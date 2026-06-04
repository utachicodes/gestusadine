import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ClassModule } from '@/types/ecosystem';

export function useClasses(category: 'All' | 'Fiqh' | 'Hadith' | 'Tawhid' = 'All'): ClassModule[] {
  const classes = useQuery(api.classes.list, { category: category !== 'All' ? category : undefined }) ?? [];
  return classes.map((c) => ({
    id: c._id,
    title: c.title,
    category: c.category as 'Fiqh' | 'Hadith' | 'Tawhid' | 'Quran',
    level: c.lessons.length > 8 ? 'Advanced' as const : c.lessons.length > 4 ? 'Intermediate' as const : 'Beginner' as const,
    duration: `${Math.ceil(c.lessons.reduce((s, l) => s + l.duration, 0) / 60)}h`,
    lessons: c.lessons.length,
    locked: false,
    image: c.imageUrl,
  }));
}
