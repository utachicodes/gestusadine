import { useState } from 'react';
import { BookOpen, Scale, Heart, Users, Crown } from 'lucide-react';
import type { SubscriptionTier } from '@/auth/AuthContext';
import { tierRank } from '@/data/subscription';
import { useTr, type Loc } from '@/lib/i18n';

export type SpecializedMode = 'general' | 'fiqh' | 'aqeedah' | 'spirituality' | 'family' | 'fatwa';

interface Mode {
    id: SpecializedMode;
    name: Loc;
    description: Loc;
    icon: React.ReactNode;
    tier: SubscriptionTier;
    color: string;
}

const TIER_LABEL: Record<SubscriptionTier, Loc> = {
    free: { en: 'Seeker', fr: 'Chercheur' },
    student: { en: 'Student', fr: 'Étudiant' },
    pro: { en: 'Pro', fr: 'Pro' },
};

const modes: Mode[] = [
    {
        id: 'general',
        name: { en: 'General Guidance', fr: 'Guidance générale' },
        description: { en: 'General Islamic questions and guidance', fr: 'Questions et conseils islamiques généraux' },
        icon: <BookOpen className="w-5 h-5" />,
        tier: 'free',
        color: 'text-blue-500',
    },
    {
        id: 'fiqh',
        name: { en: 'Fiqh & Jurisprudence', fr: 'Fiqh et jurisprudence' },
        description: { en: 'Islamic law and rulings across madhabs', fr: 'Droit et avis islamiques selon les écoles' },
        icon: <Scale className="w-5 h-5" />,
        tier: 'student',
        color: 'text-primary',
    },
    {
        id: 'aqeedah',
        name: { en: 'Aqeedah & Theology', fr: 'Aqida et théologie' },
        description: { en: 'Islamic creed and theological matters', fr: 'Dogme islamique et questions théologiques' },
        icon: <Crown className="w-5 h-5" />,
        tier: 'student',
        color: 'text-islamic-gold',
    },
    {
        id: 'spirituality',
        name: { en: 'Spiritual Growth', fr: 'Cheminement spirituel' },
        description: { en: 'Purification, dhikr, and spiritual development', fr: 'Purification, dhikr et développement spirituel' },
        icon: <Heart className="w-5 h-5" />,
        tier: 'student',
        color: 'text-rose-500',
    },
    {
        id: 'family',
        name: { en: 'Family & Society', fr: 'Famille et société' },
        description: { en: 'Marriage, parenting, and social matters', fr: 'Mariage, parentalité et questions sociales' },
        icon: <Users className="w-5 h-5" />,
        tier: 'student',
        color: 'text-secondary',
    },
    {
    id: 'fatwa',
        name: { en: 'Fatwa', fr: 'Fatwa' },
        description: { en: 'Advanced rulings for scholars', fr: 'Règles avancées pour les savants' },
        icon: <Crown className="w-5 h-5" />,
        tier: 'pro',
        color: 'text-primary',
    },
];

interface ModeSelectorProps {
    selectedMode: SpecializedMode;
    onModeChange: (mode: SpecializedMode) => void;
    userTier: SubscriptionTier;
}

export function ModeSelector({ selectedMode, onModeChange, userTier }: ModeSelectorProps) {
    const tr = useTr();
    const [hoveredMode, setHoveredMode] = useState<SpecializedMode | null>(null);

    const canAccessMode = (modeTier: SubscriptionTier): boolean => tierRank(userTier) >= tierRank(modeTier);

    return (
        <div className="flex flex-wrap gap-2">
            {modes.map((mode) => {
                const hasAccess = canAccessMode(mode.tier);
                const isSelected = selectedMode === mode.id;

                return (
                    <button
                        key={mode.id}
                        type="button"
                        title={tr(mode.description)}
                        className={`relative px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2.5 border-2 ${
                            isSelected
                                ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-lg shadow-brand-100'
                                : hasAccess
                                    ? 'bg-white border-slate-100 text-slate-500 hover:border-brand-200 hover:bg-slate-50/50 hover:text-slate-900'
                                    : 'bg-slate-50 border-transparent text-slate-300 cursor-not-allowed grayscale'
                        }`}
                        onClick={() => hasAccess && onModeChange(mode.id)}
                        onMouseEnter={() => setHoveredMode(mode.id)}
                        onMouseLeave={() => setHoveredMode(null)}
                    >
                        <span className={`transition-transform duration-300 ${isSelected ? 'scale-110' : 'opacity-70'}`}>
                            {mode.icon}
                        </span>
                        <span className="uppercase tracking-widest">{tr(mode.name)}</span>

                        {!hasAccess && (
                            <div className="flex items-center justify-center ml-1">
                                <Crown className="w-3 h-3 text-slate-300" />
                            </div>
                        )}

                        {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse ml-0.5" />
                        )}

                        {!hasAccess && hoveredMode === mode.id && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] whitespace-nowrap z-10 shadow-xl">
                                {tr({ en: 'Upgrade to', fr: 'Passer à' })} {tr(TIER_LABEL[mode.tier])}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
