import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { BookOpen, Scale, Heart, Users, Crown, Check } from 'lucide-react';

export type SpecializedMode = 'general' | 'fiqh' | 'aqeedah' | 'spirituality' | 'family' | 'fatwa';

interface Mode {
    id: SpecializedMode;
    name: string;
    description: string;
    icon: React.ReactNode;
    tier: 'free' | 'core' | 'pro';
    color: string;
}

const modes: Mode[] = [
    {
        id: 'general',
        name: 'General Guidance',
        description: 'General Islamic questions and guidance',
        icon: <BookOpen className="w-5 h-5" />,
        tier: 'free',
        color: 'text-blue-500',
    },
    {
        id: 'fiqh',
        name: 'Fiqh & Jurisprudence',
        description: 'Islamic law and rulings across madhabs',
        icon: <Scale className="w-5 h-5" />,
        tier: 'core',
        color: 'text-primary',
    },
    {
        id: 'aqeedah',
        name: 'Aqeedah & Theology',
        description: 'Islamic creed and theological matters',
        icon: <Crown className="w-5 h-5" />,
        tier: 'core',
        color: 'text-islamic-gold',
    },
    {
        id: 'spirituality',
        name: 'Spiritual Growth',
        description: 'Purification, dhikr, and spiritual development',
        icon: <Heart className="w-5 h-5" />,
        tier: 'core',
        color: 'text-rose-500',
    },
    {
        id: 'family',
        name: 'Family & Society',
        description: 'Marriage, parenting, and social matters',
        icon: <Users className="w-5 h-5" />,
        tier: 'core',
        color: 'text-secondary',
    },
    {
        id: 'fatwa',
        name: 'Detailed Fatwa',
        description: 'Comprehensive multi-perspective analysis',
        icon: <Scale className="w-5 h-5" />,
        tier: 'pro',
        color: 'text-primary',
    },
];

interface ModeSelectorProps {
    selectedMode: SpecializedMode;
    onModeChange: (mode: SpecializedMode) => void;
    userTier: 'free' | 'core' | 'pro';
}

export function ModeSelector({ selectedMode, onModeChange, userTier }: ModeSelectorProps) {
    const [hoveredMode, setHoveredMode] = useState<SpecializedMode | null>(null);

    const canAccessMode = (modeTier: 'free' | 'core' | 'pro'): boolean => {
        if (modeTier === 'free') return true;
        if (modeTier === 'core') return userTier === 'core' || userTier === 'pro';
        if (modeTier === 'pro') return userTier === 'pro';
        return false;
    };

    return (
        <div className="flex flex-wrap gap-2">
            {modes.map((mode) => {
                const hasAccess = canAccessMode(mode.tier);
                const isSelected = selectedMode === mode.id;

                return (
                    <button
                        key={mode.id}
                        type="button"
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
                        <span className="uppercase tracking-widest">{mode.name}</span>

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
                                Upgrade to {mode.tier.toUpperCase()}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
