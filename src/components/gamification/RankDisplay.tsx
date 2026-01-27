import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { RANKS, Rank } from '@/types/gamification';
import { Progress } from "@/components/ui/progress";

interface RankDisplayProps {
    currentRank: Rank;
    currentPoints: number;
}

export const RankDisplay: React.FC<RankDisplayProps> = ({ currentRank, currentPoints }) => {
    const rankInfo = RANKS[currentRank];
    const rankKeys = Object.keys(RANKS) as Rank[];
    const nextRankIndex = rankKeys.indexOf(currentRank) + 1;
    const nextRankKey = nextRankIndex < rankKeys.length ? rankKeys[nextRankIndex] : null;
    const nextRank = nextRankKey ? RANKS[nextRankKey] : null;

    // Calculate progress percentage
    // If max rank, 100%. Else (current - current_threshold) / (next_threshold - current_threshold)
    let progress = 100;
    if (nextRank) {
        const range = nextRank.threshold - rankInfo.threshold;
        const current = currentPoints - rankInfo.threshold;
        progress = Math.min(100, Math.max(0, (current / range) * 100));
    }

    return (
        <div className="islamic-card p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full bg-slate-100 dark:bg-slate-800 ${rankInfo.color}`}>
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Current Rank</p>
                        <p className={`font-bold ${rankInfo.color}`}>{rankInfo.label}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Ilm Points</p>
                    <div className="flex items-center gap-1 justify-end">
                        <Star className="w-3.5 h-3.5 text-islamic-gold fill-islamic-gold animate-pulse-slow" />
                        <span className="font-mono font-bold text-islamic-gold-700">{currentPoints}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{rankInfo.label}</span>
                    <span>{nextRank ? nextRank.label : 'Max Rank'}</span>
                </div>
                <Progress value={progress} className="h-2" />
                {nextRank && (
                    <p className="text-[10px] text-center text-muted-foreground">
                        {nextRank.threshold - currentPoints} points to next rank
                    </p>
                )}
            </div>
        </div>
    );
};
