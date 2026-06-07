import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { format, addDays, differenceInDays, isToday, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, BarChart2, Plus, ChevronLeft, ChevronRight,
  Droplets, Heart, Sun, Moon, Zap, CloudRain, Wind,
  AlertCircle, Settings, Check, Info, TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Id } from '../../../convex/_generated/dataModel';

// ── Constants ─────────────────────────────────────────────────────────────────

const FLOW_OPTIONS = [
  { key: 'none', label: 'None', labelFr: 'Aucun', color: 'bg-stone-100 border-stone-200 text-stone-500', dot: '○' },
  { key: 'spotting', label: 'Spotting', labelFr: 'Taches', color: 'bg-pink-50 border-pink-200 text-pink-600', dot: '·' },
  { key: 'light', label: 'Light', labelFr: 'Léger', color: 'bg-pink-100 border-pink-300 text-pink-700', dot: '◔' },
  { key: 'medium', label: 'Medium', labelFr: 'Moyen', color: 'bg-rose-100 border-rose-300 text-rose-700', dot: '◑' },
  { key: 'heavy', label: 'Heavy', labelFr: 'Abondant', color: 'bg-red-100 border-red-300 text-red-700', dot: '●' },
] as const;

type FlowKey = (typeof FLOW_OPTIONS)[number]['key'];

const SYMPTOMS = [
  { key: 'cramps', label: 'Cramps', labelFr: 'Crampes', emoji: '⚡' },
  { key: 'headache', label: 'Headache', labelFr: 'Maux de tête', emoji: '🤕' },
  { key: 'bloating', label: 'Bloating', labelFr: 'Ballonnements', emoji: '🫗' },
  { key: 'fatigue', label: 'Fatigue', labelFr: 'Fatigue', emoji: '😴' },
  { key: 'nausea', label: 'Nausea', labelFr: 'Nausée', emoji: '🤢' },
  { key: 'backache', label: 'Backache', labelFr: 'Mal de dos', emoji: '🦴' },
  { key: 'acne', label: 'Acne', labelFr: 'Acné', emoji: '😖' },
  { key: 'tender-breasts', label: 'Tender breasts', labelFr: 'Seins sensibles', emoji: '💜' },
  { key: 'cravings', label: 'Cravings', labelFr: 'Fringales', emoji: '🍫' },
  { key: 'insomnia', label: 'Insomnia', labelFr: 'Insomnie', emoji: '🌙' },
  { key: 'mood-swings', label: 'Mood swings', labelFr: 'Sautes d\'humeur', emoji: '🎭' },
  { key: 'spotting', label: 'Spotting btw periods', labelFr: 'Taches inter-cycles', emoji: '🩸' },
] as const;

const MOODS = [
  { key: 'happy', emoji: '😊', label: 'Happy', labelFr: 'Heureuse' },
  { key: 'calm', emoji: '🧘', label: 'Calm', labelFr: 'Calme' },
  { key: 'sensitive', emoji: '🥹', label: 'Sensitive', labelFr: 'Sensible' },
  { key: 'irritable', emoji: '😤', label: 'Irritable', labelFr: 'Irritable' },
  { key: 'sad', emoji: '😔', label: 'Sad', labelFr: 'Triste' },
  { key: 'energetic', emoji: '⚡', label: 'Energetic', labelFr: 'Pleine d\'énergie' },
  { key: 'tired', emoji: '😴', label: 'Tired', labelFr: 'Fatiguée' },
  { key: 'anxious', emoji: '😟', label: 'Anxious', labelFr: 'Anxieuse' },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function startOfDayUTC(date: Date): number {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}

type Phase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal' | 'unknown';

function getCyclePhase(dayOfCycle: number, avgCycleLength: number): Phase {
  const ovulationDay = avgCycleLength - 14;
  if (dayOfCycle <= 5) return 'menstruation';
  if (dayOfCycle <= ovulationDay - 2) return 'follicular';
  if (dayOfCycle <= ovulationDay + 1) return 'ovulation';
  if (dayOfCycle <= avgCycleLength) return 'luteal';
  return 'unknown';
}

const PHASE_CONFIG: Record<Phase, { label: string; labelFr: string; color: string; bg: string; description: string; descriptionFr: string }> = {
  menstruation: {
    label: 'Menstruation', labelFr: 'Menstruation',
    color: 'text-red-700', bg: 'bg-red-50 border-red-200',
    description: 'Your uterine lining is shedding. Rest, stay hydrated, and be gentle with yourself.',
    descriptionFr: 'Votre muqueuse utérine se détache. Reposez-vous, restez hydratée et soyez douce avec vous-même.',
  },
  follicular: {
    label: 'Follicular Phase', labelFr: 'Phase folliculaire',
    color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200',
    description: 'Estrogen rises and follicles develop. Energy increases — a great time for new projects.',
    descriptionFr: 'Les œstrogènes augmentent et les follicules se développent. L\'énergie monte — idéal pour de nouveaux projets.',
  },
  ovulation: {
    label: 'Ovulation', labelFr: 'Ovulation',
    color: 'text-green-700', bg: 'bg-green-50 border-green-200',
    description: 'Your most fertile time. You may feel confident and sociable today.',
    descriptionFr: 'Votre période la plus fertile. Vous pouvez vous sentir confiante et sociable aujourd\'hui.',
  },
  luteal: {
    label: 'Luteal Phase', labelFr: 'Phase lutéale',
    color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200',
    description: 'Progesterone rises. You may feel more introspective — this is a good time for reflection.',
    descriptionFr: 'La progestérone augmente. Vous pouvez vous sentir plus introspective — bon moment pour la réflexion.',
  },
  unknown: {
    label: 'Tracking', labelFr: 'Suivi en cours',
    color: 'text-stone-600', bg: 'bg-stone-50 border-stone-200',
    description: 'Log your first period to see phase predictions.',
    descriptionFr: 'Enregistrez votre première période pour voir les prédictions de phase.',
  },
};

// Calendar day phase colors
function getDayPhaseColor(dayOfCycle: number, avgCycleLength: number): string {
  const phase = getCyclePhase(dayOfCycle, avgCycleLength);
  switch (phase) {
    case 'menstruation': return 'bg-red-400';
    case 'follicular': return 'bg-yellow-300';
    case 'ovulation': return 'bg-green-400';
    case 'luteal': return 'bg-purple-300';
    default: return '';
  }
}

// ── Main component ────────────────────────────────────────────────────────────

type Tab = 'overview' | 'log' | 'calendar' | 'analytics' | 'settings';

export default function PeriodTracker() {
  const { language } = useLanguage();
  const [tab, setTab] = useState<Tab>('overview');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Log form state
  const [logFlow, setLogFlow] = useState<FlowKey | undefined>(undefined);
  const [logSymptoms, setLogSymptoms] = useState<string[]>([]);
  const [logMood, setLogMood] = useState<string | undefined>(undefined);
  const [logNotes, setLogNotes] = useState('');
  const [logTemp, setLogTemp] = useState('');

  // Settings state
  const [settingCycleLen, setSettingCycleLen] = useState(28);
  const [settingPeriodLen, setSettingPeriodLen] = useState(5);
  const [settingNotifs, setSettingNotifs] = useState(false);
  const [settingReminder, setSettingReminder] = useState(2);

  // Convex data
  const settings = useQuery(api.periodTracker.getSettings);
  const activeCycle = useQuery(api.periodTracker.getActiveCycle);
  const cycles = useQuery(api.periodTracker.getCycles, { limit: 12 });
  const todayLog = useQuery(api.periodTracker.getTodayLog);
  const analytics = useQuery(api.periodTracker.getAnalytics);
  const calendarLogs = useQuery(api.periodTracker.getLogsInRange, {
    fromDate: startOfDayUTC(startOfMonth(calendarMonth)),
    toDate: startOfDayUTC(endOfMonth(calendarMonth)),
  });

  const startCycle = useMutation(api.periodTracker.startCycle);
  const endCycleMutation = useMutation(api.periodTracker.endCycle);
  const logDay = useMutation(api.periodTracker.logDay);
  const updateSettings = useMutation(api.periodTracker.updateSettings);

  // Sync settings into local state when loaded
  React.useEffect(() => {
    if (settings) {
      setSettingCycleLen(settings.avgCycleLength);
      setSettingPeriodLen(settings.avgPeriodLength);
      setSettingNotifs(settings.notifications);
      setSettingReminder(settings.reminderDays);
    }
  }, [settings]);

  // Sync today's log into form
  React.useEffect(() => {
    if (todayLog) {
      setLogFlow(todayLog.flow as FlowKey | undefined);
      setLogSymptoms(todayLog.symptoms ?? []);
      setLogMood(todayLog.mood);
      setLogNotes(todayLog.notes ?? '');
      setLogTemp(todayLog.temperature?.toString() ?? '');
    }
  }, [todayLog]);

  // ── Computed values ─────────────────────────────────────────────────────────

  const avgCycleLen = settings?.avgCycleLength ?? 28;

  const { currentCycleDay, nextPeriodDate, ovulationDate, fertileStart, fertileEnd, phase } = useMemo(() => {
    const lastStart = cycles?.[0]?.startDate ?? null;
    if (!lastStart) {
      return { currentCycleDay: null, nextPeriodDate: null, ovulationDate: null, fertileStart: null, fertileEnd: null, phase: 'unknown' as Phase };
    }
    const today = startOfDayUTC(new Date());
    const dayOfCycle = differenceInDays(today, lastStart) + 1;
    const ovDay = avgCycleLen - 14;
    return {
      currentCycleDay: dayOfCycle,
      nextPeriodDate: new Date(lastStart + avgCycleLen * 86400000),
      ovulationDate: new Date(lastStart + ovDay * 86400000),
      fertileStart: new Date(lastStart + (ovDay - 5) * 86400000),
      fertileEnd: new Date(lastStart + (ovDay + 1) * 86400000),
      phase: getCyclePhase(dayOfCycle, avgCycleLen),
    };
  }, [cycles, avgCycleLen]);

  const daysUntilPeriod = nextPeriodDate
    ? Math.max(0, differenceInDays(nextPeriodDate, new Date()))
    : null;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleStartCycle = async () => {
    try {
      await startCycle({});
      toast.success(language === 'fr' ? 'Période enregistrée.' : 'Period started.');
    } catch (e: any) {
      toast.error(e?.message ?? 'Error');
    }
  };

  const handleEndCycle = async () => {
    if (!activeCycle) return;
    try {
      await endCycleMutation({ cycleId: activeCycle._id as Id<'periodCycles'> });
      toast.success(language === 'fr' ? 'Fin de période enregistrée.' : 'Period ended.');
    } catch (e: any) {
      toast.error(e?.message ?? 'Error');
    }
  };

  const handleSaveLog = async () => {
    try {
      await logDay({
        flow: logFlow,
        symptoms: logSymptoms,
        mood: logMood,
        notes: logNotes || undefined,
        temperature: logTemp ? parseFloat(logTemp) : undefined,
      });
      toast.success(language === 'fr' ? 'Journée enregistrée.' : 'Day logged.');
    } catch (e: any) {
      toast.error(e?.message ?? 'Error');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings({
        avgCycleLength: settingCycleLen,
        avgPeriodLength: settingPeriodLen,
        notifications: settingNotifs,
        reminderDays: settingReminder,
      });
      toast.success(language === 'fr' ? 'Paramètres sauvegardés.' : 'Settings saved.');
    } catch (e: any) {
      toast.error(e?.message ?? 'Error');
    }
  };

  const toggleSymptom = (key: string) => {
    setLogSymptoms((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  // Calendar helpers
  const buildCalendarWeeks = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    const weeks: (Date | null)[][] = [];
    let week: (Date | null)[] = Array(startDow).fill(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      week.push(new Date(year, month, d));
      if (week.length === 7) { weeks.push(week); week = []; }
    }
    if (week.length) { while (week.length < 7) week.push(null); weeks.push(week); }
    return weeks;
  };

  const getDayInfo = (date: Date) => {
    const ts = startOfDayUTC(date);
    const log = calendarLogs?.find((l) => l.date === ts);
    if (!log && cycles && cycles.length > 0) {
      const lastStart = cycles[0].startDate;
      const dayOfCycle = differenceInDays(ts, lastStart) + 1;
      if (dayOfCycle > 0 && dayOfCycle <= avgCycleLen) {
        return { phase: getCyclePhase(dayOfCycle, avgCycleLen), log: null };
      }
    }
    if (log?.flow && log.flow !== 'none') {
      return { phase: 'menstruation' as Phase, log };
    }
    return { phase: null, log };
  };

  const phaseInfo = PHASE_CONFIG[phase];

  const tabs: { key: Tab; label: string; labelFr: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', labelFr: 'Aperçu', icon: <Sun className="w-4 h-4" /> },
    { key: 'log', label: 'Log', labelFr: 'Journal', icon: <Droplets className="w-4 h-4" /> },
    { key: 'calendar', label: 'Calendar', labelFr: 'Calendrier', icon: <Calendar className="w-4 h-4" /> },
    { key: 'analytics', label: 'Analytics', labelFr: 'Analyses', icon: <BarChart2 className="w-4 h-4" /> },
    { key: 'settings', label: 'Settings', labelFr: 'Paramètres', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6" data-tour="period-tracker">
      <PageHeader
        title={language === 'fr' ? 'Suivi du cycle' : 'Cycle Tracker'}
        subtitle={language === 'fr' ? 'Comprenez et prenez soin de votre corps' : 'Understand and care for your body'}
      />

      {/* Tab bar */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              tab === t.key
                ? 'bg-white shadow-sm text-stone-900'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {t.icon}
            <span className="hidden sm:inline">{language === 'fr' ? t.labelFr : t.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Hero cycle card */}
            <div className={`rounded-2xl border p-6 ${phaseInfo.bg}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${phaseInfo.color}`}>
                {language === 'fr' ? phaseInfo.labelFr : phaseInfo.label}
              </p>
              {currentCycleDay !== null ? (
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-5xl font-bold text-stone-900">{currentCycleDay}</p>
                    <p className="text-stone-500 text-sm mt-1">
                      {language === 'fr' ? 'Jour du cycle' : 'Cycle day'}
                    </p>
                  </div>
                  {daysUntilPeriod !== null && (
                    <div className="ml-auto text-right">
                      <p className="text-2xl font-bold text-stone-800">{daysUntilPeriod}</p>
                      <p className="text-stone-500 text-xs mt-0.5">
                        {language === 'fr' ? 'jours avant les règles' : 'days until period'}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-stone-600 text-sm">
                  {language === 'fr'
                    ? 'Appuyez sur "Commencer les règles" pour démarrer le suivi.'
                    : 'Tap "Start period" below to begin tracking.'}
                </p>
              )}
              <p className={`text-xs mt-3 leading-relaxed ${phaseInfo.color} opacity-80`}>
                {language === 'fr' ? phaseInfo.descriptionFr : phaseInfo.description}
              </p>
            </div>

            {/* Period control */}
            <div className="flex gap-3">
              {!activeCycle ? (
                <button
                  type="button"
                  onClick={handleStartCycle}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors"
                >
                  <Droplets className="w-4 h-4" />
                  {language === 'fr' ? 'Commencer les règles' : 'Start period'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEndCycle}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-200 text-stone-800 text-sm font-semibold hover:bg-stone-300 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  {language === 'fr' ? 'Terminer les règles' : 'End period'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setTab('log')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-stone-300 text-stone-700 text-sm font-semibold hover:bg-stone-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {language === 'fr' ? 'Enregistrer la journée' : 'Log today'}
              </button>
            </div>

            {/* Upcoming events */}
            {nextPeriodDate && (
              <div className="bg-white/80 border border-stone-200 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-stone-700">
                  {language === 'fr' ? 'Prévisions' : 'Upcoming'}
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <span className="text-stone-600">{language === 'fr' ? 'Prochaines règles' : 'Next period'}</span>
                    </div>
                    <span className="font-medium text-stone-800">{format(nextPeriodDate, 'MMM d')}</span>
                  </div>
                  {ovulationDate && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        <span className="text-stone-600">{language === 'fr' ? 'Ovulation estimée' : 'Est. ovulation'}</span>
                      </div>
                      <span className="font-medium text-stone-800">{format(ovulationDate, 'MMM d')}</span>
                    </div>
                  )}
                  {fertileStart && fertileEnd && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                        <span className="text-stone-600">{language === 'fr' ? 'Fenêtre fertile' : 'Fertile window'}</span>
                      </div>
                      <span className="font-medium text-stone-800">
                        {format(fertileStart, 'MMM d')} – {format(fertileEnd, 'MMM d')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Today's log summary */}
            {todayLog && (
              <div className="bg-white/80 border border-stone-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-stone-700">{language === 'fr' ? 'Aujourd\'hui' : 'Today'}</p>
                  <button type="button" onClick={() => setTab('log')} className="text-xs text-emerald-700 hover:underline">
                    {language === 'fr' ? 'Modifier' : 'Edit'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {todayLog.flow && todayLog.flow !== 'none' && (
                    <span className="bg-rose-50 border border-rose-200 text-rose-700 px-2 py-1 rounded-full">
                      🩸 {FLOW_OPTIONS.find(f => f.key === todayLog.flow)?.[language === 'fr' ? 'labelFr' : 'label']}
                    </span>
                  )}
                  {todayLog.mood && (
                    <span className="bg-purple-50 border border-purple-200 text-purple-700 px-2 py-1 rounded-full">
                      {MOODS.find(m => m.key === todayLog.mood)?.emoji} {MOODS.find(m => m.key === todayLog.mood)?.[language === 'fr' ? 'labelFr' : 'label']}
                    </span>
                  )}
                  {(todayLog.symptoms ?? []).slice(0, 3).map((s) => {
                    const sym = SYMPTOMS.find((x) => x.key === s);
                    return sym ? (
                      <span key={s} className="bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1 rounded-full">
                        {sym.emoji} {language === 'fr' ? sym.labelFr : sym.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Phase legend */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
                {language === 'fr' ? 'Phases du cycle' : 'Cycle phases'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(['menstruation', 'follicular', 'ovulation', 'luteal'] as Phase[]).map((ph) => {
                  const cfg = PHASE_CONFIG[ph];
                  return (
                    <div key={ph} className="flex items-center gap-2 text-xs text-stone-600">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        ph === 'menstruation' ? 'bg-red-400' :
                        ph === 'follicular' ? 'bg-yellow-300' :
                        ph === 'ovulation' ? 'bg-green-400' : 'bg-purple-300'
                      }`} />
                      {language === 'fr' ? cfg.labelFr : cfg.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── LOG ── */}
        {tab === 'log' && (
          <motion.div
            key="log"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <p className="text-stone-500 text-sm">{format(new Date(), 'EEEE, MMMM d')}</p>

            {/* Flow */}
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-2">
                {language === 'fr' ? 'Flux menstruel' : 'Menstrual flow'}
              </p>
              <div className="flex gap-2 flex-wrap">
                {FLOW_OPTIONS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setLogFlow(logFlow === f.key ? undefined : f.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                      logFlow === f.key
                        ? f.color + ' shadow-sm scale-105'
                        : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-xs">{f.dot}</span>
                    {language === 'fr' ? f.labelFr : f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-2">
                {language === 'fr' ? 'Humeur' : 'Mood'}
              </p>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setLogMood(logMood === m.key ? undefined : m.key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      logMood === m.key
                        ? 'bg-purple-100 border-purple-300 text-purple-800 shadow-sm scale-105'
                        : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-sm">{m.emoji}</span>
                    <span className="hidden sm:inline">{language === 'fr' ? m.labelFr : m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-2">
                {language === 'fr' ? 'Symptômes' : 'Symptoms'}
              </p>
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => toggleSymptom(s.key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      logSymptoms.includes(s.key)
                        ? 'bg-orange-100 border-orange-300 text-orange-800 shadow-sm'
                        : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-sm">{s.emoji}</span>
                    <span>{language === 'fr' ? s.labelFr : s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* BBT */}
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-2">
                {language === 'fr' ? 'Température basale (°C)' : 'Basal body temp (°C)'}
              </p>
              <input
                type="number"
                placeholder="36.5"
                step="0.1"
                min="35"
                max="39"
                value={logTemp}
                onChange={(e) => setLogTemp(e.target.value)}
                className="w-32 rounded-xl border border-stone-200 bg-white/70 px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition"
              />
            </div>

            {/* Notes */}
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-2">
                {language === 'fr' ? 'Notes' : 'Notes'}
              </p>
              <textarea
                placeholder={language === 'fr' ? 'Comment vous sentez-vous aujourd\'hui ?' : 'How are you feeling today?'}
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-stone-200 bg-white/70 px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 transition"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveLog}
              className="w-full py-3 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {todayLog
                ? (language === 'fr' ? 'Mettre à jour' : 'Update log')
                : (language === 'fr' ? 'Enregistrer' : 'Save log')}
            </button>
          </motion.div>
        )}

        {/* ── CALENDAR ── */}
        {tab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="p-2 rounded-lg hover:bg-stone-100 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <p className="font-semibold text-stone-800">{format(calendarMonth, 'MMMM yyyy')}</p>
              <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="p-2 rounded-lg hover:bg-stone-100 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-[11px] font-semibold text-stone-400 uppercase text-center py-1">{d}</div>
              ))}
              {buildCalendarWeeks().flatMap((week, wi) =>
                week.map((date, di) => {
                  if (!date) return <div key={`${wi}-${di}`} />;
                  const { phase: dayPhase, log } = getDayInfo(date);
                  const today = isToday(date);
                  const hasPeriodFlow = log?.flow && log.flow !== 'none';
                  return (
                    <button
                      key={`${wi}-${di}`}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-xs transition-all
                        ${today ? 'ring-2 ring-rose-500 ring-offset-1' : ''}
                        ${isSameDay(date, selectedDate) ? 'scale-110 shadow-md' : 'hover:scale-105'}
                        ${dayPhase === 'menstruation' || hasPeriodFlow ? 'bg-red-200 text-red-900' :
                          dayPhase === 'follicular' ? 'bg-yellow-100 text-yellow-800' :
                          dayPhase === 'ovulation' ? 'bg-green-100 text-green-800' :
                          dayPhase === 'luteal' ? 'bg-purple-100 text-purple-800' :
                          'bg-stone-50 text-stone-600 hover:bg-stone-100'}`}
                    >
                      <span>{date.getDate()}</span>
                      {log?.symptoms && log.symptoms.length > 0 && (
                        <span className="text-[8px] mt-0.5">•</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Phase legend */}
            <div className="grid grid-cols-2 gap-2 bg-stone-50 border border-stone-200 rounded-xl p-3">
              {(['menstruation', 'follicular', 'ovulation', 'luteal'] as Phase[]).map((ph) => (
                <div key={ph} className="flex items-center gap-2 text-xs text-stone-600">
                  <span className={`w-3 h-3 rounded ${
                    ph === 'menstruation' ? 'bg-red-200' :
                    ph === 'follicular' ? 'bg-yellow-100' :
                    ph === 'ovulation' ? 'bg-green-100' : 'bg-purple-100'
                  }`} />
                  {language === 'fr' ? PHASE_CONFIG[ph].labelFr : PHASE_CONFIG[ph].label}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── ANALYTICS ── */}
        {tab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {!analytics || analytics.totalCycles === 0 ? (
              <div className="text-center py-16 text-stone-400">
                <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">{language === 'fr' ? 'Pas encore de données.' : 'No data yet.'}</p>
                <p className="text-sm mt-1">
                  {language === 'fr' ? 'Enregistrez quelques cycles pour voir les analyses.' : 'Log a few cycles to see analytics.'}
                </p>
              </div>
            ) : (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/80 border border-stone-200 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-rose-700">{analytics.totalCycles}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{language === 'fr' ? 'Cycles' : 'Cycles'}</p>
                  </div>
                  <div className="bg-white/80 border border-stone-200 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-rose-700">{analytics.avgCycleLength}d</p>
                    <p className="text-xs text-stone-500 mt-0.5">{language === 'fr' ? 'Moy. cycle' : 'Avg cycle'}</p>
                  </div>
                  <div className="bg-white/80 border border-stone-200 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-rose-700">{analytics.avgPeriodLength}d</p>
                    <p className="text-xs text-stone-500 mt-0.5">{language === 'fr' ? 'Moy. période' : 'Avg period'}</p>
                  </div>
                </div>

                {/* Cycle length chart */}
                {analytics.cycleLengths.length > 1 && (
                  <div className="bg-white/80 border border-stone-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-stone-700 mb-3">
                      {language === 'fr' ? 'Longueur des cycles récents' : 'Recent cycle lengths'}
                    </p>
                    <div className="flex items-end gap-1.5 h-20">
                      {analytics.cycleLengths.map((len, i) => {
                        const max = Math.max(...analytics.cycleLengths, 35);
                        const pct = (len / max) * 100;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] text-stone-400">{len}</span>
                            <div
                              className="w-full rounded-t bg-rose-300 transition-all"
                              style={{ height: `${pct}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-stone-400 mt-2 text-center">
                      {language === 'fr' ? 'Derniers cycles (jours)' : 'Recent cycles (days)'}
                    </p>
                  </div>
                )}

                {/* Top symptoms */}
                {Object.keys(analytics.symptomCounts).length > 0 && (
                  <div className="bg-white/80 border border-stone-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-stone-700 mb-3">
                      {language === 'fr' ? 'Symptômes fréquents' : 'Common symptoms'}
                    </p>
                    <div className="space-y-2">
                      {Object.entries(analytics.symptomCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 6)
                        .map(([key, count]) => {
                          const sym = SYMPTOMS.find((s) => s.key === key);
                          const maxCount = Math.max(...Object.values(analytics.symptomCounts));
                          const pct = Math.round((count / maxCount) * 100);
                          return (
                            <div key={key} className="flex items-center gap-2">
                              <span className="text-sm w-6">{sym?.emoji ?? '•'}</span>
                              <span className="text-xs text-stone-600 w-28 truncate">
                                {sym ? (language === 'fr' ? sym.labelFr : sym.label) : key}
                              </span>
                              <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-400 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs text-stone-400 w-4 text-right">{count}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* ── SETTINGS ── */}
        {tab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-3">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                {language === 'fr'
                  ? 'Ces paramètres personnalisent les prédictions. Vos données sont privées et sécurisées.'
                  : 'These settings personalise your predictions. Your data is private and secure.'}
              </p>
            </div>

            <div className="space-y-4 bg-white/80 border border-stone-200 rounded-xl p-4">
              <div>
                <label className="text-sm font-semibold text-stone-700">
                  {language === 'fr' ? 'Longueur moyenne du cycle' : 'Average cycle length'}
                </label>
                <p className="text-xs text-stone-400 mb-2">
                  {language === 'fr' ? 'Du 1er jour des règles au suivant (typiquement 21–35 jours)' : 'Day 1 of period to the next (typically 21–35 days)'}
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={21}
                    max={40}
                    value={settingCycleLen}
                    onChange={(e) => setSettingCycleLen(Number(e.target.value))}
                    className="flex-1 accent-rose-500"
                  />
                  <span className="text-sm font-bold text-stone-800 w-12 text-center">
                    {settingCycleLen}d
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-stone-700">
                  {language === 'fr' ? 'Durée moyenne des règles' : 'Average period length'}
                </label>
                <p className="text-xs text-stone-400 mb-2">
                  {language === 'fr' ? 'Nombre de jours de saignement (typiquement 3–7 jours)' : 'Days of bleeding (typically 3–7 days)'}
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={2}
                    max={10}
                    value={settingPeriodLen}
                    onChange={(e) => setSettingPeriodLen(Number(e.target.value))}
                    className="flex-1 accent-rose-500"
                  />
                  <span className="text-sm font-bold text-stone-800 w-12 text-center">
                    {settingPeriodLen}d
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-semibold text-stone-700">
                    {language === 'fr' ? 'Rappels' : 'Reminders'}
                  </p>
                  <p className="text-xs text-stone-400">
                    {language === 'fr' ? 'Recevoir un rappel avant les règles' : 'Get reminded before your period'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettingNotifs(!settingNotifs)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${settingNotifs ? 'bg-rose-500' : 'bg-stone-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${settingNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {settingNotifs && (
                <div>
                  <label className="text-sm font-semibold text-stone-700">
                    {language === 'fr' ? 'Rappeler moi X jours avant' : 'Remind me X days before'}
                  </label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="range"
                      min={1}
                      max={7}
                      value={settingReminder}
                      onChange={(e) => setSettingReminder(Number(e.target.value))}
                      className="flex-1 accent-rose-500"
                    />
                    <span className="text-sm font-bold text-stone-800 w-12 text-center">
                      {settingReminder}d
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveSettings}
              className="w-full py-3 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {language === 'fr' ? 'Sauvegarder les paramètres' : 'Save settings'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
