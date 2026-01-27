import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { apiFetch } from '@/lib/api';

const API_BASE = '/api/council';

export interface CouncilMember {
    id: string;
    name: string;
    role: string;
    modelId: string;
    temperature: number;
}

export interface MemberResponse {
    memberId: string;
    memberName: string;
    response: string;
    reasoning: string;
    confidence: number;
}

export interface ConsensusResult {
    query: string;
    councilMembers: CouncilMember[];
    initialResponses: MemberResponse[];
    peerReviews: Array<{
        reviewerId: string;
        revieweeId: string;
        agreement: number;
        comments: string;
    }>;
    synthesisResult: string;
    consensusScore: number;
    executionTime: number;
}

export interface Document {
    id: string;
    title: string;
    content: string;
    source: string;
    uploadedAt: string;
    category: string;
}

export interface RAGResult {
    context: string;
    sources: Array<{ title: string; source: string }>;
    relevanceScore: number;
}

export function useCouncil() {
    const queryClient = useQueryClient();
    const [isProcessing, setIsProcessing] = useState(false);

    // Fetch council members
    const membersQuery = useQuery({
        queryKey: ['councilMembers'],
        queryFn: async () => {
            const response = await apiFetch(`${API_BASE}/members`);
            if (!response.ok) throw new Error('Failed to fetch members');
            const data = await response.json();
            return data.data as CouncilMember[];
        }
    });

    // Ask the council
    const askMutation = useMutation({
        mutationFn: async ({ query, useRAG = true }: { query: string; useRAG?: boolean }) => {
            setIsProcessing(true);
            try {
                // Get madhab from localStorage
                const madhab = localStorage.getItem('GëstuSaDine-madhab') || 'maliki';
                const response = await apiFetch(`${API_BASE}/ask`, {
                    method: 'POST',
                    body: JSON.stringify({ query, useRAG, madhab })
                });
                if (!response.ok) throw new Error('Failed to ask council');
                const data = await response.json();
                return data.data as ConsensusResult;
            } finally {
                setIsProcessing(false);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['councilHistory'] });
        }
    });

    // Upload document
    const uploadMutation = useMutation({
        mutationFn: async (doc: {
            docId: string;
            title: string;
            content: string;
            source: string;
            category?: string;
        }) => {
            const response = await apiFetch(`${API_BASE}/documents`, {
                method: 'POST',
                body: JSON.stringify(doc)
            });
            if (!response.ok) throw new Error('Failed to upload document');
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        }
    });

    // Fetch documents
    const documentsQuery = useQuery({
        queryKey: ['documents'],
        queryFn: async () => {
            const response = await apiFetch(`${API_BASE}/documents`);
            if (!response.ok) throw new Error('Failed to fetch documents');
            const data = await response.json();
            return data.data as Document[];
        }
    });

    // Delete document
    const deleteMutation = useMutation({
        mutationFn: async (docId: string) => {
            const response = await apiFetch(`${API_BASE}/documents/${docId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete document');
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        }
    });

    // Search RAG
    const searchMutation = useMutation({
        mutationFn: async ({ query, topK = 5 }: { query: string; topK?: number }) => {
            const response = await apiFetch(`${API_BASE}/search`, {
                method: 'POST',
                body: JSON.stringify({ query, topK })
            });
            if (!response.ok) throw new Error('Failed to search RAG');
            const data = await response.json();
            return data.data as RAGResult;
        }
    });

    // Health check
    const healthQuery = useQuery({
        queryKey: ['councilHealth'],
        queryFn: async () => {
            const response = await apiFetch(`${API_BASE}/health`);
            if (!response.ok) throw new Error('Council health check failed');
            return await response.json();
        },
        refetchInterval: 60000 // Check every minute
    });

    return {
        // Queries
        members: membersQuery.data,
        membersLoading: membersQuery.isLoading,
        documents: documentsQuery.data,
        documentsLoading: documentsQuery.isLoading,
        isCouncilHealthy: healthQuery.data?.success,
        isProcessing,

        // Mutations
        ask: askMutation.mutateAsync,
        askLoading: askMutation.isPending,
        askError: askMutation.error?.message,

        uploadDocument: uploadMutation.mutateAsync,
        uploadLoading: uploadMutation.isPending,
        uploadError: uploadMutation.error?.message,

        deleteDocument: deleteMutation.mutateAsync,
        deleteLoading: deleteMutation.isPending,

        searchRAG: searchMutation.mutateAsync,
        searchLoading: searchMutation.isPending,

        // Refresh methods
        refetchMembers: membersQuery.refetch,
        refetchDocuments: documentsQuery.refetch
    };
}

export function useCouncilHistory() {
    return useQuery({
        queryKey: ['councilHistory'],
        queryFn: async () => {
            // This would fetch from a history endpoint if available
            return [];
        }
    });
}
