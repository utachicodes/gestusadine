import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                const next = prev + Math.random() * 15;
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(onFinish, 500); // Slight delay after 100%
                    return 100;
                }
                return next;
            });
        }, 300);

        return () => clearInterval(timer);
    }, [onFinish]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-islamic-midnight-dark text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-islamic-pattern opacity-5 animate-pattern-rotate" />

            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-islamic-gold-light via-islamic-gold to-islamic-gold-dark">
                        GëstuSaDine AI
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.7, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-sm md:text-base text-islamic-gold-100/60 tracking-[0.2em] uppercase mb-12"
                >
                    Knowledge is Light
                </motion.p>

                {/* Loading Bar */}
                <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
                    <motion.div
                        className="h-full bg-islamic-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />
                </div>

                <div className="mt-4 text-xs text-white/30 font-mono">
                    Initializing Knowledge Base...
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
