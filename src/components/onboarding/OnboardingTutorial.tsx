import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, BookOpen, MessageSquare, BookOpenText, Clock, BookMarked, Heart } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface Step {
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  icon: React.ReactNode;
  targetSelector?: string;  // data-tour attribute value
  navigateTo?: string;      // navigate to this path before highlighting
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const STEPS: Step[] = [
  {
    title: 'Welcome to GëstuSaDine',
    titleFr: 'Bienvenue sur GëstuSaDine',
    description: 'Your Islamic knowledge and wellness companion. Let us show you around in just a minute.',
    descriptionFr: 'Votre compagnon de connaissance islamique et de bien-être. Laissez-nous vous faire visiter en une minute.',
    icon: <Sparkles className="w-8 h-8 text-emerald-600" />,
    position: 'center',
  },
  {
    title: 'Your Dashboard',
    titleFr: 'Votre tableau de bord',
    description: 'This is your home. See your daily content, prayer tracker, Quran progress, and streak at a glance.',
    descriptionFr: 'C\'est votre accueil. Consultez vos contenus quotidiens, votre suivi de prière, votre progression coranique et votre streak en un coup d\'œil.',
    icon: <BookOpen className="w-8 h-8 text-emerald-600" />,
    targetSelector: 'nav-dashboard',
    navigateTo: '/dashboard',
    position: 'right',
  },
  {
    title: 'The Council',
    titleFr: 'Le Conseil',
    description: 'Ask any Islamic question and receive evidence-based answers from our AI council, grounded in Quran and authentic Hadith.',
    descriptionFr: 'Posez n\'importe quelle question islamique et recevez des réponses fondées sur des preuves de notre conseil d\'IA, ancré dans le Coran et les hadiths authentiques.',
    icon: <MessageSquare className="w-8 h-8 text-emerald-600" />,
    targetSelector: 'nav-council',
    navigateTo: '/chat',
    position: 'right',
  },
  {
    title: 'Quran Reading',
    titleFr: 'Lecture du Coran',
    description: 'Read, track your progress through all 114 surahs, and maintain a daily Quran reading streak.',
    descriptionFr: 'Lisez, suivez votre progression à travers les 114 sourates et maintenez une série de lectures quotidiennes du Coran.',
    icon: <BookOpenText className="w-8 h-8 text-emerald-600" />,
    targetSelector: 'nav-quran',
    navigateTo: '/dashboard',
    position: 'right',
  },
  {
    title: 'Prayer Tracker',
    titleFr: 'Suivi des prières',
    description: 'Log your five daily prayers and build a consistent prayer habit. Your streak motivates you to stay consistent.',
    descriptionFr: 'Enregistrez vos cinq prières quotidiennes et construisez une habitude de prière cohérente. Votre série vous motive à rester constant.',
    icon: <Clock className="w-8 h-8 text-emerald-600" />,
    targetSelector: 'nav-prayer',
    navigateTo: '/dashboard',
    position: 'right',
  },
  {
    title: 'Your Journal',
    titleFr: 'Votre journal',
    description: 'Write daily reflections, track your mood, use gratitude templates, and build a streak of self-reflection.',
    descriptionFr: 'Écrivez des réflexions quotidiennes, suivez votre humeur, utilisez des modèles de gratitude et construisez une série d\'auto-réflexion.',
    icon: <BookMarked className="w-8 h-8 text-emerald-600" />,
    targetSelector: 'nav-journal',
    navigateTo: '/dashboard',
    position: 'right',
  },
];

const FEMALE_STEP: Step = {
  title: 'Cycle Tracker',
  titleFr: 'Suivi du cycle',
  description: 'Track your menstrual cycle, log symptoms and moods, get predictions for your next period and fertile window, and access educational insights.',
  descriptionFr: 'Suivez votre cycle menstruel, enregistrez les symptômes et les humeurs, obtenez des prédictions pour vos prochaines règles et fenêtre fertile, et accédez à des informations éducatives.',
  icon: <Heart className="w-8 h-8 text-rose-500" />,
  targetSelector: 'nav-period',
  navigateTo: '/dashboard',
  position: 'right',
};

const FINAL_STEP: Step = {
  title: "You're all set!",
  titleFr: 'Vous êtes prêt(e) !',
  description: "Explore GëstuSaDine at your own pace. You can restart this tutorial anytime from Settings.",
  descriptionFr: 'Explorez GëstuSaDine à votre rythme. Vous pouvez relancer ce tutoriel à tout moment depuis les Paramètres.',
  icon: <Sparkles className="w-8 h-8 text-amber-500" />,
  position: 'center',
};

const LS_KEY = 'gestu_onboarding_done';

export function OnboardingTutorial() {
  const { profile, loading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const setOnboardingCompleted = useMutation(api.users.setOnboardingCompleted);

  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<DOMRect | null>(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const highlightRef = useRef<Element | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Determine steps based on user gender
  const steps = React.useMemo(() => {
    const base = [...STEPS];
    if (profile?.gender === 'female') {
      // Insert female step before final
      base.push(FEMALE_STEP);
    }
    base.push(FINAL_STEP);
    return base;
  }, [profile?.gender]);

  const currentStep = steps[stepIndex];

  // Check if tutorial should auto-start
  useEffect(() => {
    if (loading) return;
    if (!profile) return;

    const localDone = localStorage.getItem(LS_KEY) === 'true';
    const serverDone = profile.onboarding_completed === true;

    // Hardcoded admin skips tutorial
    if (profile.id === 'hardcoded-admin') return;

    if (!localDone && !serverDone) {
      const timer = setTimeout(() => setActive(true), 800);
      return () => clearTimeout(timer);
    }
  }, [loading, profile]);

  // Update spotlight position when step changes
  const updateSpotlight = useCallback(() => {
    if (!currentStep?.targetSelector) {
      setSpotlight(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${currentStep.targetSelector}"]`);
    if (el) {
      highlightRef.current = el;
      setSpotlight(el.getBoundingClientRect());
    } else {
      setSpotlight(null);
    }
  }, [currentStep]);

  useEffect(() => {
    if (!active) return;

    // Navigate if needed
    if (currentStep?.navigateTo && location.pathname !== currentStep.navigateTo) {
      navigate(currentStep.navigateTo);
    }

    // Allow the DOM to settle before measuring
    const timer = setTimeout(updateSpotlight, 350);

    // Update on resize
    const handleResize = () => updateSpotlight();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, stepIndex, updateSpotlight, currentStep, navigate, location.pathname]);

  const complete = useCallback(async () => {
    setActive(false);
    try {
      localStorage.setItem(LS_KEY, 'true');
      await setOnboardingCompleted();
    } catch { /* noop */ }
  }, [setOnboardingCompleted]);

  const next = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      complete();
    }
  };

  const prev = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const skip = () => complete();

  if (!active) return null;

  // On mobile the sidebar is hidden — spotlight targeting makes no sense.
  // Render a bottom sheet instead; all positioning logic is skipped.
  const isCenter = isMobile || !currentStep?.targetSelector || !spotlight || currentStep.position === 'center';
  const isLast = stepIndex === steps.length - 1;

  const getCalloutStyle = (): React.CSSProperties => {
    if (!spotlight || isCenter) return {};
    const MARGIN = 16;
    const CALLOUT_W = 320;
    const CALLOUT_H = 220;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (spotlight.right + MARGIN + CALLOUT_W < vw) {
      return { position: 'fixed', top: Math.min(spotlight.top, vh - CALLOUT_H - MARGIN), left: spotlight.right + MARGIN, width: CALLOUT_W };
    }
    if (spotlight.left - MARGIN - CALLOUT_W > 0) {
      return { position: 'fixed', top: Math.min(spotlight.top, vh - CALLOUT_H - MARGIN), right: vw - spotlight.left + MARGIN, width: CALLOUT_W };
    }
    return { position: 'fixed', top: spotlight.bottom + MARGIN, left: Math.max(MARGIN, Math.min(spotlight.left, vw - CALLOUT_W - MARGIN)), width: CALLOUT_W };
  };

  // Shared card content so mobile and desktop render the same UI
  const CardContent = () => (
    <div className="bg-white overflow-hidden" style={isMobile ? { borderRadius: '1.25rem 1.25rem 0 0' } : { borderRadius: '1rem' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 px-5 py-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            {currentStep.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-emerald-200 uppercase tracking-wider">
              {language === 'fr' ? `Étape ${stepIndex + 1} sur ${steps.length}` : `Step ${stepIndex + 1} of ${steps.length}`}
            </p>
            <p className="text-white font-bold text-base leading-tight mt-0.5">
              {language === 'fr' ? currentStep.titleFr : currentStep.title}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={skip}
          className="text-white/60 hover:text-white transition-colors ml-3 flex-shrink-0"
          aria-label="Skip tutorial"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <p className="text-sm text-stone-600 leading-relaxed">
          {language === 'fr' ? currentStep.descriptionFr : currentStep.description}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 pb-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === stepIndex ? 'w-4 bg-emerald-600' : 'w-1.5 bg-stone-200'
            }`}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-5 pb-4 flex items-center gap-2"
        style={isMobile ? { paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' } : undefined}
      >
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={prev}
            className="flex items-center gap-1 px-4 py-3 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {language === 'fr' ? 'Précédent' : 'Back'}
          </button>
        )}
        <button
          type="button"
          onClick={next}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-900 text-white text-sm font-semibold hover:bg-emerald-800 transition-colors"
        >
          {isLast
            ? (language === 'fr' ? 'Commencer' : "Let's go!")
            : (language === 'fr' ? 'Suivant' : 'Next')}
          {!isLast && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {stepIndex === 0 && (
        <div className="pb-4 text-center" style={isMobile ? { paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' } : undefined}>
          <button
            type="button"
            onClick={skip}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            {language === 'fr' ? 'Passer le tutoriel' : 'Skip tutorial'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isMobile ? skip : undefined}
            className="fixed inset-0 z-[9000]"
            style={{
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(1px)',
              pointerEvents: isMobile ? 'auto' : 'none',
            }}
          >
            {/* Desktop spotlight cutout */}
            {!isMobile && spotlight && !isCenter && (
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <mask id="spotlight-mask">
                    <rect width="100%" height="100%" fill="white" />
                    <rect
                      x={spotlight.left - 6}
                      y={spotlight.top - 6}
                      width={spotlight.width + 12}
                      height={spotlight.height + 12}
                      rx="12"
                      fill="black"
                    />
                  </mask>
                </defs>
                <rect width="100%" height="100%" fill="rgba(0,0,0,0.55)" mask="url(#spotlight-mask)" />
              </svg>
            )}
          </motion.div>

          {/* Desktop spotlight ring */}
          {!isMobile && spotlight && !isCenter && (
            <motion.div
              key="ring"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-[9001] pointer-events-none rounded-xl ring-2 ring-emerald-400"
              style={{
                top: spotlight.top - 6,
                left: spotlight.left - 6,
                width: spotlight.width + 12,
                height: spotlight.height + 12,
              }}
            />
          )}

          {/* ── Mobile: bottom sheet ── */}
          {isMobile && (
            <motion.div
              key={`sheet-${stepIndex}`}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-[9002] pointer-events-auto shadow-2xl"
            >
              <CardContent />
            </motion.div>
          )}

          {/* ── Desktop: floating callout ── */}
          {!isMobile && (
            <motion.div
              key={`callout-${stepIndex}`}
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed z-[9002] pointer-events-auto"
              style={
                isCenter
                  ? { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'min(90vw, 380px)' }
                  : getCalloutStyle()
              }
            >
              <CardContent />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

/** Call this from Settings to let users restart the tutorial */
// eslint-disable-next-line react-refresh/only-export-components
export function resetOnboardingTutorial() {
  localStorage.removeItem(LS_KEY);
}
