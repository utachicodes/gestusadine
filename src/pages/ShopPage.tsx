import React, { useEffect, useState } from "react";
import { EcosystemService } from "@/services/ecosystem";
import { Product } from "@/types/ecosystem";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles, Clock3, ShoppingBag, ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ShopPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await EcosystemService.getProducts();
      if (data) setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (product: Product) => {
    if (!user) {
      toast.info(t("login.sign_in") || "Please sign in to purchase");
      navigate("/login");
      return;
    }

    const loadingToast = toast.loading(t("shop.redirecting_naboo"));
    try {
      const { paymentUrl } = await EcosystemService.checkout(
        [{ productId: product.id, quantity: 1 }],
        'naboo'
      );

      // Redirect to NabooPay
      window.location.href = paymentUrl;
    } catch (e: any) {
      toast.dismiss(loadingToast);
      console.error("Checkout error:", e);
      toast.error(e.message || t("error.checkout_failed"));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 pattern-bg opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-islamic-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl space-y-6"
          >
            <Badge className="w-fit bg-primary/10 text-primary border-primary/30 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 mr-2 inline" />
              {t("shop.islamic") || "Premium Collection"}
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gradient">
              {t("shop.waitlist_title") || "The XamSaDine Store"}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {t("shop.waitlist_description") || "Discover a curated collection of premium Islamic lifestyle products, merchandise, and digital assets. Designed for the modern believer."}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/5 border border-border/50 backdrop-blur-sm">
                <Star className="w-4 h-4 text-islamic-gold fill-islamic-gold" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/5 border border-border/50 backdrop-blur-sm">
                <Clock3 className="w-4 h-4 text-primary" />
                <span>Limited Drops</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="container pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="islamic-card h-[450px] animate-pulse bg-muted/20" />
            ))
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="islamic-card group flex flex-col bg-card/40 backdrop-blur-md border-white/10 dark:border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Image Container */}
                <div className="aspect-[4/5] relative overflow-hidden rounded-t-2xl">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/10 text-muted-foreground">
                      <ShoppingBag className="w-12 h-12 opacity-20" />
                    </div>
                  )}

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Quick Action Button - Visible on Hover */}
                  <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button
                      className="w-full bg-white/90 text-black hover:bg-white backdrop-blur-md shadow-lg"
                      onClick={() => handleBuy(product)}
                    >
                      Buy Now
                    </Button>
                  </div>

                  <div className="absolute top-4 left-4">
                    <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10">
                      PRE-ORDER
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <span className="text-lg font-bold text-primary whitespace-nowrap">
                        {product.price.toLocaleString()} <span className="text-xs text-muted-foreground">{product.currency || 'XOF'}</span>
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-2 mt-auto">
                    <Button
                      className="w-full btn-islamic group-hover:shadow-primary/25"
                      onClick={() => handleBuy(product)}
                    >
                      <span>Purchase</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground mt-3 opacity-60">
                      Protected by NabooPay Secure Checkout
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/10 mb-6">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products available yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Our curated collection is being updated. Check back soon for exclusive drops.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
