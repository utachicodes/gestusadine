export interface LLMConfig {
    provider: 'openai' | 'anthropic' | 'local' | 'openrouter';
    model: string;
    apiKey?: string;
    endpoint?: string; // For local models
    temperature?: number;
    maxTokens?: number;
}

export interface AgentConfig {
    agentId: string;
    agentName: string;
    modelId?: string; // OpenRouter model ID
    systemPrompt?: string; // Custom system prompt
    temperature?: number; // LLM temperature setting
    llmConfig: LLMConfig;
    enabled: boolean;
    knowledgeBase?: string;
}

export interface SystemConfig {
    agents: Record<string, AgentConfig>;
    lastUpdated: string;
}
