import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { startOfDayUTC } from '@/lib/utils';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { useTr } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { PeriodOnboarding, PERIOD_ONBOARDING_KEY } from './period/PeriodOnboarding';
import { PeriodOverview } from './period/PeriodOverview';
import { PeriodLog } from './period/PeriodLog';
import { PeriodCalendar } from './period/PeriodCalendar';
import { PeriodAnalytics } from './period/PeriodAnalytics';
import { PeriodQadaa } from './period/PeriodQadaa';
import { PeriodSettings } from './period/PeriodSettings';
import { getCyclePhase, CYCLE_PHASES, TABS, type Tab } from './period/constants';

export default function PeriodTracker() {
  const tr = useTr();
  const { language } = useLanguage();
  const [tab, setTab] = useState<Tab>('overview');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [onboardingDismissed, setOnboardingDismissed] = useState(
    () => localStorage.getItem(PERIOD_ONBOARDING_KEY) === 'true'
  );

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
  const qadaaSummary = useQuery(api.periodTracker.getQadaaSummary);

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
  const markQadaaCompleted = useMutation(api.periodTracker.markQadaaCompleted);
  const unmarkQadaaCompleted = useMutation(api.periodTracker.unmarkQadaaCompleted);
  const backfillQadaa = useMutation(api.periodTracker.backfillQadaaFromHistory);

  // Qadaa schedule settings
  const [qadaaDaysPerWeek, setQadaaDaysPerWeek] = useState(2);
  const [qadaaPreferredDays, setQadaaPreferredDays] = useState<number[]>([1, 4]); // Mon, Thu
  const [qadaaReminderEnabled, setQadaaReminderEnabled] = useState(false);
  const [qadaaSettingsLoaded, setQadaaSettingsLoaded] = useState(false);

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

  React.useEffect(() => {
    if (settings && !qadaaSettingsLoaded) {
      if ((settings as any).qadaaDaysPerWeek != null) setQadaaDaysPerWeek((settings as any).qadaaDaysPerWeek);
      if ((settings as any).qadaaPreferredDays != null) setQadaaPreferredDays((settings as any).qadaaPreferredDays);
      if ((settings as any).qadaaReminderEnabled != null) setQadaaReminderEnabled((settings as any).qadaaReminderEnabled);
      setQadaaSettingsLoaded(true);
    }
  }, [settings, qadaaSettingsLoaded]);

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

  const handleOnboardingComplete = async (data: {
    cycleLength: number;
    periodLength: number;
    lastPeriodDaysAgo: number | null;
    symptoms: string[];
  }) => {
    try {
      await updateSettings({
        avgCycleLength: data.cycleLength,
        avgPeriodLength: data.periodLength,
        notifications: false,
        reminderDays: 2,
      });
      // If the period started within the last 7 days, start a cycle for them
      if (data.lastPeriodDaysAgo !== null && data.lastPeriodDaysAgo >= 0 && data.lastPeriodDaysAgo <= 7) {
        try { await startCycle({}); } catch { /* noop — cycle may already be active */ }
      }
    } catch { /* noop */ }
    localStorage.setItem(PERIOD_ONBOARDING_KEY, 'true');
    setOnboardingDismissed(true);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem(PERIOD_ONBOARDING_KEY, 'true');
    setOnboardingDismissed(true);
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

  // Show onboarding on first launch (settings is null = never saved, not still loading)
  if (!onboardingDismissed && settings === null) {
    return (
      <PeriodOnboarding
        language={language}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

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

      {tab === 'overview' && (
        <PeriodOverview
          tr={tr}
          activeCycle={activeCycle}
          cycleDay={cycleDay}
          phaseMeta={phaseMeta}
          nextPeriod={nextPeriod}
          ovulationDay={ovulationDay}
          todayLog={todayLog}
          handleEndCycle={handleEndCycle}
          handleStartCycle={handleStartCycle}
          setTab={setTab}
        />
      )}

      {tab === 'log' && (
        <PeriodLog
          tr={tr}
          logFlow={logFlow}
          setLogFlow={setLogFlow}
          logMood={logMood}
          setLogMood={setLogMood}
          logSymptoms={logSymptoms}
          toggleSymptom={toggleSymptom}
          logTemp={logTemp}
          setLogTemp={setLogTemp}
          logNotes={logNotes}
          setLogNotes={setLogNotes}
          handleSaveLog={handleSaveLog}
        />
      )}

      {tab === 'calendar' && (
        <PeriodCalendar
          tr={tr}
          calendarMonth={calendarMonth}
          setCalendarMonth={setCalendarMonth}
          calYear={calYear}
          calMon={calMon}
          firstDay={firstDay}
          daysInMonth={daysInMonth}
          logMap={logMap}
        />
      )}

      {tab === 'analytics' && (
        <PeriodAnalytics
          tr={tr}
          analytics={analytics}
        />
      )}

      {tab === 'qadaa' && (
        <PeriodQadaa
          tr={tr}
          qadaaSummary={qadaaSummary}
          markQadaaCompleted={markQadaaCompleted}
          unmarkQadaaCompleted={unmarkQadaaCompleted}
          backfillQadaa={backfillQadaa}
          qadaaDaysPerWeek={qadaaDaysPerWeek}
          setQadaaDaysPerWeek={setQadaaDaysPerWeek}
          qadaaPreferredDays={qadaaPreferredDays}
          setQadaaPreferredDays={setQadaaPreferredDays}
          qadaaReminderEnabled={qadaaReminderEnabled}
          setQadaaReminderEnabled={setQadaaReminderEnabled}
          updateSettings={updateSettings}
        />
      )}

      {tab === 'settings' && (
        <PeriodSettings
          tr={tr}
          settingCycleLen={settingCycleLen}
          setSettingCycleLen={setSettingCycleLen}
          settingPeriodLen={settingPeriodLen}
          setSettingPeriodLen={setSettingPeriodLen}
          settingNotifs={settingNotifs}
          setSettingNotifs={setSettingNotifs}
          settingReminderDays={settingReminderDays}
          setSettingReminderDays={setSettingReminderDays}
          handleSaveSettings={handleSaveSettings}
        />
      )}
    </section>
    </div>
  );
}
