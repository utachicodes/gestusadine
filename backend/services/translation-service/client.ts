/**
 * Wolof Translation Client
 * Communicates with Python translation service
 */

export interface TranslationRequest {
  text: string;
  source_lang?: 'fr' | 'wo';
  target_lang?: 'fr' | 'wo';
}

export interface TranslationResponse {
  success: boolean;
  original: string;
  translated: string;
  source_language: string;
  target_language: string;
}

export interface LanguageDetectionResponse {
  success: boolean;
  text: string;
  detected_language: 'fr' | 'wo';
  language_name: string;
}

export interface BatchTranslationRequest {
  texts: string[];
  source_lang?: 'fr' | 'wo';
}

export interface BatchTranslationResponse {
  success: boolean;
  count: number;
  translations: string[];
}

interface ErrorResponse {
  error?: string;
  message?: string;
}

class WolofTranslationClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = 'http://localhost:5000', timeout: number = 30000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Translate text from one language to another
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await this.makeRequest('/translate', 'POST', request);
      return response as TranslationResponse;
    } catch (error) {
      throw new Error(`Translation failed: ${error}`);
    }
  }

  /**
   * Translate multiple texts at once
   */
  async batchTranslate(request: BatchTranslationRequest): Promise<BatchTranslationResponse> {
    try {
      const response = await this.makeRequest('/translate-batch', 'POST', request);
      return response as BatchTranslationResponse;
    } catch (error) {
      throw new Error(`Batch translation failed: ${error}`);
    }
  }

  /**
   * Detect if text is French or Wolof
   */
  async detectLanguage(text: string): Promise<LanguageDetectionResponse> {
    try {
      const response = await this.makeRequest('/detect-language', 'POST', { text });
      return response as LanguageDetectionResponse;
    } catch (error) {
      throw new Error(`Language detection failed: ${error}`);
    }
  }

  /**
   * Check if translation service is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.makeRequest('/health', 'GET');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Helper method to make HTTP requests
   */
  private async makeRequest(endpoint: string, method: string, body?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json() as ErrorResponse;
        throw new Error(error.error || error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const translationClient = new WolofTranslationClient(
  process.env.TRANSLATION_SERVICE_URL || 'http://localhost:5000'
);

export default WolofTranslationClient;
