/**
 * Council Models Configuration
 * Defines the available LLM models and recommended assignments for each Fiqh epistemic agent
 */

export interface CouncilModelConfig {
  memberId: string;
  memberName: string;
  role: string;
  recommendedModel: string;
  modelId: string;
  provider: string;
  temperature: number;
  maxTokens: number;
  description: string;
}

/**
 * Fiqh Epistemic Architecture - Council Model Assignments
 * Using 100% FREE models from OpenRouter
 */
export const COUNCIL_MODELS_CONFIG: CouncilModelConfig[] = [
  {
    memberId: 'agent-fiqh',
    memberName: 'Fiqh Reasoning Agent',
    role: 'Islamic Jurisprudence Expert',
    recommendedModel: 'Llama 3.3 70B Instruct',
    modelId: 'meta-llama/llama-3.3-70b-instruct:free',
    provider: 'Meta',
    temperature: 0.3,
    maxTokens: 2000,
    description: 'FREE: Advanced reasoning for complex fiqh analysis. Uses Quran, Sunnah, and Ijma. 70B parameters with 131K context for deep jurisprudential reasoning.'
  },
  {
    memberId: 'agent-aqeedah',
    memberName: 'Aqeedah Boundary Agent',
    role: 'Islamic Creed Guardian',
    recommendedModel: 'Llama 3.1 405B Instruct',
    modelId: 'meta-llama/llama-3.1-405b-instruct:free',
    provider: 'Meta',
    temperature: 0.2,
    maxTokens: 1500,
    description: 'FREE: Most thorough model for theological boundaries. 405B parameters ensure precise aqeedah alignment and detection of theological issues.'
  },
  {
    memberId: 'agent-humility',
    memberName: 'Humility & Abstention Agent',
    role: 'Epistemic Humility Expert',
    recommendedModel: 'Llama 3.2 3B Instruct',
    modelId: 'meta-llama/llama-3.2-3b-instruct:free',
    provider: 'Meta',
    temperature: 0.4,
    maxTokens: 1500,
    description: 'FREE: Balanced model for recognizing knowledge limits. 3B parameters perfect for recommending tawaqquf (abstention) when appropriate.'
  },
  {
    memberId: 'agent-context',
    memberName: 'Contemporary Context Agent',
    role: 'Modern Application Expert',
    recommendedModel: 'Hermes 3 405B Instruct',
    modelId: 'nousresearch/hermes-3-llama-3.1-405b:free',
    provider: 'Nous Research',
    temperature: 0.6,
    maxTokens: 1500,
    description: 'FREE: Excellent for modern applications and agentic capabilities. 405B parameters specialized in connecting classical knowledge with contemporary contexts.'
  }
];

/**
 * Synthesis Model - Used for final consensus synthesis
 */
export const SYNTHESIS_MODEL = {
  name: 'Llama 3.3 70B Instruct',
  modelId: 'meta-llama/llama-3.3-70b-instruct:free',
  provider: 'Meta',
  temperature: 0.5,
  maxTokens: 2500,
  description: 'FREE: Powerful synthesis model for combining council perspectives into coherent guidance.'
};

/**
 * Alternative Free Models Available
 */
export const ALTERNATIVE_FREE_MODELS = [
  {
    name: 'Mistral 7B Instruct',
    modelId: 'mistralai/mistral-7b-instruct:free',
    provider: 'Mistral AI',
    description: 'Fast and efficient 7B model, good for simpler tasks'
  },
  {
    name: 'Qwen 2.5 VL 7B Instruct',
    modelId: 'qwen/qwen-2.5-vl-7b-instruct:free',
    provider: 'Qwen',
    description: 'Multimodal support with multilingual capabilities'
  }
];
