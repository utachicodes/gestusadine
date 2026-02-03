import { motion } from 'framer-motion';
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '../ui/button';
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
        icon: <Sparkles className="w-6 h-6 text-white/50" />,
        credits: '50',
        description: 'First exposure to authentic guidance'
    },
    {
        tier: 'core',
        price: '5,000 XOF',
        icon: <Zap className="w-6 h-6 text-cyan-glow" />,
        highlighted: true,
        credits: '500',
        description: 'The main experience for practitioners'
    },
    {
        tier: 'pro',
        price: '10,000 XOF',
        icon: <Crown className="w-6 h-6 text-purple-400" />,
        credits: 'Unlimited',
        description: 'For serious, long-term builders of knowledge'
    },
];

interface PricingComparisonProps {
    onSelectPlan?: (tier: 'free' | 'core' | 'pro') => void;
}

export function PricingComparison({ onSelectPlan }: PricingComparisonProps) {
    const { t } = useLanguage();

    const handleSelect = (tier: 'free' | 'core' | 'pro') => {
        if (onSelectPlan) {
            onSelectPlan(tier);
        }
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
        <section id="pricing" className="py-32 bg-deep-slate relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,255,0.05),transparent_70%)] pointer-events-none" />

            <div className="container px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="inline-flex items-center text-xs uppercase tracking-[0.3em] text-cyan-glow font-bold mb-4">
                            <span className="w-2 h-2 rounded-full bg-cyan-glow mr-3 animate-pulse" />
                            {t('pricing.section_label') || 'Tiered Access'}
                        </p>
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                            {t('pricing.title_prefix') || 'Choose Your'} <span className="text-gradient-cyan">{t('pricing.title_gradient') || 'Path'}</span>
                        </h2>
                        <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
                            {t('pricing.subtitle') || 'Fuel your spiritual evolution with precision tools and verified knowledge.'}
                        </p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={tier.tier}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="relative"
                        >
                            <div className={`h-full glass-card-premium rounded-3xl p-8 flex flex-col transition-all duration-500 hover:translate-y-[-10px] ${tier.highlighted ? 'border-cyan-glow/30 shadow-[0_0_50px_rgba(0,245,255,0.1)] scale-105 z-10' : 'hover:border-white/20'}`}>
                                {tier.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-glow text-deep-slate text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-glow-cyan">
                                        {t('pricing.most_popular') || 'Recommended'}
                                    </div>
                                )}

                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${tier.highlighted ? 'border-cyan-glow/20' : ''}`}>
                                            {tier.icon}
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                                            {t(`pricing.tier.${tier.tier}.name`) || tier.tier}
                                        </h3>
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-5xl font-black text-white">{tier.price}</span>
                                        {tier.tier !== 'free' && (
                                            <span className="text-white/40 font-bold uppercase text-xs tracking-widest">{t('pricing.per_month') || '/ Month'}</span>
                                        )}
                                    </div>
                                    <p className="text-white/50 text-sm font-medium leading-relaxed">
                                        {t(`pricing.tier.${tier.tier}.description`) || tier.description}
                                    </p>
                                </div>

                                <div className="space-y-4 flex-1 mb-10">
                                    {getFeatures(tier.tier).map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            {feature.included ? (
                                                <div className="w-5 h-5 rounded-full bg-cyan-glow/10 flex items-center justify-center border border-cyan-glow/20">
                                                    <Check className="w-3 h-3 text-cyan-glow" />
                                                </div>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                                    <X className="w-3 h-3 text-white/20" />
                                                </div>
                                            )}
                                            <span className={`text-sm font-semibold transition-colors ${feature.included ? 'text-white/80' : 'text-white/20'}`}>
                                                {feature.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleSelect(tier.tier)}
                                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-xs transition-all duration-300 ${tier.highlighted
                                        ? 'bg-cyan-glow text-deep-slate shadow-glow-cyan hover:scale-[1.02]'
                                        : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {tier.tier === 'free'
                                        ? t('pricing.get_started_free') || 'Activate Free'
                                        : `${t('pricing.upgrade_prefix') || 'Upgrade to'} ${tier.tier}`}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
