import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, ShoppingBag, X, Plus, Minus, Trash2, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useProducts, PRODUCT_CATEGORIES } from '@/data/products';
import { useTr, type Loc } from '@/lib/i18n';

const CATEGORY_LABELS: Record<string, Loc> = {
  'All': { en: 'All', fr: 'Tous' },
  'Books': { en: 'Books', fr: 'Livres' },
  'Home & Living': { en: 'Home & Living', fr: 'Maison' },
  'Food': { en: 'Food', fr: 'Alimentation' },
  'Fragrance': { en: 'Fragrance', fr: 'Parfums' },
  'Accessories': { en: 'Accessories', fr: 'Accessoires' },
};

const IslamicShop = () => {
  const tr = useTr();
  const { addToCart, items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const products = useProducts();

  const toggleWishlist = (id: string, name: string) => {
    setWishlist((prev) => {
      const has = prev.includes(id);
      toast(has
        ? tr({ en: `Removed ${name} from your wishlist.`, fr: `${name} retiré de vos favoris.` })
        : tr({ en: `Saved ${name} to your wishlist.`, fr: `${name} ajouté à vos favoris.` }));
      return has ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
              {tr({ en: 'Islamic', fr: 'Boutique' })} <span className="text-brand-600">{tr({ en: 'Shop', fr: 'islamique' })}</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl">
              {tr({
                en: 'A curated collection of authentic books, premium goods, and lifestyle essentials for the modern Muslim.',
                fr: 'Une sélection de livres authentiques, de produits de qualité et d’essentiels du quotidien pour le musulman d’aujourd’hui.',
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
              <input
                type="text"
                placeholder={tr({ en: 'Search products…', fr: 'Rechercher un produit…' })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:border-brand-500 shadow-sm shadow-slate-100 transition-all w-full md:w-64"
              />
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={tr({ en: 'Open cart', fr: 'Ouvrir le panier' })}
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

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 custom-scrollbar">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                selectedCategory === cat
                  ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-100'
                  : 'bg-white border-slate-100 text-slate-400 hover:border-brand-200 hover:text-brand-600'
              }`}
            >
              {tr(CATEGORY_LABELS[cat] ?? { en: cat, fr: cat })}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product.id}
                className="glass-card-saas group overflow-hidden flex flex-col h-full bg-white border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2rem] transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-brand-100/30"
              >
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm">
                      {tr(CATEGORY_LABELS[product.category] ?? { en: product.category, fr: product.category })}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id, product.name)}
                    aria-label={wishlist.includes(product.id)
                      ? tr({ en: 'Remove from wishlist', fr: 'Retirer des favoris' })
                      : tr({ en: 'Add to wishlist', fr: 'Ajouter aux favoris' })}
                    aria-pressed={wishlist.includes(product.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full text-slate-400 hover:text-rose-500 transition-colors shadow-sm"
                  >
                    <Heart className={`w-4 h-4 transition-colors ${wishlist.includes(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-brand-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6">
                    {product.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-100 mb-1">{tr({ en: 'Price', fr: 'Prix' })}</span>
                      <span className="text-2xl font-black text-slate-900">
                        {product.price.toLocaleString()} <span className="text-sm font-black text-brand-600 uppercase">FCFA</span>
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      aria-label={tr({ en: 'Add to cart', fr: 'Ajouter au panier' })}
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
            <h2 className="text-2xl font-black text-slate-900 mb-2">{tr({ en: 'No products found', fr: 'Aucun produit trouvé' })}</h2>
            <p className="text-slate-500 font-medium">{tr({ en: 'Try adjusting your filters or search query.', fr: 'Essayez d’ajuster vos filtres ou votre recherche.' })}</p>
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
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{tr({ en: 'Your Cart', fr: 'Votre panier' })}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {totalItems} {tr({ en: 'items selected', fr: 'articles' })}
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  aria-label={tr({ en: 'Close cart', fr: 'Fermer le panier' })}
                  className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <ShoppingBag className="w-16 h-16 mb-6 stroke-1 text-slate-400" />
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500">{tr({ en: 'Your cart is empty', fr: 'Votre panier est vide' })}</p>
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
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={tr({ en: 'Decrease quantity', fr: 'Diminuer la quantité' })} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-brand-600">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-black text-slate-700">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={tr({ en: 'Increase quantity', fr: 'Augmenter la quantité' })} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-brand-600">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} aria-label={tr({ en: 'Remove item', fr: 'Retirer l’article' })} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
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
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{tr({ en: 'Subtotal', fr: 'Sous-total' })}</span>
                    <span className="text-3xl font-black text-slate-900">
                      {totalPrice.toLocaleString()} <span className="text-sm text-brand-600">FCFA</span>
                    </span>
                  </div>
                  {totalItems > 0 && <span className="text-[10px] font-black text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase tracking-tighter">{tr({ en: 'Shipping Included', fr: 'Livraison incluse' })}</span>}
                </div>
                <button
                  disabled={items.length === 0}
                  onClick={() => toast.info(
                    tr({ en: 'Secure checkout is coming soon', fr: 'Le paiement sécurisé arrive bientôt' }),
                    { description: tr({ en: 'Online payments (mobile money & card) launch shortly, inshā’Allāh.', fr: 'Les paiements en ligne (mobile money & carte) arrivent très bientôt, inshā’Allāh.' }) },
                  )}
                  className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-[1.5rem] font-black shadow-2xl shadow-slate-200 uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-20 disabled:grayscale group"
                >
                  {tr({ en: 'Proceed to Checkout', fr: 'Passer à la caisse' })}
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
