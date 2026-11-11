import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTr, type Loc } from '@/lib/i18n';
import { Globe, ArrowRight, Languages, Check } from 'lucide-react';

const languages: Array<{ code: 'en' | 'fr'; name: Loc; native: string }> = [
    { code: 'en', name: { en: 'English', fr: 'Anglais' }, native: 'English' },
    { code: 'fr', name: { en: 'French', fr: 'Français' }, native: 'Français' },
];

export default function Language() {
    const { language, setLanguage } = useLanguage();
    const tr = useTr();

    return (
        <div className="flex-1 bg-deep-slate relative overflow-hidden min-h-screen">
            <div className="absolute top-0 left-0 w-full h-full bg-mesh-cyan opacity-5 pointer-events-none" />

            <div className="container relative z-10 py-32 px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-center mb-24">
                        <Globe className="w-16 h-16 text-cyan-glow mx-auto mb-8 animate-pulse-glow" />
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                            {tr({ en: 'Language', fr: 'Langue' })}{' '}
                            <span className="text-glow-cyan">
                                {tr({ en: 'preferences', fr: 'préférences' })}
                            </span>
                        </h1>
                        <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
                            {tr({
                                en: 'Choose the language you want the interface to use.',
                                fr: 'Choisissez la langue que vous souhaitez utiliser pour l’interface.',
                            })}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {languages.map((lang) => {
                            const selected = language === lang.code;
                            return (
                                <button
                                    key={lang.code}
                                    type="button"
                                    onClick={() => setLanguage(lang.code)}
                                    aria-pressed={selected}
                                    className={`glass-card-premium p-8 flex items-center justify-between group transition-all duration-500 border-white/5 ${selected ? 'border-cyan-glow/50 bg-cyan-glow/5 shadow-[0_0_40px_rgba(0,245,255,0.1)]' : 'hover:border-cyan-glow/20'}`}
                                >
                                    <div className="flex items-center gap-6">
                                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-cyan-glow">
                                            <Languages className="h-6 w-6" aria-hidden="true" />
                                        </span>
                                        <div className="text-left">
                                            <p className="text-lg font-black text-white group-hover:text-cyan-glow transition-colors">
                                                {lang.native}
                                            </p>
                                            <p className="text-[10px] uppercase tracking-widest text-white/20 font-black">
                                                {tr(lang.name)}
                                            </p>
                                        </div>
                                    </div>
                                    {selected && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-glow text-deep-slate shadow-glow-cyan"
                                        >
                                            <Check className="h-4 w-4" aria-hidden="true" />
                                        </motion.div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-20 text-center">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-cyan-glow transition-colors group"
                        >
                            {tr({ en: 'Back to dashboard', fr: 'Retour au tableau de bord' })}
                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
