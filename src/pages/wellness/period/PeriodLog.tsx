import { format } from 'date-fns';
import { FLOW_OPTIONS, SYMPTOMS, MOODS } from './constants';

interface PeriodLogProps {
  tr: (obj: { en: string; fr: string }) => string;
  logFlow: string | undefined;
  setLogFlow: (v: string | undefined) => void;
  logMood: string | undefined;
  setLogMood: (v: string | undefined) => void;
  logSymptoms: string[];
  toggleSymptom: (key: string) => void;
  logTemp: string;
  setLogTemp: (v: string) => void;
  logNotes: string;
  setLogNotes: (v: string) => void;
  handleSaveLog: () => void;
}

export function PeriodLog({ tr, logFlow, setLogFlow, logMood, setLogMood, logSymptoms, toggleSymptom, logTemp, setLogTemp, logNotes, setLogNotes, handleSaveLog }: PeriodLogProps) {
  return (
    <div className="islamic-card p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          {tr({ en: 'Log today', fr: "Journée d'aujourd'hui" })}
        </h2>
        <span className="text-xs text-muted-foreground">{format(new Date(), 'dd MMM yyyy')}</span>
      </div>

      {/* Flow */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">
          {tr({ en: 'Flow', fr: 'Flux' })}
        </p>
        <div className="flex flex-wrap gap-2">
          {FLOW_OPTIONS.map((f) => (
            <button
              key={f.key}
              onClick={() => setLogFlow(logFlow === f.key ? undefined : f.key)}
              className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                logFlow === f.key ? f.color + ' shadow-sm' : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40'
              }`}
            >
              {tr({ en: f.en, fr: f.fr })}
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">
          {tr({ en: 'Mood', fr: 'Humeur' })}
        </p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.key}
              onClick={() => setLogMood(logMood === m.key ? undefined : m.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                logMood === m.key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40'
              }`}
            >
               <span>{m.icon}</span>
              <span>{tr({ en: m.en, fr: m.fr })}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">
          {tr({ en: 'Symptoms', fr: 'Symptômes' })}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SYMPTOMS.map((s) => {
            const active = logSymptoms.includes(s.key);
            return (
              <button
                key={s.key}
                onClick={() => toggleSymptom(s.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all text-left ${
                  active
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40'
                }`}
              >
                 <span>{s.icon}</span>
                <span>{tr({ en: s.en, fr: s.fr })}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Temperature */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">
          {tr({ en: 'Basal body temperature (°C)', fr: 'Température basale (°C)' })}
        </p>
        <input
          type="number"
          step="0.1"
          min={35}
          max={42}
          value={logTemp}
          onChange={(e) => setLogTemp(e.target.value)}
          placeholder="36.5"
          className="w-full sm:w-48 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Notes */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">
          {tr({ en: 'Notes', fr: 'Notes' })}
        </p>
        <textarea
          value={logNotes}
          onChange={(e) => setLogNotes(e.target.value)}
          placeholder={tr({ en: 'Optional notes…', fr: 'Notes facultatives…' })}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
        />
      </div>

      <button onClick={handleSaveLog} className="btn-islamic w-full sm:w-auto">
        {tr({ en: 'Save log', fr: 'Enregistrer' })}
      </button>
    </div>
  );
}
