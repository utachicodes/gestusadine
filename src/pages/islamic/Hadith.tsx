import React, { useState } from 'react';
import { Scroll, Quote, Search } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { HADITHS, useHadiths, HADITH_CATEGORIES, HadithCategory } from '@/data/knowledge';
import { useTr, type Loc } from '@/lib/i18n';

const featured = HADITHS.find((h) => h.number === 1)!;

const CATEGORY_LABELS: Record<string, Loc> = {
    All: { en: 'All', fr: 'Tous' },
    Foundations: { en: 'Foundations', fr: 'Fondements' },
    Worship: { en: 'Worship', fr: 'Adoration' },
    Character: { en: 'Character', fr: 'Caractère' },
    Society: { en: 'Society', fr: 'Société' },
};

const HadithPage = () => {
    const [category, setCategory] = useState<'All' | HadithCategory>('All');
    const [query, setQuery] = useState('');
    const tr = useTr();
    const hadiths = useHadiths(category);

    const q = query.trim().toLowerCase();
    const filtered = q
        ? hadiths.filter((h) =>
            h.text.toLowerCase().includes(q) ||
            h.topic.toLowerCase().includes(q) ||
            h.narrator.toLowerCase().includes(q),
        )
        : hadiths;

    return (
        <div className="flex-1">
            <section className="container py-10 md:py-16 space-y-8">
                <header className="text-center md:text-left">
                    <p className="text-xs uppercase tracking-[0.22em] text-islamic-gold mb-2 font-semibold">
                        {tr({ en: 'Prophetic Traditions', fr: 'Traditions prophétiques' })}
                    </p>
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground">
                        {tr({ en: 'The Forty', fr: 'Les Quarante' })} <span className="text-gradient">Ḥadīth</span> {tr({ en: 'of an-Nawawī', fr: 'd’an-Nawawī' })}
                    </h1>
                    <p className="mt-4 text-muted-foreground max-w-2xl text-lg">
                        {tr({
                            en: 'A selection of foundational, authentic narrations, each with its narrator and a verifiable reference to ',
                            fr: 'Une sélection de narrations authentiques et fondamentales, chacune avec son rapporteur et une référence vérifiable à ',
                        })}
                        <span className="font-semibold text-foreground">Ṣaḥīḥ al-Bukhārī</span> {tr({ en: 'and', fr: 'et' })}
                        <span className="font-semibold text-foreground"> Ṣaḥīḥ Muslim</span>.
                    </p>
                </header>

                {/* Featured Hadith */}
                <div className="islamic-card p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-islamic-midnight to-islamic-midnight-dark opacity-[0.97]" />
                    <div className="absolute inset-0 bg-islamic-pattern opacity-10 animate-pattern-rotate" />

                    <div className="absolute -top-10 -left-10 text-islamic-gold/10 transition-transform duration-1000 group-hover:scale-110">
                        <Quote size={240} />
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                        <Badge variant="outline" className="border-islamic-gold text-islamic-gold bg-islamic-gold/10 px-4 py-1 text-sm tracking-widest uppercase">
                            {tr({ en: 'Ḥadīth of the Day', fr: 'Ḥadīth du jour' })}
                        </Badge>

                        <div className="space-y-6 max-w-4xl mx-auto">
                            {featured.arabic && (
                                <p className="font-arabic text-4xl md:text-6xl leading-[1.6] text-white drop-shadow-md" dir="rtl">
                                    « {featured.arabic} »
                                </p>
                            )}
                            <p className="text-xl md:text-2xl italic text-islamic-cream leading-relaxed">
                                "{featured.text}"
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-semibold text-islamic-gold/80 bg-islamic-midnight/50 px-4 py-2 rounded-full backdrop-blur-sm border border-islamic-gold/20">
                            <Scroll className="w-4 h-4" />
                            <span>{featured.source}</span>
                        </div>
                    </div>
                </div>

                {/* Search + filters */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                    <div className="flex flex-wrap gap-2">
                        {HADITH_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                                    category === cat ? 'bg-islamic-emerald text-white shadow-md' : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {tr(CATEGORY_LABELS[cat] ?? { en: cat, fr: cat })}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={tr({ en: 'Search narrations…', fr: 'Rechercher des narrations…' })}
                            className="pl-10 pr-4 py-2.5 rounded-full border border-border bg-card text-sm text-foreground focus:outline-none focus:border-islamic-emerald w-full md:w-64"
                        />
                    </div>
                </div>

                {/* Collection */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">{tr({ en: 'No narrations match your search.', fr: 'Aucune narration ne correspond à votre recherche.' })}</div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-5">
                        {filtered.map((h) => (
                            <div key={h.id} className="islamic-card p-6 flex flex-col gap-3 hover:shadow-xl transition-all border border-transparent hover:border-islamic-emerald/30">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-islamic-emerald/10 text-islamic-emerald-700 font-bold text-sm">
                                        {h.number}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{h.topic}</Badge>
                                        <Badge className="bg-islamic-emerald/10 text-islamic-emerald-700 border-islamic-emerald/20 text-[10px]">{h.grade}</Badge>
                                    </div>
                                </div>
                                <p className="text-foreground leading-relaxed">"{h.text}"</p>
                                <div className="mt-auto pt-2 border-t border-border/50 space-y-0.5">
                                    <p className="text-xs text-muted-foreground">{tr({ en: 'Narrated by', fr: 'Rapporté par' })} <span className="font-semibold text-foreground/80">{h.narrator}</span></p>
                                    <p className="text-xs text-islamic-gold/80 font-medium">{h.source}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HadithPage;
