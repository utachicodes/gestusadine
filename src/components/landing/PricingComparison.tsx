import { motion } from 'framer-motion';
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface PricingTier {
    tier: 'free' | 'core' | 'pro';
    highlighted?: boolean;
    icon: React.ReactNode;
    price: string;
    credits: number;
}

const tiers: PricingTier[] = [
    {
        tier: 'free',
        price: '0 XOF',
        icon: <Sparkles className="w-6 h-6" />,
        credits: 50,
    },
    {
        tier: 'core',
        price: '5,000 XOF',
        icon: <Zap className="w-6 h-6" />,
        highlighted: true,
        credits: 500,
    },
    {
        tier: 'pro',
        price: '10,000 XOF',
        icon: <Crown className="w-6 h-6" />,
        credits: -1, // unlimited
    },
];

interface PricingComparisonProps {
    onSelectPlan?: (tier: 'free' | 'core' | 'pro') => void;
}

export function PricingComparison({ onSelectPlan }: PricingComparisonProps) {
    const { t } = useLanguage();

    const getFeatures = (tier: 'free' | 'core' | 'pro') => {
        if (tier === 'free') {
            return [
                { name: t('pricing.feature.chat_credits', { count: '50' }), included: true },
                { name: t('pricing.feature.basic_responses'), included: true },
                { name: t('pricing.feature.standard_time'), included: true },
                { name: t('pricing.feature.specialized_modes'), included: false },
                { name: t('pricing.feature.personalized_themes'), included: false },
                { name: t('pricing.feature.memory'), included: false },
                { name: t('pricing.feature.templates'), included: false },
                { name: t('pricing.feature.priority'), included: false },
            ];
        } else if (tier === 'core') {
            return [
                { name: t('pricing.feature.chat_credits', { count: '500' }), included: true },
                { name: t('pricing.feature.specialized_modes'), included: true },
                { name: t('pricing.feature.personalized_themes'), included: true },
                { name: t('pricing.feature.memory'), included: true },
                { name: t('pricing.feature.templates'), included: true },
                { name: t('pricing.feature.priority'), included: true },
                { name: t('pricing.feature.advanced_planning'), included: false },
                { name: t('pricing.feature.early_access'), included: false },
            ];
        } else {
            return [
                { name: t('pricing.feature.unlimited_credits'), included: true },
                { name: t('pricing.feature.all_modes'), included: true },
                { name: t('pricing.feature.full_customization'), included: true },
                { name: t('pricing.feature.advanced_memory'), included: true },
                { name: t('pricing.feature.all_templates'), included: true },
                { name: t('pricing.feature.priority'), included: true },
                { name: t('pricing.feature.advanced_planning'), included: true },
                { name: t('pricing.feature.early_access'), included: true },
            ];
        }
    };

    return (
        <section id="pricing" className="py-20 bg-gradient-to-b from-white to-islamic-cream/20 dark:from-gray-900 dark:to-gray-800">
            <div className="container px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 dark:text-gray-400 mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
                            {t('pricing.section_label')}
                        </p>
                        <h2 className="text-4xl md:text-5xl font-bold text-islamic-dark dark:text-white mb-4">
                            {t('pricing.title_prefix')} <span className="text-gradient">{t('pricing.title_gradient')}</span>
                        </h2>
                        <p className="text-xl text-islamic-dark/70 dark:text-gray-300 max-w-2xl mx-auto">
                            {t('pricing.subtitle')}
                        </p>
                    </motion.div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={tier.tier}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={tier.highlighted ? 'md:-mt-4' : ''}
                        >
                            <Card
                                className={`p-8 h-full flex flex-col relative ${tier.highlighted
                                        ? 'border-primary border-2 shadow-2xl'
                                        : 'border-islamic-cream dark:border-gray-700'
                                    }`}
                            >
                                {tier.highlighted && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1 rounded-full">
                                            {t('pricing.most_popular')}
                                        </span>
                                    </div>
                                )}

                                {/* Icon */}
                                <div
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${tier.highlighted
                                            ? 'bg-primary text-white'
                                            : 'bg-primary/10 text-primary'
                                        }`}
                                >
                                    {tier.icon}
                                </div>

                                {/* Name & Price */}
                                <h3 className="text-2xl font-bold text-islamic-dark dark:text-white mb-2">
                                    {t(`pricing.tier.${tier.tier}.name`)}
                                </h3>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-islamic-dark dark:text-white">
                                        {tier.price}
                                    </span>
                                    {tier.tier !== 'free' && (
                                        <span className="text-islamic-dark/60 dark:text-gray-400">{t('pricing.per_month')}</span>
                                    )}
                                </div>
                                <p className="text-sm text-islamic-dark/60 dark:text-gray-400 mb-6">
                                    {t(`pricing.tier.${tier.tier}.description`)}
                                </p>

                                {/* CTA Button */}
                                <Button
                                    onClick={() => onSelectPlan?.(tier.tier)}
                                    className={`w-full mb-6 ${tier.highlighted ? 'btn-islamic' : 'btn-islamic-outlined'
                                        }`}
                                >
                                    {tier.tier === 'free'
                                        ? t('pricing.get_started_free')
                                        : `${t('pricing.upgrade_prefix')} ${t(`pricing.tier.${tier.tier}.name`)}`}
                                </Button>

                                {/* Features */}
                                <ul className="space-y-3 flex-1">
                                    {getFeatures(tier.tier).map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            {feature.included ? (
                                                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <X className="w-5 h-5 text-islamic-dark/20 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                                            )}
                                            <span
                                                className={
                                                    feature.included
                                                        ? 'text-islamic-dark dark:text-gray-200'
                                                        : 'text-islamic-dark/40 dark:text-gray-500'
                                                }
                                            >
                                                {feature.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ or Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <p className="text-sm text-islamic-dark/60 dark:text-gray-400">
                        {t('pricing.footer_note')}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
