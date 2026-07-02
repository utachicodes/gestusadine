import React from 'react';
import { Trophy, Star, Flame, Zap, BookOpen, Compass, Search, GraduationCap, Crown, Award } from 'lucide-react';
import { RANKS, Rank } from '@/types/gamification';

interface RankDisplayProps {
  currentRank: Rank;
  currentPoints: number;
  streak?: number;
}

const RANK_ICONS: Record<Rank, React.FC<{ className?: string }>> = {
  Talib: BookOpen,
  Murid: Compass,
  Bahith: Search,
  Alim: GraduationCap,
  Faqih: Crown,
};

const RANK_GRADIENTS: Record<Rank, string> = {
  Talib: 'from-slate-400 to-slate-500',
  Murid: 'from-emerald-400 to-emerald-600',
  Bahith: 'from-blue-400 to-blue-600',
  Alim: 'from-purple-400 to-purple-600',
  Faqih: 'from-amber-400 to-amber-600',
};

const RANK_COLORS: Record<Rank, string> = {
  Talib: 'text-slate-500',
  Murid: 'text-emerald-500',
  Bahith: 'text-blue-500',
  Alim: 'text-purple-500',
  Faqih: 'text-amber-500',
};

export const RankDisplay: React.FC<RankDisplayProps> = React.memo(({ currentRank, currentPoints, streak }) => {
  const rankInfo = RANKS[currentRank];
  const rankKeys = Object.keys(RANKS) as Rank[];
  const nextRankIndex = rankKeys.indexOf(currentRank) + 1;
  const nextRankKey = nextRankIndex < rankKeys.length ? rankKeys[nextRankIndex] : null;
  const nextRank = nextRankKey ? RANKS[nextRankKey] : null;
  const RankIcon = RANK_ICONS[currentRank];
  const gradient = RANK_GRADIENTS[currentRank];
  const rankColor = RANK_COLORS[currentRank];

  let progress = 100;
  if (nextRank) {
    const range = nextRank.threshold - rankInfo.threshold;
    const current = currentPoints - rankInfo.threshold;
    progress = Math.min(100, Math.max(0, (current / range) * 100));
  }

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="islamic-card p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg width="80" height="80" className="transform -rotate-90">
              <circle
                cx="40" cy="40" r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                className="text-muted/30"
              />
              <circle
                cx="40" cy="40" r={radius}
                fill="none"
                stroke="url(#rankGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="rankGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className="text-primary" stopColor="currentColor" />
                  <stop offset="100%" className="text-accent-foreground" stopColor="currentColor" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <RankIcon className={`w-7 h-7 ${rankColor}`} />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {rankInfo.label}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-mono font-bold text-lg text-foreground">{currentPoints.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">XP</span>
            </div>
          </div>
        </div>

        {streak !== undefined && streak > 0 && (
          <div className="flex flex-col items-center gap-0.5">
            <div className="relative">
              <Flame className="w-7 h-7 text-orange-500 animate-pulse" />
              {streak >= 7 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
              )}
            </div>
            <span className="font-mono font-bold text-sm text-orange-500">{streak}</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">streak</span>
          </div>
        )}
      </div>

      {nextRank && (
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-muted-foreground font-medium">{rankInfo.label}</span>
            <span className="text-muted-foreground font-medium">{nextRank.label}</span>
          </div>
          <div className="relative h-3 rounded-full bg-muted/40 overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
            </div>
          </div>
          <p className="text-[10px] text-center text-muted-foreground">
            <Zap className="inline w-3 h-3 text-primary mr-0.5" />
            {nextRank.threshold - currentPoints} XP to <span className="font-medium text-foreground">{nextRank.label}</span>
          </p>
        </div>
      )}

      {!nextRank && (
        <div className="text-center py-1 flex items-center justify-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <p className="text-sm font-semibold text-amber-500">Max Rank Achieved!</p>
          <Award className="w-5 h-5 text-amber-500" />
        </div>
      )}
    </div>
  );
});
