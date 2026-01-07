import React, { useEffect, useState } from "react";
import { EcosystemService } from "@/services/ecosystem";
import { Product } from "@/types/ecosystem";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/auth/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      // Don't show error toast on load to avoid annoying user if just empty
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="container py-10 md:py-16 space-y-12">
        <div className="flex flex-col gap-4 max-w-3xl">
          <Badge className="w-fit bg-primary/10 text-primary border-primary/30">{t("shop.islamic")}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t("shop.waitlist_title")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("shop.waitlist_description")}
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>{t("shop.waitlist_exclusive")}</span>
            <Clock3 className="w-4 h-4 text-secondary-foreground" />
            <span>{t("shop.waitlist_drop_hint")}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="islamic-card h-[400px] animate-pulse border border-border bg-card/50 rounded-xl" />
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="islamic-card border border-border p-4 flex flex-col gap-4 bg-card/70 group hover:border-primary/50 transition-colors">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-muted relative">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/30">
                      <span>{t("shop.preview")}</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
                    {t("shop.preorder")}
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-lg font-bold leading-tight">{product.name}</h3>
                    <p className="text-sm font-semibold text-primary whitespace-nowrap">
                      {product.price.toLocaleString()} {product.currency || 'XOF'}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white shadow-md hover:shadow-lg transition-all"
                    onClick={() => handleBuy(product)}
                  >
                    {t("shop.buy_with_naboo")}
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground mt-2 opacity-70">
                    Secured by NabooPay
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
              <p>No products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
