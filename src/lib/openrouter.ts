/**
 * Client-side OpenRouter API client
 * Works without backend dependency - calls OpenRouter API directly from the browser
 */

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  model?: string;
}

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl: string = 'https://openrouter.ai/api/v1';
  // Free embedding model - using a cost-effective option
  // Note: Most embedding models are very cheap (~$0.0001 per 1K tokens)
  private embeddingModel: string = 'openai/text-embedding-3-small'; // Very cheap, not free but minimal cost

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_OPENROUTER_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('VITE_OPENROUTER_API_KEY not configured. OpenRouter calls will fail.');
    }
  }

  async generateCompletion(
    messages: OpenRouterMessage[],
    options: OpenRouterOptions = {}
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.');
    }

    const model = options.model || 'openai/gpt-4o';
    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.maxTokens ?? 2000;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'XamSaDine AI'
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          top_p: options.topP
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${error}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error: any) {
      console.error('OpenRouter API call failed:', error);
      throw new Error(`Failed to generate completion: ${error.message}`);
    }
  }

  async generateJSON(
    messages: OpenRouterMessage[],
    options: OpenRouterOptions = {}
  ): Promise<any> {
    const systemMessage: OpenRouterMessage = {
      role: 'system',
      content: 'You must respond with valid JSON only. Do not include any markdown formatting, code blocks, or explanatory text.'
    };

    const response = await this.generateCompletion(
      [systemMessage, ...messages],
      options
    );

    try {
      return JSON.parse(response);
    } catch (error) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || response.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      throw new Error('Failed to parse JSON response');
    }
  }

  /**
   * Generate embeddings for RAG (Retrieval Augmented Generation)
   * Note: Embeddings use a separate model and have minimal cost (~$0.0001 per 1K tokens)
   */
  async getEmbedding(text: string): Promise<number[]> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'XamSaDine AI'
        },
        body: JSON.stringify({
          model: this.embeddingModel,
          input: text
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Embedding API error: ${error}`);
      }

      const data = await response.json();
      return data.data[0]?.embedding || [];
    } catch (error: any) {
      console.error('OpenRouter embedding generation failed:', error);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }
}

// Export singleton instance
export const openRouter = new OpenRouterClient();

