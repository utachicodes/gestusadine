import React from 'react';
import { BookOpen, MessageSquare, Moon, PenLine, CheckCircle2, Circle, Flame } from 'lucide-react';
import { useTr } from '@/lib/i18n';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface DailyGoal {
  id: string;
  icon: React.FC<{ className?: string }>;
  label: { en: string; fr: string };
  xp: number;
  completed: boolean;
}

interface DailyGoalsProps {
  streak?: number;
}

export const DailyGoals: React.FC<DailyGoalsProps> = ({ streak }) => {
  const tr = useTr();

  const quranProgress = useQuery(api.quranProgress.get);
  const todayPrayers = useQuery(api.prayers.getTodayLogs);
  const todayJournal = useQuery(api.journal.getTodayEntries);

  const today = new Date().toISOString().split('T')[0];

  const goals: DailyGoal[] = [
    {
      id: 'quran',
      icon: BookOpen,
      label: { en: 'Read a surah', fr: "Lire une sourate" },
      xp: 15,
      completed: (quranProgress?.completedSurahs?.length ?? 0) > 0,
    },
    {
      id: 'prayer',
      icon: Moon,
      label: { en: 'Log a prayer', fr: "Enregistrer une prière" },
      xp: 10,
      completed: (todayPrayers?.length ?? 0) > 0,
    },
    {
      id: 'journal',
      icon: PenLine,
      label: { en: 'Write a journal entry', fr: "Écrire une entrée de journal" },
      xp: 10,
      completed: (todayJournal?.length ?? 0) > 0,
    },
    {
      id: 'council',
      icon: MessageSquare,
      label: { en: 'Ask the Council', fr: "Poser une question au Conseil" },
      xp: 5,
      completed: false,
    },
  ];

  const completedCount = goals.filter((g) => g.completed).length;
  const totalXp = goals.filter((g) => g.completed).reduce((sum, g) => sum + g.xp, 0);
  const allDone = completedCount === goals.length;

  return (
    <div className="islamic-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${allDone ? 'bg-amber-500/10' : 'bg-primary/10'}`}>
            {allDone ? (
              <Flame className="w-4 h-4 text-amber-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-primary" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {tr({ en: 'Daily Goals', fr: 'Objectifs du jour' })}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {allDone
                ? tr({ en: 'All done! Mashallah', fr: 'Tout est fait ! Mashallah' })
                : `${completedCount}/${goals.length} ${tr({ en: 'completed', fr: 'terminés' })}`}
            </p>
          </div>
        </div>
        {totalXp > 0 && (
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            +{totalXp} XP
          </span>
        )}
      </div>

      <div className="space-y-2">
        {goals.map((goal) => {
          const Icon = goal.icon;
          return (
            <div
              key={goal.id}
              className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 ${
                goal.completed
                  ? 'bg-primary/5 border border-primary/10'
                  : 'bg-muted/30 border border-transparent hover:border-border'
              }`}
            >
              {goal.completed ? (
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" />
              )}
              <Icon className={`w-4 h-4 flex-shrink-0 ${goal.completed ? 'text-primary' : 'text-muted-foreground/50'}`} />
              <span className={`text-sm flex-1 ${goal.completed ? 'text-foreground line-through opacity-70' : 'text-foreground'}`}>
                {tr(goal.label)}
              </span>
              <span className={`text-[10px] font-bold ${goal.completed ? 'text-primary' : 'text-muted-foreground/40'}`}>
                +{goal.xp} XP
              </span>
            </div>
          );
        })}
      </div>

      {allDone && (
        <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-center">
          <p className="text-sm font-semibold text-amber-700">
            {tr({ en: 'All goals completed! Keep it up!', fr: 'Tous les objectifs sont terminés ! Continuez !' })}
          </p>
        </div>
      )}
    </div>
  );
};
