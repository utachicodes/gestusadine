import * as React from "react";
import { Sun, MoonStar, Trophy, Flame, Target, X, FlaskConical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { RankDisplay } from "@/components/gamification/RankDisplay";
import { useProfileStats } from "@/data/profile";
import { useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";

type LanguageCode = "fr" | "en";


interface DailyData {
  gregorianDate: string;
  hijriDate: string;
  ayah: {
    reference: string;
    arabic: string;
    translation: string;
  };
  dua: {
    arabic: string;
    translation: string;
  };
  fact: string;
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
  hijriDate: "25 Jumādā al-Thānī 1447",
  ayah: {
    reference: "Al-Baqarah 2:286",
    arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah does not burden a soul beyond what it can bear.",
  },
  dua: {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translation: "My Lord, increase me in knowledge.",
  },
  fact: "The five daily prayers were made obligatory during the Night Journey (al-Isrāʾ wal-Miʿrāj).",
};

const MOCK_DAILY_BY_LANG: Record<LanguageCode, DailyData> = {
  en: MOCK_DAILY,
  fr: {
    gregorianDate: getCurrentDateFormatted('US'),
    hijriDate: "25 Jumādā al-Thānī 1447",
    ayah: {
      reference: "Al-Baqara 2:286",
      arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
      translation:
        "Allah n'impose à aucune âme une charge supérieure à sa capacité.",
    },
    dua: {
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      translation: "Seigneur, augmente-moi en science.",
    },
    fact: "Les cinq prières obligatoires rythment la journée du musulman, de l’aube à la nuit.",
  },
};

const Dashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const convex = useConvex();
  const stats = useProfileStats();
  const [loadingDaily, setLoadingDaily] = React.useState(true);
  const [daily, setDaily] = React.useState<DailyData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchDaily = async () => {
      setLoadingDaily(true);
      setError(null);
      try {
        const data = await convex.query(api.daily.getDaily);

        // Fetch Hijri date client-side via AlAdhan API
        let hijriDate = "Hijri date unavailable";
        try {
          const now = new Date(data.gregorianDate);
          const day = String(now.getDate()).padStart(2, "0");
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const year = now.getFullYear();

          const url = `https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`;
          const res = await fetch(url);
          if (res.ok) {
            const payload = (await res.json()) as any;
            const hijri = payload?.data?.hijri;
            if (hijri) {
              hijriDate = `${hijri.day} ${hijri.month?.en} ${hijri.year}`;
            }
          }
        } catch (err) {
          console.error("Error fetching Hijri date:", err);
        }

        // Map API response to DailyData format
        const mappedData: DailyData = {
          gregorianDate: data.gregorianDate,
          hijriDate,
          ayah: data.ayah,
          dua: data.dua,
          fact: data.fact,
        };
        setDaily(mappedData);
      } catch (err) {
        console.error('Error fetching daily content:', err);
        setError('Failed to load daily content');
        // Fallback to mock data
        setDaily(MOCK_DAILY_BY_LANG[language]);
      } finally {
        setLoadingDaily(false);
      }
    };

    fetchDaily();
  }, [language, convex]);

  const [showReminder, setShowReminder] = React.useState(false);
  const [showBetaBanner, setShowBetaBanner] = React.useState(() => {
    return localStorage.getItem('gestu_beta_banner_dismissed') !== 'true';
  });

  const dismissBeta = () => {
    setShowBetaBanner(false);
    localStorage.setItem('gestu_beta_banner_dismissed', 'true');
  };

  return (
    <div className="w-full">
      <section className="container flex flex-col gap-4 py-4 md:py-6">
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
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex-shrink-0">
          {[
            { icon: Trophy, label: language === 'fr' ? 'Rang' : 'Rank', value: stats.rank, sub: `${stats.totalXp.toLocaleString()} XP` },
            { icon: Flame, label: language === 'fr' ? "Jours d'affilée" : 'Day streak', value: stats.streak, sub: language === 'fr' ? 'en cours' : 'in a row' },
            { icon: Target, label: 'Quiz', value: stats.quizzesTaken, sub: `${stats.perfectScores} ${language === 'fr' ? 'parfaits' : 'perfect'}` },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="islamic-card p-3 sm:p-4 flex flex-row items-center justify-between gap-2 sm:gap-3">
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1 truncate">{label}</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground leading-none truncate">{value}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>
              </div>
              <div className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-accent/50 text-primary">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Ayah / reminder */}
          <div className="islamic-card md:col-span-2 relative overflow-hidden group min-h-[320px] flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />
            <div className="relative p-6 flex flex-col justify-between flex-1 space-y-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1 font-semibold">
                    {t('dashboard.ayahOfTheDay')}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {daily?.ayah.reference ?? (loadingDaily ? t('dashboard.loading') : "")}
                  </p>
                </div>
              </div>

              <div className="space-y-4 flex flex-col items-center justify-center flex-1">
                <p className="font-arabic text-2xl md:text-3xl lg:text-4xl leading-[2] text-foreground text-center break-words w-full">
                  {daily?.ayah.arabic ?? (loadingDaily ? "…" : "")}
                </p>

                <p className="text-base md:text-lg text-muted-foreground leading-relaxed italic text-center w-full">
                  {daily?.ayah.translation ??
                    (loadingDaily ? t('dashboard.ayahLoading') : t('dashboard.ayahError'))}
                </p>
              </div>
            </div>
          </div>

          {/* Today summary */}
          <div className="islamic-card md:col-span-1 p-5 relative overflow-hidden group flex flex-col min-h-[320px]">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col flex-1 h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1 font-semibold">
                    {t('dashboard.todayLabel')}
                  </p>
                  <p className="font-semibold text-foreground text-base">
                    {daily?.gregorianDate ? new Date(daily.gregorianDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : ""}
                  </p>
                  <p className="font-medium text-muted-foreground mt-1 text-xs">
                    {daily?.hijriDate ?? (loadingDaily ? t('dashboard.loading') : "")}
                  </p>
                </div>
                <div className="flex gap-1 text-accent-foreground">
                  <div className="p-1.5 bg-accent/10 rounded-lg">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="p-1.5 bg-secondary/10 rounded-lg">
                    <MoonStar className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="flex-1 flex items-center mb-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('dashboard.todaySummary')}
                </p>
              </div>
              <button
                onClick={() => setShowReminder(!showReminder)}
                className="btn-islamic w-full hover:scale-[1.02] transition-transform text-sm py-2.5 mt-auto"
              >
                {t('dashboard.openReminder')}
              </button>
            </div>
          </div>

          {/* Rank */}
          <div className="md:col-span-1 space-y-3 min-h-[320px] flex flex-col">
            <RankDisplay currentRank={stats.rank} currentPoints={stats.totalXp} />
          </div>
        </div>

        {/* Reminder Modal/Expanded */}
        {showReminder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReminder(false)}>
            <div className="islamic-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">{t('dashboard.todays_reminder')}</h2>
                <button
                  onClick={() => setShowReminder(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                {/* Daily Action */}
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">{t('dashboard.todays_action')}</p>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    {t('dashboard.action_text')}
                  </p>
                </div>

                {/* Hadith */}
                <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">{t('dashboard.hadith_of_the_day')}</p>
                  <p className="font-arabic text-lg text-foreground mb-3 text-right leading-relaxed">
                    {t('dashboard.hadith_text')}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    {t('dashboard.hadith_translation')}
                  </p>
                  <p className="text-xs text-muted-foreground">{t('dashboard.source_authentic_hadith')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Duas, Facts, Quiz */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div className="islamic-card p-5 space-y-3 relative overflow-hidden group flex flex-col md:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col flex-1">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3 font-semibold">
                {t('dashboard.dailyDua')}
              </p>
              <div className="flex-1 flex flex-col justify-center">
                <p className="font-arabic text-2xl md:text-3xl text-foreground mb-3 text-right leading-relaxed min-h-[3rem]">
                  {daily?.dua.arabic ?? (loadingDaily ? "…" : "")}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {daily?.dua.translation ??
                    (loadingDaily ? t('dashboard.dailyDuaLoading') : t('dashboard.dailyDuaError'))}
                </p>
              </div>
            </div>
          </div>

          <div className="islamic-card p-5 space-y-3 relative overflow-hidden group flex flex-col md:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col flex-1">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2 font-semibold">
                {t('dashboard.smallFact')}
              </p>
              <div className="flex-1 flex items-center">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {daily?.fact ??
                    (loadingDaily ? t('dashboard.factLoading') : t('dashboard.factError'))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
