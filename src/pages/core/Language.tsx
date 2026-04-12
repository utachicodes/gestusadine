import * as React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, ArrowRight } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
];

export default function Language() {
    const { language, setLanguage, t } = useLanguage();

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
                            Localization <span className="text-glow-cyan">Matrix</span>
                        </h1>
                        <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
                            Select your preferred linguistic interface for authentic guidance.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setLanguage(lang.code as any)}
                                className={`glass-card-premium p-8 flex items-center justify-between group transition-all duration-500 border-white/5 ${language === lang.code ? 'border-cyan-glow/50 bg-cyan-glow/5 shadow-[0_0_40px_rgba(0,245,255,0.1)]' : 'hover:border-cyan-glow/20'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <span className="text-4xl">{lang.flag}</span>
                                    <div className="text-left">
                                        <p className="text-lg font-black text-white group-hover:text-cyan-glow transition-colors">{lang.native}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-white/20 font-black">{lang.name}</p>
                                    </div>
                                </div>
                                {language === lang.code && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="w-2 h-2 rounded-full bg-cyan-glow shadow-glow-cyan"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <a
                            href="/"
                            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-cyan-glow transition-colors group"
                        >
                            Back to Core <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
