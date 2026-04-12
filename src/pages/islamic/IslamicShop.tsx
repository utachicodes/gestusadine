import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Filter, ChevronRight, Star, ShoppingBag, X, Plus, Minus, Trash2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types/ecosystem';

// Demo Data
const DEMO_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'The Noble Qur\'an - Deluxe Edition',
    description: 'A beautiful, leather-bound Qur\'an with high-quality cream paper and clear Uthmani script.',
    price: 45000,
    currency: 'FCFA',
    stock_quantity: 15,
    images: ['https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=800'],
    category: 'Books',
    created_at: new Date().toISOString()
  },
  {
    id: 'p2',
    name: 'Premium Silk Prayer Mat',
    description: 'Handcrafted prayer mat with intricate patterns and extra cushioning for comfort during prayer.',
    price: 25000,
    currency: 'FCFA',
    stock_quantity: 20,
    images: ['https://images.unsplash.com/photo-1590059316631-2775f8507300?q=80&w=800'],
    category: 'Home & Living',
    created_at: new Date().toISOString()
  },
  {
    id: 'p3',
    name: 'Organic Ajwa Dates (1kg)',
    description: 'Authentic Ajwa dates from Madinah, known for their unique health benefits and spiritual significance.',
    price: 18000,
    currency: 'FCFA',
    stock_quantity: 50,
    images: ['https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=800'],
    category: 'Food',
    created_at: new Date().toISOString()
  },
  {
    id: 'p4',
    name: 'Islamic History: The Golden Age',
    description: 'An insightful journey through the intellectual and scientific achievements of the Islamic Golden Age.',
    price: 15000,
    currency: 'FCFA',
    stock_quantity: 10,
    images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800'],
    category: 'Books',
    created_at: new Date().toISOString()
  },
  {
    id: 'p5',
    name: 'Natural Oud Al-Fakher',
    description: 'Traditional Bukhoor with deep woody notes. Perfect for creating a serene spiritual environment.',
    price: 32000,
    currency: 'FCFA',
    stock_quantity: 5,
    images: ['https://images.unsplash.com/photo-1615485240384-552be837798c?q=80&w=800'],
    category: 'Fragrance',
    created_at: new Date().toISOString()
  },
  {
    id: 'p6',
    name: 'Sunni Rosary (Tasbih)',
    description: '99-bead tasbih made from authentic olive wood from the blessed lands.',
    price: 8000,
    currency: 'FCFA',
    stock_quantity: 100,
    images: ['https://images.unsplash.com/photo-1584347837135-a697669d266d?q=80&w=800'],
    category: 'Accessories',
    created_at: new Date().toISOString()
  }
];

const CATEGORIES = ['All', 'Books', 'Home & Living', 'Food', 'Fragrance', 'Accessories'];

const IslamicShop = () => {
  const { t } = useLanguage();
  const { addToCart, items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts = DEMO_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Islamic <span className="text-brand-600">Shop</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl">
              Curated collection of authentic books, premium goods, and lifestyle essentials for the modern Muslim.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:border-brand-500 shadow-sm shadow-slate-100 transition-all w-full md:w-64"
              />
            </div>
            <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 bg-white border border-slate-200 rounded-2xl hover:border-brand-300 hover:bg-brand-50 transition-all shadow-sm flex items-center justify-center"
            >
              <ShoppingBag className="w-6 h-6 text-slate-700" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-brand-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-50">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 custom-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                selectedCategory === cat
                  ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-100'
                  : 'bg-white border-slate-100 text-slate-400 hover:border-brand-200 hover:text-brand-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product.id}
                className="glass-card-saas group overflow-hidden flex flex-col h-full bg-white border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2rem] transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-brand-100/30"
              >
                {/* Image Wrapper */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm">
                      {product.category}
                    </span>
                  </div>
                  <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full text-slate-400 hover:text-rose-500 transition-colors shadow-sm">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Wrapper */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-brand-500 text-brand-500" />)}
                    <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">(24 reviews)</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-brand-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6">
                    {product.description}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-100 mb-1">Price</span>
                      <span className="text-2xl font-black text-slate-900">
                        {product.price.toLocaleString()} <span className="text-sm font-black text-brand-600 uppercase">FCFA</span>
                      </span>
                    </div>
                    <button 
                        onClick={() => addToCart(product)}
                        className="flex items-center justify-center w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl shadow-lg shadow-brand-100 transition-all active:scale-95 group/btn"
                    >
                      <Plus className="w-6 h-6 transition-transform group-hover/btn:rotate-90" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">No products found</h2>
            <p className="text-slate-500 font-medium">Try adjusting your filters or search query.</p>
          </div>
        )}

      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsCartOpen(false)}
               className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-[101] flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Your Cart</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{totalItems} items selected</p>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <ShoppingBag className="w-16 h-16 mb-6 stroke-1 text-slate-400" />
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 border border-slate-100 rounded-3xl group">
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                          <img src={item.images[0]} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-slate-900 mb-1 leading-tight line-clamp-1">{item.name}</h4>
                          <div className="text-xs font-black text-brand-600 mb-3">{item.price.toLocaleString()} FCFA</div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-slate-50 rounded-lg p-1">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-brand-600"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-black text-slate-700">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-brand-600"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button 
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <div className="flex justify-between items-end mb-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Subtotal</span>
                    <span className="text-3xl font-black text-slate-900">
                      {totalPrice.toLocaleString()} <span className="text-sm text-brand-600">FCFA</span>
                    </span>
                  </div>
                  {totalItems > 0 && <span className="text-[10px] font-black text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase tracking-tighter">Shipping Included</span>}
                </div>
                <button 
                    disabled={items.length === 0}
                    className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-[1.5rem] font-black shadow-2xl shadow-slate-200 uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-20 disabled:grayscale group"
                >
                  Proceed to Checkout
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default IslamicShop;
