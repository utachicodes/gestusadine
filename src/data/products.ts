import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Product } from '@/types/ecosystem';

export function useProducts(category?: string): Product[] {
  const products = useQuery(api.products.list, { category }) ?? [];
  return products.map((p) => ({
    id: p._id,
    name: p.name,
    description: p.description,
    price: p.price,
    currency: p.currency,
    stock_quantity: p.stock,
    images: p.image ? [p.image] : [],
    category: p.category,
    created_at: new Date(p.createdAt).toISOString(),
  }));
}

export const PRODUCT_CATEGORIES = ['All', 'Books', 'Home & Living', 'Food', 'Fragrance', 'Accessories'];
