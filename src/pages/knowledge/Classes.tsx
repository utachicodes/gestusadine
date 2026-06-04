import React, { useState } from 'react';
import { Book, GraduationCap, PlayCircle, Lock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { useClasses } from '@/data/classes';
import { useTr, type Loc } from '@/lib/i18n';

const LEVEL_LABELS: Record<string, Loc> = {
    Beginner: { en: 'Beginner', fr: 'Débutant' },
    Intermediate: { en: 'Intermediate', fr: 'Intermédiaire' },
    Advanced: { en: 'Advanced', fr: 'Avancé' },
};

const Classes = () => {
    const [filter, setFilter] = useState<'All' | 'Fiqh' | 'Hadith' | 'Tawhid'>('All');
    const tr = useTr();
    const filteredClasses = useClasses(filter);

    return (
        <div className="flex-1">
            <section className="container py-10 md:py-16 space-y-8">
                <header>
                    <p className="text-xs uppercase tracking-[0.22em] text-primary mb-2 font-semibold">
                        {tr({ en: 'Structured Learning', fr: 'Apprentissage structuré' })}
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        GëstuSaDine <span className="bg-clip-text text-transparent bg-gradient-to-r from-islamic-gold-600 to-islamic-gold-400">{tr({ en: 'Classes', fr: 'Cours' })}</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl">
                        {tr({
                            en: 'Structured courses designed to take you from a student of knowledge (Talib) to higher levels of understanding. Complete quizzes and assignments to earn Ilm Points.',
                            fr: 'Des parcours structurés pour vous mener de l’étudiant en quête de savoir (Talib) vers des niveaux de compréhension plus élevés. Terminez les quiz et les exercices pour gagner des points de savoir.',
                        })}
                    </p>
                </header>

                {/* Filter Tabs */}
                <div className="flex gap-2 pb-4 overflow-x-auto">
                    {(['All', 'Fiqh', 'Hadith', 'Tawhid'] as const).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary/10 text-muted-foreground hover:bg-secondary/20'
                                }`}
                        >
                            {cat === 'All' ? tr({ en: 'All', fr: 'Tous' }) : cat}
                        </button>
                    ))}
                </div>

                {/* Classes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map((item) => (
                        <div key={item.id} className="islamic-card group relative overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-t-4 border-t-transparent hover:border-t-islamic-gold">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-islamic-gold/5 to-islamic-primary/5 rounded-bl-[100px] -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gold-shine opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            <div className="p-6 flex-1 flex flex-col relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge
                                        className={
                                            item.category === 'Tawhid' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200' :
                                                item.category === 'Fiqh' ? 'bg-islamic-emerald-100 text-islamic-emerald-800 hover:bg-islamic-emerald-200 border-islamic-emerald-200' :
                                                    'bg-islamic-blue-100 text-islamic-blue-800 hover:bg-islamic-blue-200 border-islamic-blue-200'
                                        }
                                        variant="outline"
                                    >
                                        {item.category}
                                    </Badge>
                                    {item.locked ? (
                                        <div className="p-2 bg-slate-100 rounded-full text-slate-400">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                    ) : (
                                        <div className="p-2 bg-islamic-gold/10 rounded-full text-islamic-gold-600">
                                            <PlayCircle className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-islamic-gold-600 transition-colors duration-300">
                                    {item.title}
                                </h3>

                                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-6">
                                    <span className="flex items-center gap-1.5 p-1 px-2 rounded-md bg-secondary/50">
                                        <GraduationCap className="w-3.5 h-3.5" />
                                        {tr(LEVEL_LABELS[item.level] ?? { en: item.level, fr: item.level })}
                                    </span>
                                    <span className="flex items-center gap-1.5 p-1 px-2 rounded-md bg-secondary/50">
                                        <Book className="w-3.5 h-3.5" />
                                        {item.lessons} {tr({ en: 'Lessons', fr: 'leçons' })}
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground mt-auto leading-relaxed">
                                    {item.locked
                                        ? tr({ en: 'Reach a higher rank to unlock this wisdom.', fr: 'Atteignez un rang supérieur pour débloquer ce savoir.' })
                                        : tr({ en: 'Begin this journey to increase your knowledge.', fr: 'Commencez ce parcours pour accroître votre savoir.' })}
                                </p>
                            </div>

                            <div className="p-4 border-t border-border/50 bg-gradient-to-b from-transparent to-muted/20 backdrop-blur-sm">
                                <button
                                    onClick={() => toast(tr({ en: `“${item.title}” — course content is coming soon, inshā’Allāh.`, fr: `« ${item.title} » : le contenu du cours arrive bientôt, inshā’Allāh.` }))}
                                    className={`w-full py-3 rounded-full font-semibold text-sm transition-all duration-300 ${item.locked
                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                        : "btn-islamic text-white shadow-lg hover:shadow-islamic-gold/25"
                                        }`}
                                    disabled={item.locked}
                                >
                                    {item.locked ? tr({ en: 'Currently Locked', fr: 'Verrouillé' }) : tr({ en: 'Start Learning', fr: 'Commencer' })}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Classes;
