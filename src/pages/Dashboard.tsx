import * as React from "react";
import { Sparkles, Sun, MoonStar, HelpCircle, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type LanguageCode = "wo" | "fr" | "en";
type Difficulty = "easy" | "medium" | "advanced";

const quizByLanguage: Record<
  LanguageCode,
  Record<Difficulty, { question: string; options: string[]; correct: string; hint: string }>
> = {
  en: {
    easy: {
      question: "How many daily obligatory prayers are there in Islam?",
      options: ["Three", "Five", "Seven"],
      correct: "Five",
      hint: "Think of Fajr, Dhuhr, ʿAsr, Maghrib, ʿIshāʾ.",
    },
    medium: {
      question:
        "In Maliki fiqh, what is one key condition for following an imām in congregational prayer?",
      options: [
        "Standing directly in front of the imām",
        "Intending to follow the imām at the beginning of the prayer",
        "Reciting Sūrat al-Fātiḥah aloud with the imām",
      ],
      correct: "Intending to follow the imām at the beginning of the prayer",
      hint: "It relates to your niyyah (intention).",
    },
    advanced: {
      question:
        "According to many Maliki jurists, when can local custom (ʿurf) be used in rulings?",
      options: [
        "Whenever it is popular, even if it contradicts Qurʾān and Sunnah",
        "When it does not oppose clear textual evidence and helps clarify contracts or practices",
        "Only in matters of pure worship (ʿibādāt)",
      ],
      correct:
        "When it does not oppose clear textual evidence and helps clarify contracts or practices",
      hint: "Custom cannot override explicit texts.",
    },
  },
  fr: {
    easy: {
      question: "Combien de prières obligatoires quotidiennes y a-t-il en Islam ?",
      options: ["Trois", "Cinq", "Sept"],
      correct: "Cinq",
      hint: "Pense à Fajr, Dhuhr, ʿAsr, Maghrib, ʿIshāʾ.",
    },
    medium: {
      question:
        "En fiqh malikite, quelle est une condition clé pour suivre l’imam en prière collective ?",
      options: [
        "Se tenir directement devant l’imam",
        "Avoir l’intention de suivre l’imam au début de la prière",
        "Réciter la Fātiḥa à voix haute avec l’imam",
      ],
      correct: "Avoir l’intention de suivre l’imam au début de la prière",
      hint: "Cela concerne la niyyah (intention).",
    },
    advanced: {
      question:
        "Selon de nombreux juristes malikites, quand peut-on utiliser la coutume locale (ʿurf) dans les règles ?",
      options: [
        "Chaque fois qu’elle est populaire, même si elle contredit le Coran et la Sunna",
        "Lorsqu’elle n’oppose pas un texte clair et aide à clarifier des contrats ou pratiques",
        "Uniquement dans les questions d’adoration (ʿibādāt)",
      ],
      correct:
        "Lorsqu’elle n’oppose pas un texte clair et aide à clarifier des contrats ou pratiques",
      hint: "La coutume ne peut pas contredire des textes explicites.",
    },
  },
  wo: {
    easy: {
      question: "Njulli yu séentu bu bépp bés ñaata la ci Islam ?",
      options: ["Ñetti", "Juroom", "Juróom-ñaari"],
      correct: "Juroom",
      hint: "Xool Fajr, Dhuhr, ʿAsr, Maghrib, ʿIshāʾ.",
    },
    medium: {
      question:
        "Ci fiqh Maliki, lan la benn xaalis bu am solo ngir topp imâm ci njulli bu jàmm ?",
      options: [
        "Taxaw ci kanam imâm",
        "Niyyah ngir topp imâm ci tàmbali njulli",
        "Waxal Sūrat al-Fātiḥah ci kaw ak imâm",
      ],
      correct: "Niyyah ngir topp imâm ci tàmbali njulli",
      hint: "Li jëm ci sa niyyah.",
    },
    advanced: {
      question:
        "Ni jurist yu bari ci Maliki wax, kan la ʿurf (àdetu dëkkuwaay) mën cee jariñu ci tegtal yi ?",
      options: [
        "Saa su nekk bu ne, su mel la muy di wacc Qurʼaan ak Sunna",
        "Su mu du séen ak mbind yu wér te mu dëgëral jëmmante ak jumtukaay yi",
        "Ci mbiri jaamu rekk (ʿibādāt)",
      ],
      correct: "Su mu du séen ak mbind yu wér te mu dëgëral jëmmante ak jumtukaay yi",
      hint: "Àdet mënul weñ wott mbind yu wér.",
    },
  },
};

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
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      translation: "Ya Rabb, yokkal ma xam-xam.",
    },
    fact: "Njulli juroom-ñaari waxtuñ bi lay setlu bésu musulmaan.",
  },
};

const uiText: Record<
  LanguageCode,
  {
    sectionLabel: string;
    titlePrefix: string;
    titleHighlight: string;
    intro: string;
    ayahOfTheDay: string;
    loading: string;
    ayahLoading: string;
    ayahError: string;
    todayLabel: string;
    todaySummary: string;
    openReminder: string;
    dailyDua: string;
    dailyDuaLoading: string;
    dailyDuaError: string;
    smallFact: string;
    factLoading: string;
    factError: string;
    weeklyQuiz: string;
    weeklyQuizSubtitle: string;
    easy: string;
    medium: string;
    advanced: string;
    checkAnswer: string;
    correctFeedback: string;
    wrongFeedbackPrefix: string;
  }
> = {
  en: {
    sectionLabel: "Daily Islam",
    titlePrefix: "Your calm space for",
    titleHighlight: "today's guidance",
    intro:
      "Reminders, duas, small facts, and a weekly quiz – a calm rhythm to keep your heart close to Allah throughout the week.",
    ayahOfTheDay: "Ayah of the day",
    loading: "Loading...",
    ayahLoading: "Loading today's ayah…",
    ayahError: "Unable to load today's ayah.",
    todayLabel: "Today",
    todaySummary:
      "A simple rhythm for today: one ayah, one hadith, one dua, and one small action you can hold onto.",
    openReminder: "Open today's reminder",
    dailyDua: "Daily dua",
    dailyDuaLoading: "Loading today's dua…",
    dailyDuaError: "Unable to load today's dua.",
    smallFact: "Small fact",
    factLoading: "Loading today's fact…",
    factError: "Unable to load today's fact.",
    weeklyQuiz: "Weekly quiz",
    weeklyQuizSubtitle: "One question, three levels.",
    easy: "Easy",
    medium: "Medium",
    advanced: "Advanced",
    checkAnswer: "Check answer",
    correctFeedback: "Beautiful, that is correct.",
    wrongFeedbackPrefix: "Not quite. Hint: ",
  },
  fr: {
    sectionLabel: "Islam au quotidien",
    titlePrefix: "Un espace calme pour",
    titleHighlight: "la guidance d'aujourd'hui",
    intro:
      "Rappels, invocations, petites connaissances et un quiz hebdomadaire – un rythme doux pour garder ton cœur proche d’Allah.",
    ayahOfTheDay: "Verset du jour",
    loading: "Chargement…",
    ayahLoading: "Chargement du verset du jour…",
    ayahError: "Impossible de charger le verset du jour.",
    todayLabel: "Aujourd'hui",
    todaySummary:
      "Un petit rythme pour aujourd'hui : un verset, un hadith, une douʿa et une petite action à garder.",
    openReminder: "Ouvrir le rappel du jour",
    dailyDua: "Douʿa du jour",
    dailyDuaLoading: "Chargement de la douʿa du jour…",
    dailyDuaError: "Impossible de charger la douʿa du jour.",
    smallFact: "Petit rappel",
    factLoading: "Chargement du rappel du jour…",
    factError: "Impossible de charger le rappel du jour.",
    weeklyQuiz: "Quiz de la semaine",
    weeklyQuizSubtitle: "Une question, trois niveaux.",
    easy: "Facile",
    medium: "Intermédiaire",
    advanced: "Avancé",
    checkAnswer: "Vérifier la réponse",
    correctFeedback: "Très bien, c’est correct.",
    wrongFeedbackPrefix: "Pas tout à fait. Indice : ",
  },
  wo: {
    sectionLabel: "Jàmmu Islam bii tey",
    titlePrefix: "Sa dëkk bu sukkandiku",
    titleHighlight: "cër yi tey",
    intro:
      "Tontu, duʿa, xam-xam yu ndaw ak quizu besub lakk – ngir nga dëppoo say xol ak Yàlla léegi léegi.",
    ayahOfTheDay: "Aaya bu bees",
    loading: "Mi ngi yeb…",
    ayahLoading: "Mi ngi yeb aaya bii…",
    ayahError: "Mënul yeb aaya bii.",
    todayLabel: "Tey",
    todaySummary:
      "Ci bés bii: benn aaya, benn hadith, benn duʿa ak benn jëf bu ndaw nga mën jëfandikoo.",
    openReminder: "Ubbi cuqalub bés bii",
    dailyDua: "Duʿa bu tey",
    dailyDuaLoading: "Mi ngi yeb duʿa bu tey…",
    dailyDuaError: "Mënul yeb duʿa bu tey.",
    smallFact: "Xam-xam bu ndaw",
    factLoading: "Mi ngi yeb xam-xam bu tey…",
    factError: "Mënul yeb xam-xam bu tey.",
    weeklyQuiz: "Quizu ayu-bés",
    weeklyQuizSubtitle: "Benn laaj, ñatte tollu.",
    easy: "Wóor-wóor",
    medium: "Dig-digg",
    advanced: "Xuux",
    checkAnswer: "Seet tontu bi",
    correctFeedback: "Baax na, tontu bi dëgg la.",
    wrongFeedbackPrefix: "Dul li. Wanaan: ",
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
          className={`flex-shrink-0 w-4 h-4 rounded border-2 transition-all ${
            completed
              ? 'bg-islamic-green-600 dark:bg-islamic-green border-islamic-green-600 dark:border-islamic-green'
              : 'border-islamic-dark/30 dark:border-slate-600 hover:border-islamic-green-600 dark:hover:border-islamic-green'
          }`}
          aria-label={`Mark ${prayer} as ${completed ? 'not completed' : 'completed'}`}
        >
          {completed && (
            <svg className="w-full h-full text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <span className={`text-xs flex-1 min-w-0 ${completed ? 'text-islamic-dark/50 dark:text-slate-500 line-through' : 'text-islamic-dark/70 dark:text-slate-300'}`}>
          {tGlobal(prayerKey)}
        </span>
      </div>
      <span className={`text-sm font-semibold flex-shrink-0 ${completed ? 'text-islamic-dark/50 dark:text-slate-500' : 'text-islamic-dark dark:text-slate-100'}`}>
        {time}
      </span>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { language } = useLanguage();
  const [difficulty, setDifficulty] = React.useState<Difficulty>("easy");
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null,
  );
  const [submitted, setSubmitted] = React.useState(false);
  const [loadingDaily, setLoadingDaily] = React.useState(true);
  const [daily, setDaily] = React.useState<DailyData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const t = uiText[language];
  const tGlobal = useLanguage().t;
  const quiz = quizByLanguage[language][difficulty];
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
            <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 dark:text-slate-400 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
              {t.sectionLabel}
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-islamic-dark dark:text-slate-100">
              {t.titlePrefix}{" "}
              <span className="text-gradient">{t.titleHighlight}</span>
            </h1>
          </div>
        </header>

        <div className="grid gap-3 md:grid-cols-3 flex-1 min-h-0">
          {/* Ayah / reminder */}
          <div className="islamic-card col-span-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-islamic-green/10 via-islamic-blue/5 to-islamic-gold/10 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-islamic-gold/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />
            <div className="relative p-6 h-full flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60 dark:text-slate-400 mb-1 font-semibold">
                    {t.ayahOfTheDay}
                  </p>
                  <p className="text-sm text-islamic-dark/70 dark:text-slate-300 font-medium">
                    {daily?.ayah.reference ?? (loadingDaily ? t.loading : "")}
                  </p>
                </div>
                <div className="p-2 bg-islamic-gold/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-islamic-gold" />
                </div>
              </div>

              <div className="space-y-4 flex flex-col items-center justify-center">
                <p className="font-arabic text-3xl md:text-4xl lg:text-5xl leading-relaxed text-islamic-dark/95 dark:text-slate-100 min-h-[4rem] text-center">
                  {daily?.ayah.arabic ?? (loadingDaily ? "…" : "")}
                </p>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-islamic-gold/30 to-transparent" />

                <p className="text-base md:text-lg text-islamic-dark/85 dark:text-slate-200 leading-relaxed italic text-center max-w-2xl">
                  {daily?.ayah.translation ??
                    (loadingDaily ? t.ayahLoading : t.ayahError)}
                </p>
              </div>
            </div>
          </div>

          {/* Today summary */}
          <div className="islamic-card p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-islamic-blue/5 to-islamic-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60 dark:text-slate-400 mb-1 font-semibold">
                    {t.todayLabel}
                  </p>
                  <p className="font-semibold text-islamic-dark dark:text-slate-100 text-base">
                    {daily?.gregorianDate ? new Date(daily.gregorianDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'wo' ? 'wo-SN' : 'en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) : ""}
                  </p>
                  <p className="font-medium text-islamic-dark/80 dark:text-slate-300 mt-1 text-xs">
                    {daily?.hijriDate ?? (loadingDaily ? t.loading : "")}
                  </p>
                </div>
                <div className="flex gap-1 text-islamic-gold">
                  <div className="p-1.5 bg-islamic-gold/10 rounded-lg">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="p-1.5 bg-islamic-blue/10 rounded-lg">
                    <MoonStar className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-islamic-dark/70 dark:text-slate-300 mb-3 leading-relaxed">
                {t.todaySummary}
              </p>
              <button 
                onClick={() => setShowReminder(!showReminder)}
                className="btn-islamic w-full hover:scale-[1.02] transition-transform text-sm py-2"
              >
                {t.openReminder}
              </button>
            </div>
          </div>
        </div>

        {/* Reminder Modal/Expanded */}
        {showReminder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReminder(false)}>
            <div className="islamic-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-islamic-dark dark:text-slate-100">{tGlobal('dashboard.todays_reminder')}</h2>
                <button 
                  onClick={() => setShowReminder(false)}
                  className="text-islamic-dark/60 dark:text-slate-400 hover:text-islamic-dark dark:hover:text-slate-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                {/* Prayer Times Summary */}
                {prayerTimes && (
                  <div className="p-4 bg-islamic-green/5 rounded-lg border border-islamic-green/20">
                    <p className="text-sm font-semibold text-islamic-dark/60 dark:text-slate-400 mb-3">{tGlobal('dashboard.todays_prayer_times')}</p>
                    <div className="grid grid-cols-5 gap-2">
                      <div className="text-center">
                        <p className="text-xs text-islamic-dark/60 dark:text-slate-400 mb-1">{tGlobal('dashboard.prayer.fajr')}</p>
                        <p className="text-sm font-semibold text-islamic-dark dark:text-slate-100">{prayerTimes.fajr}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-islamic-dark/60 dark:text-slate-400 mb-1">{tGlobal('dashboard.prayer.dhuhr')}</p>
                        <p className="text-sm font-semibold text-islamic-dark dark:text-slate-100">{prayerTimes.dhuhr}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-islamic-dark/60 dark:text-slate-400 mb-1">{tGlobal('dashboard.prayer.asr')}</p>
                        <p className="text-sm font-semibold text-islamic-dark dark:text-slate-100">{prayerTimes.asr}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-islamic-dark/60 dark:text-slate-400 mb-1">{tGlobal('dashboard.prayer.maghrib')}</p>
                        <p className="text-sm font-semibold text-islamic-dark dark:text-slate-100">{prayerTimes.maghrib}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-islamic-dark/60 dark:text-slate-400 mb-1">{tGlobal('dashboard.prayer.isha')}</p>
                        <p className="text-sm font-semibold text-islamic-dark dark:text-slate-100">{prayerTimes.isha}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Daily Action */}
                <div className="p-4 bg-islamic-gold/5 rounded-lg border border-islamic-gold/20">
                  <p className="text-sm font-semibold text-islamic-dark/60 dark:text-slate-400 mb-2">{tGlobal('dashboard.todays_action')}</p>
                  <p className="text-base text-islamic-dark/90 dark:text-slate-200 leading-relaxed">
                    {tGlobal('dashboard.action_text')}
                  </p>
                </div>

                {/* Hadith */}
                <div className="p-4 bg-islamic-blue/5 rounded-lg border border-islamic-blue/20">
                  <p className="text-sm font-semibold text-islamic-dark/60 dark:text-slate-400 mb-2">{tGlobal('dashboard.hadith_of_the_day')}</p>
                  <p className="font-arabic text-lg text-islamic-dark/95 dark:text-slate-100 mb-3 text-right leading-relaxed">
                    {tGlobal('dashboard.hadith_text')}
                  </p>
                  <p className="text-xs text-islamic-dark/60 dark:text-slate-400">{tGlobal('dashboard.source_authentic_hadith')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prayer Times, Duas, Facts, Quiz */}
        <div className="grid gap-3 md:grid-cols-4 flex-1 min-h-0">
          {/* Today's Prayer Times */}
          <div className="islamic-card p-5 space-y-3 relative overflow-hidden group flex flex-col md:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-islamic-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col flex-1">
              <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60 dark:text-slate-400 mb-2 font-semibold">
                {tGlobal('dashboard.prayer_times')}
              </p>
              {loadingPrayers ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xs text-islamic-dark/60 dark:text-slate-400">{t.loading}</p>
                </div>
              ) : prayerTimes ? (
                <div className="flex-1 flex flex-col justify-center space-y-1.5">
                  {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((prayer) => (
                    <PrayerItem
                      key={prayer}
                      prayer={prayer}
                      time={prayerTimes[prayer]}
                      prayerKey={`dashboard.prayer.${prayer}`}
                      tGlobal={tGlobal}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xs text-islamic-dark/60 dark:text-slate-400 text-center">{tGlobal('dashboard.enable_location')}</p>
                </div>
              )}
            </div>
          </div>

          <div className="islamic-card p-5 space-y-3 relative overflow-hidden group flex flex-col md:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-islamic-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col flex-1">
              <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60 dark:text-slate-400 mb-2 font-semibold">
                {t.dailyDua}
              </p>
              <div className="flex-1 flex flex-col justify-center">
                <p className="font-arabic text-2xl md:text-3xl text-islamic-dark/95 dark:text-slate-100 mb-3 text-right leading-relaxed min-h-[3rem]">
                  {daily?.dua.arabic ?? (loadingDaily ? "…" : "")}
                </p>
                <div className="h-px bg-gradient-to-r from-transparent via-islamic-green/20 to-transparent mb-2" />
                <p className="text-sm text-islamic-dark/80 dark:text-slate-200 leading-relaxed">
                  {daily?.dua.translation ??
                    (loadingDaily ? t.dailyDuaLoading : t.dailyDuaError)}
                </p>
              </div>
            </div>
          </div>

          <div className="islamic-card p-5 space-y-3 relative overflow-hidden group flex flex-col md:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-islamic-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col flex-1">
              <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60 dark:text-slate-400 mb-2 font-semibold">
                {t.smallFact}
              </p>
              <div className="flex-1 flex items-center">
                <p className="text-sm md:text-base text-islamic-dark/80 dark:text-slate-200 leading-relaxed">
                  {daily?.fact ??
                    (loadingDaily ? t.factLoading : t.factError)}
                </p>
              </div>
            </div>
          </div>

          <div className="islamic-card p-4 space-y-3 relative overflow-hidden group flex flex-col md:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-islamic-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col flex-1 min-h-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-[0.16em] text-islamic-dark/60 dark:text-slate-400 font-semibold">
                    {t.weeklyQuiz}
                  </p>
                  <p className="text-xs text-islamic-dark/80 dark:text-slate-300 mt-0.5">
                    {t.weeklyQuizSubtitle}
                  </p>
                </div>
                <div className="p-1.5 bg-islamic-gold/10 rounded-lg flex-shrink-0 ml-2">
                  <HelpCircle className="w-3.5 h-3.5 text-islamic-gold" />
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
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors ${
                    difficulty === "easy"
                      ? "bg-islamic-green-600 text-white border-islamic-green-600 dark:bg-islamic-green dark:text-slate-900"
                      : "bg-islamic-green/10 dark:bg-islamic-green/20 text-islamic-green-600 dark:text-islamic-green border-transparent"
                  }`}
                >
                  {t.easy}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDifficulty("medium");
                    setSelectedOption(null);
                    setSubmitted(false);
                  }}
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors ${
                    difficulty === "medium"
                      ? "bg-islamic-gold text-white border-islamic-gold dark:bg-slate-700 dark:text-slate-100"
                      : "bg-islamic-gold/10 dark:bg-slate-700/50 text-islamic-gold dark:text-slate-300 border-transparent"
                  }`}
                >
                  {t.medium}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDifficulty("advanced");
                    setSelectedOption(null);
                    setSubmitted(false);
                  }}
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors ${
                    difficulty === "advanced"
                      ? "bg-islamic-blue text-white border-islamic-blue dark:bg-blue-600"
                      : "bg-islamic-blue/10 dark:bg-blue-900/30 text-islamic-blue dark:text-blue-400 border-transparent"
                  }`}
                >
                  {t.advanced}
                </button>
              </div>

              <p className="text-[11px] leading-tight text-islamic-dark/90 dark:text-slate-200 mb-2 line-clamp-2">{quiz.question}</p>

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
                      className={`w-full text-left text-[10px] px-2 py-1.5 rounded-lg border transition-colors ${
                        correct
                          ? "border-green-600 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                          : wrong
                            ? "border-red-600 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                            : selected
                              ? "border-islamic-green-600 dark:border-islamic-green bg-islamic-green/5 dark:bg-islamic-green/20 text-islamic-green-600 dark:text-islamic-green"
                              : "border-islamic-cream dark:border-slate-700 bg-[#efefec]/60 dark:bg-slate-800/60 text-islamic-dark/80 dark:text-slate-200 hover:bg-islamic-cream/40 dark:hover:bg-slate-700/60"
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
                {t.checkAnswer}
              </button>

              {submitted && (
                <p
                  className={`mt-1 text-[10px] leading-tight ${
                    isCorrect ? "text-green-700 dark:text-green-300" : "text-islamic-dark/75 dark:text-slate-300"
                  }`}
                >
                  {isCorrect
                    ? t.correctFeedback
                    : `${t.wrongFeedbackPrefix}${quiz.hint}`}
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


