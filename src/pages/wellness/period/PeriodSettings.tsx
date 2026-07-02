import { Info } from 'lucide-react';

interface PeriodSettingsProps {
  tr: (obj: { en: string; fr: string }) => string;
  settingCycleLen: number;
  setSettingCycleLen: (n: number) => void;
  settingPeriodLen: number;
  setSettingPeriodLen: (n: number) => void;
  settingNotifs: boolean;
  setSettingNotifs: (b: boolean) => void;
  settingReminderDays: number;
  setSettingReminderDays: (n: number) => void;
  handleSaveSettings: () => void;
}

export function PeriodSettings({ tr, settingCycleLen, setSettingCycleLen, settingPeriodLen, setSettingPeriodLen, settingNotifs, setSettingNotifs, settingReminderDays, setSettingReminderDays, handleSaveSettings }: PeriodSettingsProps) {
  return (
    <div className="islamic-card p-4 sm:p-6 space-y-6">
      <div className="flex items-start gap-2 p-3 rounded-xl bg-accent/30 border border-primary/20">
        <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          {tr({
            en: 'These settings help predict your cycle. Update them as you track more data.',
            fr: 'Ces paramètres aident à prédire votre cycle. Mettez-les à jour au fur et à mesure.',
          })}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            {tr({ en: 'Average cycle length', fr: 'Durée moyenne du cycle' })}
          </label>
          <span className="text-sm font-bold text-primary">{settingCycleLen} {tr({ en: 'days', fr: 'j' })}</span>
        </div>
        <input type="range" min={21} max={40} value={settingCycleLen} onChange={(e) => setSettingCycleLen(Number(e.target.value))} className="w-full accent-primary" />
        <div className="flex justify-between text-[10px] text-muted-foreground"><span>21</span><span>40</span></div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            {tr({ en: 'Average period length', fr: 'Durée moyenne des règles' })}
          </label>
          <span className="text-sm font-bold text-primary">{settingPeriodLen} {tr({ en: 'days', fr: 'j' })}</span>
        </div>
        <input type="range" min={2} max={10} value={settingPeriodLen} onChange={(e) => setSettingPeriodLen(Number(e.target.value))} className="w-full accent-primary" />
        <div className="flex justify-between text-[10px] text-muted-foreground"><span>2</span><span>10</span></div>
      </div>

      <div className="flex items-center justify-between py-1">
        <div>
          <p className="text-sm font-medium text-foreground">{tr({ en: 'Reminders', fr: 'Rappels' })}</p>
          <p className="text-xs text-muted-foreground">{tr({ en: 'Get notified before your next period', fr: 'Être notifiée avant vos prochaines règles' })}</p>
        </div>
        <button
          onClick={() => setSettingNotifs(!settingNotifs)}
          className="p-1.5 -m-1.5 rounded-xl transition-colors hover:bg-muted/40"
          aria-pressed={settingNotifs}
        >
          <span className={`relative flex items-center w-11 h-6 rounded-full transition-colors ${settingNotifs ? 'bg-primary' : 'bg-muted'}`}>
            <span className={`absolute w-4 h-4 bg-white rounded-full shadow transition-all ${settingNotifs ? 'left-6' : 'left-1'}`} />
          </span>
        </button>
      </div>

      {settingNotifs && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">{tr({ en: 'Remind me', fr: 'Me rappeler' })}</label>
            <span className="text-sm font-bold text-primary">{settingReminderDays} {tr({ en: 'days before', fr: 'jours avant' })}</span>
          </div>
          <input type="range" min={1} max={7} value={settingReminderDays} onChange={(e) => setSettingReminderDays(Number(e.target.value))} className="w-full accent-primary" />
        </div>
      )}

      <button onClick={handleSaveSettings} className="btn-islamic w-full sm:w-auto">
        {tr({ en: 'Save settings', fr: 'Enregistrer' })}
      </button>
    </div>
  );
}
