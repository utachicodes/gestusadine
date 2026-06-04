import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, BookOpen, Fingerprint, type LucideIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTawhid } from "@/data/knowledge";
import { useTr } from "@/lib/i18n";

const VISUALS: Record<string, { Icon: LucideIcon; wrap: string; ring: string; emphasized?: boolean }> = {
    rububiyyah: {
        Icon: Fingerprint,
        wrap: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        ring: 'hover:border-t-blue-500',
    },
    uluhiyyah: {
        Icon: ShieldCheck,
        wrap: 'bg-islamic-emerald-50 dark:bg-islamic-emerald-900/20 text-islamic-emerald-600',
        ring: 'hover:border-t-islamic-emerald',
        emphasized: true,
    },
    'asma-sifat': {
        Icon: BookOpen,
        wrap: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
        ring: 'hover:border-t-purple-500',
    },
};

const TawhidPage = () => {
    const navigate = useNavigate();
    const { categories, keyTexts } = useTawhid();
    const tr = useTr();

    return (
        <div className="flex-1">
            <section className="container py-10 md:py-16 space-y-12">
                <header className="text-center max-w-3xl mx-auto">
                    <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-primary mb-2 font-semibold">
                        {tr({ en: 'The Foundation', fr: 'Le fondement' })}
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                        Kitāb <span className="text-gradient">at-Tawḥīd</span>
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {tr({
                            en: 'Understanding the Oneness of Allah. Classical scholars divide tawḥīd into three categories, each affirming a dimension of Allah’s absolute uniqueness.',
                            fr: 'Comprendre l’Unicité d’Allah. Les savants classiques divisent le tawḥīd en trois catégories, chacune affirmant une dimension de l’unicité absolue d’Allah.',
                        })}
                    </p>
                </header>

                {/* 3 Categories of Tawhid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {categories.map((cat) => {
                        const v = VISUALS[cat.id];
                        const Icon = v?.Icon ?? BookOpen;
                        return (
                            <div
                                key={cat.id}
                                className={`islamic-card p-8 text-center space-y-5 hover:shadow-2xl transition-all duration-300 group border-t-4 border-t-transparent ${v?.ring ?? ''} ${v?.emphasized ? 'transform scale-105 shadow-xl shadow-islamic-emerald/5 z-10' : ''}`}
                            >
                                <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${v?.wrap ?? ''}`}>
                                    <Icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">{cat.name}</h3>
                                    <p className="font-arabic text-base text-islamic-gold mb-2" dir="rtl">{cat.arabicName}</p>
                                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">{cat.meaning}</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Resources Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold border-b pb-2">{tr({ en: 'Foundational Texts', fr: 'Textes fondamentaux' })}</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {keyTexts.map((text) => (
                            <div key={text.id} className="flex gap-4 p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                <div className="h-24 w-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded shadow-sm flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-lg">{text.title}</h4>
                                    <p className="text-xs text-muted-foreground mb-2">{tr({ en: 'By', fr: 'Par' })} {text.author}</p>
                                    <p className="text-sm mb-3">{text.note}</p>
                                    <Button size="sm" variant="secondary" onClick={() => navigate('/library')}>{tr({ en: 'Start Reading', fr: 'Lire' })}</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TawhidPage;
