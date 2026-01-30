import { CouncilAgent } from '../agents/council-agent';
import { llmService } from '../services/llm-service/llm.service';
import { CouncilAgentResponse, SynthesisResult } from '../shared/types';
import { LLMConfig } from '../shared/config-types';
import { ragService } from '../services/rag-service/rag.service';
import { configService } from '../services/config-service/config.service';

export class CouncilOrchestrator {
    private agents: CouncilAgent[];
    private debateConfig: LLMConfig;
    private initialized: boolean = false;

    constructor() {
        this.agents = [];
        this.debateConfig = {
            provider: 'groq',
            model: 'llama3-70b-8192',
            apiKey: process.env.GROQ_API_KEY,
            temperature: 0.5
        };
    }

    /**
     * Initialize council with agent configurations from config service
     */
    async initialize(): Promise<void> {
        if (this.initialized) return;

        console.log('[Council] Initializing with dynamic agent configurations...');

        // Load agent configurations from config service
        const agentConfigs = await configService.getAllAgents();

        // Define the expected Fiqh agents
        const fiqhAgentIds = ['agent-fiqh', 'agent-aqeedah', 'agent-humility', 'agent-context'];

        // Create agents from configuration
        this.agents = [];
        for (const agentId of fiqhAgentIds) {
            const config = agentConfigs[agentId];
            if (config) {
                const llmConfig: LLMConfig = {
                    provider: 'groq',
                    model: config.modelId || 'llama3-70b-8192',
                    apiKey: process.env.GROQ_API_KEY,
                    temperature: config.temperature || 0.5
                };

                this.agents.push(new CouncilAgent(
                    agentId,
                    config.agentName,
                    config.systemPrompt || this.getDefaultAgentConfig(agentId).systemPrompt,
                    llmConfig
                ));

                console.log(`[Council] Loaded ${config.agentName} with model ${llmConfig.model}`);
            } else {
                console.warn(`[Council] No configuration found for ${agentId}, using defaults`);
                // Fallback to default if not configured
                const defaultConfig = this.getDefaultAgentConfig(agentId);
                this.agents.push(new CouncilAgent(
                    defaultConfig.id,
                    defaultConfig.name,
                    defaultConfig.systemPrompt,
                    defaultConfig.llmConfig
                ));
            }
        }

        this.initialized = true;
        console.log(`[Council] Initialized with ${this.agents.length} agents`);
    }

    /**
     * Get default configuration for an agent (fallback)
     */
    private getDefaultAgentConfig(agentId: string) {
        const defaults: Record<string, any> = {
            'agent-fiqh': {
                id: 'agent-fiqh',
                name: 'Fiqh Reasoning Agent',
                systemPrompt: 'You are the Fiqh Reasoning Agent. Analyze questions from an Islamic jurisprudence perspective, providing reasoning based on Quran, Sunnah, and scholarly consensus (Ijma).',
                llmConfig: {
                    provider: 'groq',
                    model: 'llama3-70b-8192',
                    apiKey: process.env.GROQ_API_KEY,
                    temperature: 0.3
                }
            },
            'agent-aqeedah': {
                id: 'agent-aqeedah',
                name: 'Aqeedah Boundary Agent',
                systemPrompt: 'You are the Aqeedah Boundary Agent. Ensure that responses align with orthodox Islamic creed and theology.',
                llmConfig: {
                    provider: 'openrouter',
                    model: 'meta-llama/llama-3.2-3b-instruct:free',
                    apiKey: process.env.OPENROUTER_API_KEY,
                    temperature: 0.2
                }
            },
            'agent-humility': {
                id: 'agent-humility',
                name: 'Humility & Abstention Agent',
                systemPrompt: 'You are the Humility & Abstention Agent. When knowledge is uncertain, recommend abstention (tawaqquf) and humility.',
                llmConfig: {
                    provider: 'openrouter',
                    model: 'meta-llama/llama-3.2-3b-instruct:free',
                    apiKey: process.env.OPENROUTER_API_KEY,
                    temperature: 0.4
                }
            },
            'agent-context': {
                id: 'agent-context',
                name: 'Contemporary Context Agent',
                systemPrompt: 'You are the Contemporary Context Agent. Provide contemporary context and real-world application of Islamic principles.',
                llmConfig: {
                    provider: 'openrouter',
                    model: 'meta-llama/llama-3.2-3b-instruct:free',
                    apiKey: process.env.OPENROUTER_API_KEY,
                    temperature: 0.6
                }
            }
        };

        return defaults[agentId] || defaults['agent-fiqh'];
    }

    async processQuery(query: string): Promise<SynthesisResult> {
        console.log(`[Council] Convening for query: "${query}"`);

        // 1. Gather Context (RAG)
        const ragResult = await ragService.search(query, 5);
        const contextSummary = ragResult.context || "No specific documents found in Knowledge Base.";

        console.log(`[Council] Retrieved context with relevance score: ${ragResult.relevanceScore.toFixed(2)}`);

        // Ensure agents are initialized
        if (!this.initialized) {
            await this.initialize();
        }

        // 2. Parallel Council Deliberation
        const agentPromises = this.agents.map(agent => agent.process(query, contextSummary));
        const responses: CouncilAgentResponse[] = await Promise.all(agentPromises);

        // 3. Synthesis / Consensus
        const consensus = await this.synthesize(query, responses);

        return {
            finalResponse: consensus,
            structure: 'CONSENSUS',
            confidence: 0.95,
            sources: ["Council Knowledge Base"],
            agentTraces: responses
        };
    }

    private async synthesize(query: string, responses: CouncilAgentResponse[]): Promise<string> {
        const debateTranscript = responses.map(r => `
---
SPEAKER: ${r.personaName}
ARGUMENT:
${r.content}
---
`).join('\n');

        const prompt = `
You are the Speaker of the Council. You have heard arguments from four distinct perspectives regarding the user's query.

User Query: "${query}"

Debate Transcript:
${debateTranscript}

Your Task:
1. Synthesize a unified answer that incorporates the best insights from all agents.
2. Resolve any conflicts between Logic and Ethics, or Vision and Criticism.
3. Provide a clear, comprehensive final answer.
4. Conclude with a "Council Verdict" summarizing the main takeaway.
`;

        try {
            return await llmService.generate(this.debateConfig, prompt);
        } catch (error) {
            console.error('[Council] Synthesis failed:', error);
            return "The Council could not reach a consensus due to a communication error.";
        }
    }
}
