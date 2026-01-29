import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
    const [question, setQuestion] = useState('');
    const { toast } = useToast();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!question.trim()) {
            toast({
                title: t("Error"),
                description: t("Please enter a question"),
                variant: "destructive"
            });
            return;
        }

        if (!user) {
            toast({
                title: t('auth.required'),
                description: t('auth.signin'),
                variant: "destructive"
            });
            navigate('/login');
            return;
        }

        navigate('/chat');
    };

    return (
        <section className="relative pt-32 pb-32 overflow-hidden bg-background">
            {/* Minimalist Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>

            <div className="container relative z-10">
                <div className="max-w-4xl mx-auto text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground mb-8 bg-background/50 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                        {t('app.version') || "GëstuSaDine Platform"}
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-8 leading-[1.1]">
                        {t('hero.heading') || "Knowledge without borders."}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                        {t('hero.subtitle') || "Access authentic Islamic knowledge through our advanced AI-powered platform. Verified, precise, and accessible."}
                    </p>

                    {/* Search / CTA Area */}
                    <div className="max-w-2xl mx-auto mb-16">
                        <form onSubmit={handleSubmit} className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center bg-card rounded-lg border shadow-sm p-2">
                                <Search className="ml-3 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder={t('chat.placeholder') || "Ask a question..."}
                                    className="flex-1 bg-transparent border-none px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-lg"
                                />
                                <Button type="submit" size="lg" className="rounded-md px-8">
                                    {t('hero.ask_now') || "Ask"}
                                </Button>
                            </div>
                        </form>
                        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                            <span>Trusted by 10,000+ users</span>
                            <span>â€¢</span>
                            <span>Verified Sources</span>
                        </div>
                    </div>

                    {/* Quick Actions (Replacing animated blobs with functional links) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
                        <div onClick={() => navigate('/fatwa')} className="group p-6 rounded-xl border bg-card hover:bg-accent/5 transition-colors cursor-pointer">
                            <h3 className="font-semibold text-foreground mb-2 flex items-center">
                                Fatwa & Guidance
                                <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </h3>
                            <p className="text-sm text-muted-foreground">Get answers based on authentic fiqh.</p>
                        </div>
                        <div onClick={() => navigate('/library')} className="group p-6 rounded-xl border bg-card hover:bg-accent/5 transition-colors cursor-pointer">
                            <h3 className="font-semibold text-foreground mb-2 flex items-center">
                                Digital Library
                                <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </h3>
                            <p className="text-sm text-muted-foreground">Access thousands of books and resources.</p>
                        </div>
                        <div onClick={() => navigate('/classes')} className="group p-6 rounded-xl border bg-card hover:bg-accent/5 transition-colors cursor-pointer">
                            <h3 className="font-semibold text-foreground mb-2 flex items-center">
                                Live Classes
                                <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </h3>
                            <p className="text-sm text-muted-foreground">Join scholars and learn in real-time.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;
