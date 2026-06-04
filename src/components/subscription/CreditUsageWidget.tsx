import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { useSubscription } from '@/data/subscription';
import { useTr } from '@/lib/i18n';

export function CreditUsageWidget() {
    const navigate = useNavigate();
    const { usage } = useSubscription();
    const tr = useTr();

    const isUnlimited = usage.chat_credits_limit === -1;
    const showAsUnlimited = isUnlimited;

    const isLow = usage.percentage_used >= 80 && !isUnlimited;
    const isCritical = usage.percentage_used >= 95 && !isUnlimited;

    return (
        <Card className={`p-6 ${isCritical ? 'border-red-500 border-2' : isLow ? 'border-amber-500' : ''}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Zap className={`w-5 h-5 ${isCritical ? 'text-red-500' : isLow ? 'text-amber-500' : 'text-primary'}`} />
                    <h3 className="font-semibold text-islamic-dark dark:text-white">
                        {tr({ en: 'Council Usage', fr: 'Utilisation du Conseil' })}
                    </h3>
                </div>
                {(isLow || isCritical) && (
                    <AlertCircle className={`w-5 h-5 ${isCritical ? 'text-red-500' : 'text-amber-500'}`} />
                )}
            </div>

            {showAsUnlimited ? (
                <div className="text-center py-4">
                    <TrendingUp className="w-12 h-12 text-primary mx-auto mb-2" />
                    <p className="text-lg font-semibold text-islamic-dark dark:text-white">{tr({ en: 'Unlimited questions', fr: 'Questions illimitées' })}</p>
                    <p className="text-sm text-islamic-dark/60 dark:text-gray-400">
                        {tr({ en: 'Pro benefit', fr: 'Avantage Pro' })}
                    </p>
                </div>
            ) : (
                <>
                    <div className="mb-3">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-islamic-dark/70 dark:text-gray-300">
                                {tr({ en: `${usage.chat_credits_used} / ${usage.chat_credits_limit} questions used`, fr: `${usage.chat_credits_used} / ${usage.chat_credits_limit} questions utilisées` })}
                            </span>
                            <span className={`font-semibold ${isCritical ? 'text-red-500' :
                                isLow ? 'text-amber-500' :
                                    'text-primary'
                                }`}>
                                {usage.percentage_used}%
                            </span>
                        </div>
                        <Progress
                            value={usage.percentage_used}
                            className={`h-2 ${isCritical ? 'bg-red-100 dark:bg-red-900/20' :
                                isLow ? 'bg-amber-100 dark:bg-amber-900/20' :
                                    'bg-primary/10'
                                }`}
                        />
                    </div>

                    <p className="text-xs text-islamic-dark/60 dark:text-gray-400 mb-3">
                        {tr({ en: `Resets on ${new Date(usage.period_end).toLocaleDateString()}`, fr: `Réinitialisation le ${new Date(usage.period_end).toLocaleDateString('fr-FR')}` })}
                    </p>

                    {(isLow || isCritical) && (
                        <div className={`p-3 rounded-lg ${isCritical ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                            'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                            }`}>
                            <p className={`text-sm font-medium mb-2 ${isCritical ? 'text-red-800 dark:text-red-200' :
                                'text-amber-800 dark:text-amber-200'
                                }`}>
                                {isCritical
                                    ? tr({ en: '⚠️ Running out of questions!', fr: '⚠️ Vos questions sont presque épuisées !' })
                                    : tr({ en: '⚡ Questions running low', fr: '⚡ Il vous reste peu de questions' })}
                            </p>
                            <Button
                                onClick={() => navigate('/pricing')}
                                size="sm"
                                className="w-full btn-islamic"
                            >
                                {tr({ en: 'Upgrade for more', fr: 'Passer à l’offre supérieure' })}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </Card>
    );
}
