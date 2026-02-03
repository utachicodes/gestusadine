import { motion } from 'framer-motion';

export default function Privacy() {
    return (
        <div className="flex-1 bg-deep-slate relative overflow-hidden min-h-screen">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-full h-full bg-mesh-cyan opacity-5 pointer-events-none" />

            <div className="container relative z-10 py-24 px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-center mb-20">
                        <p className="text-cyan-glow font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                            Legal Governance
                        </p>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                            Privacy <span className="text-glow-cyan">Policy</span>
                        </h1>
                        <p className="text-white/40 font-medium">
                            Last updated: January 16, 2026
                        </p>
                    </div>

                    <div className="glass-card-premium p-10 space-y-12 border border-white/5">
                        <section className="relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
                                <h2 className="text-2xl font-black text-white tracking-tight uppercase">1. Information We Collect</h2>
                            </div>
                            <p className="text-white/40 leading-relaxed font-medium pl-6 border-l border-white/5">
                                We collect information you provide when creating an account: name, email address, and optional profile information.
                                We also collect your chat messages and usage data to improve our service through advanced analytics.
                            </p>
                        </section>

                        <section className="relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
                                <h2 className="text-2xl font-black text-white tracking-tight uppercase">2. Utilization of Data</h2>
                            </div>
                            <ul className="space-y-4 pl-6 border-l border-white/5">
                                {[
                                    'Powering authentic AI-driven Islamic guidance',
                                    'Personalizing your spiritual experience',
                                    'Secure processing of subscription services',
                                    'Critical platform updates and notifications',
                                    'Maintaining systemic integrity and security'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 text-white/40 font-medium">
                                        <div className="w-1 h-1 rounded-full bg-white/20 mt-2.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
                                <h2 className="text-2xl font-black text-white tracking-tight uppercase">3. Data Security Architecture</h2>
                            </div>
                            <p className="text-white/40 leading-relaxed font-medium pl-6 border-l border-white/5">
                                We employ industry-leading encryption protocols and decentralized security measures to safeguard your data.
                                All sensitive metrics are end-to-end encrypted both in transit and at rest.
                            </p>
                        </section>

                        {/* More sections could be added but for brevity keep the core structure */}

                        <section className="pt-12 border-t border-white/5">
                            <h2 className="text-sm font-black text-white/20 uppercase tracking-[0.3em] mb-6">Contact Legal Support</h2>
                            <p className="text-white/40 leading-relaxed font-medium">
                                For inquiries regarding data processing, reach us at:{' '}
                                <a href="mailto:privacy@gestusadine.com" className="text-cyan-glow hover:underline underline-offset-4">
                                    privacy@gestusadine.com
                                </a>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
