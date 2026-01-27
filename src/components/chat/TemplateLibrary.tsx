import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FileText, Search, Sparkles, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface Template {
    id: string;
    name: string;
    description: string;
    category: 'prayer' | 'fasting' | 'business' | 'family' | 'general';
    tier: 'free' | 'core' | 'pro';
    prompt: string;
}

const templates: Template[] = [
    {
        id: 'prayer-times',
        name: 'Prayer Time Guidance',
        description: 'Learn about the importance and timing of the five daily prayers',
        category: 'prayer',
        tier: 'free',
        prompt: 'Can you explain the five daily prayers, their times, and importance in Islam?',
    },
    {
        id: 'ramadan-guide',
        name: 'Ramadan Fasting Guide',
        description: 'Complete guidance on fasting during Ramadan',
        category: 'fasting',
        tier: 'core',
        prompt: 'Provide comprehensive guidance on fasting in Ramadan, including rules, benefits, and common questions.',
    },
    {
        id: 'halal-business',
        name: 'Halal Business Practices',
        description: 'Guidelines for conducting business according to Islamic principles',
        category: 'business',
        tier: 'core',
        prompt: 'What are the Islamic guidelines for conducting business ethically? Cover halal practices, forbidden transactions, and proper conduct.',
    },
    {
        id: 'marriage-rights',
        name: 'Marriage Rights & Duties',
        description: 'Rights and responsibilities of spouses in Islamic marriage',
        category: 'family',
        tier: 'core',
        prompt: 'Explain the rights and duties of husband and wife in an Islamic marriage according to Quran and Sunnah.',
    },
    {
        id: 'zakat-calculation',
        name: 'Zakat Calculation Guide',
        description: 'Detailed guide on calculating and distributing Zakat',
        category: 'general',
        tier: 'pro',
        prompt: 'Provide a detailed explanation of Zakat calculation, nisab, types of wealth subject to Zakat, and proper distribution.',
    },
    {
        id: 'inheritance-law',
        name: 'Islamic Inheritance Laws',
        description: 'Understanding Islamic inheritance distribution',
        category: 'family',
        tier: 'pro',
        prompt: 'Explain Islamic inheritance laws (Faraid) with examples of how wealth is distributed among heirs.',
    },
];

interface TemplateLibraryProps {
    onSelectTemplate: (prompt: string) => void;
    userTier: 'free' | 'core' | 'pro';
}

export function TemplateLibrary({ onSelectTemplate, userTier }: TemplateLibraryProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const canAccessTemplate = (tier: 'free' | 'core' | 'pro'): boolean => {
        if (tier === 'free') return true;
        if (tier === 'core') return userTier === 'core' || userTier === 'pro';
        if (tier === 'pro') return userTier === 'pro';
        return false;
    };

    const filteredTemplates = templates.filter((template) =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getCategoryColor = (category: Template['category']) => {
        switch (category) {
            case 'prayer': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'fasting': return 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground';
            case 'business': return 'bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary-foreground';
            case 'family': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    return (
        <>
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-islamic-dark dark:text-white">Question Templates</h3>
                    </div>
                    <Sparkles className="w-5 h-5 text-islamic-gold" />
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-islamic-dark/40" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-islamic-cream dark:border-gray-700 bg-white dark:bg-gray-800 text-islamic-dark dark:text-white"
                    />
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredTemplates.map((template) => {
                        const hasAccess = canAccessTemplate(template.tier);

                        return (
                            <Card
                                key={template.id}
                                className={`p-4 ${hasAccess ? 'cursor-pointer hover:border-primary/50' : 'opacity-50'}`}
                                onClick={() => hasAccess && setSelectedTemplate(template)}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold text-sm text-islamic-dark dark:text-white flex items-center gap-2">
                                        {template.name}
                                        {!hasAccess && <Lock className="w-3 h-3 text-islamic-gold" />}
                                    </h4>
                                    <div className="flex gap-2">
                                        <Badge variant="secondary" className={`text-xs ${getCategoryColor(template.category)}`}>
                                            {template.category}
                                        </Badge>
                                        {template.tier !== 'free' && (
                                            <Badge variant="secondary" className="text-xs bg-islamic-gold/10 text-islamic-gold">
                                                {template.tier}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-islamic-dark/60 dark:text-gray-400">
                                    {template.description}
                                </p>
                            </Card>
                        );
                    })}
                </div>
            </Card>

            {/* Preview Dialog */}
            <Dialog open={selectedTemplate !== null} onOpenChange={() => setSelectedTemplate(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedTemplate?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-islamic-dark/70 dark:text-gray-300">
                            {selectedTemplate?.description}
                        </p>
                        <div className="p-4 bg-islamic-cream/30 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm font-mono text-islamic-dark dark:text-gray-200">
                                "{selectedTemplate?.prompt}"
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    if (selectedTemplate) {
                                        onSelectTemplate(selectedTemplate.prompt);
                                        setSelectedTemplate(null);
                                    }
                                }}
                                className="flex-1 btn-islamic"
                            >
                                Use This Template
                            </Button>
                            <Button
                                onClick={() => setSelectedTemplate(null)}
                                variant="outline"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
