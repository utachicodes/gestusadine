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
        <div className="mb-6">
            <h3 className="text-sm font-semibold text-islamic-dark dark:text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Specialized Mode
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {modes.map((mode) => {
                    const hasAccess = canAccessMode(mode.tier);
                    const isSelected = selectedMode === mode.id;

                    return (
                        <Card
                            key={mode.id}
                            className={`relative p-4 cursor-pointer transition-all duration-200 ${isSelected
                                ? 'border-primary border-2 shadow-lg'
                                : hasAccess
                                    ? 'hover:border-primary/50 hover:shadow-md'
                                    : 'opacity-50 cursor-not-allowed'
                                }`}
                            onClick={() => hasAccess && onModeChange(mode.id)}
                            onMouseEnter={() => setHoveredMode(mode.id)}
                            onMouseLeave={() => setHoveredMode(null)}
                        >
                            {!hasAccess && (
                                <div className="absolute top-2 right-2">
                                    <Badge variant="secondary" className="text-xs bg-islamic-gold/10 text-islamic-gold border-islamic-gold/20">
                                        {mode.tier === 'core' ? 'Core' : 'Pro'}
                                    </Badge>
                                </div>
                            )}

                            {isSelected && (
                                <div className="absolute top-2 right-2">
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                </div>
                            )}

                            <div className={`mb-3 ${mode.color}`}>
                                {mode.icon}
                            </div>

                            <h4 className="font-semibold text-sm text-islamic-dark dark:text-white mb-1">
                                {mode.name}
                            </h4>

                            <p className="text-xs text-islamic-dark/60 dark:text-gray-400 line-clamp-2">
                                {mode.description}
                            </p>

                            {!hasAccess && hoveredMode === mode.id && (
                                <div className="absolute inset-0 bg-black/80 rounded-lg flex items-center justify-center p-3">
                                    <p className="text-xs text-white text-center font-medium">
                                        Upgrade to {mode.tier === 'core' ? 'Core' : 'Pro'} to unlock
                                    </p>
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
