import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Minus, HelpCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTr, type Loc } from '@/lib/i18n';

const faqs: { question: Loc; answer: Loc }[] = [
    {
        question: { en: 'What is GëstuSaDine?', fr: 'Qu’est-ce que GëstuSaDine ?' },
        answer: {
            en: "It's an Islamic Q&A platform that uses multiple AI agents to answer your questions. Each question is checked by a Fiqh agent, an Aqeedah agent, a modern-context agent, and a humility agent, then combined into one referenced answer covering all four Sunni madhhabs.",
            fr: "C'est une plateforme islamique de questions-réponses qui utilise plusieurs agents IA. Chaque question est vérifiée par un agent Fiqh, un agent Aqida, un agent de contexte moderne et un agent d'humilité, puis combinée en une réponse référencée couvrant les quatre écoles sunnites.",
        },
    },
    {
        question: { en: 'How do I know the answers are reliable?', fr: 'Comment savoir si les réponses sont fiables ?' },
        answer: {
            en: "Every response is generated from a curated library of authentic Islamic texts using RAG (Retrieval-Augmented Generation). The Aqeedah agent flags anything theologically problematic, and the Humility agent tells you when the AI isn't confident enough to give a definitive answer.",
            fr: "Chaque réponse est générée à partir d'une bibliothèque de textes islamiques authentiques via la RAG (génération augmentée par récupération). L'agent Aqida signale tout ce qui pose problème sur le plan théologique, et l'agent d'humilité vous indique quand l'IA n'est pas assez sûre pour donner une réponse définitive.",
        },
    },
    {
        question: { en: 'Is there a mobile app?', fr: 'Existe-t-il une application mobile ?' },
        answer: {
            en: 'Not yet. The platform works on mobile browsers. A native app is planned.',
            fr: 'Pas encore. La plateforme fonctionne sur les navigateurs mobiles. Une application native est prévue.',
        },
    },
    {
        question: { en: 'How do credits work?', fr: 'Comment fonctionnent les crédits ?' },
        answer: {
            en: 'Each AI question uses one credit. Free accounts get a monthly allowance; paid plans get far more, up to unlimited fair use. Credits reset each month.',
            fr: 'Chaque question à l’IA utilise un crédit. Les comptes gratuits disposent d’un quota mensuel ; les offres payantes en obtiennent bien plus, jusqu’à un usage illimité raisonnable. Les crédits sont réinitialisés chaque mois.',
        },
    },
    {
        question: { en: 'Can I cancel anytime?', fr: 'Puis-je annuler à tout moment ?' },
        answer: {
            en: 'Yes. Cancel from your dashboard. You keep access until the end of your billing cycle.',
            fr: 'Oui. Annulez depuis votre tableau de bord. Vous conservez l’accès jusqu’à la fin de votre cycle de facturation.',
        },
    },
];

export default function FAQ() {
    const tr = useTr();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <div className="flex-1 relative overflow-hidden min-h-screen">
            <div className="absolute inset-0 bg-warm-base -z-10" />

            <div className="container relative z-10 py-20 px-4 max-w-3xl">
                <div className="text-center mb-14">
                    <h1 className="text-4xl md:text-5xl font-bold text-deep-green mb-4 tracking-tight">
                        {tr({ en: 'Frequently asked questions', fr: 'Questions fréquentes' })}
                    </h1>
                    <p className="text-base text-deep-green/55 max-w-lg mx-auto">
                        {tr({
                            en: 'Common questions about the platform, credits, and how the AI works.',
                            fr: 'Questions courantes sur la plateforme, les crédits et le fonctionnement de l’IA.',
                        })}
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`glass-card-warm rounded-2xl overflow-hidden transition-all duration-200 ${activeIndex === index ? 'shadow-md' : ''}`}
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left group"
                            >
                                <span className={`text-base font-semibold leading-snug pr-4 ${activeIndex === index ? 'text-warm-gold' : 'text-deep-green group-hover:text-warm-gold'} transition-colors`}>
                                    {tr(faq.question)}
                                </span>
                                <div className={`p-1.5 rounded-lg flex-shrink-0 transition-all ${activeIndex === index ? 'bg-warm-gold/10 text-warm-gold' : 'bg-warm-sand/40 text-deep-green/50'}`}>
                                    {activeIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-6 pb-5 text-deep-green/60 leading-relaxed border-t border-warm-sand/60 pt-4 text-sm">
                                            {tr(faq.answer)}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center glass-card-warm rounded-2xl p-7">
                    <p className="text-deep-green/50 text-sm mb-4">{tr({ en: 'Something else?', fr: 'Une autre question ?' })}</p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-deep-green text-warm-cream font-semibold text-sm hover:bg-deep-green-light transition-colors group"
                    >
                        <HelpCircle className="w-4 h-4" />
                        {tr({ en: 'Contact us', fr: 'Nous contacter' })}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
