/**
 * Groq API Client for LLM Integration
 * Ultra-fast inference with state-of-the-art models
 */

export interface GroqMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface GroqChatRequest {
    model: string;
    messages: GroqMessage[];
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    stream?: boolean;
}

export interface GroqChatResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

/**
 * Groq API Client
 * Support for Llama, Mistral, Gemma models with blazing fast inference
 */
export class GroqClient {
    private apiKey: string;
    private baseURL: string = 'https://api.groq.com/openai/v1';

    /**
     * Available Groq models
     */
    public static readonly MODELS = {
        // Llama 3 models (Recommended for Islamic content)
        LLAMA_3_70B: 'llama3-70b-8192',           // Best balance
        LLAMA_3_8B: 'llama3-8b-8192',             // Fastest

        // Mixtral models
        MIXTRAL_8X7B: 'mixtral-8x7b-32768',       // Great for complex reasoning

        // Gemma models
        GEMMA_7B: 'gemma-7b-it',                  // Google's model
    } as const;

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.GROQ_API_KEY || '';

        if (!this.apiKey) {
            console.warn('⚠️ GROQ_API_KEY not set. Get your free key at https://console.groq.com/');
        } else {
            console.log('✅ Groq client initialized successfully');
        }
    }

    /**
     * Send a chat completion request to Groq
     */
    async chat(
        messages: GroqMessage[],
        options: {
            model?: string;
            temperature?: number;
            maxTokens?: number;
            stream?: boolean;
        } = {}
    ): Promise<GroqChatResponse> {
        if (!this.apiKey) {
            throw new Error('GROQ_API_KEY is required. Get it from https://console.groq.com/');
        }

        const {
            model = GroqClient.MODELS.LLAMA_3_70B,
            temperature = 0.7,
            maxTokens = 2048,
            stream = false
        } = options;

        const requestBody: GroqChatRequest = {
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
            stream
        };

        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    `Groq API error: ${response.status} - ${JSON.stringify(errorData)}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Groq API request failed:', error);
            throw error;
        }
    }

    /**
     * Simple ask function for single-turn questions
     */
    async ask(
        prompt: string,
        systemPrompt?: string,
        options?: { model?: string; temperature?: number; maxTokens?: number }
    ): Promise<string> {
        const messages: GroqMessage[] = [];

        if (systemPrompt) {
            messages.push({
                role: 'system',
                content: systemPrompt
            });
        }

        messages.push({
            role: 'user',
            content: prompt
        });

        const response = await this.chat(messages, options);
        return response.choices[0]?.message?.content || '';
    }

    /**
     * Stream chat completion (for real-time responses)
     */
    async *streamChat(
        messages: GroqMessage[],
        options: {
            model?: string;
            temperature?: number;
            maxTokens?: number;
        } = {}
    ): AsyncGenerator<string> {
        if (!this.apiKey) {
            throw new Error('GROQ_API_KEY is required. Get it from https://console.groq.com/');
        }

        const {
            model = GroqClient.MODELS.LLAMA_3_70B,
            temperature = 0.7,
            maxTokens = 2048
        } = options;

        const requestBody: GroqChatRequest = {
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
            stream: true
        };

        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                `Groq API error: ${response.status} - ${JSON.stringify(errorData)}`
            );
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('Failed to get response stream reader');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed === 'data: [DONE]') continue;
                    if (!trimmed.startsWith('data: ')) continue;

                    try {
                        const data = JSON.parse(trimmed.slice(6));
                        const content = data.choices[0]?.delta?.content;
                        if (content) {
                            yield content;
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }
}

// Export singleton instance
export const groqClient = new GroqClient();

export default GroqClient;
