import React from 'react';
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PricingTier {
    tier: 'free' | 'core' | 'pro';
    highlighted?: boolean;
    icon: React.ReactNode;
    price: string;
    credits: string;
    description: string;
}

const tiers: PricingTier[] = [
    {
        tier: 'free',
        price: '0 XOF',
        icon: <Sparkles className="w-5 h-5 text-deep-green/40" />,
        credits: '50',
        description: 'Try the platform with 50 monthly credits'
    },
    {
        tier: 'core',
        price: '5,000 XOF',
        icon: <Zap className="w-5 h-5 text-warm-gold" />,
        highlighted: true,
        credits: '500',
        description: 'For regular use — 500 credits and full features'
    },
    {
        tier: 'pro',
        price: '10,000 XOF',
        icon: <Crown className="w-5 h-5 text-deep-green-light" />,
        credits: 'Unlimited',
        description: 'Unlimited access to everything'
    },
];

interface PricingComparisonProps {
    onSelectPlan?: (tier: 'free' | 'core' | 'pro') => void;
}

export function PricingComparison({ onSelectPlan }: PricingComparisonProps) {
    const { t } = useLanguage();

    const handleSelect = (tier: 'free' | 'core' | 'pro') => {
        if (onSelectPlan) onSelectPlan(tier);
    };

    const getFeatures = (tier: 'free' | 'core' | 'pro') => {
        if (tier === 'free') {
            return [
                { name: t('pricing.feature.chat_credits', { count: '50' }), included: true },
                { name: t('pricing.feature.basic_responses'), included: true },
                { name: t('pricing.feature.standard_time'), included: true },
                { name: t('pricing.feature.specialized_modes'), included: false },
                { name: t('pricing.feature.personalized_themes'), included: false },
            ];
        } else if (tier === 'core') {
            return [
                { name: t('pricing.feature.chat_credits', { count: '500' }), included: true },
                { name: t('pricing.feature.specialized_modes'), included: true },
                { name: t('pricing.feature.personalized_themes'), included: true },
                { name: t('pricing.feature.memory'), included: true },
                { name: t('pricing.feature.priority'), included: true },
            ];
        } else {
            return [
                { name: t('pricing.feature.unlimited_credits'), included: true },
                { name: t('pricing.feature.all_modes'), included: true },
                { name: t('pricing.feature.full_customization'), included: true },
                { name: t('pricing.feature.advanced_memory'), included: true },
                { name: t('pricing.feature.early_access'), included: true },
            ];
        }
    };

    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-warm-sand/20 -z-10" />

            <div className="container px-4 relative z-10">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-deep-green mb-4 tracking-tight">
                        {t('pricing.title_prefix') || 'Pricing'}
                    </h2>
                    <p className="text-base text-deep-green/55 max-w-xl mx-auto">
                        {t('pricing.subtitle') || 'Start free. Upgrade when you need more.'}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
                    {tiers.map((tier) => (
                        <div key={tier.tier} className="relative">
                            <div className={`glass-card-warm rounded-2xl p-7 flex flex-col transition-all duration-200 hover:shadow-md ${
                                tier.highlighted
                                    ? 'border-warm-gold/40 shadow-lg scale-[1.02] z-10'
                                    : ''
                            }`}>
                                {tier.highlighted && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-warm-gold text-white text-[10px] font-bold uppercase tracking-[0.15em] px-4 py-1 rounded-full">
                                        {t('pricing.most_popular') || 'Most popular'}
                                    </div>
                                )}

                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-2 rounded-lg bg-warm-sand/40 border ${tier.highlighted ? 'border-warm-gold/30' : 'border-warm-sand'}`}>
                                            {tier.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-deep-green uppercase tracking-tight">
                                            {t(`pricing.tier.${tier.tier}.name`) || tier.tier}
                                        </h3>
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-3xl font-black text-deep-green">{tier.price}</span>
                                        {tier.tier !== 'free' && (
                                            <span className="text-deep-green/40 font-semibold text-xs uppercase tracking-widest">
                                                {t('pricing.per_month') || '/ month'}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-deep-green/50 text-sm">
                                        {t(`pricing.tier.${tier.tier}.description`) || tier.description}
                                    </p>
                                </div>

                                <div className="space-y-3 flex-1 mb-7">
                                    {getFeatures(tier.tier).map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            {feature.included ? (
                                                <div className="w-5 h-5 rounded-full bg-sage-green/15 flex items-center justify-center border border-sage-green/25 flex-shrink-0">
                                                    <Check className="w-3 h-3 text-sage-green-dark" />
                                                </div>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-warm-sand/30 flex items-center justify-center border border-warm-sand flex-shrink-0">
                                                    <X className="w-3 h-3 text-deep-green/25" />
                                                </div>
                                            )}
                                            <span className={`text-sm ${feature.included ? 'text-deep-green/80' : 'text-deep-green/25'}`}>
                                                {feature.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleSelect(tier.tier)}
                                    className={`w-full py-3 rounded-xl font-bold uppercase tracking-[0.1em] text-xs transition-all duration-200 ${
                                        tier.highlighted
                                            ? 'bg-deep-green text-warm-cream hover:bg-deep-green-light shadow-md'
                                            : 'bg-warm-sand/40 text-deep-green border border-warm-sand hover:bg-warm-sand/70'
                                    }`}
                                >
                                    {tier.tier === 'free'
                                        ? t('pricing.get_started_free') || 'Start free'
                                        : `${t('pricing.upgrade_prefix') || 'Upgrade to'} ${tier.tier}`}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
