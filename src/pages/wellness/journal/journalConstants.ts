import {
  Heart, Smile, Wind, TrendingUp, Moon, AlertCircle, CloudRain, Zap,
  Pencil, Sparkles, Star, Sun,
  BookOpen, Edit3, Calendar, BarChart2,
  type LucideIcon,
} from 'lucide-react';

export interface MoodDef {
  key: string;
  icon: LucideIcon;
  en: string;
  fr: string;
}

export const MOODS: MoodDef[] = [
  { key: 'grateful', icon: Heart,        en: 'Grateful',   fr: 'Reconnaissant' },
  { key: 'happy',    icon: Smile,        en: 'Happy',       fr: 'Heureux' },
  { key: 'calm',     icon: Wind,         en: 'Calm',        fr: 'Calme' },
  { key: 'hopeful',  icon: TrendingUp,   en: 'Hopeful',     fr: "Plein d'espoir" },
  { key: 'tired',    icon: Moon,         en: 'Tired',       fr: 'Fatigué' },
  { key: 'anxious',  icon: AlertCircle,  en: 'Anxious',     fr: 'Anxieux' },
  { key: 'sad',      icon: CloudRain,    en: 'Sad',         fr: 'Triste' },
  { key: 'angry',    icon: Zap,          en: 'Frustrated',  fr: 'Frustré' },
];

export interface TemplateDef {
  key: string;
  icon: LucideIcon;
  en: string;
  fr: string;
  prompt: string;
}

export const TEMPLATES: TemplateDef[] = [
  { key: 'free',       icon: Pencil,    en: 'Free write',      fr: 'Écriture libre',  prompt: '' },
  { key: 'gratitude',  icon: Sparkles,  en: 'Gratitude',       fr: 'Gratitude',       prompt: "Today I am grateful for:\n1. \n2. \n3. \n\nA blessing I noticed:\n\nA dua I want to make:\n" },
  { key: 'reflection', icon: Star,      en: 'Reflection',      fr: 'Réflexion',       prompt: "What I did today:\n\nWhat went well:\n\nWhat I want to improve:\n\nLesson I learned:\n" },
  { key: 'daily',      icon: Sun,       en: 'Daily check-in',  fr: 'Bilan quotidien', prompt: "Mood today: \n\nMy intention for the day:\n\nWhat I want to accomplish:\n\nOne thing I look forward to:\n" },
];

export type Tab = 'today' | 'entries' | 'calendar' | 'stats';

export const TABS: { id: Tab; en: string; fr: string; icon: LucideIcon }[] = [
  { id: 'today',    en: 'Today',    fr: "Aujourd'hui", icon: Edit3 },
  { id: 'entries',  en: 'Entries',  fr: 'Entrées',     icon: BookOpen },
  { id: 'calendar', en: 'Calendar', fr: 'Calendar',    icon: Calendar },
  { id: 'stats',    en: 'Stats',    fr: 'Stats',       icon: BarChart2 },
];
