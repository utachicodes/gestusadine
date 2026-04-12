import * as React from "react";
import { Sparkles, Sun, MoonStar, HelpCircle, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CreditUsageWidget } from "@/components/subscription/CreditUsageWidget";
import { RankDisplay } from "@/components/gamification/RankDisplay";
import { BadgeList, BadgeType } from "@/components/gamification/BadgeList";

type LanguageCode = "fr" | "en";
type Difficulty = "easy" | "medium" | "advanced";


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
  wo: {
    gregorianDate: getCurrentDateFormatted('EU'),
    hijriDate: "25 Jumādā al-Thānī 1447",
    ayah: {
      reference: "Al-Baqara 2:286",
      arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
      translation:
        "Yàlla du jël ci koro jigeen walla góor lu gën sàmm ndigalu moom.",
    },
    dua: {
      arabic: "رَبِّ زIDNII CILMĀ",
      translation: "Ya Rabb, yokkal ma xam-xam.",
    },
    fact: "Njulli juroom-ñaari waxtuñ bi lay setlu bésu musulmaan.",
  },
};

// Prayer tracking component to avoid hooks in map
const PrayerItem: React.FC<{
  prayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  time: string;
  prayerKey: string;
  tGlobal: (key: string) => string;
}> = ({ prayer, time, prayerKey, tGlobal }) => {
  const storageKey = `prayer_${prayer}_${new Date().toDateString()}`;
  const [completed, setCompleted] = React.useState(() => {
    return localStorage.getItem(storageKey) === 'true';
  });

  const handleToggle = () => {
    const newState = !completed;
    setCompleted(newState);
    localStorage.setItem(storageKey, newState.toString());
  };

  return (
    <div className="flex justify-between items-center py-1 group">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          type="button"
          onClick={handleToggle}
          className={`flex-shrink-0 w-4 h-4 rounded border-2 transition-all ${completed
            ? 'bg-primary border-primary'
            : 'border-muted-foreground/30 hover:border-primary'
            }`}
          aria-label={`Mark ${prayer} as ${completed ? 'not completed' : 'completed'}`}
        >
          {completed && (
            <svg className="w-full h-full text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <span className={`text-xs flex-1 min-w-0 ${completed ? 'text-muted-foreground line-through' : 'text-muted-foreground'}`}>
          {tGlobal(prayerKey)}
        </span>
      </div>
      <span className={`text-sm font-semibold flex-shrink-0 ${completed ? 'text-muted-foreground' : 'text-foreground'}`}>
        {time}
      </span>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const [difficulty, setDifficulty] = React.useState<Difficulty>("easy");
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null,
  );
  const [submitted, setSubmitted] = React.useState(false);
  const [loadingDaily, setLoadingDaily] = React.useState(true);
  const [daily, setDaily] = React.useState<DailyData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Quiz content derived from translations
  const quiz = {
    question: t(`quiz.${difficulty}.question`),
    options: [
      t(`quiz.${difficulty}.options.0`),
      t(`quiz.${difficulty}.options.1`),
      t(`quiz.${difficulty}.options.2`),
    ],
    correct: t(`quiz.${difficulty}.correct`),
    hint: t(`quiz.${difficulty}.hint`),
  };

  const isCorrect = submitted && selectedOption === quiz.correct;

  React.useEffect(() => {
    const fetchDaily = async () => {
      setLoadingDaily(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiUrl}/api/daily`);
        if (!response.ok) throw new Error('Failed to fetch daily content');
        const data = await response.json();

        // Map API response to DailyData format
        const mappedData: DailyData = {
          gregorianDate: data.gregorianDate,
          hijriDate: data.hijriDate,
          ayah: {
            reference: data.ayah.reference,
            arabic: data.ayah.arabic,
            translation: data.ayah.translation,
          },
          dua: {
            arabic: data.dua.arabic,
            translation: data.dua.translation,
          },
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
  }, [language]);

  const [showReminder, setShowReminder] = React.useState(false);
  const [prayerTimes, setPrayerTimes] = React.useState<{
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  } | null>(null);
  const [loadingPrayers, setLoadingPrayers] = React.useState(false);

  // Get user location and fetch today's prayer times
  React.useEffect(() => {
    const fetchTodayPrayerTimes = async () => {
      setLoadingPrayers(true);
      try {
        const fetchForLocation = async (lat: number, lng: number) => {
          const today = new Date();
          const day = String(today.getDate()).padStart(2, '0');
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const year = today.getFullYear();

          try {
            const response = await fetch(
              `http://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lng}&method=2`
            );
            const data = await response.json();
            const dayData = data.data?.find((d: any) => d.date.gregorian.day === day);
            if (dayData) {
              setPrayerTimes({
                fajr: dayData.timings.Fajr?.substring(0, 5) || '--:--',
                dhuhr: dayData.timings.Dhuhr?.substring(0, 5) || '--:--',
                asr: dayData.timings.Asr?.substring(0, 5) || '--:--',
                maghrib: dayData.timings.Maghrib?.substring(0, 5) || '--:--',
                isha: dayData.timings.Isha?.substring(0, 5) || '--:--',
              });
            }
          } catch (err) {
            console.error('Error fetching prayer times:', err);
          }
        };

        // Try to get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              await fetchForLocation(position.coords.latitude, position.coords.longitude);
            },
            () => {
              // Default to Dakar, Senegal if location access denied
              fetchForLocation(14.7167, -17.4677);
            }
          );
        } else {
          // Default to Dakar, Senegal if geolocation not available
          fetchForLocation(14.7167, -17.4677);
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      } finally {
        setLoadingPrayers(false);
      }
    };

    fetchTodayPrayerTimes();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      <section className="container py-3 md:py-4 space-y-3 flex-1 flex flex-col min-h-0">
        <header className="mb-2">
          <div>
            <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-muted-foreground mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
              {t('dashboard.sectionLabel')}
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              {t('dashboard.titlePrefix')}{" "}
              <span className="text-gradient">{t('dashboard.titleHighlight')}</span>
            </h1>
          </div>
        </header>

        <div className="grid gap-3 md:grid-cols-4 flex-1 min-h-0">
          {/* Ayah / reminder */}
          <div className="islamic-card md:col-span-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />
            <div className="relative p-6 h-full flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1 font-semibold">
                    {t('dashboard.ayahOfTheDay')}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {daily?.ayah.reference ?? (loadingDaily ? t('dashboard.loading') : "")}
                  </p>
                </div>
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-accent-foreground" />
                </div>
              </div>

              <div className="space-y-4 flex flex-col items-center justify-center">
                <p className="font-arabic text-3xl md:text-4xl lg:text-5xl leading-relaxed text-foreground min-h-[4rem] text-center">
                  {daily?.ayah.arabic ?? (loadingDaily ? "…" : "")}
                </p>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

                <p className="text-base md:text-lg text-muted-foreground leading-relaxed italic text-center max-w-2xl">
                  {daily?.ayah.translation ??
                    (loadingDaily ? t('dashboard.ayahLoading') : t('dashboard.ayahError'))}
                </p>
              </div>
            </div>
          </div>

          {/* Today summary */}
          <div className="islamic-card p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
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
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {t('dashboard.todaySummary')}
              </p>
              <button
                onClick={() => setShowReminder(!showReminder)}
                className="btn-islamic w-full hover:scale-[1.02] transition-transform text-sm py-2"
              >
                {t('dashboard.openReminder')}
              </button>
            </div>
          </div>

          {/* Credit Usage Widget */}
          {/* Credit Usage Widget replaced by Rank Display */}
          <CreditUsageWidget />
          <div className="md:col-span-1 space-y-4">
            <RankDisplay currentRank="Talib" currentPoints={45} />

            <div className="islamic-card p-4">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-islamic-gold" /> Your Badges
              </h3>
              <BadgeList badges={['Founding Member', 'Explorer', 'Beta Tester']} />
            </div>
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
                {/* Prayer Times Summary */}
                {prayerTimes && (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm font-semibold text-muted-foreground mb-3">{t('dashboard.todays_prayer_times')}</p>
                    <div className="grid grid-cols-5 gap-2">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">{t('dashboard.prayer.fajr')}</p>
                        <p className="text-sm font-semibold text-foreground">{prayerTimes.fajr}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">{t('dashboard.prayer.dhuhr')}</p>
                        <p className="text-sm font-semibold text-foreground">{prayerTimes.dhuhr}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">{t('dashboard.prayer.asr')}</p>
                        <p className="text-sm font-semibold text-foreground">{prayerTimes.asr}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">{t('dashboard.prayer.maghrib')}</p>
                        <p className="text-sm font-semibold text-foreground">{prayerTimes.maghrib}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">{t('dashboard.prayer.isha')}</p>
                        <p className="text-sm font-semibold text-foreground">{prayerTimes.isha}</p>
                      </div>
                    </div>
                  </div>
                )}

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
                  <p className="text-xs text-muted-foreground">{t('dashboard.source_authentic_hadith')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prayer Times, Duas, Facts, Quiz */}
        <div className="grid gap-3 md:grid-cols-4 flex-1 min-h-0">
          {/* Today's Prayer Times */}
          <div className="islamic-card p-5 space-y-3 relative overflow-hidden group flex flex-col md:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col flex-1">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2 font-semibold">
                {t('dashboard.prayer_times')}
              </p>
              {loadingPrayers ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">{t('dashboard.loading')}</p>
                </div>
              ) : prayerTimes ? (
                <div className="flex-1 flex flex-col justify-center space-y-1.5">
                  {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((prayer) => (
                    <PrayerItem
                      key={prayer}
                      prayer={prayer}
                      time={prayerTimes[prayer]}
                      prayerKey={`dashboard.prayer.${prayer}`}
                      tGlobal={t}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xs text-muted-foreground text-center">{t('dashboard.enable_location')}</p>
                </div>
              )}
            </div>
          </div>

          <div className="islamic-card p-5 space-y-3 relative overflow-hidden group flex flex-col md:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col flex-1">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2 font-semibold">
                {t('dashboard.dailyDua')}
              </p>
              <div className="flex-1 flex flex-col justify-center">
                <p className="font-arabic text-2xl md:text-3xl text-foreground mb-3 text-right leading-relaxed min-h-[3rem]">
                  {daily?.dua.arabic ?? (loadingDaily ? "…" : "")}
                </p>
                <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-2" />
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

          <div className="islamic-card p-4 space-y-3 relative overflow-hidden group flex flex-col md:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col flex-1 min-h-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                    {t('dashboard.weeklyQuiz')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('dashboard.weeklyQuizSubtitle')}
                  </p>
                </div>
                <div className="p-1.5 bg-accent/10 rounded-lg flex-shrink-0 ml-2">
                  <HelpCircle className="w-3.5 h-3.5 text-accent-foreground" />
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setDifficulty("easy");
                    setSelectedOption(null);
                    setSubmitted(false);
                  }}
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors ${difficulty === "easy"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-primary/10 text-primary border-transparent hover:bg-primary/20"
                    }`}
                >
                  {t('dashboard.easy')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDifficulty("medium");
                    setSelectedOption(null);
                    setSubmitted(false);
                  }}
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors ${difficulty === "medium"
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-accent/10 text-accent-foreground border-transparent hover:bg-accent/20"
                    }`}
                >
                  {t('dashboard.medium')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDifficulty("advanced");
                    setSelectedOption(null);
                    setSubmitted(false);
                  }}
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors ${difficulty === "advanced"
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "bg-secondary/10 text-secondary-foreground border-transparent hover:bg-secondary/20"
                    }`}
                >
                  {t('dashboard.advanced')}
                </button>
              </div>

              <p className="text-[11px] leading-tight text-foreground mb-2 line-clamp-2">{quiz.question}</p>

              <div className="space-y-1 flex-1 min-h-0 overflow-y-auto">
                {quiz.options.map((option) => {
                  const selected = selectedOption === option;
                  const correct = submitted && option === quiz.correct;
                  const wrong = submitted && selected && !correct;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedOption(option);
                        setSubmitted(false);
                      }}
                      disabled={submitted}
                      className={`w-full text-left text-[10px] px-2 py-1.5 rounded-lg border transition-colors ${correct
                        ? "border-primary bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-foreground"
                        : wrong
                          ? "border-destructive bg-destructive/10 dark:bg-destructive/20 text-destructive dark:text-destructive-foreground"
                          : selected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-card text-muted-foreground hover:bg-muted"
                        } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span className="line-clamp-2">{option}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!selectedOption) return;
                  setSubmitted(true);
                }}
                disabled={!selectedOption || submitted}
                className="btn-islamic-outlined w-full mt-2 flex items-center justify-center gap-1 text-[10px] py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Star className="w-3 h-3" />
                {t('dashboard.checkAnswer')}
              </button>

              {submitted && (
                <p
                  className={`mt-1 text-[10px] leading-tight ${isCorrect ? "text-primary dark:text-primary-foreground" : "text-muted-foreground"
                    }`}
                >
                  {isCorrect
                    ? t('dashboard.correctFeedback')
                    : `${t('dashboard.wrongFeedbackPrefix')}${quiz.hint}`}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
