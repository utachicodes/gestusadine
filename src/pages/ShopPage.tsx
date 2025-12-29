import React, { useEffect, useState, useRef } from 'react';
import { EcosystemService } from '@/services/ecosystem';
import { Product } from '@/types/ecosystem';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CartItem {
    product: Product;
    quantity: number;
    size?: string;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface ProductCardProps {
    product: Product;
    isClothing: boolean;
    selectedSize: string;
    onSizeSelect: (size: string) => void;
    onDragStart: (e: React.DragEvent, size?: string) => void;
    onDragEnd: () => void;
    onAddToCart: (size?: string) => void;
}

function ProductCard({ product, isClothing, selectedSize, onSizeSelect, onDragStart, onDragEnd, onAddToCart }: ProductCardProps) {
    const { t } = useLanguage();
    
    const handleDragStart = (e: React.DragEvent) => {
        if (isClothing && !selectedSize) {
            e.preventDefault();
            return;
        }
        onDragStart(e, isClothing && selectedSize ? selectedSize : undefined);
    };

    return (
        <div
            draggable={!isClothing || (isClothing && selectedSize !== '')}
            onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
            className={`group relative ${(!isClothing || selectedSize) ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-60'}`}
        >
            {/* Limited Edition Badge */}
            {isClothing && (
                <div className="absolute top-4 left-4 z-10 bg-islamic-gold text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                    {t('shop.limited')}
                </div>
            )}
            
            <div className="islamic-card overflow-hidden mb-4">
                <div className="aspect-[3/4] relative overflow-hidden bg-islamic-cream/30 dark:bg-slate-800">
                    {product.images && product.images[0] ? (
                        <>
                            <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-islamic-dark/20 dark:text-slate-600">
                            <ShoppingCart size={48} />
                        </div>
                    )}
                </div>
            </div>
            
            <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-islamic-dark dark:text-slate-100 uppercase tracking-wide leading-tight flex-1">
                        {product.name}
                    </h3>
                </div>
                
                <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-islamic-gold dark:text-islamic-gold tracking-wide">
                        {product.price.toLocaleString()} {product.currency}
                    </p>
                </div>
                
                {isClothing && (
                    <>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {SIZES.map((size) => (
                                <button
                                    key={size}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSizeSelect(size);
                                    }}
                                    className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all ${
                                        selectedSize === size
                                            ? 'bg-islamic-green text-white border-islamic-green shadow-md'
                                            : 'bg-transparent text-islamic-dark dark:text-slate-300 border-islamic-dark/30 dark:border-slate-600 hover:border-islamic-green-600 dark:hover:border-islamic-green hover:text-islamic-green-600 dark:hover:text-islamic-green'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {selectedSize && (
                            <p className="text-xs text-islamic-green-600 dark:text-islamic-green mt-2 font-medium">
                                {t('shop.drag_to_cart')}
                            </p>
                        )}
                        {!selectedSize && (
                            <p className="text-xs text-islamic-dark/50 dark:text-slate-500 mt-2">
                                {t('shop.select_size_drag')}
                            </p>
                        )}
                    </>
                )}
                {!isClothing && (
                    <p className="text-xs text-islamic-green-600 dark:text-islamic-green mt-3 font-medium">
                        {t('shop.drag_to_cart')}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function ShopPage() {
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('default');
    const [draggedProduct, setDraggedProduct] = useState<{ product: Product; size?: string } | null>(null);
    const [isDraggingOverCart, setIsDraggingOverCart] = useState(false);
    const [productSelectedSizes, setProductSelectedSizes] = useState<Record<string, string>>({});
    const cartButtonRef = useRef<HTMLButtonElement>(null);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('xamsadine-cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to load cart from localStorage');
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('xamsadine-cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        
        // Use mock data immediately and stop loading
        setProducts(MOCK_PRODUCTS);
        setLoading(false);
        
        // Try to fetch from API in background (fire and forget)
        (async () => {
            try {
                const data = await EcosystemService.getProducts();
                if (data.length > 0) {
                    setProducts(data);
                }
            } catch (error) {
                // Silently fail, already using mock data
            }
        })();
    };

    const isClothing = (product: Product) => {
        return product.category === 'clothing';
    };

    const handleDragStart = (e: React.DragEvent, product: Product, size?: string) => {
        setDraggedProduct({ product, size });
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', product.id);
        // Create a custom drag image
        const dragImage = document.createElement('div');
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        dragImage.style.width = '200px';
        dragImage.style.padding = '12px';
        dragImage.style.background = 'rgba(239, 239, 236, 0.95)';
        dragImage.style.color = '#8fa3c4';
        dragImage.style.border = '2px solid #8fa3c4';
        dragImage.style.borderRadius = '12px';
        dragImage.style.boxShadow = '0 8px 32px rgba(224, 232, 243, 0.2)';
        dragImage.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${product.images?.[0] || ''}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" />
                <div>
                    <div style="font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #8fa3c4;">${product.name}</div>
                    <div style="font-size: 12px; font-weight: 700; color: #d97706;">${product.price.toLocaleString()} ${product.currency}</div>
                </div>
            </div>
        `;
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        setTimeout(() => document.body.removeChild(dragImage), 0);
    };

    const handleDragEnd = () => {
        setDraggedProduct(null);
        setIsDraggingOverCart(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDraggingOverCart(true);
    };

    const handleDragLeave = () => {
        setIsDraggingOverCart(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOverCart(false);
        
        if (draggedProduct) {
            addToCart(draggedProduct.product, draggedProduct.size);
            setDraggedProduct(null);
        }
    };

    const addToCart = (product: Product, size?: string) => {
        const key = size ? `${product.id}-${size}` : product.id;
        const existingItem = cart.find(item => {
            const itemKey = item.size ? `${item.product.id}-${item.size}` : item.product.id;
            return itemKey === key;
        });
        
        if (existingItem) {
            setCart(cart.map(item => {
                const itemKey = item.size ? `${item.product.id}-${item.size}` : item.product.id;
                return itemKey === key 
                    ? { ...item, quantity: item.quantity + 1 }
                    : item;
            }));
            toast.success(`Updated ${product.name}${size ? ` (${size})` : ''} quantity in cart`);
        } else {
            setCart([...cart, { product, quantity: 1, size }]);
            toast.success(`Added ${product.name}${size ? ` (${size})` : ''} to cart`);
        }
    };

    const removeFromCart = (productId: string, size?: string) => {
        setCart(cart.filter(item => {
            const itemKey = item.size ? `${item.product.id}-${item.size}` : item.product.id;
            const targetKey = size ? `${productId}-${size}` : productId;
            return itemKey !== targetKey;
        }));
        toast.success('Item removed from cart');
    };

    const updateQuantity = (productId: string, quantity: number, size?: string) => {
        if (quantity <= 0) {
            removeFromCart(productId, size);
            return;
        }
        const key = size ? `${productId}-${size}` : productId;
        setCart(cart.map(item => {
            const itemKey = item.size ? `${item.product.id}-${item.size}` : item.product.id;
            return itemKey === key 
                ? { ...item, quantity }
                : item;
        }));
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.error(t('shop.cart_empty'));
            return;
        }
        try {
            const items = cart.map(item => ({ productId: item.product.id, quantity: item.quantity }));
            const { paymentUrl } = await EcosystemService.checkout(items, 'wave');

            toast.success("Order created! Redirecting to payment...");
            setTimeout(() => {
                window.open(paymentUrl, '_blank');
                setCart([]);
                setCartOpen(false);
            }, 1000);

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : t('error.checkout_failed');
            toast.error(message);
        }
    };

    // Filter and sort products
    const filteredProducts = products.filter(product => {
        if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
        return true;
    }).sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
    });

    const categories = Array.from(new Set(products.map(p => p.category)));

    return (
        <div className="min-h-screen bg-islamic-light dark:bg-slate-900 overflow-y-auto">
            <section className="container py-10 md:py-16 space-y-10">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-4">
                    <div>
                        <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 dark:text-slate-400 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
                            Shop
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark dark:text-slate-100">
                            Islamic <span className="text-gradient">Store</span>
                        </h1>
                        <p className="mt-2 text-islamic-dark/70 dark:text-slate-300 max-w-xl">
                            Browse and purchase Islamic products, books, and merchandise
                        </p>
                    </div>
                </header>

                {/* Filters Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-6 mb-12 border-b border-islamic-dark/10 dark:border-slate-700 pb-8">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[140px] border border-islamic-dark/20 dark:border-slate-700 bg-[#efefec] dark:bg-slate-800 text-islamic-dark dark:text-slate-100 font-medium text-sm h-10">
                                <SelectValue placeholder={t('shop.category')} />
                            </SelectTrigger>
                            <SelectContent className="bg-[#efefec] dark:bg-slate-800 border border-islamic-dark/20 dark:border-slate-700">
                                <SelectItem value="all">{t('shop.all')}</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat} className="capitalize">
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[160px] border border-islamic-dark/20 dark:border-slate-700 bg-[#efefec] dark:bg-slate-800 text-islamic-dark dark:text-slate-100 font-medium text-sm h-10">
                            <SelectValue placeholder={t('shop.sort_by')} />
                            </SelectTrigger>
                            <SelectContent className="bg-[#efefec] dark:bg-slate-800 border border-islamic-dark/20 dark:border-slate-700">
                                <SelectItem value="default">{t('shop.default')}</SelectItem>
                                <SelectItem value="price-low">{t('shop.price_low')}</SelectItem>
                                <SelectItem value="price-high">{t('shop.price_high')}</SelectItem>
                                <SelectItem value="name">{t('shop.name')}</SelectItem>
                            </SelectContent>
                        </Select>

                        <Dialog open={cartOpen} onOpenChange={setCartOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    ref={cartButtonRef}
                                    variant="outline"
                                    className="relative border border-islamic-dark/20 dark:border-slate-700 bg-[#efefec] dark:bg-slate-800 hover:bg-islamic-green/10 dark:hover:bg-islamic-green/20 hover:border-islamic-green-600 dark:hover:border-islamic-green h-10 w-10 p-0 transition-all"
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <ShoppingCart className="h-5 w-5 text-islamic-dark dark:text-slate-100" />
                                    {cart.length > 0 && (
                                        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-islamic-green text-white text-xs font-bold border-2 border-[#efefec] dark:border-slate-900">
                                            {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                        </Badge>
                                    )}
                                    {isDraggingOverCart && (
                                        <div className="absolute inset-0 bg-islamic-green/20 dark:bg-islamic-green/30 flex items-center justify-center border-2 border-islamic-green rounded-lg">
                                            <span className="text-xs font-semibold text-islamic-green-600 dark:text-islamic-green">{t('shop.drop')}</span>
                                        </div>
                                    )}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#efefec] dark:bg-slate-900 border border-islamic-dark/20 dark:border-slate-700">
                                <DialogHeader>
                                    <DialogTitle className="text-islamic-dark dark:text-slate-100 font-bold">{t('shop.shopping_cart')}</DialogTitle>
                                    <DialogDescription className="text-islamic-dark/70 dark:text-slate-400">
                                        {cart.length === 0 ? t('shop.cart_empty') : `${cart.length} ${cart.length > 1 ? t('shop.items_in_cart_plural') : t('shop.items_in_cart')} ${t('shop.in_your_cart')}`}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                    {cart.length === 0 ? (
                                        <div className="text-center py-12 text-islamic-dark/40 dark:text-slate-500">
                                            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-islamic-dark/20 dark:text-slate-700" />
                                            <p className="text-sm font-medium text-islamic-dark/60 dark:text-slate-400">{t('shop.cart_empty')}</p>
                                        </div>
                                    ) : (
                                        <>
                                            {cart.map((item) => {
                                                const itemKey = item.size ? `${item.product.id}-${item.size}` : item.product.id;
                                                return (
                                                    <div key={itemKey} className="islamic-card p-4 flex items-center gap-4">
                                                        {item.product.images && item.product.images[0] ? (
                                                            <img 
                                                                src={item.product.images[0]} 
                                                                alt={item.product.name}
                                                                className="w-20 h-20 object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <div className="w-20 h-20 bg-islamic-cream/30 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                                                <ShoppingCart className="w-8 h-8 text-islamic-dark/40 dark:text-slate-500" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-islamic-dark dark:text-slate-100">{item.product.name}</h4>
                                                            {item.size && (
                                                                <p className="text-xs text-islamic-dark/60 dark:text-slate-400 mt-1">{t('shop.size')}: {item.size}</p>
                                                            )}
                                                            <p className="text-base font-bold text-islamic-gold dark:text-islamic-gold mt-2">
                                                                {item.product.price.toLocaleString()} {item.product.currency}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 border border-islamic-dark/20 dark:border-slate-700"
                                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)}
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                            <span className="w-12 text-center font-semibold text-islamic-dark dark:text-slate-100 text-sm">{item.quantity}</span>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 border border-islamic-dark/20 dark:border-slate-700"
                                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            onClick={() => removeFromCart(item.product.id, item.size)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                            <div className="border-t border-islamic-dark/10 dark:border-slate-700 pt-4 space-y-4">
                                                <div className="flex justify-between items-center text-lg font-bold">
                                                    <span className="text-islamic-dark dark:text-slate-100">{t('shop.total')}:</span>
                                                    <span className="text-islamic-gold dark:text-islamic-gold">
                                                        {getTotalPrice().toLocaleString()} {cart[0]?.product.currency || 'XOF'}
                                                    </span>
                                                </div>
                                                <Button 
                                                    className="w-full btn-islamic font-semibold h-12" 
                                                    onClick={handleCheckout}
                                                >
                                                    {t('shop.proceed_checkout')}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {loading ? (
                        <div className="col-span-full text-center py-20">
                            <p className="text-islamic-dark/60 dark:text-slate-400 text-sm font-medium">{t('shop.loading')}</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center py-20">
                            <p className="text-islamic-dark/60 dark:text-slate-400 text-sm font-medium">{t('shop.empty')}</p>
                        </div>
                    ) : filteredProducts.map((product) => {
                        const isClothingItem = isClothing(product);
                        const productSelectedSize = productSelectedSizes[product.id] || '';
                        
                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isClothing={isClothingItem}
                                selectedSize={productSelectedSize}
                                onSizeSelect={(size) => setProductSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                                onDragStart={(e, size) => handleDragStart(e, product, size)}
                                onDragEnd={handleDragEnd}
                                onAddToCart={(size) => addToCart(product, size)}
                            />
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
