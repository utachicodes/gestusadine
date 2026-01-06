import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'react-router-dom';
import {
    Users,
    Brain,
    Download,
    Upload,
    Search,
    AlertCircle,
    CheckCircle2,
    Clock,
    Zap,
    FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCouncil, ConsensusResult, Document, RAGResult } from '@/hooks/use-council';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    CouncilQueryForm,
    CouncilMembersDisplay,
    ConsensusScoreDisplay,
    MemberResponseDisplay,
    DocumentUploadForm
} from '@/components/council/CouncilDisplay';

const CirclePage: React.FC = () => {
    const { toast } = useToast();
    const { t } = useLanguage();
    const location = useLocation();
    const council = useCouncil();
    const [activeResult, setActiveResult] = React.useState<ConsensusResult | null>(null);
    const [showDocumentForm, setShowDocumentForm] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<RAGResult | null>(null);

    const askNowQuery = React.useMemo(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q');
        return q ? q.trim() : '';
    }, [location.search]);

    const autoSubmitKey = React.useMemo(() => {
        return askNowQuery ? `asknow:${askNowQuery}` : '';
    }, [askNowQuery]);

    const hasAutoSubmittedRef = React.useRef(false);

    React.useEffect(() => {
        if (!askNowQuery) return;
        if (hasAutoSubmittedRef.current) return;
        hasAutoSubmittedRef.current = true;
        handleAskCouncil(askNowQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [askNowQuery]);

    const handleAskCouncil = async (query: string) => {
        try {
            const result = await council.ask({ query, useRAG: true });
            setActiveResult(result);
            toast({
                title: 'Success',
                description: 'The Council has provided their analysis.',
                variant: 'default'
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to get council response';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive'
            });
        }
    };

    const handleUploadDocument = async (doc: {
        docId: string;
        title: string;
        content: string;
        source: string;
        category?: string;
    }) => {
        try {
            await council.uploadDocument(doc);
            setShowDocumentForm(false);
            toast({
                title: 'Success',
                description: 'Document uploaded and indexed successfully.',
                variant: 'default'
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to upload document';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive'
            });
        }
    };

    const handleSearchRAG = async () => {
        if (!searchQuery.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a search query.',
                variant: 'destructive'
            });
            return;
        }

        try {
            const results = await council.searchRAG({ query: searchQuery });
            setSearchResults(results);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : t('error.search_failed');
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive'
            });
        }
    };

    const handleDeleteDocument = async (docId: string) => {
        try {
            await council.deleteDocument(docId);
            toast({
                title: 'Success',
                description: 'Document deleted successfully.',
                variant: 'default'
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : t('error.delete_failed');
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive'
            });
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-gradient-to-br from-islamic-cream/30 via-[#efefec] to-islamic-gold/10">
            {/* Header Section */}
            <div className="border-b border-islamic-gold/20 bg-[#efefec]/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-islamic-dark flex items-center gap-3">
                                <Users className="w-8 h-8 text-islamic-gold" />
                                Circle of Knowledge
                            </h1>
                            <p className="text-islamic-dark/70 mt-2 max-w-2xl">
                                The Circle of Knowledge: A multi-agent epistemic architecture for Islamic scholarly reasoning, combining Fiqh jurisprudence, Aqeedah boundaries, epistemic humility, and contemporary context.
                            </p>
                        </div>
                    </div>

                    {/* Status Bar */}
                    {council.isCouncilHealthy && (
                        <Alert className="bg-primary/5 border-primary/20">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <AlertDescription className="text-primary/90">
                                Council is active and ready with {council.members?.length || 4} expert members
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Tabs defaultValue="ask-council" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 bg-islamic-cream/30 p-1 rounded-md border border-islamic-gold/20">
                        <TabsTrigger value="ask-council" className="flex items-center gap-2 text-islamic-dark">
                            <Brain className="w-4 h-4" />
                            Ask Council
                        </TabsTrigger>
                        <TabsTrigger value="members" className="flex items-center gap-2 text-islamic-dark">
                            <Users className="w-4 h-4" />
                            Members
                        </TabsTrigger>
                        <TabsTrigger value="documents" className="flex items-center gap-2 text-islamic-dark">
                            <FileText className="w-4 h-4" />
                            Knowledge Base
                        </TabsTrigger>
                        <TabsTrigger value="search" className="flex items-center gap-2 text-islamic-dark">
                            <Search className="w-4 h-4" />
                            Search RAG
                        </TabsTrigger>
                    </TabsList>

                    {/* Ask Council Tab */}
                    <TabsContent value="ask-council" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <Card className="border-islamic-gold/30 sticky top-24">
                                    <CardHeader>
                                        <CardTitle className="text-islamic-dark">Submit Your Question</CardTitle>
                                        <CardDescription>Ask complex questions for expert analysis</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <CouncilQueryForm
                                            onSubmit={handleAskCouncil}
                                            isLoading={council.askLoading || council.isProcessing}
                                            initialQuery={askNowQuery || undefined}
                                            autoSubmitKey={autoSubmitKey || undefined}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-2">
                                {council.isProcessing && (
                                    <Card className="border-islamic-gold/30 bg-gradient-to-br from-islamic-cream/50 to-[#efefec]">
                                        <CardContent className="pt-8">
                                            <div className="text-center space-y-4">
                                                <div className="inline-block">
                                                    <div className="w-12 h-12 border-4 border-islamic-gold border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                                <p className="text-islamic-dark font-semibold">The Council is Deliberating...</p>
                                                <p className="text-islamic-dark/70 text-sm">
                                                    Our expert members are analyzing your question from multiple perspectives.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {activeResult && !council.isProcessing && (
                                    <div className="space-y-6">
                                        {/* Synthesis Result */}
                                        <Card className="border-islamic-gold/30 bg-gradient-to-br from-islamic-cream/50 to-[#efefec]">
                                            <CardHeader>
                                                <CardTitle className="text-islamic-dark">Council Consensus</CardTitle>
                                                <CardDescription>Synthesized response from all members</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <p className="text-islamic-dark/80 leading-relaxed">
                                                    {activeResult.synthesisResult}
                                                </p>
                                                <Separator className="my-4" />
                                                <ConsensusScoreDisplay
                                                    score={activeResult.consensusScore}
                                                    executionTime={activeResult.executionTime}
                                                />
                                            </CardContent>
                                        </Card>

                                        {/* Individual Responses */}
                                        <Card className="border-islamic-gold/30">
                                            <CardHeader>
                                                <CardTitle className="text-islamic-dark">Individual Perspectives</CardTitle>
                                                <CardDescription>Each member's analysis</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                {activeResult.initialResponses.map((response, idx) => (
                                                    <React.Fragment key={response.memberId}>
                                                        {idx > 0 && <Separator />}
                                                        <MemberResponseDisplay
                                                            memberName={response.memberName}
                                                            response={response.response}
                                                            confidence={response.confidence}
                                                        />
                                                    </React.Fragment>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {!activeResult && !council.isProcessing && (
                                    <EmptyState
                                        title="No analysis yet"
                                        description="Submit a question to see the Council's analysis"
                                        icon={Zap}
                                    />
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Members Tab */}
                    <TabsContent value="members" className="space-y-6">
                        <Card className="border-islamic-gold/30 bg-gradient-to-br from-islamic-cream/30 to-[#efefec]">
                            <CardHeader>
                                <CardTitle className="text-islamic-dark flex items-center gap-2">
                                    <Users className="w-5 h-5 text-islamic-gold" />
                                    Council Members
                                </CardTitle>
                                <CardDescription>
                                    Four expert models with diverse perspectives working together
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CouncilMembersDisplay
                                    members={council.members}
                                    isLoading={council.membersLoading}
                                />
                            </CardContent>
                        </Card>

                        {/* Member Roles Description */}
                        <Card className="border-islamic-gold/30">
                            <CardHeader>
                                <CardTitle className="text-islamic-dark">Epistemic Architecture</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <h4 className="font-semibold text-blue-900 mb-2">Fiqh Reasoning Agent</h4>
                                        <p className="text-blue-800 text-sm">
                                            Analyzes questions from an Islamic jurisprudence perspective, providing reasoning based on Quran, Sunnah, and scholarly consensus (Ijma).
                                        </p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <h4 className="font-semibold text-purple-900 mb-2">Aqeedah Boundary Agent</h4>
                                        <p className="text-purple-800 text-sm">
                                            Ensures responses align with orthodox Islamic creed and theology. Flags potential theological issues and maintains boundaries of proper belief.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                                        <h4 className="font-semibold text-primary mb-2">Humility & Abstention Agent</h4>
                                        <p className="text-muted-foreground text-sm">
                                            Recommends epistemic humility and abstention (tawaqquf) when knowledge is uncertain or requires specialized scholarship.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                        <h4 className="font-semibold text-orange-900 mb-2">Contemporary Context Agent</h4>
                                        <p className="text-orange-800 text-sm">
                                            Provides contemporary context and real-world application of Islamic principles while maintaining authenticity to classical knowledge.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <Card className="border-islamic-gold/30 sticky top-24">
                                    <CardHeader>
                                        <CardTitle className="text-islamic-dark">
                                            {showDocumentForm ? 'Upload Document' : 'Manage Knowledge Base'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {!showDocumentForm ? (
                                            <button
                                                onClick={() => setShowDocumentForm(true)}
                                                className="w-full px-4 py-3 bg-islamic-gold text-white font-semibold rounded-lg hover:bg-islamic-gold/90 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Upload className="w-5 h-5" />
                                                Add Document
                                            </button>
                                        ) : (
                                            <>
                                                <DocumentUploadForm
                                                    onSubmit={handleUploadDocument}
                                                    isLoading={council.uploadLoading}
                                                />
                                                <button
                                                    onClick={() => setShowDocumentForm(false)}
                                                    className="w-full mt-4 px-4 py-2 border border-islamic-gold/30 text-islamic-dark rounded-lg hover:bg-islamic-cream/30 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-2">
                                <Card className="border-islamic-gold/30">
                                    <CardHeader>
                                        <CardTitle className="text-islamic-dark">
                                            Indexed Documents ({council.documents?.length || 0})
                                        </CardTitle>
                                        <CardDescription>
                                            Documents that inform the Council's knowledge base
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {council.documentsLoading ? (
                                            <div className="space-y-4">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="h-20 bg-islamic-gold/10 rounded-lg animate-pulse" />
                                                ))}
                                            </div>
                                        ) : council.documents && council.documents.length > 0 ? (
                                            <div className="space-y-3">
                                                {council.documents.map((doc: Document) => (
                                                    <div
                                                        key={doc.id}
                                                        className="p-4 border border-islamic-gold/20 rounded-lg hover:bg-islamic-cream/20 transition-colors"
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h4 className="font-semibold text-islamic-dark">{doc.title}</h4>
                                                                <div className="flex gap-2 mt-1">
                                                                    <Badge variant="secondary" className="bg-islamic-gold/20 text-islamic-dark border-islamic-gold/30">
                                                                        {doc.category}
                                                                    </Badge>
                                                                    <Badge variant="outline" className="text-islamic-dark/70">
                                                                        {doc.source}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteDocument(doc.id)}
                                                                disabled={council.deleteLoading}
                                                                className="text-red-600 hover:text-red-700 font-medium text-sm"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                        <p className="text-islamic-dark/70 text-sm line-clamp-2">
                                                            {doc.content}
                                                        </p>
                                                        <p className="text-xs text-islamic-dark/50 mt-2">
                                                            {new Date(doc.uploadedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <FileText className="w-12 h-12 text-islamic-gold/30 mx-auto mb-4" />
                                                <p className="text-islamic-dark/70">No documents uploaded yet</p>
                                                <p className="text-islamic-dark/50 text-sm">
                                                    Add documents to enhance the Council's knowledge base
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Search RAG Tab */}
                    <TabsContent value="search" className="space-y-6">
                        <Card className="border-islamic-gold/30">
                            <CardHeader>
                                <CardTitle className="text-islamic-dark flex items-center gap-2">
                                    <Search className="w-5 h-5 text-islamic-gold" />
                                    Search Knowledge Base
                                </CardTitle>
                                <CardDescription>
                                    Semantic search across all indexed documents
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && handleSearchRAG()}
                                        placeholder="Search documents..."
                                        className="flex-1 px-4 py-2 border border-islamic-gold/30 rounded-lg bg-[#efefec] text-islamic-dark placeholder-islamic-dark/50 focus:outline-none focus:border-islamic-gold"
                                    />
                                    <button
                                        onClick={handleSearchRAG}
                                        disabled={council.searchLoading}
                                        className="px-6 py-2 bg-islamic-gold text-white font-semibold rounded-lg hover:bg-islamic-gold/90 disabled:opacity-50 transition-colors"
                                    >
                                        {council.searchLoading ? 'Searching...' : 'Search'}
                                    </button>
                                </div>

                                {searchResults && (
                                    <div className="mt-6 space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-islamic-dark mb-2">
                                                Relevance Score: {Math.round(searchResults.relevanceScore * 100)}%
                                            </h3>
                                        </div>

                                        {searchResults.sources.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-islamic-dark text-sm mb-2">Sources</h4>
                                                <div className="space-y-2">
                                                    {searchResults.sources.map((source, idx: number) => (
                                                        <div key={idx} className="p-2 bg-islamic-cream/30 rounded text-sm">
                                                            <p className="font-medium text-islamic-dark">{source.title}</p>
                                                            <p className="text-islamic-dark/70 text-xs">{source.source}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {searchResults.context && (
                                            <div>
                                                <h4 className="font-semibold text-islamic-dark text-sm mb-2">Context</h4>
                                                <div className="p-4 bg-islamic-cream/20 rounded border border-islamic-gold/20 text-sm text-islamic-dark/80 whitespace-pre-wrap">
                                                    {searchResults.context}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default CirclePage;
