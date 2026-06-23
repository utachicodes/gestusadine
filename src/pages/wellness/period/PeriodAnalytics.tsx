import { BarChart2 } from 'lucide-react';
import { SYMPTOMS } from './constants';

interface PeriodAnalyticsProps {
  tr: (obj: { en: string; fr: string }) => string;
  analytics: any;
}

export function PeriodAnalytics({ tr, analytics }: PeriodAnalyticsProps) {
  return (
    <div className="space-y-4">
      {!analytics || analytics.totalCycles === 0 ? (
        <div className="islamic-card p-8 text-center">
          <BarChart2 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {tr({ en: 'Not enough data yet. Log a few cycles first.', fr: "Pas encore assez de données. Enregistrez quelques cycles d'abord." })}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: tr({ en: 'Avg cycle', fr: 'Cycle moy.' }), value: `${analytics.avgCycleLength}`, sub: tr({ en: 'days', fr: 'jours' }) },
              { label: tr({ en: 'Avg period', fr: 'Règles moy.' }), value: `${analytics.avgPeriodLength}`, sub: tr({ en: 'days', fr: 'jours' }) },
              { label: tr({ en: 'Cycles tracked', fr: 'Cycles suivis' }), value: `${analytics.totalCycles}`, sub: tr({ en: 'total', fr: 'total' }) },
            ].map(({ label, value, sub }) => (
              <div key={label} className="islamic-card p-3 sm:p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1">{label}</p>
                <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              </div>
            ))}
          </div>

          {analytics.cycleLengths.length > 1 && (
            <div className="islamic-card p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">
                {tr({ en: 'Cycle lengths', fr: 'Durées des cycles' })}
              </h2>
              {/* Horizontally scrollable so bars don't squish on mobile */}
              <div className="overflow-x-auto">
                <div className="flex items-end gap-2 h-24" style={{ minWidth: analytics.cycleLengths.length * 48 }}>
                  {analytics.cycleLengths.map((len: number, i: number) => {
                    const max = Math.max(...analytics.cycleLengths, 35);
                    const pct = (len / max) * 100;
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 w-10 flex-shrink-0">
                        <span className="text-[10px] text-muted-foreground">{len}d</span>
                        <div className="w-full rounded-sm bg-muted/40 overflow-hidden" style={{ height: 56 }}>
                          <div
                            className="w-full bg-primary/70 rounded-sm"
                            style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {Object.keys(analytics.symptomCounts).length > 0 && (
            <div className="islamic-card p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">
                {tr({ en: 'Most common symptoms', fr: 'Symptômes les plus fréquents' })}
              </h2>
              <div className="space-y-2.5">
                {Object.entries(analytics.symptomCounts)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 8)
                  .map(([key, count]) => {
                    const meta = SYMPTOMS.find((s) => s.key === key);
                    const maxVal = Math.max(...Object.values(analytics.symptomCounts) as number[]);
                    const pct = Math.round(((count as number) / maxVal) * 100);
                    return (
                      <div key={key} className="flex items-center gap-3">
                         <span className="flex-shrink-0">{meta?.icon ?? '•'}</span>
                        <div className="flex-1 h-2.5 rounded-full bg-muted/40 overflow-hidden">
                          <div className="h-full rounded-full bg-primary/70 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground w-5 text-right">{count}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
