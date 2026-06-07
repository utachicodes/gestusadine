import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { Search, BookOpen, Bookmark, CheckCircle2, Flame } from 'lucide-react';
import { useTr, type Loc } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SURAHS } from '@/data/surahs';
import { api } from '../../../convex/_generated/api';

/** Total ayat in the Quran — used to weight reading progress by surah length. */
const TOTAL_VERSES = 6236;

/** Translation editions offered across the Quran reader (alquran.cloud, no key). */
export const TRANSLATION_EDITIONS: {
  id: string;
  label: string;
}[] = [
  { id: 'en.sahih', label: '🇬🇧 English  Saheeh International' },
  { id: 'en.pickthall', label: '🇬🇧 English  Pickthall' },
  { id: 'en.yusufali', label: '🇬🇧 English  Yusuf Ali' },
  { id: 'en.hilali', label: '🇬🇧 English  Hilali & Khan' },
  { id: 'en.asad', label: '🇬🇧 English  Muhammad Asad' },
  { id: 'fr.hamidullah', label: '🇫🇷 Français  Hamidullah' },
  { id: 'es.cortes', label: '🇪🇸 Español  Cortés' },
  { id: 'de.bubenheim', label: '🇩🇪 Deutsch  Bubenheim & Elyas' },
  { id: 'it.piccardo', label: '🇮🇹 Italiano  Piccardo' },
  { id: 'tr.diyanet', label: '🇹🇷 Türkçe  Diyanet İşleri' },
  { id: 'ru.kuliev', label: '🇷🇺 Русский  Kuliev' },
  { id: 'id.indonesian', label: '🇮🇩 Indonesia  Kemenag' },
  { id: 'ur.jalandhry', label: '🇵🇰 اردو  Jalandhry' },
  { id: 'bn.bengali', label: '🇧🇩 বাংলা  Muhiuddin Khan' },
];

const TRANSLATION_STORAGE_KEY = 'quran-translation';
const SAVED_STORAGE_KEY = 'quran-saved';

/** The translation edition that matches the app's UI language. */
function defaultEdition(lang: string): string {
  return lang === 'fr' ? 'fr.hamidullah' : 'en.sahih';
}

/** Safely read the persisted translation edition, falling back to the language default. */
function readTranslation(lang: string): string {
  try {
    const stored = localStorage.getItem(TRANSLATION_STORAGE_KEY);
    if (stored && TRANSLATION_EDITIONS.some((e) => e.id === stored)) {
      return stored;
    }
  } catch {
    /* ignore storage errors */
  }
  return defaultEdition(lang);
}

/** Safely read the persisted bookmarked surah numbers. */
function readSaved(): number[] {
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((n): n is number => typeof n === 'number');
    }
  } catch {
    /* ignore parse errors */
  }
  return [];
}

export default function Quran() {
  const tr = useTr();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [translation, setTranslation] = useState<string>(() => readTranslation(language));
  const [saved, setSaved] = useState<number[]>(() => readSaved());

  // Reading progress is tracked automatically (a surah is marked read when you
  // open it in the reader — see SurahView). This view is read-only.
  const progress = useQuery(api.quranProgress.get);
  const completedSurahs = useMemo(
    () => new Set<number>(progress?.completedSurahs ?? []),
    [progress],
  );
  const versesRead = useMemo(
    () => SURAHS.filter((s) => completedSurahs.has(s.number)).reduce((sum, s) => sum + s.verses, 0),
    [completedSurahs],
  );
  const readPercent = Math.round((versesRead / TOTAL_VERSES) * 100);

  // Refresh the saved count if the user returns from the reader.
  useEffect(() => {
    const onFocus = () => setSaved(readSaved());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Follow the app language: switching FR/EN updates the reader's translation
  // edition. Skips the first render so a stored choice is kept.
  const langInitialized = useRef(false);
  useEffect(() => {
    if (!langInitialized.current) {
      langInitialized.current = true;
      return;
    }
    const edition = defaultEdition(language);
    setTranslation(edition);
    try {
      localStorage.setItem(TRANSLATION_STORAGE_KEY, edition);
    } catch {
      /* ignore storage errors */
    }
  }, [language]);

  const handleTranslationChange = (value: string) => {
    setTranslation(value);
    try {
      localStorage.setItem(TRANSLATION_STORAGE_KEY, value);
    } catch {
      /* ignore storage errors */
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SURAHS;
    return SURAHS.filter((s) => {
      return (
        String(s.number) === q ||
        String(s.number).includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        s.arabicName.includes(query.trim())
      );
    });
  }, [query]);

  const revelationLabel = (rev: 'Meccan' | 'Medinan'): string =>
    rev === 'Meccan'
      ? tr({ en: 'Meccan', fr: 'Mecquoise' })
      : tr({ en: 'Medinan', fr: 'Médinoise' });

  const header: Loc = { en: 'The Noble Quran', fr: 'Le Noble Coran' };
  const subtitle: Loc = { en: 'Read, Understand & Reflect', fr: 'Lire, comprendre et méditer' };

  return (
    <div>
      <section className="container py-8 md:py-10 space-y-6">
        {/* Header */}
        <header>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
            {tr({ en: 'Recitation & Study', fr: 'Récitation et étude' })}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{tr(header)}</h1>
          <p className="mt-2 text-muted-foreground max-w-xl">{tr(subtitle)}</p>
        </header>

        {/* Controls */}
        <div className="islamic-card p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tr({
                  en: 'Search by name, number, or meaning...',
                  fr: 'Rechercher par nom, numéro ou sens...',
                })}
                className="pl-10"
              />
            </div>

            {/* Translation selector */}
            <Select value={translation} onValueChange={handleTranslationChange}>
              <SelectTrigger aria-label={tr({ en: 'Translation', fr: 'Traduction' })}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSLATION_EDITIONS.map((edition) => (
                  <SelectItem key={edition.id} value={edition.id}>
                    {edition.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Saved indicator */}
            <div className="inline-flex items-center justify-center gap-2 rounded-full bg-accent/50 text-accent-foreground px-4 py-2 text-sm font-medium whitespace-nowrap">
              <Bookmark className="h-4 w-4 text-primary" />
              {tr({ en: 'Saved', fr: 'Enregistrés' })} ({saved.length})
            </div>
          </div>
        </div>

        {/* Reading progress — auto-tracked as you read surahs */}
        <div className="islamic-card p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">
              {tr({ en: 'Your reading progress', fr: 'Votre progression de lecture' })}
            </h2>
            <span className="text-[11px] text-muted-foreground">
              {tr({ en: 'Auto-tracked as you read', fr: 'Suivi automatique pendant la lecture' })}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1">{tr({ en: 'Completion', fr: 'Achèvement' })}</p>
              <p className="text-2xl font-bold text-foreground leading-none">{readPercent}%</p>
              <p className="text-[11px] text-muted-foreground mt-1">{tr({ en: 'of the Quran', fr: 'du Coran' })}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1">{tr({ en: 'Surahs read', fr: 'Sourates lues' })}</p>
              <p className="text-2xl font-bold text-foreground leading-none">
                {progress?.completedSurahCount ?? 0}<span className="text-base text-muted-foreground">/114</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1">{tr({ en: 'Streak', fr: 'Série' })}</p>
              <p className="text-2xl font-bold text-foreground leading-none inline-flex items-center gap-1">
                <Flame className="w-5 h-5 text-primary" />{progress?.streak ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">{tr({ en: 'days', fr: 'jours' })}</p>
            </div>
          </div>
          <div className="h-2.5 rounded-full bg-muted/50 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${readPercent}%` }} />
          </div>
        </div>

        {/* Result count */}
        <p className="text-sm text-muted-foreground">
          {filtered.length}{' '}
          {filtered.length === 1
            ? tr({ en: 'surah', fr: 'sourate' })
            : tr({ en: 'surahs', fr: 'sourates' })}
        </p>

        {/* Surah grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-14 w-14 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-lg text-muted-foreground">
              {tr({ en: 'No surah matches your search.', fr: 'Aucune sourate ne correspond à votre recherche.' })}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((surah) => {
              const isSaved = saved.includes(surah.number);
              const isRead = completedSurahs.has(surah.number);
              return (
                <button
                  key={surah.number}
                  type="button"
                  onClick={() => navigate(`/quran/${surah.number}`)}
                  className={`islamic-card p-5 text-left transition-all duration-200 hover:shadow-md hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group ${
                    isRead ? 'border-primary/30 bg-primary/[0.03]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="inline-flex items-center justify-center h-9 w-9 shrink-0 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {surah.number}
                      </span>
                      <div className="min-w-0">
                        <h2 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {surah.name}
                        </h2>
                        <p className="text-sm text-muted-foreground truncate">{surah.englishName}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center gap-1">
                        {isRead && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                        {isSaved && <Bookmark className="h-4 w-4 text-primary fill-primary" />}
                      </div>
                      <span className="font-arabic text-xl text-foreground" dir="rtl">
                        {surah.arabicName}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
                    <span>{surah.verses} {tr({ en: 'verses', fr: 'versets' })} · {revelationLabel(surah.revelation)}</span>
                    {isRead && (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {tr({ en: 'Read', fr: 'Lu' })}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
