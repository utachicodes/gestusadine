import { LLMConfig } from '../../shared/config-types.js';

export class LLMService {
    async generate(config: LLMConfig, prompt: string): Promise<string> {
        if (config.provider === 'openai') {
            return this.callOpenAI(config, prompt);
        } else if (config.provider === 'anthropic') {
            return this.callAnthropic(config, prompt);
        } else if (config.provider === 'local') {
            return this.callLocal(config, prompt);
        } else if (config.provider === 'openrouter') {
            return this.callOpenRouter(config, prompt);
        } else if (config.provider === 'groq') {
            return this.callGroq(config, prompt);
        }
        throw new Error(`Unknown provider: ${config.provider}`);
    }

    async getEmbedding(config: LLMConfig, text: string): Promise<number[]> {
        // Use OpenRouter or OpenAI for embeddings
        const apiKey = config.apiKey;
        if (!apiKey) throw new Error("API Key required for embeddings");

        // Try to use a dedicated embedding endpoint if provider is openrouter or openai
        // For simplicity using OpenRouter's compatible endpoint default
        const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://deenakdiamano.com',
                'X-Title': 'DeenAkDiamano'
            },
            body: JSON.stringify({
                model: 'openai/text-embedding-3-small', // efficient default
                input: text
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Embedding API error: ${error}`);
        }

        const data = await response.json();
        return data.data[0].embedding;
    }

    private async callOpenAI(config: LLMConfig, prompt: string): Promise<string> {
        if (!config.apiKey) {
            throw new Error('OpenAI API key not configured');
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model || 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                temperature: config.temperature ?? 0.7,
                max_tokens: config.maxTokens ?? 1500
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenAI API error: ${error}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    }

    private async callAnthropic(config: LLMConfig, prompt: string): Promise<string> {
        if (!config.apiKey) {
            throw new Error('Anthropic API key not configured');
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: config.model || 'claude-3-sonnet-20240229',
                messages: [{ role: 'user', content: prompt }],
                temperature: config.temperature ?? 0.7,
                max_tokens: config.maxTokens ?? 1500
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Anthropic API error: ${error}`);
        }

        const data = await response.json() as { content: { text: string }[] };
        return data.content[0]?.text || '';
    }

    private async callLocal(config: LLMConfig, prompt: string): Promise<string> {
        const response = await fetch(config.endpoint || 'http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: config.model || 'llama2',
                prompt: prompt,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Local model error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response || '';
    }

    private async callOpenRouter(config: LLMConfig, prompt: string): Promise<string> {
        if (!config.apiKey) {
            throw new Error('OpenRouter API key not configured');
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`,
                'HTTP-Referer': 'https://platform.example.com',
                'X-Title': 'AI Platform'
            },
            body: JSON.stringify({
                model: config.model || 'meta-llama/llama-3.2-3b-instruct:free',
                messages: [{ role: 'user', content: prompt }],
                temperature: config.temperature ?? 0.7,
                max_tokens: config.maxTokens ?? 1500
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenRouter API error: ${error}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    }

    private async callGroq(config: LLMConfig, prompt: string): Promise<string> {
        if (!config.apiKey) {
            throw new Error('Groq API key not configured. Get it from https://console.groq.com/');
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model || 'llama3-70b-8192',
                messages: [{ role: 'user', content: prompt }],
                temperature: config.temperature ?? 0.7,
                max_tokens: config.maxTokens ?? 2048
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Groq API error: ${error}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    }
}

export const llmService = new LLMService();
