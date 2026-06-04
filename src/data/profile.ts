import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { ConsistencyDay } from './profile';

export type { ConsistencyDay };

export interface UserStats {
  joinDate: string;
  rank: string;
  streak: number;
  totalXp: number;
  quizzesTaken: number;
  perfectScores: number;
  timeSpent: string;
  consistency: ConsistencyDay[];
}

export function useProfileStats(): UserStats {
  const stats = useQuery(api.gamification.myStats);
  return {
    joinDate: 'N/A',
    rank: stats?.rank ?? 'Talib',
    streak: stats?.streak ?? 0,
    totalXp: stats?.xp ?? 0,
    quizzesTaken: stats?.quizzesTaken ?? 0,
    perfectScores: stats?.perfectScores ?? 0,
    timeSpent: '—',
    consistency: [],
  };
}
