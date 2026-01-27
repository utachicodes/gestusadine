import { CouncilAgentResponse } from '../shared/types.js';
import { llmService } from '../services/llm-service/llm.service.js';
import { LLMConfig } from '../shared/config-types.js';

export class CouncilAgent {
    constructor(
        private agentId: string,
        private personaName: string,
        private systemPrompt: string,
        private modelConfig: LLMConfig
    ) { }

    async process(query: string, context?: string): Promise<CouncilAgentResponse> {
        console.log(`[CouncilAgent:${this.personaName}] Processing query...`);

        const fullPrompt = `
System Context: ${this.systemPrompt}

You are acting as: ${this.personaName}

Context from Knowledge Base:
${context || "No specific documents found."}

User Query: "${query}"

Provide your response from the perspective of your persona. Be concise but deep.
`;

        try {
            const content = await llmService.generate(this.modelConfig, fullPrompt);

            return {
                agentId: this.agentId,
                agentType: 'COUNCIL_MEMBER',
                personaName: this.personaName,
                timestamp: new Date().toISOString(),
                confidence: 0.9,
                trace: [`Processed by ${this.modelConfig.model} (${this.modelConfig.provider})`],
                content: content
            };
        } catch (error: any) {
            console.error(`[CouncilAgent:${this.personaName}] Error:`, error);
            return {
                agentId: this.agentId,
                agentType: 'COUNCIL_MEMBER',
                personaName: this.personaName,
                timestamp: new Date().toISOString(),
                confidence: 0.0,
                trace: [`Error: ${error.message}`],
                content: "I am unable to provide input at this time due to a connection error."
            };
        }
    }
}
