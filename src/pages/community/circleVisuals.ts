import { BookOpen, Star, Heart, Globe, Users, type LucideIcon } from 'lucide-react';
import type { CircleIcon, CircleAccent } from '@/data/community';

// Presentation-only mapping from a circle's data keys to icon + accent classes.
export const CIRCLE_ICONS: Record<CircleIcon, LucideIcon> = {
  book: BookOpen,
  star: Star,
  heart: Heart,
  globe: Globe,
  users: Users,
};

export const CIRCLE_ACCENTS: Record<CircleAccent, { bg: string; fg: string }> = {
  green: { bg: 'bg-deep-green/8', fg: 'text-deep-green' },
  gold: { bg: 'bg-warm-gold/8', fg: 'text-warm-gold' },
  sage: { bg: 'bg-sage-green/8', fg: 'text-sage-green-dark' },
};
