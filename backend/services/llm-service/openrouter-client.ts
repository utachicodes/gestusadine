// Built-in fetch in Node.js 18+
// No need to import from 'node-fetch'

export interface OpenRouterRequest {
    model: string;
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    top_k?: number;
}

export interface OpenRouterResponse {
    id: string;
    model: string;
    choices: Array<{
        message: { role: string; content: string };
        finish_reason: string;
        stop_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
    };
}

export interface ModelConfig {
    id: string;
    displayName: string;
    provider: string;
    contextWindow: number;
    costPer1kPrompt: number;
    costPer1kCompletion: number;
}

// Available models on OpenRouter for the Council (Free Tier)
export const COUNCIL_MODELS: Record<string, ModelConfig> = {
    'llama-3.2-3b': {
        id: 'meta-llama/llama-3.2-3b-instruct:free',
        displayName: 'Llama 3.2 3B Instruct (Free)',
        provider: 'Meta',
        contextWindow: 8192,
        costPer1kPrompt: 0,
        costPer1kCompletion: 0
    },
    'llama-3.1-8b': {
        id: 'meta-llama/llama-3.1-8b-instruct:free',
        displayName: 'Llama 3.1 8B Instruct (Free)',
        provider: 'Meta',
        contextWindow: 131072,
        costPer1kPrompt: 0,
        costPer1kCompletion: 0
    },
    'gemma-7b': {
        id: 'google/gemma-7b-it:free',
        displayName: 'Gemma 7B IT (Free)',
        provider: 'Google',
        contextWindow: 8192,
        costPer1kPrompt: 0,
        costPer1kCompletion: 0
    },
    'phi-3-mini': {
        id: 'microsoft/phi-3-mini-128k-instruct:free',
        displayName: 'Phi-3 Mini 128K (Free)',
        provider: 'Microsoft',
        contextWindow: 128000,
        costPer1kPrompt: 0,
        costPer1kCompletion: 0
    }
};

export class OpenRouterClient {
    private apiKey: string;
    private baseUrl: string = 'https://openrouter.ai/api/v1';
    private referer: string;
    private title: string;

    constructor(apiKey?: string, referer: string = 'https://xamsadine.ai', title: string = 'XamSaDine AI') {
        this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
        this.referer = referer;
        this.title = title;

        if (!this.apiKey) {
            console.error('CRITICAL: OPENROUTER_API_KEY is missing. Chat functionality will fail.');
            // We cannot proceed without an API key even for free models
        } else {
            console.log('OpenRouter Client initialized with API Key');
        }
    }

    async generateCompletion(
        modelId: string,
        messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
        options?: { temperature?: number; maxTokens?: number; topP?: number }
    ): Promise<string> {
        const payload: OpenRouterRequest = {
            model: modelId,
            messages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 2000,
            top_p: options?.topP ?? 1.0
        };

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': this.referer,
                    'X-Title': this.title
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.text();
                console.error(`[OpenRouter] Error response from ${modelId}:`, error);
                throw new Error(`OpenRouter API error (${response.status}): ${error}`);
            }

            const data = (await response.json()) as OpenRouterResponse;

            const content = data.choices?.[0]?.message?.content;
            if (!content) {
                throw new Error(`No content in response from ${modelId}`);
            }

            return content;
        } catch (error: any) {
            console.error(`[OpenRouter] Call to ${modelId} failed:`, error.message);
            throw error;
        }
    }

    async generateWithStreaming(
        modelId: string,
        messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
        onChunk: (chunk: string) => void,
        options?: { temperature?: number; maxTokens?: number }
    ): Promise<string> {
        const payload = {
            model: modelId,
            messages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 2000,
            stream: true
        };

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': this.referer,
                    'X-Title': this.title
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`OpenRouter API error: ${error}`);
            }

            let fullContent = '';
            // For Node.js, stream the response
            if (response.body) {
                const reader = response.body as any;
                for await (const chunk of reader) {
                    const text = chunk.toString();
                    const lines = text.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const jsonStr = line.substring(6);
                            if (jsonStr === '[DONE]') continue;

                            try {
                                const parsed = JSON.parse(jsonStr);
                                const content = parsed.choices?.[0]?.delta?.content || '';
                                if (content) {
                                    fullContent += content;
                                    onChunk(content);
                                }
                            } catch (e) {
                                // Skip parsing errors for stream messages
                            }
                        }
                    }
                }
            }

            return fullContent;
        } catch (error: any) {
            console.error(`[OpenRouter] Streaming call to ${modelId} failed:`, error.message);
            throw error;
        }
    }

    async getEmbedding(text: string): Promise<number[]> {
        try {
            const response = await fetch(`${this.baseUrl}/embeddings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': this.referer,
                    'X-Title': this.title
                },
                body: JSON.stringify({
                    model: 'openai/text-embedding-3-small',
                    input: text
                })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Embedding API error: ${error}`);
            }

            const data = (await response.json()) as any;
            return data.data[0]?.embedding || [];
        } catch (error: any) {
            console.error(`[OpenRouter] Embedding generation failed:`, error.message);
            throw error;
        }
    }

    async getAvailableModels(): Promise<typeof COUNCIL_MODELS> {
        return COUNCIL_MODELS;
    }

    isConfigured(): boolean {
        return !!this.apiKey;
    }
}

export const openRouterClient = new OpenRouterClient();
