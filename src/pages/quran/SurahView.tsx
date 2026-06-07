import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useTr, type Loc } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { SURAHS } from '@/data/surahs';
import { TRANSLATION_EDITIONS } from './Quran';

const ARABIC_EDITION = 'quran-uthmani';
const BISMILLAH = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
const TRANSLATION_STORAGE_KEY = 'quran-translation';
const SAVED_STORAGE_KEY = 'quran-saved';

interface Ayah {
  numberInSurah: number;
  arabic: string;
  translation: string;
}

interface ApiAyah {
  numberInSurah: number;
  text: string;
}
interface ApiEdition {
  edition: { identifier: string };
  ayahs: ApiAyah[];
}

/** The translation edition that matches the app's UI language. */
function defaultEdition(lang: string): string {
  return lang === 'fr' ? 'fr.hamidullah' : 'en.sahih';
}

function readTranslation(lang: string): string {
  try {
    const stored = localStorage.getItem(TRANSLATION_STORAGE_KEY);
    if (stored && TRANSLATION_EDITIONS.some((e) => e.id === stored)) {
      return stored;
    }
  } catch {
    /* ignore */
  }
  return defaultEdition(lang);
}

function readSaved(): number[] {
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((n): n is number => typeof n === 'number');
    }
  } catch {
    /* ignore */
  }
  return [];
}

function writeSaved(values: number[]): void {
  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(values));
  } catch {
    /* ignore */
  }
}

export default function SurahView() {
  const tr = useTr();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { number } = useParams<{ number: string }>();

  const surahNumber = Number(number);
  const surah = useMemo(
    () => SURAHS.find((s) => s.number === surahNumber),
    [surahNumber],
  );

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [translation, setTranslation] = useState<string>(() => readTranslation(language));
  const [saved, setSaved] = useState<number[]>(() => readSaved());

  // Follow the app language: switching FR/EN switches the verse translation to
  // that language's edition. Skips the first render so a stored choice is kept.
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
      /* ignore */
    }
  }, [language]);

  const isValid = Boolean(surah);
  const isSaved = surah ? saved.includes(surah.number) : false;

  const handleTranslationChange = (value: string) => {
    setTranslation(value);
    try {
      localStorage.setItem(TRANSLATION_STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  };

  const toggleSaved = useCallback(() => {
    if (!surah) return;
    setSaved((prev) => {
      const next = prev.includes(surah.number)
        ? prev.filter((n) => n !== surah.number)
        : [...prev, surah.number];
      writeSaved(next);
      return next;
    });
  }, [surah]);

  // Fetch the Arabic text + the selected translation. Re-fetches when the surah
  // or the chosen edition changes (so it scales to any number of editions).
  useEffect(() => {
    if (!isValid) return;

    const controller = new AbortController();
    setLoading(true);
    setError(false);

    const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/${ARABIC_EDITION},${translation}`;

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json: { data?: ApiEdition[] }) => {
        const data = json?.data;
        if (!Array.isArray(data)) throw new Error('Unexpected response shape');

        const byEdition = new Map<string, ApiAyah[]>();
        for (const ed of data) {
          if (ed?.edition?.identifier) {
            byEdition.set(ed.edition.identifier, ed.ayahs ?? []);
          }
        }

        const arabicAyahs = byEdition.get(ARABIC_EDITION) ?? [];
        const translationAyahs = byEdition.get(translation) ?? [];
        const combined: Ayah[] = arabicAyahs.map((arabicAyah, index) => ({
          numberInSurah: arabicAyah.numberInSurah,
          arabic: arabicAyah.text,
          translation: translationAyahs[index]?.text ?? '',
        }));

        setAyahs(combined);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(true);
        setLoading(false);
      });

    return () => controller.abort();
  }, [surahNumber, isValid, reloadKey, translation]);

  // Reading a surah automatically records it as read and advances the Quran
  // reading streak — once per surah, after its verses have loaded. No manual
  // marking needed.
  const recordSurahRead = useMutation(api.quranProgress.recordSurahRead);
  const recordedRef = useRef<Set<number>>(new Set());
  useEffect(() => {
    if (isValid && ayahs.length > 0 && !recordedRef.current.has(surahNumber)) {
      recordedRef.current.add(surahNumber);
      recordSurahRead({ surah: surahNumber }).catch(() => {});
    }
  }, [isValid, ayahs.length, surahNumber, recordSurahRead]);

  // Invalid surah number  friendly not-found.
  if (!isValid) {
    return (
      <div>
        <section className="container py-8 md:py-10 space-y-6">
          <div className="text-center py-20">
            <AlertTriangle className="h-14 w-14 mx-auto text-muted-foreground/40 mb-4" />
            <h1 className="text-2xl font-bold text-foreground">
              {tr({ en: 'Surah not found', fr: 'Sourate introuvable' })}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {tr({
                en: 'The surah number is invalid. Please pick one from the list.',
                fr: 'Le numéro de sourate est invalide. Veuillez en choisir une dans la liste.',
              })}
            </p>
            <Button className="btn-islamic mt-6" onClick={() => navigate('/quran')}>
              <ArrowLeft className="h-4 w-4" />
              {tr({ en: 'Back to all surahs', fr: 'Retour à toutes les sourates' })}
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const revelationLabel: Loc =
    surah!.revelation === 'Meccan'
      ? { en: 'Meccan', fr: 'Mecquoise' }
      : { en: 'Medinan', fr: 'Médinoise' };

  // Show Bismillah header except At-Tawbah (9). For Al-Fatihah (1) it is ayah 1
  // already, so we don't add a separate header line.
  const showBismillah = surah!.number !== 9 && surah!.number !== 1;

  return (
    <div>
      <section className="container py-8 md:py-10 space-y-6">
        {/* Back link */}
        <button
          type="button"
          onClick={() => navigate('/quran')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {tr({ en: 'All surahs', fr: 'Toutes les sourates' })}
        </button>

        {/* Header */}
        <div className="islamic-card p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center justify-center h-12 w-12 shrink-0 rounded-full bg-primary text-primary-foreground text-lg font-bold">
                {surah!.number}
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{surah!.name}</h1>
                <p className="text-muted-foreground">{surah!.englishName}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {surah!.verses} {tr({ en: 'verses', fr: 'versets' })} · {tr(revelationLabel)}
                </p>
              </div>
            </div>
            <span className="font-arabic text-3xl md:text-4xl text-foreground self-start md:self-center" dir="rtl">
              {surah!.arabicName}
            </span>
          </div>

          {/* Toolbar */}
          <div className="mt-5 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="sm:w-72">
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
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <button
                type="button"
                onClick={toggleSaved}
                aria-pressed={isSaved}
                className={
                  isSaved
                    ? 'btn-islamic'
                    : 'btn-islamic-outlined'
                }
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved
                  ? tr({ en: 'Saved', fr: 'Enregistré' })
                  : tr({ en: 'Save', fr: 'Enregistrer' })}
              </button>

              <a
                href={`https://quran.com/${surah!.number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-islamic-outlined"
              >
                <ExternalLink className="h-4 w-4" />
                {tr({ en: 'Open on Quran.com', fr: 'Ouvrir sur Quran.com' })}
              </a>
            </div>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-sm">{tr({ en: 'Loading verses...', fr: 'Chargement des versets...' })}</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-lg text-foreground font-medium">
              {tr({ en: 'Unable to load this surah.', fr: 'Impossible de charger cette sourate.' })}
            </p>
            <p className="mt-1 text-muted-foreground">
              {tr({
                en: 'Please check your connection and try again.',
                fr: 'Veuillez vérifier votre connexion et réessayer.',
              })}
            </p>
            <Button className="btn-islamic mt-6" onClick={() => setReloadKey((k) => k + 1)}>
              {tr({ en: 'Retry', fr: 'Réessayer' })}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bismillah */}
            {showBismillah && (
              <div className="islamic-card p-6 text-center">
                <p className="font-arabic text-2xl md:text-3xl leading-loose text-foreground" dir="rtl">
                  {BISMILLAH}
                </p>
              </div>
            )}

            {ayahs.map((ayah) => (
              <div key={ayah.numberInSurah} className="islamic-card p-5 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-accent/50 text-accent-foreground text-xs font-semibold">
                    {surah!.number}:{ayah.numberInSurah}
                  </span>
                </div>
                <p
                  className="font-arabic text-2xl md:text-3xl leading-loose text-right text-foreground"
                  dir="rtl"
                >
                  {ayah.arabic}
                </p>
                {ayah.translation && (
                  <p className="mt-4 text-muted-foreground leading-relaxed" dir="auto">
                    {ayah.translation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
