import React, { useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { BadgeList, BadgeType } from '@/components/gamification/BadgeList';
import { RankDisplay } from '@/components/gamification/RankDisplay';
import {
    Calendar,
    Trophy,
    Flame,
    Target,
    BookOpen,
    Clock,
    Medal,
    Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Mock Data for Profile
const MOCK_PROFILE = {
    joinDate: 'Ramadan 1445',
    streak: 12,
    totalXp: 2450,
    quizzesTaken: 45,
    perfectScores: 18,
    timeSpent: '12h 30m',
    consistency: Array.from({ length: 365 }, (_, i) => ({
        date: new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000),
        level: Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0
    }))
};

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

const ConsistencyGraph = ({ data }: { data: any[] }) => {
    // Render last 3 months ~ 90 days
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
    const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

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
                                <p className="text-muted-foreground">Joined {MOCK_PROFILE.joinDate}</p>
                            </div>

                            <RankDisplay currentRank="Talib" currentPoints={MOCK_PROFILE.totalXp} />

                            <Button className="w-full btn-islamic-outlined gap-2">
                                <Share2 className="w-4 h-4" /> Share Profile
                            </Button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8 w-full">

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <StatCard
                                icon={Flame}
                                label="Current Streak"
                                value={`${MOCK_PROFILE.streak} Days`}
                                subtext="Keep it up!"
                                delay={100}
                            />
                            <StatCard
                                icon={Target}
                                label="Quizzes Taken"
                                value={MOCK_PROFILE.quizzesTaken}
                                subtext={`${MOCK_PROFILE.perfectScores} Perfect Scores`}
                                delay={200}
                            />
                            <StatCard
                                icon={Clock}
                                label="Learning Time"
                                value={MOCK_PROFILE.timeSpent}
                                subtext="This Month"
                                delay={300}
                            />
                        </div>

                        {/* Consistency Graph */}
                        <div className="islamic-card p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    Knowledge Consistency
                                </h3>
                                <div className="text-xs text-muted-foreground">Last 3 Months</div>
                            </div>
                            <ConsistencyGraph data={MOCK_PROFILE.consistency} />
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                <span>Less</span>
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 rounded-sm bg-secondary/20" />
                                    <div className="w-3 h-3 rounded-sm bg-primary/40" />
                                    <div className="w-3 h-3 rounded-sm bg-primary/70" />
                                    <div className="w-3 h-3 rounded-sm bg-primary" />
                                </div>
                                <span>More</span>
                            </div>
                        </div>

                        {/* Trophy Room (Badges) */}
                        <div className="islamic-card p-6">
                            <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
                                <Medal className="w-5 h-5 text-islamic-gold" />
                                Trophy Case
                            </h3>
                            <BadgeList
                                badges={[
                                    'Founding Member',
                                    'Explorer',
                                    'Beta Tester',
                                    'Library Builder',
                                    'Top 1%'
                                ]}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
