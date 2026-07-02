import React from 'react';
import { BookOpen, Flame, BarChart2, Tag } from 'lucide-react';
import { MOODS } from './journalConstants';

interface JournalStatsProps {
  stats: any;
  tr: (obj: { en: string; fr: string }) => string;
}

export function JournalStats({ stats, tr }: JournalStatsProps) {
  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />, label: tr({ en: 'Total entries', fr: 'Total entrées' }), value: stats?.total ?? 0, sub: tr({ en: 'journal entries', fr: 'entrées de journal' }) },
          { icon: <Flame className="w-4 h-4 sm:w-5 sm:h-5" />,   label: tr({ en: 'Streak', fr: 'Série' }),         value: stats?.streak ?? 0, sub: tr({ en: 'consecutive days', fr: 'jours consécutifs' }) },
          { icon: <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" />,label: tr({ en: 'Moods', fr: 'Humeurs' }),       value: Object.keys(stats?.moodCounts ?? {}).length, sub: tr({ en: 'types recorded', fr: 'types enregistrés' }) },
          { icon: <Tag className="w-4 h-4 sm:w-5 sm:h-5" />,     label: tr({ en: 'Tags', fr: 'Étiquettes' }),      value: Object.keys(stats?.tagCounts ?? {}).length, sub: tr({ en: 'unique tags', fr: 'étiquettes uniques' }) },
        ].map(({ icon, label, value, sub }) => (
          <div key={label} className="islamic-card p-3 sm:p-4 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1 truncate">{label}</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground leading-none">{value}</p>
              <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>
            </div>
            <div className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-accent/50 text-primary">{icon}</div>
          </div>
        ))}
      </div>

      {/* Mood distribution */}
      {Object.keys(stats?.moodCounts ?? {}).length > 0 && (
        <div className="islamic-card p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            {tr({ en: 'Mood distribution', fr: 'Répartition des humeurs' })}
          </h2>
          <div className="space-y-2.5">
            {MOODS.filter((m) => (stats?.moodCounts ?? {})[m.key]).map((m) => {
              const count = (stats?.moodCounts ?? {})[m.key] ?? 0;
              const total = stats?.total ?? 1;
              const pct = Math.round((count / total) * 100);
              const Icon = m.icon;
              return (
                <div key={m.key} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0 text-primary/70" />
                  <div className="flex-1 h-2.5 rounded-full bg-muted/40 overflow-hidden">
                    <div className="h-full rounded-full bg-primary/70 transition-all duration-300" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top tags */}
      {Object.keys(stats?.tagCounts ?? {}).length > 0 && (
        <div className="islamic-card p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            {tr({ en: 'Top tags', fr: 'Étiquettes populaires' })}
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats?.tagCounts ?? {})
              .sort(([, a], [, b]) => b - a)
              .slice(0, 20)
              .map(([tag, count]) => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/50 text-primary text-sm font-medium">
                  #{tag}
                  <span className="text-xs text-primary/70 ml-1">{count}</span>
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
