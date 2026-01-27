import React from 'react';
import {
    Award,
    BookOpen,
    BrickWall,
    Bug,
    Calendar,
    Crown,
    Lightbulb,
    Map,
    PenTool,
    Shield
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type BadgeType =
    | 'Founding Member'
    | '1 Year Journey'
    | 'Library Builder'
    | 'Explorer'
    | 'Bug Hunter'
    | 'Idea Factory'
    | 'Top 1%'
    | 'Teacher'
    | 'Beta Tester'
    | 'Legend';

interface BadgeConfig {
    icon: React.ReactNode;
    color: string;
    bg: string;
    description: string;
}

const BADGES: Record<BadgeType, BadgeConfig> = {
    'Founding Member': {
        icon: <BrickWall className="w-5 h-5" />,
        color: "text-amber-600",
        bg: "bg-amber-100",
        description: "One of the first to join the circle."
    },
    '1 Year Journey': {
        icon: <Calendar className="w-5 h-5" />,
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        description: "Stayed with us for a full lunar year."
    },
    'Library Builder': {
        icon: <BookOpen className="w-5 h-5" />,
        color: "text-blue-600",
        bg: "bg-blue-100",
        description: "Contributed to the community knowledge base."
    },
    'Explorer': {
        icon: <Map className="w-5 h-5" />,
        color: "text-orange-600",
        bg: "bg-orange-100",
        description: "Visited every section of the platform."
    },
    'Bug Hunter': {
        icon: <Bug className="w-5 h-5" />,
        color: "text-red-500",
        bg: "bg-red-100",
        description: "Helped improve the system by finding errors."
    },
    'Idea Factory': {
        icon: <Lightbulb className="w-5 h-5" />,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        description: "Provided valuable suggestions."
    },
    'Top 1%': {
        icon: <Crown className="w-5 h-5 fill-current" />,
        color: "text-purple-600",
        bg: "bg-purple-100",
        description: "Achieved a score in the top 1% of students."
    },
    'Teacher': {
        icon: <PenTool className="w-5 h-5" />,
        color: "text-slate-600",
        bg: "bg-slate-100",
        description: "Helped explain concepts to others."
    },
    'Beta Tester': {
        icon: <Shield className="w-5 h-5" />,
        color: "text-teal-600",
        bg: "bg-teal-100",
        description: "Tested new features before release."
    },
    'Legend': {
        icon: <Award className="w-5 h-5" />,
        color: "text-islamic-gold",
        bg: "bg-islamic-gold/10",
        description: "A master of knowledge and practice."
    }
};

interface BadgeListProps {
    badges: BadgeType[];
}

export const BadgeList: React.FC<BadgeListProps> = ({ badges }) => {
    return (
        <TooltipProvider>
            <div className="flex flex-wrap gap-3">
                {badges.map((badge, idx) => {
                    const config = BADGES[badge];
                    if (!config) return null;
                    return (
                        <Tooltip key={idx}>
                            <TooltipTrigger>
                                <div className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-b-4 transition-all hover:-translate-y-1 ${config.bg} border-${config.color.split('-')[1]}-200`}>
                                    <div className={`${config.color}`}>
                                        {config.icon}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">{badge}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="font-semibold">{badge}</p>
                                <p className="text-xs">{config.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
        </TooltipProvider>
    );
};
