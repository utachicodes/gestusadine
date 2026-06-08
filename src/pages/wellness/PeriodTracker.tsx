import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { format, isToday } from 'date-fns';
import {
  Heart, Calendar, BarChart2, Settings, ChevronLeft, ChevronRight,
  Droplets, Activity, Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { useTr } from '@/lib/i18n';

// ── Constants ─────────────────────────────────────────────────────────────────

const FLOW_OPTIONS = [
  { key: 'none',     en: 'None',     fr: 'Aucun',    color: 'border-border bg-muted/30 text-muted-foreground' },
  { key: 'spotting', en: 'Spotting', fr: 'Léger',    color: 'border-pink-200 bg-pink-50 text-pink-700' },
  { key: 'light',    en: 'Light',    fr: 'Faible',   color: 'border-rose-200 bg-rose-50 text-rose-700' },
  { key: 'medium',   en: 'Medium',   fr: 'Moyen',    color: 'border-red-300 bg-red-50 text-red-700' },
  { key: 'heavy',    en: 'Heavy',    fr: 'Abondant', color: 'border-red-400 bg-red-100 text-red-800' },
] as const;

const SYMPTOMS = [
  { key: 'cramps',     en: 'Cramps',            fr: 'Crampes',            emoji: '⚡' },
  { key: 'headache',   en: 'Headache',          fr: 'Mal de tête',        emoji: '🤕' },
  { key: 'fatigue',    en: 'Fatigue',           fr: 'Fatigue',            emoji: '😴' },
  { key: 'bloating',   en: 'Bloating',          fr: 'Ballonnements',      emoji: '💨' },
  { key: 'nausea',     en: 'Nausea',            fr: 'Nausée',             emoji: '🤢' },
  { key: 'backpain',   en: 'Back pain',         fr: 'Mal de dos',         emoji: '🔙' },
  { key: 'moodswings', en: 'Mood swings',       fr: "Sautes d'humeur",    emoji: '🎭' },
  { key: 'insomnia',   en: 'Insomnia',          fr: 'Insomnie',           emoji: '🌙' },
  { key: 'acne',       en: 'Acne',              fr: 'Acné',               emoji: '😶' },
  { key: 'cravings',   en: 'Cravings',          fr: 'Envies',             emoji: '🍫' },
  { key: 'tender',     en: 'Breast tenderness', fr: 'Seins sensibles',    emoji: '💗' },
  { key: 'spotting2',  en: 'Spotting',          fr: 'Pertes',             emoji: '🩸' },
];

const MOODS = [
  { key: 'happy',     en: 'Happy',     fr: 'Heureuse',  emoji: '😊' },
  { key: 'calm',      en: 'Calm',      fr: 'Calme',     emoji: '🧘' },
  { key: 'irritable', en: 'Irritable', fr: 'Irritable', emoji: '😠' },
  { key: 'anxious',   en: 'Anxious',   fr: 'Anxieuse',  emoji: '😟' },
  { key: 'sad',       en: 'Sad',       fr: 'Triste',    emoji: '😔' },
  { key: 'sensitive', en: 'Sensitive', fr: 'Sensible',  emoji: '🥺' },
  { key: 'energetic', en: 'Energetic', fr: 'Énergique', emoji: '⚡' },
  { key: 'tired',     en: 'Tired',     fr: 'Fatiguée',  emoji: '😴' },
];

const CYCLE_PHASES = [
  { key: 'menstruation', en: 'Menstruation', fr: 'Menstruation', color: 'bg-red-100 text-red-700 border-red-200' },
  { key: 'follicular',   en: 'Follicular',   fr: 'Folliculaire', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { key: 'ovulation',    en: 'Ovulation',    fr: 'Ovulation',    color: 'bg-green-50 text-green-700 border-green-200' },
  { key: 'luteal',       en: 'Luteal',       fr: 'Lutéale',      color: 'bg-purple-50 text-purple-700 border-purple-200' },
];

function getCyclePhase(day: number, avgCycleLen: number): string {
  const ovDay = avgCycleLen - 14;
  if (day <= 5) return 'menstruation';
  if (day < ovDay - 1) return 'follicular';
  if (day <= ovDay + 1) return 'ovulation';
  return 'luteal';
}

function startOfDayUTC(date: Date): number {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'log' | 'calendar' | 'analytics' | 'settings';

const TABS: { id: Tab; en: string; fr: string; icon: React.ReactNode }[] = [
  { id: 'overview',  en: 'Overview', fr: 'Aperçu',   icon: <Heart className="w-3.5 h-3.5" /> },
  { id: 'log',       en: 'Log',      fr: 'Journal',  icon: <Droplets className="w-3.5 h-3.5" /> },
  { id: 'calendar',  en: 'Calendar', fr: 'Calendar', icon: <Calendar className="w-3.5 h-3.5" /> },
  { id: 'analytics', en: 'Analytics',fr: 'Analytics',icon: <BarChart2 className="w-3.5 h-3.5" /> },
  { id: 'settings',  en: 'Settings', fr: 'Settings', icon: <Settings className="w-3.5 h-3.5" /> },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function PeriodTracker() {
  const tr = useTr();
  const [tab, setTab] = useState<Tab>('overview');
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Log form state
  const [logFlow, setLogFlow] = useState<string | undefined>();
  const [logSymptoms, setLogSymptoms] = useState<string[]>([]);
  const [logMood, setLogMood] = useState<string | undefined>();
  const [logNotes, setLogNotes] = useState('');
  const [logTemp, setLogTemp] = useState('');

  // Settings form state
  const [settingCycleLen, setSettingCycleLen] = useState(28);
  const [settingPeriodLen, setSettingPeriodLen] = useState(5);
  const [settingNotifs, setSettingNotifs] = useState(false);
  const [settingReminderDays, setSettingReminderDays] = useState(2);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Queries
  const settings = useQuery(api.periodTracker.getSettings);
  const todayLog = useQuery(api.periodTracker.getTodayLog);
  const activeCycle = useQuery(api.periodTracker.getActiveCycle);
  const cycles = useQuery(api.periodTracker.getCycles, { limit: 12 });
  const analytics = useQuery(api.periodTracker.getAnalytics);

  const calYear = calendarMonth.getFullYear();
  const calMon = calendarMonth.getMonth();
  const logsInRange = useQuery(api.periodTracker.getLogsInRange, {
    fromDate: startOfDayUTC(new Date(calYear, calMon, 1)),
    toDate: startOfDayUTC(new Date(calYear, calMon + 1, 0)),
  });

  // Mutations
  const logDay = useMutation(api.periodTracker.logDay);
  const startCycle = useMutation(api.periodTracker.startCycle);
  const endCycle = useMutation(api.periodTracker.endCycle);
  const updateSettings = useMutation(api.periodTracker.updateSettings);

  // Sync settings once loaded
  React.useEffect(() => {
    if (settings && !settingsLoaded) {
      setSettingCycleLen(settings.avgCycleLength ?? 28);
      setSettingPeriodLen(settings.avgPeriodLength ?? 5);
      setSettingNotifs(settings.notifications ?? false);
      setSettingReminderDays(settings.reminderDays ?? 2);
      setSettingsLoaded(true);
    }
  }, [settings, settingsLoaded]);

  // Sync today's log into form once loaded
  React.useEffect(() => {
    if (todayLog) {
      setLogFlow(todayLog.flow ?? undefined);
      setLogSymptoms(todayLog.symptoms ?? []);
      setLogMood(todayLog.mood ?? undefined);
      setLogNotes(todayLog.notes ?? '');
      setLogTemp(todayLog.temperature != null ? String(todayLog.temperature) : '');
    }
  }, [todayLog]);

  const handleSaveLog = async () => {
    try {
      await logDay({
        flow: logFlow as any,
        symptoms: logSymptoms,
        mood: logMood,
        notes: logNotes || undefined,
        temperature: logTemp ? parseFloat(logTemp) : undefined,
      });
      toast.success(tr({ en: 'Day logged.', fr: 'Journée enregistrée.' }));
    } catch {
      toast.error(tr({ en: 'Could not save log.', fr: "Impossible d'enregistrer." }));
    }
  };

  const handleStartCycle = async () => {
    try {
      await startCycle({});
      toast.success(tr({ en: 'Cycle started.', fr: 'Cycle démarré.' }));
    } catch {
      toast.error(tr({ en: 'Could not start cycle.', fr: 'Impossible de démarrer le cycle.' }));
    }
  };

  const handleEndCycle = async () => {
    if (!activeCycle) return;
    try {
      await endCycle({ cycleId: activeCycle._id });
      toast.success(tr({ en: 'Cycle ended.', fr: 'Cycle terminé.' }));
    } catch {
      toast.error(tr({ en: 'Could not end cycle.', fr: 'Impossible de terminer le cycle.' }));
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings({
        avgCycleLength: settingCycleLen,
        avgPeriodLength: settingPeriodLen,
        notifications: settingNotifs,
        reminderDays: settingReminderDays,
      });
      toast.success(tr({ en: 'Settings saved.', fr: 'Paramètres enregistrés.' }));
    } catch {
      toast.error(tr({ en: 'Could not save settings.', fr: "Impossible d'enregistrer." }));
    }
  };

  const toggleSymptom = (key: string) =>
    setLogSymptoms((prev) => prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]);

  // Derived cycle info
  const avgCycleLen = settings?.avgCycleLength ?? 28;
  const cycleDay = activeCycle
    ? Math.floor((startOfDayUTC(new Date()) - activeCycle.startDate) / 86400000) + 1
    : null;
  const phase = cycleDay != null ? getCyclePhase(cycleDay, avgCycleLen) : null;
  const phaseMeta = CYCLE_PHASES.find((p) => p.key === phase);

  const lastCycle = (cycles ?? [])[0];
  const nextPeriod = lastCycle ? new Date(lastCycle.startDate + avgCycleLen * 86400000) : null;
  const ovulationDay = lastCycle ? new Date(lastCycle.startDate + (avgCycleLen - 14) * 86400000) : null;

  // Calendar grid
  const firstDay = new Date(calYear, calMon, 1).getDay();
  const daysInMonth = new Date(calYear, calMon + 1, 0).getDate();
  const logMap = new Map((logsInRange ?? []).map((l) => [l.date, l]));

  return (
    <div className="flex-1">
    <section className="container py-8 md:py-10 space-y-6">
      <PageHeader
        eyebrow={tr({ en: 'Wellness', fr: 'Bien-être' })}
        title={tr({ en: 'Cycle Tracker', fr: 'Suivi du cycle' })}
        subtitle={tr({
          en: 'Track your menstrual cycle, symptoms, and wellbeing.',
          fr: 'Suivez votre cycle menstruel, vos symptômes et votre bien-être.',
        })}
      />

      {/* Tab bar — scrollable so all 5 labels stay visible on narrow screens */}
      <div className="flex gap-1 border-b border-border overflow-x-auto scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap flex-shrink-0 ${
              tab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon}
            <span>{tr({ en: t.en, fr: t.fr })}</span>
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ────────────────────────────────────────────────────── */}
      {tab === 'overview' && (
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
                {(todayLog.symptoms ?? []).map((s) => {
                  const meta = SYMPTOMS.find((sym) => sym.key === s);
                  return meta ? (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-accent/50 text-primary border border-primary/20 font-medium">
                      {meta.emoji} {tr({ en: meta.en, fr: meta.fr })}
                    </span>
                  ) : null;
                })}
                {todayLog.mood && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-muted/50 text-foreground border border-border font-medium">
                    {MOODS.find((m) => m.key === todayLog.mood)?.emoji} {todayLog.mood}
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
      )}

      {/* ── LOG ─────────────────────────────────────────────────────────── */}
      {tab === 'log' && (
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
                  <span>{m.emoji}</span>
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
                    <span>{s.emoji}</span>
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
              className="w-full sm:w-48 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50"
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
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
            />
          </div>

          <button onClick={handleSaveLog} className="btn-islamic w-full sm:w-auto">
            {tr({ en: 'Save log', fr: 'Enregistrer' })}
          </button>
        </div>
      )}

      {/* ── CALENDAR ────────────────────────────────────────────────────── */}
      {tab === 'calendar' && (
        <div className="islamic-card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCalendarMonth(new Date(calYear, calMon - 1, 1))}
              className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-semibold text-foreground">{format(calendarMonth, 'MMMM yyyy')}</h2>
            <button
              onClick={() => setCalendarMonth(new Date(calYear, calMon + 1, 1))}
              className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <div key={i} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`b${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayDate = new Date(calYear, calMon, i + 1);
              const dayTs = startOfDayUTC(dayDate);
              const log = logMap.get(dayTs);
              const flow = log?.flow;
              const isT = isToday(dayDate);

              const cellColor = flow === 'heavy' || flow === 'medium'
                ? 'bg-red-100 text-red-800'
                : flow === 'light' || flow === 'spotting'
                ? 'bg-rose-50 text-rose-700'
                : (log?.symptoms?.length ?? 0) > 0
                ? 'bg-purple-50 text-purple-700'
                : isT
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted/40';

              return (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-center rounded-xl min-h-[40px] sm:aspect-square text-xs font-medium ${cellColor} ${isT ? 'ring-2 ring-primary/30' : ''}`}
                >
                  <span>{i + 1}</span>
                  {flow && flow !== 'none' && <span className="text-[8px]">🩸</span>}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
            {[
              { color: 'bg-red-100', label: tr({ en: 'Heavy / Medium', fr: 'Abondant / Moyen' }) },
              { color: 'bg-rose-50',   label: tr({ en: 'Light / Spotting', fr: 'Léger / Spotting' }) },
              { color: 'bg-purple-50', label: tr({ en: 'Symptoms logged', fr: 'Symptômes notés' }) },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`w-3 h-3 rounded-sm ${color}`} />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ANALYTICS ───────────────────────────────────────────────────── */}
      {tab === 'analytics' && (
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
                      {analytics.cycleLengths.map((len, i) => {
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
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 8)
                      .map(([key, count]) => {
                        const meta = SYMPTOMS.find((s) => s.key === key);
                        const maxVal = Math.max(...Object.values(analytics.symptomCounts));
                        const pct = Math.round((count / maxVal) * 100);
                        return (
                          <div key={key} className="flex items-center gap-3">
                            <span className="text-base w-6 text-center">{meta?.emoji ?? '•'}</span>
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
      )}

      {/* ── SETTINGS ────────────────────────────────────────────────────── */}
      {tab === 'settings' && (
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
      )}
    </section>
    </div>
  );
}
