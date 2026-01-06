import React from 'react';
import { Brain, Users, Zap, Award, TrendingUp, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export interface CouncilMember {
    id: string;
    name: string;
    role: string;
    modelId: string;
    temperature: number;
}

interface CouncilMembersDisplayProps {
    members: CouncilMember[] | undefined;
    isLoading: boolean;
}

export const CouncilMembersDisplay: React.FC<CouncilMembersDisplayProps> = ({ members, isLoading }) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-gradient-to-r from-islamic-gold/10 to-islamic-gold/20 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (!members || members.length === 0) {
        return <div className="text-center text-islamic-dark/50 py-12">No council members available</div>;
    }

    const memberIcons: Record<string, React.ReactNode> = {
        'member-logic': <Brain className="w-8 h-8 text-blue-500" />,
        'member-creativity': <Zap className="w-8 h-8 text-purple-500" />,
        'member-ethics': <Shield className="w-8 h-8 text-primary" />,
        'member-critic': <Award className="w-8 h-8 text-orange-500" />
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map(member => (
                <Card key={member.id} className="border-islamic-gold/30 hover:border-islamic-gold/60 transition-colors">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-islamic-gold/10 rounded-lg">
                                    {memberIcons[member.id]}
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-islamic-dark">{member.name}</CardTitle>
                                    <CardDescription className="text-islamic-dark/70">{member.role}</CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <div className="text-sm text-islamic-dark/70 mb-1">Model</div>
                            <Badge variant="secondary" className="bg-islamic-gold/20 text-islamic-dark border-islamic-gold/30">
                                {member.modelId.split('/')[1] || member.modelId}
                            </Badge>
                        </div>
                        <div>
                            <div className="text-sm text-islamic-dark/70 mb-1">Creativity Level</div>
                            <Progress value={member.temperature * 50} className="h-2" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

interface ConsensusScoreDisplayProps {
    score: number;
    executionTime: number;
}

export const ConsensusScoreDisplay: React.FC<ConsensusScoreDisplayProps> = ({ score, executionTime }) => {
    const scorePercentage = Math.round(score * 100);
    const getScoreColor = () => {
        if (scorePercentage >= 80) return 'text-primary';
        if (scorePercentage >= 60) return 'text-blue-600';
        if (scorePercentage >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <Card className="border-islamic-gold/30 bg-gradient-to-br from-islamic-cream/50 to-[#efefec]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-islamic-dark">
                    <TrendingUp className="w-5 h-5" />
                    Consensus Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-islamic-dark/70">Consensus Score</span>
                        <span className={`text-2xl font-bold ${getScoreColor()}`}>{scorePercentage}%</span>
                    </div>
                    <Progress value={scorePercentage} className="h-3" />
                </div>
                <div className="pt-2 border-t border-islamic-gold/20">
                    <div className="text-sm text-islamic-dark/70">
                        <div className="flex justify-between">
                            <span>Processing Time</span>
                            <span className="font-semibold text-islamic-dark">{(executionTime / 1000).toFixed(2)}s</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

interface MemberResponseDisplayProps {
    memberName: string;
    response: string;
    confidence: number;
}

export const MemberResponseDisplay: React.FC<MemberResponseDisplayProps> = ({
    memberName,
    response,
    confidence
}) => {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold text-islamic-dark">{memberName}</h4>
                <Badge variant="outline" className="border-islamic-gold/30 text-islamic-dark/70">
                    {Math.round(confidence * 100)}% Confidence
                </Badge>
            </div>
            <p className="text-islamic-dark/80 text-sm leading-relaxed">{response}</p>
        </div>
    );
};

interface CouncilQueryFormProps {
    onSubmit: (query: string) => void;
    isLoading: boolean;
    initialQuery?: string;
    autoSubmitKey?: string;
}

export const CouncilQueryForm: React.FC<CouncilQueryFormProps> = ({ onSubmit, isLoading, initialQuery, autoSubmitKey }) => {
    const [query, setQuery] = React.useState('');

    React.useEffect(() => {
        if (typeof initialQuery === 'string' && initialQuery.trim() && !query.trim()) {
            setQuery(initialQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQuery]);

    React.useEffect(() => {
        if (autoSubmitKey && typeof initialQuery === 'string' && initialQuery.trim()) {
            onSubmit(initialQuery);
            setQuery('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoSubmitKey]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSubmit(query);
            setQuery('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium text-islamic-dark block mb-2">
                    Ask the Council
                </label>
                <textarea
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Ask a complex question and let the Council analyze it from multiple perspectives..."
                    disabled={isLoading}
                    className="w-full p-4 border border-islamic-gold/30 rounded-lg bg-[#efefec] text-islamic-dark placeholder-islamic-dark/50 focus:outline-none focus:border-islamic-gold focus:ring-2 focus:ring-islamic-gold/20 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                    rows={4}
                />
            </div>
            <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="w-full px-6 py-3 bg-islamic-gold text-white font-semibold rounded-lg hover:bg-islamic-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Council is Deliberating...
                    </>
                ) : (
                    <>
                        <Users className="w-5 h-5" />
                        Ask Council
                    </>
                )}
            </button>
        </form>
    );
};

interface DocumentUploadFormProps {
    onSubmit: (data: {
        docId: string;
        title: string;
        content: string;
        source: string;
        category?: string;
    }) => void;
    isLoading: boolean;
}

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = React.useState({
        docId: '',
        title: '',
        content: '',
        source: '',
        category: 'general'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.title.trim() && formData.content.trim()) {
            onSubmit(formData);
            setFormData({ docId: '', title: '', content: '', source: '', category: 'general' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium text-islamic-dark block mb-1">Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value, docId: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="Document title"
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-islamic-gold/30 rounded-lg bg-[#efefec] text-islamic-dark placeholder-islamic-dark/50 focus:outline-none focus:border-islamic-gold disabled:opacity-50"
                />
            </div>
            <div>
                <label className="text-sm font-medium text-islamic-dark block mb-1">Source</label>
                <input
                    type="text"
                    value={formData.source}
                    onChange={e => setFormData({ ...formData, source: e.target.value })}
                    placeholder="Document source (e.g., Islamic Text, Legal Document)"
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-islamic-gold/30 rounded-lg bg-[#efefec] text-islamic-dark placeholder-islamic-dark/50 focus:outline-none focus:border-islamic-gold disabled:opacity-50"
                />
            </div>
            <div>
                <label className="text-sm font-medium text-islamic-dark block mb-1">Category</label>
                <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-islamic-gold/30 rounded-lg bg-[#efefec] text-islamic-dark focus:outline-none focus:border-islamic-gold disabled:opacity-50"
                >
                    <option value="general">General (All Agents)</option>
                    <option value="agent-fiqh">Fiqh Reasoning Agent</option>
                    <option value="agent-aqeedah">Aqeedah Boundary Agent</option>
                    <option value="agent-humility">Humility & Abstention Agent</option>
                    <option value="agent-context">Contemporary Context Agent</option>
                </select>
            </div>
            <div>
                <label className="text-sm font-medium text-islamic-dark block mb-1">Content</label>
                <textarea
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Paste document content here"
                    disabled={isLoading}
                    className="w-full p-4 border border-islamic-gold/30 rounded-lg bg-[#efefec] text-islamic-dark placeholder-islamic-dark/50 focus:outline-none focus:border-islamic-gold disabled:opacity-50 resize-none"
                    rows={6}
                />
            </div>
            <button
                type="submit"
                disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
                className="w-full px-6 py-3 bg-islamic-gold text-white font-semibold rounded-lg hover:bg-islamic-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? 'Uploading...' : 'Upload Document'}
            </button>
        </form>
    );
};
