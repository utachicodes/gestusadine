import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "What is GëstuSaDine exactly?",
        answer: "GëstuSaDine is a premium digital ecosystem that bridges authentic Islamic scholarship with advanced AI. It provides verified guidance on Fiqh, Tawheed, and daily Islamic living through a sophisticated, data-driven platform."
    },
    {
        question: "How is the AI guidance verified?",
        answer: "Our RAG (Retrieval-Augmented Generation) technology is grounded in a curated library of authentic Islamic texts. Every response is generated from these trusted sources and is subject to auditing by qualified scholars."
    },
    {
        question: "Is there a mobile app available?",
        answer: "The platform is currently optimized for web and mobile browsers. A dedicated native mobile experience is in development to provide seamless access to Islamic knowledge on the go."
    },
    {
        question: "How do the credits work?",
        answer: "Credits are used to interact with our advanced AI modules. Free users receive a monthly allocation, while Core and Pro users enjoy significantly higher or unlimited access to all platform features."
    },
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, you can manage your subscription from your dashboard. Cancellations take effect at the end of the current billing cycle, and you will retain access to your plan until then."
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <div className="flex-1 bg-deep-slate relative overflow-hidden min-h-screen">
            {/* Background patterns */}
            <div className="absolute top-0 right-0 w-full h-full bg-mesh-cyan opacity-5 pointer-events-none" />

            <div className="container relative z-10 py-32 px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-center mb-24">
                        <p className="text-cyan-glow font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                            Knowledge Base
                        </p>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                            Common <span className="text-glow-cyan">Inquiries</span>
                        </h1>
                        <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
                            Clarifying the path between faith and technology.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="glass-card-premium overflow-hidden border border-white/5 transition-all hover:border-cyan-glow/20"
                            >
                                <button
                                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                    className="w-full p-8 flex items-center justify-between text-left group"
                                >
                                    <span className={`text-lg font-black tracking-tight transition-colors ${activeIndex === index ? 'text-cyan-glow' : 'text-white'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 group-hover:text-cyan-glow transition-all ${activeIndex === index ? 'rotate-180 text-cyan-glow' : ''}`}>
                                        {activeIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <div className="px-8 pb-8 text-white/40 font-medium leading-relaxed border-t border-white/5 pt-6">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    <div className="mt-24 text-center">
                        <p className="text-white/20 text-sm font-bold uppercase tracking-widest mb-6">Still have questions?</p>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:text-cyan-glow hover:border-cyan-glow/50 hover:bg-cyan-glow/5 transition-all group"
                        >
                            <HelpCircle className="w-5 h-5" />
                            <span>Reach our support team</span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
