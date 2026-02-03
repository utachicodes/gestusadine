import * as React from 'react';
import { motion } from 'framer-motion';

export default function Terms() {
    return (
        <div className="flex-1 bg-deep-slate relative overflow-hidden min-h-screen">
            <div className="absolute top-0 left-0 w-full h-full bg-mesh-cyan opacity-5 pointer-events-none" />

            <div className="container relative z-10 py-24 px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-center mb-20">
                        <p className="text-cyan-glow font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                            Operational Framework
                        </p>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                            Terms of <span className="text-glow-cyan">Service</span>
                        </h1>
                        <p className="text-white/40 font-medium">
                            Last updated: January 16, 2026
                        </p>
                    </div>

                    <div className="glass-card-premium p-10 space-y-12 border border-white/5">
                        <section className="relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
                                <h2 className="text-2xl font-black text-white tracking-tight uppercase">1. Acceptance of Terms</h2>
                            </div>
                            <p className="text-white/40 leading-relaxed font-medium pl-6 border-l border-white/5">
                                By accessing GëstuSaDine, you agree to be bound by these premium operational terms. Our service is a sophisticated vehicle for Islamic knowledge, and its use implies commitment to ethical interaction.
                            </p>
                        </section>

                        <section className="relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
                                <h2 className="text-2xl font-black text-white tracking-tight uppercase">2. Intellectual Property</h2>
                            </div>
                            <p className="text-white/40 leading-relaxed font-medium pl-6 border-l border-white/5">
                                All algorithmic outputs, curated datasets, and interface designs are the exclusive property of GëstuSaDine. Unauthorized replication or extraction of knowledge models is strictly prohibited.
                            </p>
                        </section>

                        <section className="relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
                                <h2 className="text-2xl font-black text-white tracking-tight uppercase">3. Disclaimer of Guidance</h2>
                            </div>
                            <p className="text-white/40 leading-relaxed font-medium pl-6 border-l border-white/5 italic">
                                While our AI is grounded in authentic scholarship, users are encouraged to consult directly with local scholars for life-altering decisions. The platform serves as a high-precision assistance tool, not a replacement for direct human scholarly interaction.
                            </p>
                        </section>

                        <section className="pt-12 border-t border-white/5">
                            <h2 className="text-sm font-black text-white/20 uppercase tracking-[0.3em] mb-6">Institutional Oversight</h2>
                            <p className="text-white/40 leading-relaxed font-medium">
                                For formal legal inquiries or institutional partnership terms, contact:{' '}
                                <a href="mailto:legal@gestusadine.com" className="text-cyan-glow hover:underline underline-offset-4">
                                    legal@gestusadine.com
                                </a>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
