import * as React from "react";
import { Sun, MoonStar, Trophy, Flame, Target, X, FlaskConical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { RankDisplay } from "@/components/gamification/RankDisplay";
import { DailyGoals } from "@/components/gamification/DailyGoals";
import { useProfileStats } from "@/data/profile";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

type LanguageCode = "fr" | "en";


interface DailyData {
  gregorianDate: string;
  hijriDate: string;
  ayah: { reference: string; arabic: string; translation: string };
  hadith: { arabic: string; translation: string; source: string };
  dua: { arabic: string; translation: string };
  fact: string;
  action: string;
}

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getCurrentDateFormatted = (format: 'US' | 'EU' | 'ISO') => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  switch (format) {
    case 'US': return `${month}/${day}/${year}`;
    case 'EU': return `${day}-${month}-${year}`;
    case 'ISO': return `${year}-${month}-${day}`;
    default: return `${year}-${month}-${day}`;
  }
};

const MOCK_DAILY: DailyData = {
  gregorianDate: getCurrentDate(),
  hijriDate: "-",
  ayah: { reference: "Al-Baqarah 2:286", arabic: "لا يكلف الله نفسا الا وسعها", translation: "Allah does not burden a soul beyond what it can bear." },
  hadith: { arabic: "انما الاعمال بالنيات", translation: "Actions are but by intentions.", source: "Sahih al-Bukhari 1" },
  dua: { arabic: "رب زدني علما", translation: "My Lord, increase me in knowledge." },
  fact: "The five daily prayers were made obligatory during the Night Journey.",
  action: "Take a moment to remember Allah with sincerity and share something beneficial with someone today.",
};

const Dashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const stats = useProfileStats();
  const subscription = useQuery(api.subscription.getMySubscription);
  const recordActivity = useMutation(api.gamification.recordDailyActivity);
  const isFree = subscription?.tier === 'free';

  // Fire once on mount — backend now guards against double-counting per day
  React.useEffect(() => {
    recordActivity().catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reactive query — data arrives as soon as the WS connection delivers it,
  // no extra imperative round-trip after mount.
  const dailyRaw = useQuery(api.daily.getDaily);
  const loadingDaily = dailyRaw === undefined;

  const [hijriDate, setHijriDate] = React.useState<string>("-");

  // Fetch Hijri date once per session, derived from today's date (no Convex dep)
  React.useEffect(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    fetch(`https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`)
      .then((r) => r.ok ? r.json() : null)
      .then((payload) => {
        const hijri = payload?.data?.hijri;
        if (hijri) setHijriDate(`${hijri.day} ${hijri.month?.en} ${hijri.year}`);
      })
      .catch(() => {});
  }, []);

  const daily: DailyData | null = dailyRaw
    ? { ...dailyRaw, hijriDate }
    : loadingDaily ? null : MOCK_DAILY;

  const [showReminder, setShowReminder] = React.useState(false);
  const [showBetaBanner, setShowBetaBanner] = React.useState(() => {
    return localStorage.getItem('gestu_beta_banner_dismissed') !== 'true';
  });

  const dismissBeta = () => {
    setShowBetaBanner(false);
    localStorage.setItem('gestu_beta_banner_dismissed', 'true');
  };

  return (
    <div className="w-full lg:h-full">
      <section className="container flex flex-col gap-3 py-3 md:py-4 lg:h-full lg:min-h-0">
        <AnimatePresence>
          {showBetaBanner && (
            <motion.div
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 flex-shrink-0 overflow-hidden"
            >
              <div className="flex items-center gap-2.5">
                <FlaskConical className="w-4 h-4 flex-shrink-0" />
                <span>
                  {language === 'fr'
                    ? 'GëstuSaDine est en version bêta  certains bugs peuvent survenir.'
                    : 'GëstuSaDine is in beta  some bugs may occur.'}
                </span>
              </div>
              <button
                type="button"
                onClick={dismissBeta}
                className="flex-shrink-0 rounded-lg p-1 hover:bg-amber-100 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="flex-shrink-0">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-1">
              {t('dashboard.sectionLabel')}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('dashboard.titlePrefix')}{" "}
              <span className="text-gradient">{t('dashboard.titleHighlight')}</span>
            </h1>
          </div>
        </header>

        {/* At-a-glance stats (reference-inspired) */}
        <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${!isFree ? 'lg:grid-cols-3' : ''} flex-shrink-0`}>
          {[
            { icon: Trophy, label: language === 'fr' ? 'Rang' : 'Rank', value: stats.rank, sub: `${stats.totalXp.toLocaleString()} XP`, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { icon: Flame, label: language === 'fr' ? "Jours d'affilée" : 'Day streak', value: stats.streak, sub: language === 'fr' ? 'en cours' : 'in a row', color: 'text-orange-500', bg: 'bg-orange-500/10' },
            ...(!isFree ? [{ icon: Target, label: 'Quiz', value: stats.quizzesTaken, sub: `${stats.perfectScores} ${language === 'fr' ? 'parfaits' : 'perfect'}`, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }] : []),
          ].map(({ icon: Icon, label, value, sub, color, bg }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="islamic-card p-3 sm:p-4 flex flex-row items-center justify-between gap-2 sm:gap-3"
            >
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1 truncate">{label}</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground leading-none truncate">{value}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>
              </div>
              <div className={`flex-shrink-0 p-2 sm:p-2.5 rounded-xl ${bg}`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main content — single 4x2 grid fills viewport */}
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:flex-1 lg:min-h-0 auto-rows-fr">
          {/* Ayah / reminder — spans 2 cols x 2 rows */}
          <div className="islamic-card md:col-span-2 lg:row-span-2 relative overflow-hidden group flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />
            <div className="relative p-4 md:p-5 flex flex-col justify-between flex-1 gap-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                    {t('dashboard.ayahOfTheDay')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {daily?.ayah.reference ?? (loadingDaily ? t('dashboard.loading') : "")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center flex-1 min-h-0 gap-2 overflow-y-auto">
                <p className="font-arabic text-2xl md:text-3xl lg:text-4xl leading-[1.8] text-foreground text-center break-words w-full">
                  {daily?.ayah.arabic ?? (loadingDaily ? "…" : "")}
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic text-center w-full">
                  {daily?.ayah.translation ??
                    (loadingDaily ? t('dashboard.ayahLoading') : t('dashboard.ayahError'))}
                </p>
              </div>
            </div>
          </div>

          {/* Today summary */}
          <div className="islamic-card p-3 md:p-4 relative overflow-hidden group flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col flex-1 h-full gap-1.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                    {t('dashboard.todayLabel')}
                  </p>
                  <p className="font-semibold text-foreground text-sm">
                    {daily?.gregorianDate ? new Date(daily.gregorianDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : ""}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {daily?.hijriDate ?? (loadingDaily ? t('dashboard.loading') : "")}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <div className="p-1 bg-accent/10 rounded-lg">
                    <Sun className="w-3 h-3" />
                  </div>
                  <div className="p-1 bg-secondary/10 rounded-lg">
                    <MoonStar className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <div className="flex-1 flex items-center">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {t('dashboard.todaySummary')}
                </p>
              </div>
              <button
                onClick={() => setShowReminder(!showReminder)}
                className="btn-islamic w-full hover:scale-[1.02] transition-transform text-xs py-1.5"
              >
                {t('dashboard.openReminder')}
              </button>
            </div>
          </div>

          {/* Rank + Daily Goals */}
          <div className="flex flex-col gap-3 min-h-0">
            <RankDisplay currentRank={stats.rank} currentPoints={stats.totalXp} streak={stats.streak} />
            <DailyGoals streak={stats.streak} />
          </div>

          {/* Dua */}
          <div className="islamic-card p-3 md:p-4 relative overflow-hidden group flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col flex-1 gap-1.5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                {t('dashboard.dailyDua')}
              </p>
              <div className="flex-1 flex flex-col justify-center min-h-0">
                <p className="font-arabic text-lg md:text-xl text-foreground text-right leading-relaxed">
                  {daily?.dua.arabic ?? (loadingDaily ? "…" : "")}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  {daily?.dua.translation ??
                    (loadingDaily ? t('dashboard.dailyDuaLoading') : t('dashboard.dailyDuaError'))}
                </p>
              </div>
            </div>
          </div>

          {/* Fact */}
          <div className="islamic-card p-3 md:p-4 relative overflow-hidden group flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col flex-1 gap-1.5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                {t('dashboard.smallFact')}
              </p>
              <div className="flex-1 flex items-center min-h-0 overflow-y-auto">
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {daily?.fact ??
                    (loadingDaily ? t('dashboard.factLoading') : t('dashboard.factError'))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reminder Modal */}
        {showReminder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReminder(false)}>
            <div className="islamic-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  {language === 'fr' ? "Rappel du jour" : "Today's Reminder"}
                </h2>
                <button onClick={() => setShowReminder(false)} className="text-muted-foreground hover:text-foreground">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                {/* Daily Action */}
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    {language === 'fr' ? "Action du jour" : "Today's Action"}
                  </p>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    {daily?.action ?? (loadingDaily ? "…" : "—")}
                  </p>
                </div>

                {/* Hadith */}
                <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    {language === 'fr' ? "Hadith du jour" : "Hadith of the Day"}
                  </p>
                  <p className="font-arabic text-lg text-foreground mb-3 text-right leading-relaxed">
                    {daily?.hadith.arabic ?? (loadingDaily ? "…" : "—")}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    {daily?.hadith.translation ?? ""}
                  </p>
                  <p className="text-xs text-muted-foreground/60">{daily?.hadith.source ?? ""}</p>
                </div>
              </div>
            </div>
          </div>
        )}


      </section>
    </div>
  );
};

export default Dashboard;
