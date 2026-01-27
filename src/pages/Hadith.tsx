import React from 'react';
import { Scroll, Quote } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const HadithPage = () => {
    return (
        <div className="flex-1">
            <section className="container py-10 md:py-16 space-y-8">
                <header className="text-center md:text-left">
                    <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-gold mb-2 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
                        Prophetic Traditions
                    </p>
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground">
                        Sahih <span className="text-gradient">Bukhari</span> & More
                    </h1>
                    <p className="mt-4 text-muted-foreground max-w-2xl text-lg">
                        Explore the authentic sayings of the Prophet ﷺ. Our platform prioritizes
                        <span className="font-semibold text-foreground"> Sahih Al-Bukhari</span> and
                        <span className="font-semibold text-foreground"> Sahih Muslim</span>.
                    </p>
                </header>

                {/* Featured Hadith */}
                <div className="islamic-card p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-islamic-midnight to-islamic-midnight-dark opacity-[0.97]" />
                    <div className="absolute inset-0 bg-islamic-pattern opacity-10 animate-pattern-rotate" />

                    <div className="absolute -top-10 -left-10 text-islamic-gold/10 transition-transform duration-1000 group-hover:scale-110">
                        <Quote size={240} />
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                        <Badge variant="outline" className="border-islamic-gold text-islamic-gold bg-islamic-gold/10 px-4 py-1 text-sm tracking-widest uppercase">
                            Hadith of the Day
                        </Badge>

                        <div className="space-y-6 max-w-4xl mx-auto">
                            <p className="font-arabic text-4xl md:text-6xl leading-[1.6] text-white drop-shadow-md" dir="rtl">
                                « إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ »
                            </p>
                            <div className="h-px w-32 bg-gradient-to-r from-transparent via-islamic-gold to-transparent mx-auto" />
                            <p className="text-xl md:text-2xl font-serif italic text-islamic-cream leading-relaxed">
                                "Actions are judged by intentions, so each man will have what he intended."
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-semibold text-islamic-gold/80 bg-islamic-midnight/50 px-4 py-2 rounded-full backdrop-blur-sm border border-islamic-gold/20">
                            <Scroll className="w-4 h-4" />
                            <span>Sahih Al-Bukhari 1</span>
                        </div>
                    </div>
                </div>

                {/* Collections Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="islamic-card p-8 flex items-start gap-6 hover:shadow-2xl hover:shadow-islamic-emerald/10 transition-all duration-300 group cursor-pointer border border-transparent hover:border-islamic-emerald/30">
                        <div className="p-4 bg-islamic-emerald/10 rounded-2xl text-islamic-emerald-600 group-hover:scale-110 transition-transform duration-300">
                            <BookIcon />
                        </div>
                        <div className="flex-1 space-y-2">
                            <h3 className="text-2xl font-bold group-hover:text-islamic-emerald-700 transition-colors">Sahih Al-Bukhari</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                The most authentic book after the Quran. 97 books, ~7,563 hadiths.
                            </p>
                            <div className="pt-2">
                                <Button className="bg-islamic-emerald hover:bg-islamic-emerald-600 text-white rounded-full px-6 shadow-lg shadow-islamic-emerald/20">
                                    Browse Collection
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="islamic-card p-8 flex items-start gap-6 hover:shadow-2xl hover:shadow-islamic-gold/10 transition-all duration-300 group cursor-pointer border border-transparent hover:border-islamic-gold/30">
                        <div className="p-4 bg-islamic-gold/10 rounded-2xl text-islamic-gold-600 group-hover:scale-110 transition-transform duration-300">
                            <BookIcon />
                        </div>
                        <div className="flex-1 space-y-2">
                            <h3 className="text-2xl font-bold group-hover:text-islamic-gold-700 transition-colors">40 Hadith Al-Nawawi</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                A concise collection of authentic narrations covering the foundations of Islam.
                            </p>
                            <div className="pt-2">
                                <Button className="bg-islamic-gold hover:bg-islamic-gold-600 text-white rounded-full px-6 shadow-lg shadow-islamic-gold/20">
                                    Browse Collection
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const BookIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

export default HadithPage;
