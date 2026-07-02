import { useState, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useTr, type Loc } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Heart, ArrowLeft, BookOpen, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Id } from '../../../convex/_generated/dataModel';

const ICON_MAP: Record<string, string> = {
  Sun: '\u2600\uFE0F',
  Clock: '\u23F0',
  Plane: '\u2708\uFE0F',
  Utensils: '\u{1F37D}\uFE0F',
  Home: '\u{1F3E0}',
  HeartHandshake: '\u{1F91D}',
  Sparkles: '\u2728',
  Shield: '\u{1F6E1}\uFE0F',
  Users: '\u{1F465}',
  Baby: '\u{1F476}',
  GraduationCap: '\u{1F393}',
  Activity: '\u{1F3AF}',
};

export default function Duas() {
  const tr = useTr();
  const { language } = useLanguage();
  const [selectedCat, setSelectedCat] = useState<Id<'duaCategories'> | null>(null);
  const [selectedDua, setSelectedDua] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const categories = useQuery(api.duas.listDuaCategories);
  const duas = useQuery(api.duas.listDuas, selectedCat ? { categoryId: selectedCat } : undefined);
  const searchResults = useQuery(api.duas.searchDuas, search.length >= 2 ? { query: search } : 'skip');
  const favoriteIds = useQuery(api.duas.getUserFavorites);
  const toggleFavorite = useMutation(api.duas.toggleFavorite);
  const favoriteDuas = useQuery(api.duas.getFavoriteDuas, showFavorites ? undefined : 'skip');

  const displayDuas = useMemo(() => {
    if (search.length >= 2 && searchResults) return searchResults;
    if (showFavorites && favoriteDuas) return favoriteDuas;
    return duas ?? [];
  }, [search, searchResults, showFavorites, favoriteDuas, duas]);

  const selectedCategory = categories?.find((c) => c._id === selectedCat);

  const handleFavorite = async (duaId: Id<'duas'>) => {
    await toggleFavorite({ duaId });
  };

  const isFavorited = (duaId: Id<'duas'>) => {
    return favoriteIds?.includes(duaId) ?? false;
  };

  // Dua detail view
  if (selectedDua) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => setSelectedDua(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'fr' ? 'Retour' : 'Back'}
        </button>

        <div className="islamic-card p-6 md:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold text-foreground">{tr(selectedDua.title)}</h2>
            <button
              type="button"
              onClick={() => handleFavorite(selectedDua._id)}
              className="flex-shrink-0 p-2 rounded-xl hover:bg-secondary transition-colors"
              aria-label={language === 'fr' ? 'Ajouter aux favoris' : 'Add to favorites'}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorited(selectedDua._id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          </div>

          {/* Arabic text */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-6 md:p-8 border border-emerald-200/50 dark:border-emerald-800/30">
            <p
              className="font-arabic text-2xl md:text-3xl leading-[2] text-emerald-900 dark:text-emerald-100 text-center"
              dir="rtl"
            >
              {selectedDua.arabicText}
            </p>
          </div>

          {/* Transliteration */}
          {selectedDua.transliteration && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {language === 'fr' ? 'Translittération' : 'Transliteration'}
              </p>
              <p className="text-sm italic text-foreground/80 leading-relaxed">
                {selectedDua.transliteration}
              </p>
            </div>
          )}

          {/* Translation */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {language === 'fr' ? 'Traduction' : 'Translation'}
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {tr(selectedDua.translation)}
            </p>
          </div>

          {/* Source */}
          {selectedDua.source && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{selectedDua.source}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Category or list view
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <span className="text-3xl">{'\uD83D\uDD4A\uFE0F'}</span>
          {language === 'fr' ? 'Du\'as' : 'Du\'as'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'fr'
            ? 'Suppliques authentiques du Coran et de la Sunna'
            : 'Authentic supplications from the Quran and Sunnah'}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowFavorites(false);
              setSelectedCat(null);
            }}
            placeholder={language === 'fr' ? 'Rechercher une dua...' : 'Search for a dua...'}
            className="pl-9"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setShowFavorites(!showFavorites);
            setSearch('');
            setSelectedCat(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            showFavorites
              ? 'bg-red-500/10 text-red-500 border border-red-500/20'
              : 'bg-secondary text-muted-foreground hover:text-foreground border border-transparent'
          }`}
        >
          <Heart className={`w-4 h-4 ${showFavorites ? 'fill-red-500' : ''}`} />
          {language === 'fr' ? 'Favoris' : 'Favorites'}
        </button>
      </div>

      {/* Category grid */}
      {!selectedCat && !showFavorites && search.length < 2 && categories && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => setSelectedCat(cat._id)}
              className="islamic-card p-4 md:p-5 text-left transition-all duration-200 hover:shadow-md hover:border-primary/30 group"
            >
              <span className="text-2xl mb-2 block">{ICON_MAP[cat.icon] ?? '\u{1F54A}\uFE0F'}</span>
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {tr(cat.name)}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {tr(cat.description)}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Category header */}
      {selectedCategory && !showFavorites && search.length < 2 && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedCat(null)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{tr(selectedCategory.name)}</h2>
            <p className="text-sm text-muted-foreground">{tr(selectedCategory.description)}</p>
          </div>
        </div>
      )}

      {/* Favorites header */}
      {showFavorites && (
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          <h2 className="text-lg font-semibold text-foreground">
            {language === 'fr' ? 'Mes Du\'as favorites' : 'My Favorite Du\'as'}
          </h2>
        </div>
      )}

      {/* Duas list */}
      <div className="space-y-3">
        {displayDuas.map((dua) => (
          <div
            key={dua._id}
            className="islamic-card p-4 md:p-5 transition-all duration-200 hover:shadow-md hover:border-primary/30 group"
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setSelectedDua(dua)}
                className="flex-1 text-left space-y-3"
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {tr(dua.title)}
                  </h3>
                  {dua.source && (
                    <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md">
                      {dua.source}
                    </span>
                  )}
                </div>
                <p
                  className="font-arabic text-lg md:text-xl text-foreground/90 leading-relaxed line-clamp-2"
                  dir="rtl"
                >
                  {dua.arabicText}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {tr(dua.translation)}
                </p>
              </button>
              <button
                type="button"
                onClick={() => handleFavorite(dua._id)}
                className="flex-shrink-0 p-2 rounded-xl hover:bg-secondary transition-colors"
                aria-label={language === 'fr' ? 'Ajouter aux favoris' : 'Add to favorites'}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFavorited(dua._id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}

        {displayDuas.length === 0 && !categories && (
          <div className="islamic-card p-12 text-center">
            <div className="text-4xl mb-3">{'\u{1F54A}\uFE0F'}</div>
            <p className="text-muted-foreground">
              {language === 'fr' ? 'Chargement des du\'as...' : 'Loading duas...'}
            </p>
          </div>
        )}

        {displayDuas.length === 0 && categories && (
          <div className="islamic-card p-12 text-center">
            <div className="text-4xl mb-3">
              {showFavorites ? '\u2764\uFE0F' : '\u{1F50D}'}
            </div>
            <p className="text-muted-foreground">
              {showFavorites
                ? language === 'fr'
                  ? 'Aucune dua favorite pour le moment. Appuyez sur le coeur pour ajouter!'
                  : 'No favorite duas yet. Tap the heart to add one!'
                : language === 'fr'
                  ? 'Aucune dua trouvée.'
                  : 'No duas found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
