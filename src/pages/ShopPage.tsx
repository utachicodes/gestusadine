import React, { useEffect, useState } from "react";
import { EcosystemService } from "@/services/ecosystem";
import { Product } from "@/types/ecosystem";
import { useLanguage } from "@/contexts/LanguageContext";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles, Clock3 } from "lucide-react";

interface WaitlistEntry {
  productId: string;
  email: string;
  createdAt: string;
}

const STORAGE_KEY = "xamsadine-merch-waitlist";

export default function ShopPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailByProduct, setEmailByProduct] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadProducts();
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: WaitlistEntry[] = JSON.parse(saved);
        const submittedMap: Record<string, boolean> = {};
        parsed.forEach((entry) => (submittedMap[entry.productId] = true));
        setSubmitted(submittedMap);
      } catch {
        // ignore corrupted data
      }
    }
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setProducts(MOCK_PRODUCTS);
    setLoading(false);
    try {
      const data = await EcosystemService.getProducts();
      if (data.length > 0) setProducts(data);
    } catch {
      // silent fallback to mock data
    }
  };

  const saveWaitlist = (entries: WaitlistEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  };

  const handleNotify = (productId: string) => {
    const email = emailByProduct[productId]?.trim();
    if (!email || !email.includes("@")) {
      toast.error(t("shop.waitlist_invalid_email"));
      return;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    let entries: WaitlistEntry[] = [];
    if (saved) {
      try {
        entries = JSON.parse(saved);
      } catch {
        entries = [];
      }
    }
    entries.push({ productId, email, createdAt: new Date().toISOString() });
    saveWaitlist(entries);
    setSubmitted((prev) => ({ ...prev, [productId]: true }));
    toast.success(t("shop.waitlist_joined"));
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
            {t("shop.waitlist_subtitle")}
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>{t("shop.waitlist_exclusive")}</span>
            <Clock3 className="w-4 h-4 text-secondary-foreground" />
            <span>{t("shop.waitlist_drop_hint")}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="islamic-card h-[360px] animate-pulse border border-border" />
              ))
            : products.map((product) => (
                <div key={product.id} className="islamic-card border border-border p-4 flex flex-col gap-4 bg-card/70">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-muted relative">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <span>{t("shop.preview")}</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[11px] font-semibold px-3 py-1 rounded-full">
                      {t("shop.preorder")}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {product.description || t("shop.waitlist_description")}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {t("shop.waitlist_price_hint", { price: product.price.toLocaleString(), currency: product.currency })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder={t("shop.waitlist_email_placeholder")}
                      value={emailByProduct[product.id] || ""}
                      onChange={(e) =>
                        setEmailByProduct((prev) => ({ ...prev, [product.id]: e.target.value }))
                      }
                      className="bg-background/70"
                    />
                    <Button
                      className="w-full"
                      onClick={() => handleNotify(product.id)}
                      disabled={submitted[product.id]}
                    >
                      {submitted[product.id] ? t("shop.waitlist_joined_short") : t("shop.waitlist_cta")}
                    </Button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
