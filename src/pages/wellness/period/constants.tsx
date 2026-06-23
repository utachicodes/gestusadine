import React from 'react';
import { Heart, Droplets, Calendar, BarChart2, Settings, Moon, Zap, Activity, Wind, Frown, ArrowDown, Thermometer, Cookie, Smile, CheckCircle, SmilePlus, Meh, Frown as FrownIcon, CloudRain, Zap as ZapIcon, BatteryLow } from 'lucide-react';

export const FLOW_OPTIONS = [
  { key: 'none',     en: 'None',     fr: 'Aucun',    color: 'border-border bg-muted/30 text-muted-foreground' },
  { key: 'spotting', en: 'Spotting', fr: 'Léger',    color: 'border-pink-200 bg-pink-50 text-pink-700' },
  { key: 'light',    en: 'Light',    fr: 'Faible',   color: 'border-rose-200 bg-rose-50 text-rose-700' },
  { key: 'medium',   en: 'Medium',   fr: 'Moyen',    color: 'border-red-300 bg-red-50 text-red-700' },
  { key: 'heavy',    en: 'Heavy',    fr: 'Abondant', color: 'border-red-400 bg-red-100 text-red-800' },
] as const;

export const SYMPTOMS = [
  { key: 'cramps',     en: 'Cramps',            fr: 'Crampes',            icon: <Zap className="w-4 h-4" /> },
  { key: 'headache',   en: 'Headache',          fr: 'Mal de tête',        icon: <Activity className="w-4 h-4" /> },
  { key: 'fatigue',    en: 'Fatigue',           fr: 'Fatigue',            icon: <BatteryLow className="w-4 h-4" /> },
  { key: 'bloating',   en: 'Bloating',          fr: 'Ballonnements',      icon: <Wind className="w-4 h-4" /> },
  { key: 'nausea',     en: 'Nausea',            fr: 'Nausée',             icon: <Thermometer className="w-4 h-4" /> },
  { key: 'backpain',   en: 'Back pain',         fr: 'Mal de dos',         icon: <ArrowDown className="w-4 h-4" /> },
  { key: 'moodswings', en: 'Mood swings',       fr: "Sautes d'humeur",    icon: <Meh className="w-4 h-4" /> },
  { key: 'insomnia',   en: 'Insomnia',          fr: 'Insomnie',           icon: <Moon className="w-4 h-4" /> },
  { key: 'acne',       en: 'Acne',              fr: 'Acné',               icon: <Smile className="w-4 h-4" /> },
  { key: 'cravings',   en: 'Cravings',          fr: 'Envies',             icon: <Cookie className="w-4 h-4" /> },
  { key: 'tender',     en: 'Breast tenderness', fr: 'Seins sensibles',    icon: <Heart className="w-4 h-4" /> },
  { key: 'spotting2',  en: 'Spotting',          fr: 'Pertes',             icon: <Droplets className="w-4 h-4" /> },
];

export const MOODS = [
  { key: 'happy',     en: 'Happy',     fr: 'Heureuse',  icon: <SmilePlus className="w-4 h-4" /> },
  { key: 'calm',      en: 'Calm',      fr: 'Calme',     icon: <CheckCircle className="w-4 h-4" /> },
  { key: 'irritable', en: 'Irritable', fr: 'Irritable', icon: <FrownIcon className="w-4 h-4" /> },
  { key: 'anxious',   en: 'Anxious',   fr: 'Anxieuse',  icon: <CloudRain className="w-4 h-4" /> },
  { key: 'sad',       en: 'Sad',       fr: 'Triste',    icon: <FrownIcon className="w-4 h-4" /> },
  { key: 'sensitive', en: 'Sensitive', fr: 'Sensible',  icon: <Heart className="w-4 h-4" /> },
  { key: 'energetic', en: 'Energetic', fr: 'Énergique', icon: <ZapIcon className="w-4 h-4" /> },
  { key: 'tired',     en: 'Tired',     fr: 'Fatiguée',  icon: <BatteryLow className="w-4 h-4" /> },
];

export const CYCLE_PHASES = [
  { key: 'menstruation', en: 'Menstruation', fr: 'Menstruation', color: 'bg-red-100 text-red-700 border-red-200' },
  { key: 'follicular',   en: 'Follicular',   fr: 'Folliculaire', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { key: 'ovulation',    en: 'Ovulation',    fr: 'Ovulation',    color: 'bg-green-50 text-green-700 border-green-200' },
  { key: 'luteal',       en: 'Luteal',       fr: 'Lutéale',      color: 'bg-purple-50 text-purple-700 border-purple-200' },
];

export function getCyclePhase(day: number, avgCycleLen: number): string {
  const ovDay = avgCycleLen - 14;
  if (day <= 5) return 'menstruation';
  if (day < ovDay - 1) return 'follicular';
  if (day <= ovDay + 1) return 'ovulation';
  return 'luteal';
}

export type Tab = 'overview' | 'log' | 'calendar' | 'analytics' | 'qadaa' | 'settings';

export const TABS: { id: Tab; en: string; fr: string; icon: React.ReactNode }[] = [
  { id: 'overview',  en: 'Overview', fr: 'Aperçu',   icon: <Heart className="w-3.5 h-3.5" /> },
  { id: 'log',       en: 'Log',      fr: 'Journal',  icon: <Droplets className="w-3.5 h-3.5" /> },
  { id: 'calendar',  en: 'Calendar', fr: 'Calendar', icon: <Calendar className="w-3.5 h-3.5" /> },
  { id: 'analytics', en: 'Analytics',fr: 'Analytics',icon: <BarChart2 className="w-3.5 h-3.5" /> },
  { id: 'qadaa',     en: 'Sawm Qadaa', fr: 'Sawm Qadaa', icon: <Moon className="w-3.5 h-3.5" /> },
  { id: 'settings',  en: 'Settings', fr: 'Settings', icon: <Settings className="w-3.5 h-3.5" /> },
];
