import { motion } from 'framer-motion';
import { Heart, Users, BookOpen, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
    const { t } = useLanguage();

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
                            ABOUT US
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            About <span className="text-gradient">GÎstuSaDine</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Making authentic Islamic knowledge accessible in Wolof, French, and English
                        </p>
                    </div>

                    {/* Mission */}
                    <div className="islamic-card p-8 mb-8">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Heart className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">Our Mission</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    GÎstuSaDine bridges the gap between traditional Islamic scholarship and modern technology.
                                    We provide AI-powered guidance rooted in authentic sources, making Islamic knowledge accessible
                                    to Senegalese and West African Muslims in their native languages.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="islamic-card p-6">
                            <BookOpen className="w-8 h-8 text-primary mb-3" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">Authentic Sources</h3>
                            <p className="text-muted-foreground text-sm">
                                All guidance is derived from Quran, authentic Hadith, and recognized Islamic scholarship
                            </p>
                        </div>

                        <div className="islamic-card p-6">
                            <Users className="w-8 h-8 text-accent mb-3" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">Multi-Perspective</h3>
                            <p className="text-muted-foreground text-sm">
                                We present multiple scholarly viewpoints to give you a comprehensive understanding
                            </p>
                        </div>

                        <div className="islamic-card p-6">
                            <Award className="w-8 h-8 text-secondary mb-3" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">Cultural Relevance</h3>
                            <p className="text-muted-foreground text-sm">
                                Designed specifically for West African Muslims, with support for Wolof, French, and English
                            </p>
                        </div>

                        <div className="islamic-card p-6">
                            <Heart className="w-8 h-8 text-islamic-gold mb-3" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">Community Driven</h3>
                            <p className="text-muted-foreground text-sm">
                                Built by and for the Muslim community, continuously improving based on your feedback
                            </p>
                        </div>
                    </div>

                    {/* Team Note */}
                    <div className="islamic-card p-8 text-center">
                        <p className="text-muted-foreground mb-4">
                            Built with ‚ù§Ô∏è in Senegal for the Muslim Ummah
                        </p>
                        <p className="text-sm text-muted-foreground/70">
                            May Allah accept this effort and make it beneficial for all
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
