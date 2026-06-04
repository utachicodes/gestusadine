import React from 'react';
import { Mic, Play, Clock, Calendar, Headphones, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEpisodes, PODCAST_CATEGORIES } from '@/data/podcasts';
import { PodcastEpisode } from '@/types/ecosystem';
import { MediaPlayer } from '@/components/media/MediaPlayer';
import { useTr, type Loc } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

// Presentation-only: map a content category to its accent styling.
const CATEGORY_STYLES: Record<string, { color: string; iconColor: string }> = {
  Aqeedah: { color: 'bg-deep-green/8', iconColor: 'text-deep-green' },
  Fiqh: { color: 'bg-warm-gold/8', iconColor: 'text-warm-gold' },
  History: { color: 'bg-sage-green/8', iconColor: 'text-sage-green-dark' },
  Spirituality: { color: 'bg-deep-green/8', iconColor: 'text-deep-green-light' },
  Quran: { color: 'bg-warm-gold/8', iconColor: 'text-warm-gold-dark' },
  Family: { color: 'bg-sage-green/8', iconColor: 'text-sage-green' },
};
const styleFor = (cat: string) => CATEGORY_STYLES[cat] ?? { color: 'bg-warm-sand/40', iconColor: 'text-deep-green' };

const PodcastsPage = () => {
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [active, setActive] = React.useState<PodcastEpisode | null>(null);
  const filtered = useEpisodes(activeCategory);
  const tr = useTr();
  const { language } = useLanguage();

  const stats: { value: string; label: Loc }[] = [
    { value: '50+', label: { en: 'Episodes', fr: 'Épisodes' } },
    { value: '12', label: { en: 'Scholars', fr: 'Savants' } },
    { value: '2', label: { en: 'Languages', fr: 'Langues' } },
  ];

  const fmtDate = (iso: string) =>
    language === 'fr'
      ? format(new Date(iso), 'd MMM yyyy', { locale: fr })
      : format(new Date(iso), 'MMM d, yyyy');

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-20 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-warm-base -z-10" />

        <div className="container px-4 mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-warm-gold/30 bg-warm-gold/8 px-4 py-1.5 text-sm font-semibold text-warm-gold mb-5">
            <Headphones className="w-4 h-4" />
            Podcasts
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-deep-green mb-4 leading-tight">
            {tr({ en: 'Conversations with scholars', fr: 'Conversations avec des savants' })}
          </h1>

          <p className="text-lg text-deep-green/55 max-w-xl mx-auto mb-10">
            {tr({
              en: 'Long-form discussions on Fiqh, Aqeedah, history, and family, with scholars from Senegal and beyond.',
              fr: 'Des discussions approfondies sur le fiqh, l’aqida, l’histoire et la famille, avec des savants du Sénégal et d’ailleurs.',
            })}
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            {stats.map((stat) => (
              <div key={stat.label.en} className="text-center">
                <p className="text-3xl font-bold text-deep-green">{stat.value}</p>
                <p className="text-sm text-deep-green/50">{tr(stat.label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter + Episodes */}
      <section className="py-14">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {PODCAST_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-deep-green text-warm-cream'
                    : 'bg-warm-sand/40 text-deep-green/70 hover:bg-warm-sand/70 border border-warm-sand'
                }`}
              >
                {cat === 'All' ? tr({ en: 'All', fr: 'Tous' }) : cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((ep) => {
              const style = styleFor(ep.category);
              return (
                <div key={ep.id} className="glass-card-warm p-5 rounded-2xl transition-all duration-200 hover:shadow-md flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${style.color} ${style.iconColor}`}>
                      {ep.category}
                    </span>
                    <div className={`w-9 h-9 rounded-lg ${style.color} flex items-center justify-center ${style.iconColor}`}>
                      <Mic className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-deep-green mb-1.5 leading-snug">{ep.title}</h3>
                  <p className="text-sm text-deep-green/50 mb-3 leading-relaxed flex-1">{ep.description}</p>

                  <div className="text-xs font-semibold text-deep-green/50 mb-4">
                    {tr({ en: 'with', fr: 'avec' })} {ep.guest}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-deep-green/40">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {ep.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {fmtDate(ep.published_at)}
                      </span>
                    </div>
                    <button
                      onClick={() => setActive(ep)}
                      aria-label={tr({ en: `Play ${ep.title}`, fr: `Écouter ${ep.title}` })}
                      className="w-8 h-8 rounded-full bg-deep-green flex items-center justify-center text-warm-cream hover:bg-deep-green-light transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-warm-sand/25 -z-10" />

        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-deep-green mb-3">
            {tr({ en: 'Get notified about new episodes', fr: 'Soyez informé des nouveaux épisodes' })}
          </h2>
          <p className="text-deep-green/55 mb-6 max-w-md mx-auto text-sm">
            {tr({
              en: "Sign up and we'll let you know when new conversations are published.",
              fr: 'Inscrivez-vous et nous vous préviendrons dès la publication de nouvelles conversations.',
            })}
          </p>
          <Link to="/login" className="btn-spiritual inline-flex items-center gap-2 text-sm">
            {tr({ en: 'Subscribe', fr: 'S’abonner' })}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <MediaPlayer
        open={!!active}
        onClose={() => setActive(null)}
        kind="audio"
        title={active?.title}
        src={active?.audio_url}
      />
    </div>
  );
};

export default PodcastsPage;
