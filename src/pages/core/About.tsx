import * as React from 'react';
import { motion } from 'framer-motion';
import AboutSection from '@/components/landing/AboutSection';

export default function About() {
    return (
        <div className="flex-1 bg-deep-slate">
            {/* Hero Section for About Page */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="container relative z-10 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <p className="text-cyan-glow font-black uppercase tracking-[0.4em] text-[10px] mb-6">
                            Architects of Faith
                        </p>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8">
                            Our <span className="text-glow-cyan">Mission</span>
                        </h1>
                        <p className="text-2xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed">
                            Pioneering the next generation of spiritual technology by merging authentic Islamic scholarship with computational intelligence.
                        </p>
                    </motion.div>
                </div>

                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,245,255,0.1),transparent_70%)] pointer-events-none" />
            </section>

            <AboutSection />

            {/* Vision Section */}
            <section className="py-32 relative overflow-hidden border-t border-white/5">
                <div className="container px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-16">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-6 tracking-tight">The Vision</h2>
                                <p className="text-white/40 leading-relaxed font-medium">
                                    We believe that faith and intelligence are not distinct realms, but interconnected dimensions of the human experience. Our goal is to make divine wisdom accessible, verifiable, and relevant in the digital age.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white mb-6 tracking-tight">The Tech</h2>
                                <p className="text-white/40 leading-relaxed font-medium">
                                    Leveraging state-of-the-art RAG (Retrieval-Augmented Generation) and authentic datasets, we ensure that every interaction is grounded in verified scholarship, audited by experts.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
