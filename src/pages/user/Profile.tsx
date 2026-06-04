import React from 'react';
import { useAuth } from '@/auth/AuthContext';
import { RankDisplay } from '@/components/gamification/RankDisplay';
import {
    Calendar,
    Trophy,
    Flame,
    Target,
    Clock,
    Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useProfileStats, ConsistencyDay } from '@/data/profile';
import { useTr } from '@/lib/i18n';

const StatCard = ({ icon: Icon, label, value, subtext, delay }: any) => (
    <div
        className="islamic-card p-6 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
            <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
    </div>
);

const ConsistencyGraph = ({ data }: { data: ConsistencyDay[] }) => {
    const recentData = data.slice(-91);
    return (
        <div className="flex gap-1 flex-wrap justify-center sm:justify-start">
            {recentData.map((day, i) => (
                <div
                    key={i}
                    title={day.date.toDateString()}
                    className={`w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-help ${day.level === 0 ? 'bg-secondary/20' :
                            day.level === 1 ? 'bg-primary/40' :
                                day.level === 2 ? 'bg-primary/70' :
                                    'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]'
                        }`}
                />
            ))}
        </div>
    );
};

const Profile = () => {
    const { user } = useAuth();
    const stats = useProfileStats();
    const tr = useTr();

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header / Hero */}
            <div className="relative h-64 bg-hero-gradient overflow-hidden">
                <div className="absolute inset-0 bg-islamic-pattern opacity-10 animate-pattern-rotate" />
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent" />
            </div>

            <div className="container px-4 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* User Card */}
                    <div className="w-full md:w-80 flex-shrink-0">
                        <div className="islamic-card p-6 flex flex-col items-center text-center space-y-4">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-background bg-muted shadow-xl overflow-hidden">
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary">
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 bg-islamic-gold text-white p-2 rounded-full border-4 border-background shadow-lg">
                                    <Trophy className="w-5 h-5" />
                                </div>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-foreground">{user?.email?.split('@')[0]}</h1>
                                <p className="text-muted-foreground">
                                    {tr({ en: `Joined ${stats.joinDate}`, fr: `Membre depuis ${stats.joinDate}` })}
                                </p>
                            </div>

                            <RankDisplay currentRank={stats.rank} currentPoints={stats.totalXp} />

                            <Button
                                onClick={async () => {
                                    const url = window.location.origin;
                                    const shareData = {
                                        title: 'GëstuSaDine',
                                        text: tr({
                                            en: 'Join me on GëstuSaDine: Islamic knowledge, guidance, and community.',
                                            fr: 'Rejoignez-moi sur GëstuSaDine : savoir, guidance et communauté islamiques.',
                                        }),
                                        url,
                                    };
                                    try {
                                        if (navigator.share) {
                                            await navigator.share(shareData);
                                        } else {
                                            await navigator.clipboard.writeText(url);
                                            toast(tr({ en: 'Link copied to clipboard.', fr: 'Lien copié dans le presse-papiers.' }));
                                        }
                                    } catch {
                                        // user dismissed the share sheet — no-op
                                    }
                                }}
                                className="w-full btn-islamic-outlined gap-2"
                            >
                                <Share2 className="w-4 h-4" /> {tr({ en: 'Share Profile', fr: 'Partager le profil' })}
                            </Button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8 w-full">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <StatCard
                                icon={Flame}
                                label={tr({ en: 'Current Streak', fr: 'Série actuelle' })}
                                value={tr({ en: `${stats.streak} Days`, fr: `${stats.streak} jours` })}
                                subtext={tr({ en: 'Keep it up!', fr: 'Continuez !' })}
                                delay={100}
                            />
                            <StatCard
                                icon={Target}
                                label={tr({ en: 'Quizzes Taken', fr: 'Quiz réalisés' })}
                                value={stats.quizzesTaken}
                                subtext={tr({ en: `${stats.perfectScores} Perfect Scores`, fr: `${stats.perfectScores} sans faute` })}
                                delay={200}
                            />
                            <StatCard
                                icon={Clock}
                                label={tr({ en: 'Learning Time', fr: 'Temps d’apprentissage' })}
                                value={stats.timeSpent}
                                subtext={tr({ en: 'This Month', fr: 'Ce mois-ci' })}
                                delay={300}
                            />
                        </div>

                        {/* Consistency Graph */}
                        <div className="islamic-card p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    {tr({ en: 'Knowledge Consistency', fr: 'Régularité' })}
                                </h3>
                                <div className="text-xs text-muted-foreground">{tr({ en: 'Last 3 Months', fr: '3 derniers mois' })}</div>
                            </div>
                            <ConsistencyGraph data={stats.consistency} />
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                <span>{tr({ en: 'Less', fr: 'Moins' })}</span>
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 rounded-sm bg-secondary/20" />
                                    <div className="w-3 h-3 rounded-sm bg-primary/40" />
                                    <div className="w-3 h-3 rounded-sm bg-primary/70" />
                                    <div className="w-3 h-3 rounded-sm bg-primary" />
                                </div>
                                <span>{tr({ en: 'More', fr: 'Plus' })}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
