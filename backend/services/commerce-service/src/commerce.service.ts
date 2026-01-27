import { db } from '../../api-gateway/src/lib/firebase-admin';
import { Product, Order, OrderItem } from '../../../shared/ecosystem-types.js';

export const CommerceService = {
    // Get all products
    async getProducts(category?: string) {
        let query = db.collection('products')
            .where('stock_quantity', '>', 0) // Only show in-stock
            .orderBy('stock_quantity', 'desc')
            .orderBy('created_at', 'desc');

        if (category) {
            query = query.where('category', '==', category);
        }

        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
    },

    async getProductById(id: string) {
        const doc = await db.collection('products').doc(id).get();
        if (!doc.exists) {
            throw new Error('Product not found');
        }
        return {
            id: doc.id,
            ...doc.data()
        } as Product;
    },

    // Create Order & Initiate Payment
    async createOrder(userId: string, items: { productId: string; quantity: number }[], paymentMethod: string) {
        // 1. Calculate Total & Verify Stock
        let totalAmount = 0;
        const orderItemsData = [];
        const paymentItems = [];

        for (const item of items) {
            const product = await this.getProductById(item.productId);
            if (product.stock_quantity < item.quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
            }
            totalAmount += product.price * item.quantity;
            orderItemsData.push({
                product_id: item.productId,
                quantity: item.quantity,
                unit_price: product.price
            });
            // Prepare items for payment gateway
            paymentItems.push({
                name: product.name,
                category: 'Merch',
                amount: product.price,
                quantity: item.quantity,
                description: product.description || 'DeenAkDiamano Merch'
            });
        }

        // 2. Create Order in DB
        const orderData = {
            user_id: userId,
            total_amount: totalAmount,
            status: 'pending',
            payment_method: paymentMethod,
            created_at: new Date().toISOString()
        };

        const orderRef = await db.collection('orders').add(orderData);
        const orderDoc = await orderRef.get();
        const order = {
            id: orderDoc.id,
            ...orderDoc.data()
        };

        // 3. Create Order Items
        for (const item of orderItemsData) {
            await db.collection('order_items').add({
                ...item,
                order_id: order.id,
                created_at: new Date().toISOString()
            });
        }

        // 4. Initiate Payment logic (NabooPay)
        const paymentUrl = await this.initiatePaymentGateway(order, paymentItems, paymentMethod);

        return { order, paymentUrl };
    },

    // Payment Gateway Integration
    async initiatePaymentGateway(order: any, items: any[], method: string) {
        if (method === 'naboo') {
            const NABOO_API_URL = 'https://api.naboopay.com/api/v1/transaction/create-transaction';
            const apiKey = process.env.NABOOPAY_API_KEY;

            if (!apiKey) {
                throw new Error("Missing NABOOPAY_API_KEY environment variable");
            }

            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';

            const payload = {
                method_of_payment: ['WAVE', 'ORANGE_MONEY', 'FREE_MONEY', 'CREDIT_CARD'],
                products: items,
                amount: order.total_amount,
                currency: 'XOF',
                is_escrow: false,
                success_url: `${frontendUrl}/shop?status=success&orderId=${order.id}`,
                cancel_url: `${frontendUrl}/shop?status=cancelled&orderId=${order.id}`,
                error_url: `${frontendUrl}/shop?status=error`
            };

            const response = await fetch(NABOO_API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data: any = await response.json();

            if (!response.ok) {
                console.error("NabooPay Error:", data);
                throw new Error(data.message || 'Payment provider error');
            }

            return data.checkout_url;
        }

        // Default / Mock fallthrough
        return `https://checkout.deenakdiamano.com/mock-pay/${order.id}`;
    },

    // Handle Payment Webhook (Success)
    async handlePaymentSuccess(orderId: string) {
        // Update order status
        const orderRef = db.collection('orders').doc(orderId);
        await orderRef.update({
            status: 'paid',
            updated_at: new Date().toISOString()
        });

        const orderDoc = await orderRef.get();
        const order = {
            id: orderDoc.id,
            ...orderDoc.data()
        };

        // Decrement Inventory
        const itemsSnapshot = await db.collection('order_items')
            .where('order_id', '==', orderId)
            .get();

        for (const itemDoc of itemsSnapshot.docs) {
            const item = itemDoc.data();
            const productRef = db.collection('products').doc(item.product_id);
            const productDoc = await productRef.get();

            if (productDoc.exists) {
                const currentStock = productDoc.data()?.stock_quantity || 0;
                await productRef.update({
                    stock_quantity: Math.max(0, currentStock - item.quantity)
                });
            }
        }

        // Log Activity
        await db.collection('user_activity').add({
            user_id: order.user_id,
            activity_type: 'purchase',
            target_id: order.id,
            metadata: { amount: order.total_amount },
            created_at: new Date().toISOString()
        });

        return order;
    },

    // Get User Orders
    async getUserOrders(userId: string) {
        const ordersSnapshot = await db.collection('orders')
            .where('user_id', '==', userId)
            .orderBy('created_at', 'desc')
            .get();

        const orders = [];
        for (const orderDoc of ordersSnapshot.docs) {
            const order = {
                id: orderDoc.id,
                ...orderDoc.data()
            };

            // Fetch order items
            const itemsSnapshot = await db.collection('order_items')
                .where('order_id', '==', order.id)
                .get();

            const items = [];
            for (const itemDoc of itemsSnapshot.docs) {
                const item = itemDoc.data();
                // Fetch product details
                const productDoc = await db.collection('products').doc(item.product_id).get();
                items.push({
                    id: itemDoc.id,
                    ...item,
                    product: productDoc.exists ? { id: productDoc.id, ...productDoc.data() } : null
                });
            }

            orders.push({
                ...order,
                items
            });
        }

        return orders;
    }
};
