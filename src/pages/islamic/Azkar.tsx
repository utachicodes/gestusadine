import { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useTr } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, RotateCcw, Sun, Moon, Bed, BookOpen, Trophy, ChevronRight } from 'lucide-react';
import type { Id } from '../../../convex/_generated/dataModel';

const TYPE_ICONS: Record<string, string> = {
  morning: '\u2600\uFE0F',
  evening: '\u{1F319}',
  sleep: '\u{1F31B}',
  generic: '\u2728',
};

const TYPE_TABS = [
  { key: 'all', en: 'All', fr: 'Tout' },
  { key: 'morning', en: 'Morning', fr: 'Matin' },
  { key: 'evening', en: 'Evening', fr: 'Soir' },
  { key: 'sleep', en: 'Sleep', fr: 'Sommeil' },
  { key: 'generic', en: 'Other', fr: 'Autre' },
];

export default function Azkar() {
  const tr = useTr();
  const { language } = useLanguage();
  const [selectedCat, setSelectedCat] = useState<Id<'azkarCategories'> | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [tappedId, setTappedId] = useState<string | null>(null);

  const categories = useQuery(api.azkar.listAzkarCategories);
  const azkarList = useQuery(
    api.azkar.getTodayAzkarProgress,
    selectedCat ? { categoryId: selectedCat } : undefined,
  );
  const stats = useQuery(api.azkar.getAzkarStats);
  const logProgress = useMutation(api.azkar.logAzkarProgress);
  const resetProgress = useMutation(api.azkar.resetAzkarProgress);

  const filteredCategories = categories?.filter(
    (c) => activeTab === 'all' || c.type === activeTab,
  );

  const selectedCategory = categories?.find((c) => c._id === selectedCat);

  const handleTap = useCallback(
    async (azkarId: Id<'azkar'>, maxCount: number, currentCount: number) => {
      if (currentCount >= maxCount) return;
      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(15);
      setTappedId(azkarId as string);
      setTimeout(() => setTappedId(null), 200);
      await logProgress({ azkarId });
    },
    [logProgress],
  );

  const handleReset = useCallback(
    async (azkarId: Id<'azkar'>) => {
      await resetProgress({ azkarId });
    },
    [resetProgress],
  );

  // Detail / counter view for a single category
  if (selectedCat && azkarList) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Stats header */}
        {stats && (
          <div className="grid grid-cols-2 gap-3">
            <div className="islamic-card p-4 flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10">
                <Trophy className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stats.totalCompleted}</p>
                <p className="text-xs text-muted-foreground">
                  {language === 'fr' ? "Complétés aujourd'hui" : 'Completed today'}
                </p>
              </div>
            </div>
            <div className="islamic-card p-4 flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stats.categoriesCompleted}</p>
                <p className="text-xs text-muted-foreground">
                  {language === 'fr' ? 'Catégories terminées' : 'Categories finished'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedCat(null)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {selectedCategory && tr(selectedCategory.name)}
            </h2>
            <p className="text-sm text-muted-foreground">
              {language === 'fr'
                ? 'Appuyez pour compter chaque dhikr'
                : 'Tap to count each dhikr'}
            </p>
          </div>
        </div>

        {/* Azkar cards */}
        <div className="space-y-3">
          {azkarList.map((item) => {
            const progress = item.currentCount;
            const required = item.repeatCount;
            const completed = progress >= required;
            const progressPercent = Math.min((progress / required) * 100, 100);

            return (
              <div
                key={item._id}
                className={`islamic-card overflow-hidden transition-all duration-300 ${
                  completed
                    ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : tappedId === (item._id as string)
                      ? 'scale-[0.98] shadow-lg'
                      : ''
                }`}
              >
                {/* Progress bar */}
                <div className="h-1 bg-secondary">
                  <div
                    className={`h-full transition-all duration-500 ${
                      completed ? 'bg-emerald-500' : 'bg-primary'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="p-4 md:p-5 space-y-4">
                  {/* Arabic text */}
                  <p
                    className="font-arabic text-xl md:text-2xl leading-[1.8] text-foreground text-center"
                    dir="rtl"
                  >
                    {item.arabicText}
                  </p>

                  {/* Transliteration */}
                  {item.transliteration && (
                    <p className="text-xs italic text-muted-foreground text-center leading-relaxed">
                      {item.transliteration}
                    </p>
                  )}

                  {/* Translation */}
                  <p className="text-sm text-foreground/80 text-center leading-relaxed">
                    {tr(item.translation)}
                  </p>

                  {/* Source */}
                  {item.source && (
                    <p className="text-[10px] text-muted-foreground text-center">
                      {item.source}
                    </p>
                  )}

                  {/* Counter area */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-sm font-medium text-muted-foreground">
                      {progress} / {required}
                    </span>

                    <div className="flex items-center gap-2">
                      {progress > 0 && (
                        <button
                          type="button"
                          onClick={() => handleReset(item._id)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-secondary transition-colors"
                          aria-label={language === 'fr' ? 'Réinitialiser' : 'Reset'}
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleTap(item._id, required, progress)}
                        disabled={completed}
                        className={`flex items-center justify-center w-12 h-12 rounded-xl text-lg font-bold transition-all duration-200 ${
                          completed
                            ? 'bg-emerald-500/10 text-emerald-500 cursor-default'
                            : 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95'
                        }`}
                        aria-label={
                          completed
                            ? language === 'fr' ? 'Terminé' : 'Completed'
                            : language === 'fr' ? 'Compter' : 'Count'
                        }
                      >
                        {completed ? '\u2713' : '+'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {azkarList.length === 0 && (
            <div className="islamic-card p-12 text-center">
              <div className="text-4xl mb-3">{'\u2728'}</div>
              <p className="text-muted-foreground">
                {language === 'fr'
                  ? 'Aucun dhikr dans cette catégorie.'
                  : 'No dhikr in this category.'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Category list view
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <span className="text-3xl">{'\u{1F54C}'}</span>
          {language === 'fr' ? 'Adhkar' : 'Adhkar'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'fr'
            ? 'Souvenirs quotidiens pour protéger votre foi et votre paix'
            : 'Daily remembrance to protect your faith and peace'}
        </p>
      </div>

      {/* Stats */}
      {stats && stats.totalCompleted > 0 && (
        <div className="islamic-card p-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10">
            <Trophy className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{stats.totalCompleted}</p>
            <p className="text-xs text-muted-foreground">
              {language === 'fr' ? "Dhikr complétés aujourd'hui" : 'Dhikr completed today'}
            </p>
          </div>
        </div>
      )}

      {/* Type tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.key !== 'all' && <span>{TYPE_ICONS[tab.key]}</span>}
            {tab[language as 'en' | 'fr']}
          </button>
        ))}
      </div>

      {/* Category grid */}
      <div className="space-y-3">
        {filteredCategories?.map((cat) => (
          <button
            key={cat._id}
            type="button"
            onClick={() => setSelectedCat(cat._id)}
            className="islamic-card w-full p-4 md:p-5 text-left transition-all duration-200 hover:shadow-md hover:border-primary/30 group"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-2xl flex-shrink-0">
                {TYPE_ICONS[cat.type] ?? '\u2728'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tr(cat.name)}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {tr(cat.description)}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
          </button>
        ))}

        {filteredCategories?.length === 0 && (
          <div className="islamic-card p-12 text-center">
            <div className="text-4xl mb-3">{'\u2728'}</div>
            <p className="text-muted-foreground">
              {language === 'fr'
                ? 'Aucune catégorie trouvée.'
                : 'No categories found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
