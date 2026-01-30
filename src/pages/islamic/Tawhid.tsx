import React from 'react';
import { ShieldCheck, BookOpen, Fingerprint } from 'lucide-react';
import { Button } from "@/components/ui/button";

const TawhidPage = () => {
    return (
        <div className="flex-1">
            <section className="container py-10 md:py-16 space-y-12">
                <header className="text-center max-w-3xl mx-auto">
                    <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-primary mb-2 font-semibold">
                        The Foundation
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                        Kitab <span className="text-gradient">At-Tawhid</span>
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Understanding the Oneness of Allah based on the methodology of the Salaf-us-Saliheen.
                        References from <strong>Sheikh Al-Islam Ibn Taymiyyah</strong> and <strong>Imam Muhammad ibn Abd al-Wahhab</strong>.
                    </p>
                </header>

                {/* 3 Categories of Tawhid */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="islamic-card p-8 text-center space-y-5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group border-t-4 border-t-transparent hover:border-t-blue-500">
                        <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                            <Fingerprint className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">Tawhid ar-Rububiyyah</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Lordship. Believing that Allah is the only Creator, Provider, and Sustainer of everything.
                            </p>
                        </div>
                    </div>

                    <div className="islamic-card p-8 text-center space-y-5 hover:shadow-2xl hover:shadow-islamic-emerald/10 transition-all duration-300 group border-t-4 border-t-transparent hover:border-t-islamic-emerald transform scale-105 shadow-xl shadow-islamic-emerald/5 z-10">
                        <div className="mx-auto w-16 h-16 bg-islamic-emerald-50 dark:bg-islamic-emerald-900/20 rounded-2xl flex items-center justify-center text-islamic-emerald-600 group-hover:scale-110 transition-transform duration-300">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-islamic-emerald-600 transition-colors">Tawhid al-Uluhiyyah</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Worship. Directing all acts of worship (Prayer, Dua, Fear, Hope) to Allah alone.
                            </p>
                        </div>
                    </div>

                    <div className="islamic-card p-8 text-center space-y-5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 group border-t-4 border-t-transparent hover:border-t-purple-500">
                        <div className="mx-auto w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">Asma wa Sifat</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Names & Attributes. Affirming what Allah affirmed for Himself without distortion or likeness.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Resources Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold border-b pb-2">Key Texts</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex gap-4 p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                            <div className="h-24 w-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded shadow-sm flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg">Al-Aqeedah Al-Wasitiyyah</h4>
                                <p className="text-xs text-muted-foreground mb-2">By Ibn Taymiyyah</p>
                                <p className="text-sm mb-3">A summary of the creed of Ahlus-Sunnah wal-Jama'ah.</p>
                                <Button size="sm" variant="secondary">Start Reading</Button>
                            </div>
                        </div>

                        <div className="flex gap-4 p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                            <div className="h-24 w-16 bg-gradient-to-br from-amber-200 to-amber-300 rounded shadow-sm flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg">Kitab at-Tawhid</h4>
                                <p className="text-xs text-muted-foreground mb-2">By Muhammad ibn Abd al-Wahhab</p>
                                <p className="text-sm mb-3">The book of Monotheism regarding the obligation to worship Allah alone.</p>
                                <Button size="sm" variant="secondary">Start Reading</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TawhidPage;
