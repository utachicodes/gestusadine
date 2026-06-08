import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { format, isToday } from 'date-fns';
import {
  Heart, Calendar, BarChart2, Settings, ChevronLeft, ChevronRight,
  Droplets, Activity, Info, Check, Sparkles, Moon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { useTr } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

// ── Onboarding ────────────────────────────────────────────────────────────────

const PERIOD_ONBOARDING_KEY = 'period_onboarding_v1';

const CYCLE_LENGTH_OPTIONS = [
  { label: { en: 'Less than 21 days', fr: 'Moins de 21 jours' }, value: 20 },
  { label: { en: '21 – 25 days', fr: '21 – 25 jours' }, value: 23 },
  { label: { en: '26 – 30 days', fr: '26 – 30 jours' }, value: 28, common: true },
  { label: { en: '31 – 35 days', fr: '31 – 35 jours' }, value: 33 },
  { label: { en: 'More than 35 days', fr: 'Plus de 35 jours' }, value: 36 },
  { label: { en: 'Irregular / not sure', fr: 'Irrégulier / je ne sais pas' }, value: 28 },
];

const PERIOD_LENGTH_OPTIONS = [
  { label: { en: '1 – 3 days', fr: '1 – 3 jours' }, value: 2 },
  { label: { en: '4 – 5 days', fr: '4 – 5 jours' }, value: 5, common: true },
  { label: { en: '6 – 7 days', fr: '6 – 7 jours' }, value: 6 },
  { label: { en: 'More than 7 days', fr: 'Plus de 7 jours' }, value: 8 },
  { label: { en: "I'm not sure", fr: 'Je ne sais pas' }, value: 5 },
];

const CONTRACEPTION_OPTIONS = [
  { key: 'none',     label: { en: 'None', fr: 'Aucune' }, emoji: '✨' },
  { key: 'pill',     label: { en: 'Birth control pill', fr: 'Pilule contraceptive' }, emoji: '💊' },
  { key: 'iud',      label: { en: 'IUD', fr: 'Stérilet (DIU)' }, emoji: '🔩' },
  { key: 'implant',  label: { en: 'Implant', fr: 'Implant' }, emoji: '💉' },
  { key: 'condom',   label: { en: 'Condom', fr: 'Préservatif' }, emoji: '🛡️' },
  { key: 'other',    label: { en: 'Other / prefer not to say', fr: 'Autre / ne pas dire' }, emoji: '•••' },
];

interface OnboardingProps {
  onComplete: (data: { cycleLength: number; periodLength: number; lastPeriodDaysAgo: number | null; symptoms: string[] }) => void;
  onSkip: () => void;
  language: string;
}

function PeriodOnboarding({ onComplete, onSkip, language }: OnboardingProps) {
  const L = (en: string, fr: string) => language === 'fr' ? fr : en;

  const [step, setStep] = useState(0);
  const [lastPeriodDaysAgo, setLastPeriodDaysAgo] = useState<number | null>(null);
  const [cycleLength, setCycleLength] = useState<number | null>(null);
  const [periodLength, setPeriodLength] = useState<number | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [contraception, setContraception] = useState<string | null>(null);

  const TOTAL_STEPS = 6; // 0=welcome, 1=last period, 2=cycle, 3=duration, 4=symptoms, 5=done

  const canNext = () => {
    if (step === 1) return lastPeriodDaysAgo !== null;
    if (step === 2) return cycleLength !== null;
    if (step === 3) return periodLength !== null;
    return true;
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else finish();
  };

  const finish = () => {
    onComplete({
      cycleLength: cycleLength ?? 28,
      periodLength: periodLength ?? 5,
      lastPeriodDaysAgo,
      symptoms: selectedSymptoms,
    });
  };

  const toggleSymptom = (key: string) =>
    setSelectedSymptoms((prev) => prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]);

  const ONBOARDING_SYMPTOMS = [
    { key: 'cramps',     en: 'Cramps',       fr: 'Crampes',          emoji: '⚡' },
    { key: 'headache',   en: 'Headache',     fr: 'Mal de tête',      emoji: '🤕' },
    { key: 'fatigue',    en: 'Fatigue',      fr: 'Fatigue',          emoji: '😴' },
    { key: 'bloating',   en: 'Bloating',     fr: 'Ballonnements',    emoji: '💨' },
    { key: 'moodswings', en: 'Mood swings',  fr: "Sautes d'humeur",  emoji: '🎭' },
    { key: 'backpain',   en: 'Back pain',    fr: 'Mal de dos',       emoji: '🔙' },
    { key: 'nausea',     en: 'Nausea',       fr: 'Nausée',           emoji: '🤢' },
    { key: 'insomnia',   en: 'Insomnia',     fr: 'Insomnie',         emoji: '🌙' },
    { key: 'cravings',   en: 'Cravings',     fr: 'Envies',           emoji: '🍫' },
    { key: 'acne',       en: 'Acne',         fr: 'Acné',             emoji: '😶' },
    { key: 'tender',     en: 'Breast tenderness', fr: 'Seins sensibles', emoji: '💗' },
  ];

  // Last 14 days as chips
  const dayChips = Array.from({ length: 14 }, (_, i) => ({
    daysAgo: i,
    label: i === 0 ? L('Today', "Aujourd'hui") : i === 1 ? L('Yesterday', 'Hier') : L(`${i} days ago`, `Il y a ${i} jours`),
  }));

  const stepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col items-center text-center gap-6 py-4">
            <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center">
              <Heart className="w-10 h-10 text-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {L("Let's get to know your cycle", "Apprenons à connaître votre cycle")}
              </h1>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                {L(
                  "Just a few questions so we can personalise your tracker and give you accurate predictions.",
                  "Quelques questions pour personnaliser votre suivi et vous donner des prédictions précises."
                )}
              </p>
            </div>
            <div className="w-full space-y-2 text-left">
              {[
                L('Predict your next period', 'Prédire vos prochaines règles'),
                L('Track symptoms & moods', 'Suivre vos symptômes et humeurs'),
                L('Understand your cycle phases', 'Comprendre vos phases de cycle'),
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-rose-50/60 border border-rose-100">
                  <Check className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {L('When did your last period start?', 'Quand ont commencé vos dernières règles ?')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {L('This helps us predict your next period.', 'Cela nous aide à prédire vos prochaines règles.')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto overscroll-contain pr-1">
              {dayChips.map(({ daysAgo, label }) => (
                <button
                  key={daysAgo}
                  type="button"
                  onClick={() => setLastPeriodDaysAgo(daysAgo)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                    lastPeriodDaysAgo === daysAgo
                      ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-sm'
                      : 'border-border bg-muted/30 text-muted-foreground hover:border-rose-300'
                  }`}
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setLastPeriodDaysAgo(-1)}
                className={`col-span-2 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                  lastPeriodDaysAgo === -1
                    ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-sm'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-rose-300'
                }`}
              >
                {L('More than 2 weeks ago', 'Il y a plus de 2 semaines')}
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {L('How long is your usual cycle?', 'Quelle est la durée habituelle de votre cycle ?')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {L('Count from day 1 of your period to the day before your next one.', 'Du 1er jour de vos règles jusqu\'à la veille des suivantes.')}
              </p>
            </div>
            <div className="space-y-2">
              {CYCLE_LENGTH_OPTIONS.map((opt) => (
                <button
                  key={opt.value + opt.label.en}
                  type="button"
                  onClick={() => setCycleLength(opt.value)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                    cycleLength === opt.value && CYCLE_LENGTH_OPTIONS.find(o => o.value === cycleLength)?.label.en === opt.label.en
                      ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-sm'
                      : 'border-border bg-muted/30 text-muted-foreground hover:border-rose-300'
                  }`}
                >
                  <span>{language === 'fr' ? opt.label.fr : opt.label.en}</span>
                  {opt.common && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-rose-400 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      {L('Most common', 'Le plus courant')}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {L('How long does your period usually last?', 'Combien de jours durent habituellement vos règles ?')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {L('Include lighter days too.', 'Incluez aussi les jours plus légers.')}
              </p>
            </div>
            <div className="space-y-2">
              {PERIOD_LENGTH_OPTIONS.map((opt) => (
                <button
                  key={opt.value + opt.label.en}
                  type="button"
                  onClick={() => setPeriodLength(opt.value)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                    periodLength === opt.value && PERIOD_LENGTH_OPTIONS.find(o => o.value === periodLength)?.label.en === opt.label.en
                      ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-sm'
                      : 'border-border bg-muted/30 text-muted-foreground hover:border-rose-300'
                  }`}
                >
                  <span>{language === 'fr' ? opt.label.fr : opt.label.en}</span>
                  {opt.common && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-rose-400 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      {L('Average', 'Moyenne')}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {L('Which symptoms do you usually experience?', 'Quels symptômes ressentez-vous habituellement ?')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {L('Select all that apply. You can always add more later.', 'Sélectionnez tout ce qui s\'applique. Vous pouvez en ajouter plus tard.')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ONBOARDING_SYMPTOMS.map((s) => {
                const active = selectedSymptoms.includes(s.key);
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => toggleSymptom(s.key)}
                    className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                      active
                        ? 'border-rose-400 bg-rose-50 text-rose-700'
                        : 'border-border bg-muted/30 text-muted-foreground hover:border-rose-300'
                    }`}
                  >
                    <span className="text-base">{s.emoji}</span>
                    <span className="truncate">{language === 'fr' ? s.fr : s.en}</span>
                    {active && <Check className="w-3.5 h-3.5 ml-auto flex-shrink-0 text-rose-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col items-center text-center gap-6 py-4">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {L("You're all set!", "C'est prêt !")}
              </h2>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                {L(
                  "Your tracker is personalised. Log daily to get better predictions over time.",
                  "Votre suivi est personnalisé. Enregistrez chaque jour pour améliorer les prédictions au fil du temps."
                )}
              </p>
            </div>
            <div className="w-full space-y-2.5 text-left text-sm">
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-muted/40 border border-border">
                <span className="text-muted-foreground">{L('Cycle length', 'Durée du cycle')}</span>
                <span className="font-semibold text-foreground">{cycleLength ?? 28} {L('days', 'jours')}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-muted/40 border border-border">
                <span className="text-muted-foreground">{L('Period duration', 'Durée des règles')}</span>
                <span className="font-semibold text-foreground">{periodLength ?? 5} {L('days', 'jours')}</span>
              </div>
              {selectedSymptoms.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-muted/40 border border-border">
                  <span className="text-muted-foreground">{L('Symptoms tracked', 'Symptômes suivis')}</span>
                  <span className="font-semibold text-foreground">{selectedSymptoms.length}</span>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = step / (TOTAL_STEPS - 1);

  return (
    <div
      className="fixed inset-0 z-50 bg-background flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
        <div className="flex-1">
          {step > 0 && step < TOTAL_STEPS - 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {L('Back', 'Retour')}
            </button>
          )}
        </div>
        <div className="flex-1 text-center">
          {step > 0 && step < TOTAL_STEPS - 1 && (
            <span className="text-xs font-semibold text-muted-foreground">
              {step} / {TOTAL_STEPS - 2}
            </span>
          )}
        </div>
        <div className="flex-1 flex justify-end">
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {L('Skip', 'Passer')}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {step > 0 && step < TOTAL_STEPS - 1 && (
        <div className="mx-5 h-1 rounded-full bg-muted overflow-hidden flex-shrink-0">
          <motion.div
            className="h-full rounded-full bg-rose-400"
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
          >
            {stepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pb-4 flex-shrink-0">
        <button
          type="button"
          onClick={step === TOTAL_STEPS - 1 ? finish : next}
          disabled={!canNext()}
          className="w-full py-4 rounded-2xl bg-rose-500 text-white text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-rose-600 transition-colors"
        >
          {step === 0
            ? L("Let's start", "Commençons")
            : step === 4
            ? L('Continue', 'Continuer')
            : step === TOTAL_STEPS - 1
            ? L('Open my tracker', 'Ouvrir mon suivi')
            : L('Continue', 'Continuer')}
        </button>
        {step === 4 && (
          <button
            type="button"
            onClick={next}
            className="w-full mt-2 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {L('Skip for now', 'Passer pour l\'instant')}
          </button>
        )}
      </div>
    </div>
  );
}

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

type Tab = 'overview' | 'log' | 'calendar' | 'analytics' | 'qadaa' | 'settings';

const TABS: { id: Tab; en: string; fr: string; icon: React.ReactNode }[] = [
  { id: 'overview',  en: 'Overview', fr: 'Aperçu',   icon: <Heart className="w-3.5 h-3.5" /> },
  { id: 'log',       en: 'Log',      fr: 'Journal',  icon: <Droplets className="w-3.5 h-3.5" /> },
  { id: 'calendar',  en: 'Calendar', fr: 'Calendar', icon: <Calendar className="w-3.5 h-3.5" /> },
  { id: 'analytics', en: 'Analytics',fr: 'Analytics',icon: <BarChart2 className="w-3.5 h-3.5" /> },
  { id: 'qadaa',     en: 'Sawm Qadaa', fr: 'Sawm Qadaa', icon: <Moon className="w-3.5 h-3.5" /> },
  { id: 'settings',  en: 'Settings', fr: 'Settings', icon: <Settings className="w-3.5 h-3.5" /> },
];

// ── Main component ────────────────────────────────────────────────────────────

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

      {/* ── SAWM QADAA ──────────────────────────────────────────────────── */}
      {tab === 'qadaa' && (
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
            .map(([yearStr, data]) => {
              const year = Number(yearStr);
              const owedRows = qadaaSummary.rows.filter(
                (r) => r.ramadanYear === year && r.completedAt === undefined
              );
              const doneRows = qadaaSummary.rows.filter(
                (r) => r.ramadanYear === year && r.completedAt !== undefined
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
                      {owedRows.map((row) => (
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
                        {doneRows.map((row) => (
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
