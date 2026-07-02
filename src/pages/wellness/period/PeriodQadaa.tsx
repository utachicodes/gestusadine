import { Info, Check, Moon } from 'lucide-react';
import { toast } from 'sonner';

interface PeriodQadaaProps {
  tr: (obj: { en: string; fr: string }) => string;
  qadaaSummary: any;
  markQadaaCompleted: any;
  unmarkQadaaCompleted: any;
  backfillQadaa: any;
  qadaaDaysPerWeek: number;
  setQadaaDaysPerWeek: (n: number) => void;
  qadaaPreferredDays: number[];
  setQadaaPreferredDays: React.Dispatch<React.SetStateAction<number[]>>;
  qadaaReminderEnabled: boolean;
  setQadaaReminderEnabled: (b: boolean) => void;
  updateSettings: any;
}

export function PeriodQadaa({ tr, qadaaSummary, markQadaaCompleted, unmarkQadaaCompleted, backfillQadaa, qadaaDaysPerWeek, setQadaaDaysPerWeek, qadaaPreferredDays, setQadaaPreferredDays, qadaaReminderEnabled, setQadaaReminderEnabled, updateSettings }: PeriodQadaaProps) {
  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          {tr({
            en: 'When you log a period that overlaps with Ramadan, the missed fasting days (Sawm) are tracked here automatically. Make them up at your own pace and mark each day complete.',
            fr: "Lorsque vous enregistrez une période qui chevauche le Ramadan, les jours de jeûne manqués (Sawm) sont suivis ici automatiquement. Rattrapez-les à votre rythme et marquez chaque jour comme accompli.",
          })}
        </p>
      </div>

      {/* Summary card */}
      {qadaaSummary != null && (
        <div className="islamic-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">
              {tr({ en: 'Qadaa summary', fr: 'Résumé Qadaa' })}
            </h2>
            <button
              onClick={async () => {
                try {
                  const r = await backfillQadaa({});
                  if (r.inserted > 0) toast.success(tr({ en: `Found ${r.inserted} new day(s) to make up.`, fr: `${r.inserted} nouveau(x) jour(s) à rattraper trouvé(s).` }));
                  else toast.success(tr({ en: 'No new days found.', fr: 'Aucun nouveau jour trouvé.' }));
                } catch { toast.error(tr({ en: 'Scan failed.', fr: 'Analyse échouée.' })); }
              }}
              className="text-xs text-primary font-medium hover:underline"
            >
              {tr({ en: 'Scan past cycles', fr: 'Analyser les cycles passés' })}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-center">
              <p className="text-2xl font-bold text-amber-700">{qadaaSummary.totalOwed}</p>
              <p className="text-xs text-amber-600 mt-0.5">{tr({ en: 'Days owed', fr: 'Jours à rattraper' })}</p>
            </div>
            <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-center">
              <p className="text-2xl font-bold text-green-700">{qadaaSummary.totalCompleted}</p>
              <p className="text-xs text-green-600 mt-0.5">{tr({ en: 'Days completed', fr: 'Jours accomplis' })}</p>
            </div>
          </div>
        </div>
      )}

      {/* Per-year list */}
      {qadaaSummary != null && Object.keys(qadaaSummary.byYear).length === 0 && (
        <div className="islamic-card p-8 text-center">
          <Moon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {tr({ en: 'No Sawm qadaa days tracked yet. Log a cycle that overlaps with Ramadan to get started.', fr: "Aucun jour de Sawm qadaa suivi pour l'instant. Enregistrez un cycle qui chevauche le Ramadan pour commencer." })}
          </p>
        </div>
      )}

      {qadaaSummary != null && Object.entries(qadaaSummary.byYear)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([yearStr, data]: [string, any]) => {
          const year = Number(yearStr);
          const owedRows = qadaaSummary.rows.filter(
            (r: any) => r.ramadanYear === year && r.completedAt === undefined
          );
          const doneRows = qadaaSummary.rows.filter(
            (r: any) => r.ramadanYear === year && r.completedAt !== undefined
          );
          return (
            <div key={year} className="islamic-card p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  {tr({ en: `Ramadan ${year}`, fr: `Ramadan ${year}` })}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {data.completed}/{data.owed + data.completed} {tr({ en: 'done', fr: 'faits' })}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${Math.round((data.completed / (data.owed + data.completed || 1)) * 100)}%` }}
                />
              </div>
              {/* Owed days */}
              {owedRows.length > 0 && (
                <div className="space-y-1.5">
                  {owedRows.map((row: any) => (
                    <div key={row._id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-amber-50/60 border border-amber-100">
                      <span className="text-sm text-foreground">
                        {new Date(row.ramadanDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', timeZone: 'UTC' })}
                      </span>
                      <button
                        onClick={async () => {
                          try { await markQadaaCompleted({ qadaaId: row._id }); }
                          catch { toast.error(tr({ en: 'Could not save.', fr: 'Impossible de sauvegarder.' })); }
                        }}
                        className="flex items-center gap-1 text-xs font-medium text-green-700 hover:text-green-800 px-2 py-1 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {tr({ en: 'Mark done', fr: 'Marquer fait' })}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Completed days (collapsible summary) */}
              {doneRows.length > 0 && (
                <details className="group">
                  <summary className="cursor-pointer text-xs text-muted-foreground list-none flex items-center gap-1 hover:text-foreground">
                    <span className="inline-block w-3 h-3 border rounded-full bg-green-100 border-green-300 flex-shrink-0" />
                    {doneRows.length} {tr({ en: 'day(s) completed', fr: 'jour(s) accompli(s)' })}
                  </summary>
                  <div className="mt-2 space-y-1">
                    {doneRows.map((row: any) => (
                      <div key={row._id} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-green-50/60 border border-green-100">
                        <span className="text-sm text-green-800">
                          {new Date(row.ramadanDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', timeZone: 'UTC' })}
                        </span>
                        <button
                          onClick={async () => {
                            try { await unmarkQadaaCompleted({ qadaaId: row._id }); }
                            catch { toast.error(tr({ en: 'Could not update.', fr: 'Impossible de mettre à jour.' })); }
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground px-2 py-0.5 rounded hover:bg-muted/40 transition-colors"
                        >
                          {tr({ en: 'Undo', fr: 'Annuler' })}
                        </button>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          );
        })}

      {/* Qadaa schedule settings */}
      <div className="islamic-card p-4 sm:p-5 space-y-4">
        <h3 className="font-semibold text-foreground">
          {tr({ en: 'Make-up schedule', fr: 'Calendrier de rattrapage' })}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {tr({ en: 'Days per week', fr: 'Jours par semaine' })}
            </label>
            <span className="text-sm font-bold text-primary">{qadaaDaysPerWeek}</span>
          </div>
          <input
            type="range" min={1} max={7} value={qadaaDaysPerWeek}
            onChange={(e) => setQadaaDaysPerWeek(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <p className="text-xs text-muted-foreground">
            {tr({
              en: `At this pace, you will complete ${qadaaSummary?.totalOwed ?? '?'} day(s) in about ${Math.ceil((qadaaSummary?.totalOwed ?? 0) / qadaaDaysPerWeek)} week(s).`,
              fr: `À ce rythme, vous rattraperez ${qadaaSummary?.totalOwed ?? '?'} jour(s) en environ ${Math.ceil((qadaaSummary?.totalOwed ?? 0) / qadaaDaysPerWeek)} semaine(s).`,
            })}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">{tr({ en: 'Preferred days', fr: 'Jours préférés' })}</p>
          <div className="flex flex-wrap gap-2">
            {(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const).map((day, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setQadaaPreferredDays((prev) => prev.includes(i) ? prev.filter((d) => d !== i) : [...prev, i])}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  qadaaPreferredDays.includes(i)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-medium text-foreground">{tr({ en: 'Reminders', fr: 'Rappels' })}</p>
            <p className="text-xs text-muted-foreground">{tr({ en: 'Get notified on your qadaa days', fr: 'Être notifiée les jours de qadaa' })}</p>
          </div>
          <button
            onClick={() => setQadaaReminderEnabled(!qadaaReminderEnabled)}
            className="p-1.5 -m-1.5 rounded-xl hover:bg-muted/40 transition-colors"
            aria-pressed={qadaaReminderEnabled}
          >
            <span className={`relative flex items-center w-11 h-6 rounded-full transition-colors ${qadaaReminderEnabled ? 'bg-primary' : 'bg-muted'}`}>
              <span className={`absolute w-4 h-4 bg-white rounded-full shadow transition-all ${qadaaReminderEnabled ? 'left-6' : 'left-1'}`} />
            </span>
          </button>
        </div>

        <button
          onClick={async () => {
            try {
              await updateSettings({ qadaaDaysPerWeek, qadaaPreferredDays, qadaaReminderEnabled });
              toast.success(tr({ en: 'Schedule saved.', fr: 'Calendrier enregistré.' }));
            } catch {
              toast.error(tr({ en: 'Could not save.', fr: 'Impossible de sauvegarder.' }));
            }
          }}
          className="btn-islamic w-full sm:w-auto"
        >
          {tr({ en: 'Save schedule', fr: 'Enregistrer le calendrier' })}
        </button>
      </div>
    </div>
  );
}
