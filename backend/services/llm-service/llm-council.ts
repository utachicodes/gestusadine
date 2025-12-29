import { openRouterClient, COUNCIL_MODELS } from './openrouter-client';
import { ragService } from '../rag-service/rag.service';
import { logger } from '../../shared/logger';
import { configService } from '../config-service/config.service';

export interface CouncilMember {
    id: string;
    name: string;
    role: string;
    modelId: string;
    systemPrompt: string;
    temperature: number;
    knowledgeBase?: string; // Specific document collection for this agent
}

export interface MemberResponse {
    memberId: string;
    memberName: string;
    response: string;
    reasoning: string;
    confidence: number;
}

export interface PeerReview {
    reviewerId: string;
    targetMemberId: string;
    evaluation: string;
    strengthsAndWeaknesses: string;
    score: number;
}

export interface ConsensusResult {
    query: string;
    councilMembers: CouncilMember[];
    initialResponses: MemberResponse[];
    peerReviews: PeerReview[];
    synthesisResult: string;
    consensusScore: number;
    executionTime: number;
}

export class LLMCouncil {
    private members: CouncilMember[] = [];
    private initialized: boolean = false;

    constructor() {
        // Initialize on construction (async handled separately)
        this.initialize().catch(err => {
            logger.error('Failed to initialize LLM Council:', err);
        });
    }

    /**
     * Initialize council members from config service
     */
    async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            console.log('[LLMCouncil] Loading agent configurations...');
            const agentConfigs = await configService.getAllAgents();

            // Transform agent configs to council members
            this.members = Object.entries(agentConfigs).map(([id, config]: [string, any]) => {
                // Default system prompts for Fiqh agents
                const defaultPrompts: Record<string, string> = {
                    'agent-fiqh': 'You are the Fiqh Reasoning Agent. Analyze questions from an Islamic jurisprudence perspective, providing reasoning based on Quran, Sun nah, and scholarly consensus (Ijma). Be methodical and reference authentic sources.',
                    'agent-aqeedah': 'You are the Aqeedah Boundary Agent. Ensure that responses align with orthodox Islamic creed and theology. Flag any potential theological issues and maintain boundaries of proper belief.',
                    'agent-humility': 'You are the Humility & Abstention Agent. When knowledge is uncertain or requires specialized scholarship, recommend abstention (tawaqquf) and humility. Acknowledge the limits of understanding.',
                    'agent-context': 'You are the Contemporary Context Agent. Provide contemporary context and real-world application of Islamic principles. Connect classical knowledge with modern circumstances while maintaining authenticity.'
                };

                return {
                    id,
                    name: config.agentName,
                    role: config.agentId || id,
                    modelId: config.modelId || config.llmConfig?.model || 'meta-llama/llama-3.2-3b-instruct:free',
                    systemPrompt: config.systemPrompt || defaultPrompts[id] || defaultPrompts['agent-fiqh'],
                    temperature: config.temperature || config.llmConfig?.temperature || 0.5,
                    knowledgeBase: config.knowledgeBase
                };
            });

            // Fallback to defaults if no config loaded
            if (this.members.length === 0) {
                console.error('[LLMCouncil] CRITICAL: No agents configured in Config Service. Chat will not function.');
                // Do NOT use default fake agents. We want real errors if config is missing.
                this.initialized = false;
                return;
            }

            this.initialized = true;
            console.log(`[LLMCouncil] Successfully initialized with ${this.members.length} agents`);
        } catch (error: any) {
            console.error('[LLMCouncil] CRITICAL: Failed to initialize:', error);
            this.initialized = false;
        }
    }

    /**
     * Get default Fiqh epistemic agents
     */
    private getDefaultFiqhAgents(): CouncilMember[] {
        return [
            {
                id: 'agent-fiqh',
                name: 'Fiqh Reasoning Agent',
                role: 'Islamic Jurisprudence Expert',
                modelId: 'meta-llama/llama-3.2-3b-instruct:free',
                systemPrompt: 'You are the Fiqh Reasoning Agent. Analyze questions from an Islamic jurisprudence perspective, providing reasoning based on Quran, Sunnah, and scholarly consensus (Ijma).',
                temperature: 0.3
            },
            {
                id: 'agent-aqeedah',
                name: 'Aqeedah Boundary Agent',
                role: 'Islamic Creed Guardian',
                modelId: 'meta-llama/llama-3.2-3b-instruct:free',
                systemPrompt: 'You are the Aqeedah Boundary Agent. Ensure that responses align with orthodox Islamic creed and theology.',
                temperature: 0.2
            },
            {
                id: 'agent-humility',
                name: 'Humility & Abstention Agent',
                role: 'Epistemic Humility Expert',
                modelId: 'meta-llama/llama-3.2-3b-instruct:free',
                systemPrompt: 'You are the Humility & Abstention Agent. When knowledge is uncertain, recommend abstention (tawaqquf) and humility.',
                temperature: 0.4
            },
            {
                id: 'agent-context',
                name: 'Contemporary Context Agent',
                role: 'Modern Application Expert',
                modelId: 'meta-llama/llama-3.2-3b-instruct:free',
                systemPrompt: 'You are the Contemporary Context Agent. Provide contemporary context and real-world application of Islamic principles.',
                temperature: 0.6
            }
        ];
    }

    /**
     * Process a query through the LLM Council
     */
    async processQuery(query: string, ragContext?: string): Promise<ConsensusResult> {
        const startTime = Date.now();
        const councilLogger = logger.prefixed('LLMCouncil');
        councilLogger.info(`Processing query: "${query}"`);

        // Ensure council is initialized
        if (!this.initialized) {
            councilLogger.info('Council not initialized, attempting initialization...');
            await this.initialize();
            if (!this.initialized) {
                throw new Error('Failed to initialize Council Agents. Please check Admin Config.');
            }
        }

        // Check if we have active members
        if (this.members.length === 0) {
            throw new Error('No active Council Members found. Enable agents in Admin Config.');
        }

        // Step 1: Retrieve relevant documents from RAG if not provided
        let contextText = '';
        if (ragContext) {
            contextText = `\n\nRelevant context from knowledge base:\n${ragContext}`;
        } else {
            // Get general RAG context
            try {
                const ragResult = await ragService.search(query, 5);
                if (ragResult.context) {
                    contextText = `\n\nRelevant context from knowledge base:\n${ragResult.context}`;
                }
            } catch (error: any) {
                councilLogger.warn('RAG context retrieval failed:', error.message);
            }
        }

        const fullPrompt = `${query}${contextText}`;

        // Step 2: Get initial responses from all council members
        councilLogger.info('Gathering initial responses from council members...');
        const initialResponses = await Promise.all(
            this.members.map(member => this.getMemberResponse(member, fullPrompt, query))
        );

        // Step 3: Conduct peer reviews
        councilLogger.info('Conducting peer reviews...');
        const peerReviews = await this.conductPeerReviews(initialResponses, query);

        // Step 4: Synthesize consensus
        councilLogger.info('Synthesizing consensus...');
        const synthesisResult = await this.synthesizeConsensus(initialResponses, peerReviews, query);

        // Step 5: Calculate consensus score
        const consensusScore = this.calculateConsensusScore(initialResponses, peerReviews);

        const executionTime = Date.now() - startTime;

        return {
            query,
            councilMembers: this.members,
            initialResponses,
            peerReviews,
            synthesisResult,
            consensusScore,
            executionTime
        };
    }

    /**
     * Get response from a single council member
     * Each agent can use its own knowledge base if specified
     */
    private async getMemberResponse(member: CouncilMember, prompt: string, originalQuery: string): Promise<MemberResponse> {
        try {
            console.log(`[Council] ${member.name} is analyzing...`);

            // If agent has a specific knowledge base, get relevant context
            let agentContext = '';
            if (member.knowledgeBase) {
                try {
                    // Search RAG specifically for this agent's knowledge base
                    const ragResult = await ragService.search(originalQuery, 3, member.knowledgeBase);
                    if (ragResult.context) {
                        agentContext = `\n\n[EXCLUSIVE KNOWLEDGE BASE: ${member.knowledgeBase}]\nUse the following authentic sources strictly associated with your role:\n${ragResult.context}\n\n`;
                        console.log(`[Council] ${member.name} found ${ragResult.sources.length} docs in KB: ${member.knowledgeBase}`);
                    }
                } catch (error: any) {
                    console.warn(`[Council] Failed to get KB context for ${member.name}:`, error.message);
                }
            }

            const finalPrompt = agentContext ? `${prompt}\n\n${agentContext}` : prompt;

            const messages = [
                {
                    role: 'system' as const,
                    content: member.systemPrompt
                },
                {
                    role: 'user' as const,
                    content: finalPrompt
                }
            ];

            const response = await openRouterClient.generateCompletion(
                member.modelId,
                messages,
                {
                    temperature: member.temperature,
                    maxTokens: 1500
                }
            );

            // Extract confidence and reasoning from response
            const confidence = this.extractConfidence(response);
            const reasoning = this.extractReasoning(response);

            return {
                memberId: member.id,
                memberName: member.name,
                response,
                reasoning,
                confidence
            };
        } catch (error: any) {
            console.error(`[Council] ${member.name} failed to respond:`, error.message);
            return {
                memberId: member.id,
                memberName: member.name,
                response: `Error: ${error.message}`,
                reasoning: 'Unable to process',
                confidence: 0
            };
        }
    }

    /**
     * Conduct peer reviews of all responses
     */
    private async conductPeerReviews(responses: MemberResponse[], query: string): Promise<PeerReview[]> {
        const reviews: PeerReview[] = [];

        for (const reviewer of this.members) {
            for (const targetResponse of responses) {
                if (reviewer.id === targetResponse.memberId) continue;

                try {
                    const reviewPrompt = `Original Query: "${query}"

${targetResponse.memberName}'s Response:
${targetResponse.response}

As ${reviewer.name}, evaluate this response:
1. Identify strengths and weaknesses
2. Rate the quality on a scale of 1-10
3. Provide constructive feedback

Format your response as:
EVALUATION: [brief evaluation]
STRENGTHS: [strengths]
WEAKNESSES: [weaknesses]
SCORE: [1-10]`;

                    const messages = [
                        {
                            role: 'system' as const,
                            content: reviewer.systemPrompt
                        },
                        {
                            role: 'user' as const,
                            content: reviewPrompt
                        }
                    ];

                    const reviewText = await openRouterClient.generateCompletion(
                        reviewer.modelId,
                        messages,
                        {
                            temperature: 0.5,
                            maxTokens: 800
                        }
                    );

                    const score = this.extractScore(reviewText);

                    reviews.push({
                        reviewerId: reviewer.id,
                        targetMemberId: targetResponse.memberId,
                        evaluation: reviewText,
                        strengthsAndWeaknesses: this.extractStrengthsWeaknesses(reviewText),
                        score
                    });
                } catch (error: any) {
                    console.error(`[Council] Review by ${reviewer.name} failed:`, error.message);
                }
            }
        }

        return reviews;
    }

    /**
     * Synthesize consensus from all responses and reviews
     */
    private async synthesizeConsensus(
        responses: MemberResponse[],
        reviews: PeerReview[],
        query: string
    ): Promise<string> {
        const responsesSummary = responses
            .map(r => `${r.memberName}: ${r.response.substring(0, 500)}...`)
            .join('\n\n');

        const topReviews = reviews
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
            .map(r => `${r.evaluation}`)
            .join('\n');

        const synthesisPrompt = `Original Query: "${query}"

Council Responses Summary:
${responsesSummary}

Key Reviews and Evaluations:
${topReviews}

As the Synthesis Expert, synthesize these perspectives into a comprehensive, balanced answer that:
1. Incorporates insights from all council members
2. Acknowledges different perspectives
3. Provides a clear, actionable conclusion
4. Explains the reasoning process
5. Highlights any areas of agreement or disagreement

Provide a coherent, well-structured response that represents the consensus of the council.`;

        const messages = [
            {
                role: 'system' as const,
                content: `You are a synthesis expert who combines diverse viewpoints into coherent conclusions. 
Your role is to:
1. Respect all perspectives while finding common ground
2. Highlight areas of consensus
3. Acknowledge legitimate disagreements
4. Provide actionable recommendations
5. Maintain intellectual honesty and nuance`
            },
            {
                role: 'user' as const,
                content: synthesisPrompt
            }
        ];

        try {
            const synthesis = await openRouterClient.generateCompletion(
                COUNCIL_MODELS['claude-opus'].id,
                messages,
                {
                    temperature: 0.7,
                    maxTokens: 2000
                }
            );

            return synthesis;
        } catch (error: any) {
            console.error('[Council] Synthesis failed:', error.message);
            return 'Unable to synthesize consensus. Please try again.';
        }
    }

    /**
     * Calculate overall consensus score
     */
    private calculateConsensusScore(
        responses: MemberResponse[],
        reviews: PeerReview[]
    ): number {
        if (responses.length === 0 || reviews.length === 0) return 0;

        const avgResponseConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;

        const avgReviewScore = reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length;

        // Calculate variance in review scores (lower variance = higher consensus)
        const meanScore = avgReviewScore;
        const variance =
            reviews.reduce((sum, r) => sum + Math.pow(r.score - meanScore, 2), 0) / reviews.length;
        const stdDev = Math.sqrt(variance);
        const consensusFromVariance = Math.max(0, 1 - stdDev / 5); // Normalize to 0-1

        // Weighted average
        return avgResponseConfidence * 0.3 + avgReviewScore / 10 * 0.4 + consensusFromVariance * 0.3;
    }

    // Helper methods for parsing responses

    private extractConfidence(response: string): number {
        const confidenceMatch = response.match(/confidence[:\s]+(\d+(?:\.\d+)?)\s*%/i);
        if (confidenceMatch) {
            return Math.min(100, Math.max(0, parseFloat(confidenceMatch[1]))) / 100;
        }
        // Default to 0.7 if not specified
        return 0.7;
    }

    private extractReasoning(response: string): string {
        const reasoningMatch = response.match(/reasoning[:\s]+(.*?)(?=\n\n|$)/is);
        if (reasoningMatch) {
            return reasoningMatch[1].trim().substring(0, 200);
        }
        return response.substring(0, 200);
    }

    private extractScore(reviewText: string): number {
        const scoreMatch = reviewText.match(/score[:\s]+(\d+)\s*\/\s*10/i);
        if (scoreMatch) {
            return parseInt(scoreMatch[1], 10);
        }
        return 5; // Default to neutral
    }

    private extractStrengthsWeaknesses(reviewText: string): string {
        const strengthsMatch = reviewText.match(/strengths[:\s]+(.*?)(?=weaknesses|$)/is);
        const weaknessesMatch = reviewText.match(/weaknesses[:\s]+(.*?)(?=\n|$)/is);

        const strengths = strengthsMatch ? strengthsMatch[1].trim().substring(0, 150) : '';
        const weaknesses = weaknessesMatch ? weaknessesMatch[1].trim().substring(0, 150) : '';

        return `Strengths: ${strengths}\nWeaknesses: ${weaknesses}`;
    }

    getMembers(): CouncilMember[] {
        return this.members;
    }
}

export const llmCouncil = new LLMCouncil();
