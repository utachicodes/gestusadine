import React, { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight, Check, Sparkles, Zap, Activity, Moon, Wind, Frown, ArrowDown, Thermometer, Cookie, Smile, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PERIOD_ONBOARDING_KEY = 'period_onboarding_v1';

export const CYCLE_LENGTH_OPTIONS = [
  { label: { en: 'Less than 21 days', fr: 'Moins de 21 jours' }, value: 20 },
  { label: { en: '21 – 25 days', fr: '21 – 25 jours' }, value: 23 },
  { label: { en: '26 – 30 days', fr: '26 – 30 jours' }, value: 28, common: true },
  { label: { en: '31 – 35 days', fr: '31 – 35 jours' }, value: 33 },
  { label: { en: 'More than 35 days', fr: 'Plus de 35 jours' }, value: 36 },
  { label: { en: 'Irregular / not sure', fr: 'Irrégulier / je ne sais pas' }, value: 28 },
];

export const PERIOD_LENGTH_OPTIONS = [
  { label: { en: '1 – 3 days', fr: '1 – 3 jours' }, value: 2 },
  { label: { en: '4 – 5 days', fr: '4 – 5 jours' }, value: 5, common: true },
  { label: { en: '6 – 7 days', fr: '6 – 7 jours' }, value: 6 },
  { label: { en: 'More than 7 days', fr: 'Plus de 7 jours' }, value: 8 },
  { label: { en: "I'm not sure", fr: 'Je ne sais pas' }, value: 5 },
];

export const CONTRACEPTION_OPTIONS = [
  { key: 'none',     label: { en: 'None', fr: 'Aucune' }, icon: 'none' as const },
  { key: 'pill',     label: { en: 'Birth control pill', fr: 'Pilule contraceptive' }, icon: 'pill' as const },
  { key: 'iud',      label: { en: 'IUD', fr: 'Stérilet (DIU)' }, icon: 'iud' as const },
  { key: 'implant',  label: { en: 'Implant', fr: 'Implant' }, icon: 'implant' as const },
  { key: 'condom',   label: { en: 'Condom', fr: 'Préservatif' }, icon: 'condom' as const },
  { key: 'other',    label: { en: 'Other / prefer not to say', fr: 'Autre / ne pas dire' }, icon: 'other' as const },
];

export interface OnboardingProps {
  onComplete: (data: { cycleLength: number; periodLength: number; lastPeriodDaysAgo: number | null; symptoms: string[] }) => void;
  onSkip: () => void;
  language: string;
}

export function PeriodOnboarding({ onComplete, onSkip, language }: OnboardingProps) {
  const L = (en: string, fr: string) => language === 'fr' ? fr : en;

  const [step, setStep] = useState(0);
  const [lastPeriodDaysAgo, setLastPeriodDaysAgo] = useState<number | null>(null);
  const [cycleLength, setCycleLength] = useState<number | null>(null);
  const [periodLength, setPeriodLength] = useState<number | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [contraception, setContraception] = useState<string | null>(null);

  const TOTAL_STEPS = 6;

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
    { key: 'cramps',     en: 'Cramps',       fr: 'Crampes',          icon: <Zap className="w-4 h-4" /> },
    { key: 'headache',   en: 'Headache',     fr: 'Mal de tête',      icon: <Activity className="w-4 h-4" /> },
    { key: 'fatigue',    en: 'Fatigue',      fr: 'Fatigue',          icon: <Moon className="w-4 h-4" /> },
    { key: 'bloating',   en: 'Bloating',     fr: 'Ballonnements',    icon: <Wind className="w-4 h-4" /> },
    { key: 'moodswings', en: 'Mood swings',  fr: "Sautes d'humeur",  icon: <Frown className="w-4 h-4" /> },
    { key: 'backpain',   en: 'Back pain',    fr: 'Mal de dos',       icon: <ArrowDown className="w-4 h-4" /> },
    { key: 'nausea',     en: 'Nausea',       fr: 'Nausée',           icon: <Thermometer className="w-4 h-4" /> },
    { key: 'insomnia',   en: 'Insomnia',     fr: 'Insomnie',         icon: <Moon className="w-4 h-4" /> },
    { key: 'cravings',   en: 'Cravings',     fr: 'Envies',           icon: <Cookie className="w-4 h-4" /> },
    { key: 'acne',       en: 'Acne',         fr: 'Acné',             icon: <Smile className="w-4 h-4" /> },
    { key: 'tender',     en: 'Breast tenderness', fr: 'Seins sensibles', icon: <Droplets className="w-4 h-4" /> },
  ];

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
                    <span className="flex-shrink-0">{s.icon}</span>
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
