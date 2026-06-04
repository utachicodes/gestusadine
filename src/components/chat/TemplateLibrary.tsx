import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FileText, Search, Sparkles, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import type { SubscriptionTier } from '@/auth/AuthContext';
import { tierRank } from '@/data/subscription';
import { useTr, type Loc } from '@/lib/i18n';

type TemplateCategory = 'prayer' | 'fasting' | 'business' | 'family' | 'general';

interface Template {
    id: string;
    name: Loc;
    description: Loc;
    category: TemplateCategory;
    tier: SubscriptionTier;
    prompt: string;
}

const TIER_LABEL: Record<SubscriptionTier, Loc> = {
    free: { en: 'Seeker', fr: 'Chercheur' },
    student: { en: 'Student', fr: 'Étudiant' },
    pro: { en: 'Pro', fr: 'Pro' },
};

const CATEGORY_LABEL: Record<TemplateCategory, Loc> = {
    prayer: { en: 'prayer', fr: 'prière' },
    fasting: { en: 'fasting', fr: 'jeûne' },
    business: { en: 'business', fr: 'affaires' },
    family: { en: 'family', fr: 'famille' },
    general: { en: 'general', fr: 'général' },
};

const templates: Template[] = [
    {
        id: 'ramadan-guide',
        name: { en: 'Ramadan Fasting Guide', fr: 'Guide du jeûne du Ramadan' },
        description: { en: 'Complete guidance on fasting during Ramadan', fr: 'Guide complet sur le jeûne pendant le Ramadan' },
        category: 'fasting',
        tier: 'student',
        prompt: 'Provide comprehensive guidance on fasting in Ramadan, including rules, benefits, and common questions.',
    },
    {
        id: 'halal-business',
        name: { en: 'Halal Business Practices', fr: 'Pratiques commerciales halal' },
        description: { en: 'Guidelines for conducting business according to Islamic principles', fr: 'Règles pour mener des affaires selon les principes islamiques' },
        category: 'business',
        tier: 'student',
        prompt: 'What are the Islamic guidelines for conducting business ethically? Cover halal practices, forbidden transactions, and proper conduct.',
    },
    {
        id: 'marriage-rights',
        name: { en: 'Marriage Rights & Duties', fr: 'Droits et devoirs du mariage' },
        description: { en: 'Rights and responsibilities of spouses in Islamic marriage', fr: 'Droits et responsabilités des époux dans le mariage islamique' },
        category: 'family',
        tier: 'student',
        prompt: 'Explain the rights and duties of husband and wife in an Islamic marriage according to Quran and Sunnah.',
    },
    {
        id: 'zakat-calculation',
        name: { en: 'Zakat Calculation Guide', fr: 'Guide de calcul de la Zakat' },
        description: { en: 'Detailed guide on calculating and distributing Zakat', fr: 'Guide détaillé pour calculer et distribuer la Zakat' },
        category: 'general',
        tier: 'pro',
        prompt: 'Provide a detailed explanation of Zakat calculation, nisab, types of wealth subject to Zakat, and proper distribution.',
    },
    {
        id: 'inheritance-law',
        name: { en: 'Islamic Inheritance Laws', fr: 'Lois successorales islamiques' },
        description: { en: 'Understanding Islamic inheritance distribution', fr: 'Comprendre la répartition de l’héritage en islam' },
        category: 'family',
        tier: 'pro',
        prompt: 'Explain Islamic inheritance laws (Faraid) with examples of how wealth is distributed among heirs.',
    },
];

interface TemplateLibraryProps {
    onSelectTemplate: (prompt: string) => void;
    userTier: SubscriptionTier;
}

export function TemplateLibrary({ onSelectTemplate, userTier }: TemplateLibraryProps) {
    const tr = useTr();
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const canAccessTemplate = (tier: SubscriptionTier): boolean => tierRank(userTier) >= tierRank(tier);

    const filteredTemplates = templates.filter((template) => {
        const q = searchQuery.toLowerCase();
        return tr(template.name).toLowerCase().includes(q) || tr(template.description).toLowerCase().includes(q);
    });

    const getCategoryColor = (category: TemplateCategory) => {
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
                        <h3 className="font-semibold text-islamic-dark dark:text-white">{tr({ en: 'Question Templates', fr: 'Modèles de questions' })}</h3>
                    </div>
                    <Sparkles className="w-5 h-5 text-islamic-gold" />
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-islamic-dark/40" />
                    <input
                        type="text"
                        placeholder={tr({ en: 'Search templates...', fr: 'Rechercher des modèles...' })}
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
                                        {tr(template.name)}
                                        {!hasAccess && <Lock className="w-3 h-3 text-islamic-gold" />}
                                    </h4>
                                    <div className="flex gap-2">
                                        <Badge variant="secondary" className={`text-xs ${getCategoryColor(template.category)}`}>
                                            {tr(CATEGORY_LABEL[template.category])}
                                        </Badge>
                                        {template.tier !== 'free' && (
                                            <Badge variant="secondary" className="text-xs bg-islamic-gold/10 text-islamic-gold">
                                                {tr(TIER_LABEL[template.tier])}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-islamic-dark/60 dark:text-gray-400">
                                    {tr(template.description)}
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
                        <DialogTitle>{selectedTemplate ? tr(selectedTemplate.name) : ''}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-islamic-dark/70 dark:text-gray-300">
                            {selectedTemplate ? tr(selectedTemplate.description) : ''}
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
                                {tr({ en: 'Use This Template', fr: 'Utiliser ce modèle' })}
                            </Button>
                            <Button
                                onClick={() => setSelectedTemplate(null)}
                                variant="outline"
                            >
                                {tr({ en: 'Cancel', fr: 'Annuler' })}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
