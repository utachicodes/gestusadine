import { format } from 'date-fns';
import { Droplets, Activity } from 'lucide-react';
import { FLOW_OPTIONS, SYMPTOMS, MOODS, CYCLE_PHASES, type Tab } from './constants';

interface PeriodOverviewProps {
  tr: (obj: { en: string; fr: string }) => string;
  activeCycle: any;
  cycleDay: number | null;
  phaseMeta: { key: string; en: string; fr: string; color: string } | undefined;
  nextPeriod: Date | null;
  ovulationDay: Date | null;
  todayLog: any;
  handleEndCycle: () => void;
  handleStartCycle: () => void;
  setTab: (tab: Tab) => void;
}

export function PeriodOverview({ tr, activeCycle, cycleDay, phaseMeta, nextPeriod, ovulationDay, todayLog, handleEndCycle, handleStartCycle, setTab }: PeriodOverviewProps) {
  return (
    <div className="space-y-4">
      {/* Cycle status */}
      <div className="islamic-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1">
              {tr({ en: 'Current status', fr: 'Statut actuel' })}
            </p>
            {activeCycle ? (
              <>
                <p className="text-3xl font-bold text-foreground">
                  {tr({ en: `Day ${cycleDay}`, fr: `Jour ${cycleDay}` })}
                </p>
                {phaseMeta && (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border mt-2 ${phaseMeta.color}`}>
                    {tr({ en: phaseMeta.en, fr: phaseMeta.fr })}
                  </span>
                )}
              </>
            ) : (
              <p className="text-lg text-muted-foreground">
                {tr({ en: 'No active cycle', fr: 'Aucun cycle actif' })}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {activeCycle ? (
              <button
                onClick={handleEndCycle}
                className="px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-muted-foreground hover:text-foreground text-sm font-medium transition-all"
              >
                {tr({ en: 'End period', fr: 'Terminer la période' })}
              </button>
            ) : (
              <button onClick={handleStartCycle} className="btn-islamic">
                {tr({ en: 'Start period', fr: 'Démarrer la période' })}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming events */}
      {(nextPeriod || ovulationDay) && (
        <div className="grid sm:grid-cols-2 gap-3">
          {nextPeriod && !activeCycle && (
            <div className="islamic-card p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-50 text-red-600 flex-shrink-0">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {tr({ en: 'Next period', fr: 'Prochaine période' })}
                </p>
                <p className="text-sm font-semibold text-foreground">{format(nextPeriod, 'dd MMM yyyy')}</p>
              </div>
            </div>
          )}
          {ovulationDay && (
            <div className="islamic-card p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-green-50 text-green-600 flex-shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {tr({ en: 'Ovulation', fr: 'Ovulation' })}
                </p>
                <p className="text-sm font-semibold text-foreground">{format(ovulationDay, 'dd MMM yyyy')}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Today's log summary */}
      {todayLog && (
        <div className="islamic-card p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            {tr({ en: "Today's log", fr: "Journal d'aujourd'hui" })}
          </h2>
          <div className="flex flex-wrap gap-2">
            {todayLog.flow && todayLog.flow !== 'none' && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-medium">
                {FLOW_OPTIONS.find((f) => f.key === todayLog.flow)?.en ?? todayLog.flow}
              </span>
            )}
            {(todayLog.symptoms ?? []).map((s: string) => {
              const meta = SYMPTOMS.find((sym) => sym.key === s);
              return meta ? (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-accent/50 text-primary border border-primary/20 font-medium">
                   {meta.icon} {tr({ en: meta.en, fr: meta.fr })}
                </span>
              ) : null;
            })}
            {todayLog.mood && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-muted/50 text-foreground border border-border font-medium">
                 {MOODS.find((m) => m.key === todayLog.mood)?.icon} {todayLog.mood}
              </span>
            )}
          </div>
          <button onClick={() => setTab('log')} className="mt-3 text-xs text-primary font-medium hover:underline">
            {tr({ en: 'Update log →', fr: 'Mettre à jour →' })}
          </button>
        </div>
      )}

      {/* Phase legend */}
      <div className="islamic-card p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">
          {tr({ en: 'Cycle phases', fr: 'Phases du cycle' })}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CYCLE_PHASES.map((p) => (
            <div key={p.key} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium ${p.color}`}>
              <span className="w-2 h-2 rounded-full flex-shrink-0 bg-current" />
              {tr({ en: p.en, fr: p.fr })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
