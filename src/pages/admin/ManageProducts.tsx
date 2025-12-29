import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Plus, Edit, Trash2, Tag, Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/types/ecosystem';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

export default function ManageProducts() {
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        currency: 'XOF',
        stock_quantity: '',
        category: 'clothing',
        images: '',
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error: any) {
            console.error('Failed to load products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        setUploadingImage(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setFormData({ ...formData, images: data.publicUrl });
            toast.success('Image uploaded successfully');
        } catch (error: any) {
            console.error('Failed to upload image:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                currency: formData.currency,
                stock_quantity: parseInt(formData.stock_quantity),
                category: formData.category,
                images: formData.images ? [formData.images] : [],
            };

            if (editingId) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingId);

                if (error) throw error;
                toast.success('Product updated successfully');
                setEditingId(null);
            } else {
                const { data, error } = await supabase
                    .from('products')
                    .insert([productData])
                    .select()
                    .single();

                if (error) throw error;
                toast.success('Product created successfully');
                setIsCreating(false);
            }

            await loadProducts();
            setFormData({
                name: '',
                description: '',
                price: '',
                currency: 'XOF',
                stock_quantity: '',
                category: 'clothing',
                images: '',
            });
        } catch (error: any) {
            console.error('Failed to save product:', error);
            toast.error(error.message || 'Failed to save product');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            currency: product.currency,
            stock_quantity: product.stock_quantity.toString(),
            category: product.category || 'clothing',
            images: product.images?.[0] || '',
        });
        setIsCreating(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Product deleted successfully');
            await loadProducts();
        } catch (error: any) {
            console.error('Failed to delete product:', error);
            toast.error('Failed to delete product');
        }
    };

    return (
        <div className="flex-1">
            <section className="container py-10 md:py-16 space-y-10">
                <header className="flex justify-between items-center">
                    <div>
                        <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
                            Admin
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark">
                            Manage <span className="text-gradient">Products</span>
                        </h1>
                    </div>
                    <Button
                        onClick={() => {
                            setIsCreating(true);
                            setEditingId(null);
                            setFormData({
                                name: '',
                                description: '',
                                price: '',
                                currency: 'XOF',
                                stock_quantity: '',
                                category: 'clothing',
                                images: '',
                            });
                        }}
                        className="btn-islamic"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-primary-green"></div>
                    </div>
                ) : (
                    <>
                        {isCreating && (
                            <Card className="bg-[#efefec]/80 backdrop-blur-sm border border-islamic-gold/30">
                                <CardHeader>
                                    <CardTitle>{editingId ? 'Edit Product' : 'Add New Product'}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <Input
                                            placeholder="Product Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            placeholder="Description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            rows={4}
                                            required
                                        />
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-600">Price</label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600">Currency</label>
                                                <select
                                                    value={formData.currency}
                                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="XOF">XOF</option>
                                                    <option value="USD">USD</option>
                                                    <option value="EUR">EUR</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600">Stock Quantity</label>
                                                <Input
                                                    type="number"
                                                    value={formData.stock_quantity}
                                                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-600">Category</label>
                                                <select
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="clothing">Clothing</option>
                                                    <option value="books">Books</option>
                                                    <option value="accessories">Accessories</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600">Image</label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Image URL"
                                                        value={formData.images}
                                                        onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                                                    />
                                                    <label className="cursor-pointer">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) handleImageUpload(file);
                                                            }}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            disabled={uploadingImage}
                                                            className="whitespace-nowrap"
                                                        >
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            {uploadingImage ? 'Uploading...' : 'Upload'}
                                                        </Button>
                                                    </label>
                                                </div>
                                                {formData.images && (
                                                    <img src={formData.images} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="submit" className="btn-islamic">
                                                {editingId ? 'Update' : 'Create'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsCreating(false);
                                                    setEditingId(null);
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <Card key={product.id} className="bg-[#efefec]/80 backdrop-blur-sm border border-islamic-gold/30 overflow-hidden">
                                    <div className="aspect-square bg-islamic-cream/30 relative">
                                        {product.images && product.images[0] ? (
                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <Tag size={48} className="text-islamic-dark/40" />
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-islamic-dark">{product.name}</h3>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-lg font-bold text-islamic-gold mb-2">
                                            {product.price.toLocaleString()} {product.currency}
                                        </p>
                                        <p className="text-sm text-islamic-dark/70 line-clamp-2 mb-3">{product.description}</p>
                                        <div className="flex gap-2 items-center">
                                            <Badge>{product.category}</Badge>
                                            <span className="text-xs text-islamic-dark/60">
                                                Stock: {product.stock_quantity}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}

