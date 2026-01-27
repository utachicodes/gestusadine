import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UsageData {
    chat_credits_used: number;
    chat_credits_limit: number;
    percentage_used: number;
    period_end: string;
}

export function CreditUsageWidget() {
    const [usage, setUsage] = useState<UsageData | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useLanguage();

    useEffect(() => {
        fetchUsage();
    }, []);

    const fetchUsage = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
            const response = await fetch(`${apiUrl}/api/subscription/usage`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsage(data);
            }
        } catch (error) {
            console.error('Failed to fetch usage:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className="p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </Card>
        );
    }

    if (!usage) return null;

    const isUnlimited = usage.chat_credits_limit === -1;
    const isLow = usage.percentage_used >= 80 && !isUnlimited;
    const isCritical = usage.percentage_used >= 95 && !isUnlimited;

    return (
        <Card className={`p-6 ${isCritical ? 'border-red-500 border-2' : isLow ? 'border-amber-500' : ''}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Zap className={`w-5 h-5 ${isCritical ? 'text-red-500' : isLow ? 'text-amber-500' : 'text-primary'}`} />
                    <h3 className="font-semibold text-islamic-dark dark:text-white">
                        Credit Usage
                    </h3>
                </div>
                {(isLow || isCritical) && (
                    <AlertCircle className={`w-5 h-5 ${isCritical ? 'text-red-500' : 'text-amber-500'}`} />
                )}
            </div>

            {isUnlimited ? (
                <div className="text-center py-4">
                    <TrendingUp className="w-12 h-12 text-primary mx-auto mb-2" />
                    <p className="text-lg font-semibold text-islamic-dark dark:text-white">Unlimited Credits</p>
                    <p className="text-sm text-islamic-dark/60 dark:text-gray-400">Pro tier benefit</p>
                </div>
            ) : (
                <>
                    <div className="mb-3">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-islamic-dark/70 dark:text-gray-300">
                                {usage.chat_credits_used} / {usage.chat_credits_limit} credits used
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
                        Resets on {new Date(usage.period_end).toLocaleDateString()}
                    </p>

                    {(isLow || isCritical) && (
                        <div className={`p-3 rounded-lg ${isCritical ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                            'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                            }`}>
                            <p className={`text-sm font-medium mb-2 ${isCritical ? 'text-red-800 dark:text-red-200' :
                                'text-amber-800 dark:text-amber-200'
                                }`}>
                                {isCritical ? '⚠️ Running out of credits!' : '⚡ Credits running low'}
                            </p>
                            <Button
                                onClick={() => navigate('/pricing')}
                                size="sm"
                                className="w-full btn-islamic"
                            >
                                Upgrade for More Credits
                            </Button>
                        </div>
                    )}
                </>
            )}
        </Card>
    );
}
