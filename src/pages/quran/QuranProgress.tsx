import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';
import { PageHeader } from '@/components/layout/PageHeader';
import { useTr } from '@/lib/i18n';
import { getErrorMessage } from '@/types/errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpenText, Flame, BookMarked, Layers, Minus, Plus } from 'lucide-react';

const TOTAL_PAGES = 604;
const TOTAL_JUZ = 30;

const QuranProgress: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const tr = useTr();
  const progress = useQuery(api.quranProgress.get);
  const setPage = useMutation(api.quranProgress.setPage);
  const toggleSurahMut = useMutation(api.quranProgress.toggleSurah);

  const onError = (e: unknown) =>
    toast.error(getErrorMessage(e, tr({
      en: 'Could not save your progress. Please try again.',
      fr: "Impossible d'enregistrer votre progression. Veuillez réessayer.",
    })));

  const toggleSurah = (args: { surah: number }) => toggleSurahMut(args).catch(onError);

  const currentPage = progress?.currentPage ?? 0;
  const pagePercent = progress?.pagePercent ?? 0;
  const completed = new Set<number>(progress?.completedSurahs ?? []);
  const juzReached = currentPage > 0 ? Math.min(TOTAL_JUZ, Math.ceil(currentPage / (TOTAL_PAGES / TOTAL_JUZ))) : 0;

  const [pageInput, setPageInput] = React.useState<string>('');
  React.useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const commitPage = (value: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_PAGES, Math.floor(value || 0)));
    setPageInput(String(clamped));
    setPage({ page: clamped }).catch(onError);
  };

  const statCards = [
    { icon: BookOpenText, label: tr({ en: 'Completion', fr: 'Achèvement' }), value: `${pagePercent}%`, sub: tr({ en: 'of the Quran', fr: 'du Coran' }) },
    { icon: BookMarked, label: tr({ en: 'Current page', fr: 'Page actuelle' }), value: `${currentPage}`, sub: `/ ${TOTAL_PAGES}` },
    { icon: Layers, label: tr({ en: 'Surahs done', fr: 'Sourates faites' }), value: `${progress?.completedSurahCount ?? 0}`, sub: `/ ${progress?.totalSurahs ?? 114}` },
    { icon: Flame, label: tr({ en: 'Streak', fr: 'Série' }), value: progress?.streak ?? 0, sub: tr({ en: 'days reading', fr: 'jours de lecture' }) },
  ];

  const milestones = [25, 50, 75, 100];

  return (
    <div className={embedded ? 'space-y-6' : 'max-w-4xl mx-auto w-full px-4 py-6 space-y-6'}>
      {embedded ? (
        <h2 className="text-xl font-bold text-foreground">
          {tr({ en: 'Your reading progress', fr: 'Votre progression de lecture' })}
        </h2>
      ) : (
        <PageHeader
          eyebrow={tr({ en: 'Knowledge', fr: 'Savoir' })}
          title={tr({ en: 'Quran Progress', fr: 'Progression du Coran' })}
          subtitle={tr({
            en: 'Track your reading page by page and surah by surah, and keep your streak alive.',
            fr: 'Suivez votre lecture page par page et sourate par sourate, et gardez votre série active.',
          })}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="islamic-card p-3 sm:p-4 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1 truncate">{label}</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground leading-none">{value}</p>
              <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>
            </div>
            <div className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-accent/50 text-primary">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Reading progress bar */}
      <div className="islamic-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-foreground">{tr({ en: 'Reading progress', fr: 'Progression de lecture' })}</h2>
          <span className="text-xs text-muted-foreground">
            {tr({ en: `Juz ${juzReached} of ${TOTAL_JUZ}`, fr: `Juz ${juzReached} sur ${TOTAL_JUZ}` })}
          </span>
        </div>
        <div className="relative h-4 rounded-full bg-muted/50 overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pagePercent}%` }} />
          {milestones.map((m) => (
            <span
              key={m}
              className="absolute top-0 bottom-0 w-px bg-background/70"
              style={{ left: `${m}%` }}
              aria-hidden
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
          {milestones.map((m) => (
            <span key={m} className={pagePercent >= m ? 'text-primary font-semibold' : ''}>{m}%</span>
          ))}
        </div>

        {/* Page setter */}
        <div className="mt-5 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1">
              {tr({ en: 'Current page', fr: 'Page actuelle' })}
            </label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="icon" onClick={() => commitPage(currentPage - 1)} aria-label="minus">
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                min={0}
                max={TOTAL_PAGES}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={() => commitPage(Number(pageInput))}
                className="w-24 text-center"
              />
              <Button type="button" variant="outline" size="icon" onClick={() => commitPage(currentPage + 1)} aria-label="plus">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button type="button" className="btn-islamic" onClick={() => commitPage(Number(pageInput))}>
            {tr({ en: 'Save progress', fr: 'Enregistrer' })}
          </Button>
        </div>
      </div>

      {/* Surah completion grid */}
      <div className="islamic-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">{tr({ en: 'Surah completion', fr: 'Sourates complétées' })}</h2>
          <span className="text-xs text-muted-foreground">{progress?.surahPercent ?? 0}%</span>
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5">
          {Array.from({ length: 114 }, (_, i) => i + 1).map((n) => {
            const done = completed.has(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => toggleSurah({ surah: n })}
                aria-pressed={done}
                title={`${tr({ en: 'Surah', fr: 'Sourate' })} ${n}`}
                className={`aspect-square rounded-md text-[11px] font-semibold transition-all ${
                  done
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">
          {tr({ en: 'Tap a surah number to mark it complete.', fr: 'Touchez le numéro d\'une sourate pour la marquer comme terminée.' })}
        </p>
      </div>
    </div>
  );
};

export default QuranProgress;
