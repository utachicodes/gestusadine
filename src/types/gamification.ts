export type Rank = 'Talib' | 'Murid' | 'Bahith' | 'Alim' | 'Faqih';

export interface UserProgress {
    userId: string;
    rank: Rank;
    currentPoints: number;
    nextRankThreshold: number;
    completedClasses: string[];
    badges: string[];
}

export const RANKS: Record<Rank, { label: string; threshold: number; color: string }> = {
    Talib: { label: 'Talib (Student)', threshold: 0, color: 'text-slate-500' },
    Murid: { label: 'Murid (Seeker)', threshold: 100, color: 'text-emerald-500' },
    Bahith: { label: 'Bahith (Researcher)', threshold: 500, color: 'text-blue-500' },
    Alim: { label: 'Alim (Scholar)', threshold: 1000, color: 'text-purple-500' },
    Faqih: { label: 'Faqih (Jurist)', threshold: 2500, color: 'text-amber-500' },
};
