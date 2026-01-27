import React, { useState } from 'react';
import { Book, GraduationCap, PlayCircle, Lock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ClassModule {
    id: string;
    title: string;
    category: 'Fiqh' | 'Hadith' | 'Tawhid' | 'Quran';
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    lessons: number;
    locked: boolean;
    image?: string;
}

const MOCK_CLASSES: ClassModule[] = [
    {
        id: '1',
        title: 'Purification (Taharah) Essentials',
        category: 'Fiqh',
        level: 'Beginner',
        duration: '2h 30m',
        lessons: 5,
        locked: false,
    },
    {
        id: '2',
        title: '40 Hadith Al-Nawawi: Part 1',
        category: 'Hadith',
        level: 'Beginner',
        duration: '4h 15m',
        lessons: 10,
        locked: false,
    },
    {
        id: '3',
        title: 'Three Fundamental Principles (Usool ath-Thalatha)',
        category: 'Tawhid',
        level: 'Beginner',
        duration: '3h 00m',
        lessons: 8,
        locked: false,
    },
    {
        id: '4',
        title: 'Fiqh of Prayer (Salah)',
        category: 'Fiqh',
        level: 'Intermediate',
        duration: '5h 00m',
        lessons: 12,
        locked: true,
    },
    {
        id: '5',
        title: 'Kitab at-Tawhid: Chapter 1-10',
        category: 'Tawhid',
        level: 'Advanced',
        duration: '6h 30m',
        lessons: 15,
        locked: true,
    },
];

const Classes = () => {
    const [filter, setFilter] = useState<'All' | 'Fiqh' | 'Hadith' | 'Tawhid'>('All');

    const filteredClasses = filter === 'All'
        ? MOCK_CLASSES
        : MOCK_CLASSES.filter(c => c.category === filter);

    return (
        <div className="flex-1">
            <section className="container py-10 md:py-16 space-y-8">
                <header>
                    <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-primary mb-2 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        Structured Learning
                    </p>
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-serif">
                        GëstuSaDine <span className="bg-clip-text text-transparent bg-gradient-to-r from-islamic-gold-600 to-islamic-gold-400">Classes</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl">
                        Join structured courses designed to take you from a student of knowledge (Talib) to higher levels of understanding.
                        Complete quizzes and assignments to earn Ilm Points.
                    </p>
                </header>

                {/* Filter Tabs */}
                <div className="flex gap-2 pb-4 overflow-x-auto">
                    {['All', 'Fiqh', 'Hadith', 'Tawhid'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat as any)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary/10 text-muted-foreground hover:bg-secondary/20'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Classes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map((item) => (
                        <div key={item.id} className="islamic-card group relative overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-t-4 border-t-transparent hover:border-t-islamic-gold">
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-islamic-gold/5 to-islamic-primary/5 rounded-bl-[100px] -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-110" />

                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gold-shine opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            <div className="p-6 flex-1 flex flex-col relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge
                                        className={
                                            item.category === 'Tawhid' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200' :
                                                item.category === 'Fiqh' ? 'bg-islamic-emerald-100 text-islamic-emerald-800 hover:bg-islamic-emerald-200 border-islamic-emerald-200' :
                                                    'bg-islamic-blue-100 text-islamic-blue-800 hover:bg-islamic-blue-200 border-islamic-blue-200'
                                        }
                                        variant="outline"
                                    >
                                        {item.category}
                                    </Badge>
                                    {item.locked ? (
                                        <div className="p-2 bg-slate-100 rounded-full text-slate-400">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                    ) : (
                                        <div className="p-2 bg-islamic-gold/10 rounded-full text-islamic-gold-600">
                                            <PlayCircle className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-islamic-gold-600 transition-colors duration-300">
                                    {item.title}
                                </h3>

                                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-6">
                                    <span className="flex items-center gap-1.5 p-1 px-2 rounded-md bg-secondary/50">
                                        <GraduationCap className="w-3.5 h-3.5" />
                                        {item.level}
                                    </span>
                                    <span className="flex items-center gap-1.5 p-1 px-2 rounded-md bg-secondary/50">
                                        <Book className="w-3.5 h-3.5" />
                                        {item.lessons} Lessons
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground mt-auto leading-relaxed">
                                    {item.locked
                                        ? "Reach a higher rank to unlock this wisdom."
                                        : "Begin this journey to increase your knowledge."}
                                </p>
                            </div>

                            <div className="p-4 border-t border-border/50 bg-gradient-to-b from-transparent to-muted/20 backdrop-blur-sm">
                                <button
                                    className={`w-full py-3 rounded-full font-semibold text-sm transition-all duration-300 ${item.locked
                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                        : "btn-islamic text-white shadow-lg hover:shadow-islamic-gold/25"
                                        }`}
                                    disabled={item.locked}
                                >
                                    {item.locked ? 'Currently Locked' : 'Start Learning'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Classes;
