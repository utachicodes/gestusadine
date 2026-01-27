import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: 'What is GëstuSaDine?',
        answer: 'GëstuSaDine is an AI-powered platform that provides authentic Islamic guidance in Wolof, French, and English. We use advanced AI to help answer your questions based on Quran, authentic Hadith, and recognized Islamic scholarship.',
    },
    {
        question: 'Is the information provided authentic?',
        answer: 'Yes! All our responses are based on the Quran, authentic Hadith collections, and the works of recognized Islamic scholars. We prioritize accuracy and authenticity in all our guidance.',
    },
    {
        question: 'What are the different subscription tiers?',
        answer: 'We offer three tiers: Free (50 credits/month), Core (500 credits/month + specialized modes, themes, templates), and Pro (unlimited credits + all features). Each tier provides increasing access to our features.',
    },
    {
        question: 'How does credit usage work?',
        answer: 'Each question you ask uses 1 credit. Free users get 50 credits per month, Core users get 500, and Pro users have unlimited credits. Your credits reset at the beginning of each month.',
    },
    {
        question: 'Can I change my subscription?',
        answer: 'Yes! You can upgrade or downgrade your subscription at any time from your account settings. Changes take effect immediately, and you\'ll retain access to your current tier features until the end of your billing period.',
    },
    {
        question: 'What madhabs do you support?',
        answer: 'We primarily focus on the Maliki madhab, which is predominant in West Africa. However, we also provide perspectives from other recognized madhabs when relevant.',
    },
    {
        question: 'Is my data secure?',
        answer: 'Yes, we take security seriously. All your data is encrypted, and we never share your personal information with third parties. Your conversations are private and stored securely.',
    },
    {
        question: 'How can I report an error?',
        answer: 'If you notice an error or have concerns about any response, please contact us at +221 76 577 08 10. We review all reports and continuously improve our system.',
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="container py-12 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-muted-foreground mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                            HELP CENTER
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Frequently Asked <span className="text-gradient">Questions</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Find answers to common questions about GëstuSaDine
                        </p>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="islamic-card overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                                >
                                    <h3 className="font-semibold text-foreground pr-8">{faq.question}</h3>
                                    <ChevronDown
                                        className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 pb-6">
                                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-12 islamic-card p-8 text-center">
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            Still have questions?
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            We're here to help! Reach out to our support team.
                        </p>
                        <a href="/contact" className="btn-islamic inline-flex">
                            Contact Us
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
