import fs from 'fs/promises';
import path from 'path';
import { SystemConfig, AgentConfig, LLMConfig } from '../../shared/config-types.js';
import { db } from '../api-gateway/src/lib/firebase-admin.js';

const CONFIG_FILE = path.join(process.cwd(), 'backend', 'config.json');

const FIRESTORE_COLLECTION = 'system_config';
const FIRESTORE_CONFIG_ID = 'default';

// Default configuration
const DEFAULT_CONFIG: SystemConfig = {
    agents: {
        'agent-fiqh': {
            agentId: 'agent-fiqh',
            agentName: 'Fiqh Reasoning Agent',
            modelId: 'meta-llama/llama-3.3-70b-instruct:free',
            systemPrompt: 'You are the Fiqh Reasoning Agent. Analyze questions from an Islamic jurisprudence perspective, providing reasoning based on Quran, Sunnah, and scholarly consensus (Ijma). Be methodical and reference authentic sources.',
            temperature: 0.3,
            llmConfig: {
                provider: 'openrouter',
                model: 'meta-llama/llama-3.3-70b-instruct:free',
                temperature: 0.3,
                maxTokens: 2000
            },
            enabled: true,
            knowledgeBase: 'agent-fiqh'
        },
        'agent-aqeedah': {
            agentId: 'agent-aqeedah',
            agentName: 'Aqeedah Boundary Agent',
            modelId: 'meta-llama/llama-3.1-405b-instruct:free',
            systemPrompt: 'You are the Aqeedah Boundary Agent. Ensure that responses align with orthodox Islamic creed and theology. Flag any potential theological issues and maintain boundaries of proper belief.',
            temperature: 0.2,
            llmConfig: {
                provider: 'openrouter',
                model: 'meta-llama/llama-3.1-405b-instruct:free',
                temperature: 0.2,
                maxTokens: 1500
            },
            enabled: true,
            knowledgeBase: 'agent-aqeedah'
        },
        'agent-humility': {
            agentId: 'agent-humility',
            agentName: 'Humility & Abstention Agent',
            modelId: 'meta-llama/llama-3.2-3b-instruct:free',
            systemPrompt: 'You are the Humility & Abstention Agent. When knowledge is uncertain or requires specialized scholarship, recommend abstention (tawaqquf) and humility. Acknowledge the limits of understanding.',
            temperature: 0.4,
            llmConfig: {
                provider: 'openrouter',
                model: 'meta-llama/llama-3.2-3b-instruct:free',
                temperature: 0.4,
                maxTokens: 1500
            },
            enabled: true,
            knowledgeBase: 'agent-humility'
        },
        'agent-context': {
            agentId: 'agent-context',
            agentName: 'Contemporary Context Agent',
            modelId: 'nousresearch/hermes-3-llama-3.1-405b:free',
            systemPrompt: 'You are the Contemporary Context Agent. Provide contemporary context and real-world application of Islamic principles. Connect classical knowledge with modern circumstances while maintaining authenticity.',
            temperature: 0.6,
            llmConfig: {
                provider: 'openrouter',
                model: 'nousresearch/hermes-3-llama-3.1-405b:free',
                temperature: 0.6,
                maxTokens: 1500
            },
            enabled: true,
            knowledgeBase: 'agent-context'
        }
    },
    lastUpdated: new Date().toISOString()
};

export class ConfigService {
    private config: SystemConfig | null = null;

    async loadConfig(): Promise<SystemConfig> {
        try {
            // Try loading from Firestore first
            const doc = await db.collection(FIRESTORE_COLLECTION).doc(FIRESTORE_CONFIG_ID).get();

            if (doc.exists) {
                const data = doc.data();
                if (data?.config) {
                    this.config = data.config as SystemConfig;
                    return this.config;
                }
            }

            // If not in Firestore, try local file
            try {
                const fileData = await fs.readFile(CONFIG_FILE, 'utf-8');
                this.config = JSON.parse(fileData);
                // Save to Firestore for future use
                await this.saveConfig(this.config!);
                return this.config!;
            } catch {
                // If no file, use default
                console.log('Config not found, creating default...');
                await this.saveConfig(DEFAULT_CONFIG);
                this.config = DEFAULT_CONFIG;
                return DEFAULT_CONFIG;
            }
        } catch (error) {
            console.error('Error loading config from Firestore:', error);
            // Fallback to local file
            try {
                const data = await fs.readFile(CONFIG_FILE, 'utf-8');
                this.config = JSON.parse(data);
                return this.config!;
            } catch {
                console.log('Config file not found, creating default...');
                await this.saveConfig(DEFAULT_CONFIG);
                this.config = DEFAULT_CONFIG;
                return DEFAULT_CONFIG;
            }
        }
    }

    async saveConfig(config: SystemConfig): Promise<void> {
        config.lastUpdated = new Date().toISOString();

        try {
            // Save to Firestore
            await db.collection(FIRESTORE_COLLECTION).doc(FIRESTORE_CONFIG_ID).set({
                config,
                updated_at: config.lastUpdated,
            }, { merge: true });
        } catch (error) {
            console.error('Error saving config to Firestore:', error);
        }

        // Always save to local file as backup
        await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');

        this.config = config;
    }

    async getAgentConfig(agentId: string): Promise<AgentConfig | null> {
        if (!this.config) await this.loadConfig();
        return this.config!.agents[agentId] || null;
    }

    async updateAgentConfig(agentId: string, updates: Partial<AgentConfig>): Promise<void> {
        if (!this.config) await this.loadConfig();

        if (!this.config!.agents[agentId]) {
            throw new Error(`Agent ${agentId} not found`);
        }

        this.config!.agents[agentId] = {
            ...this.config!.agents[agentId],
            ...updates
        };

        await this.saveConfig(this.config!);
    }

    async getAllAgents(): Promise<Record<string, AgentConfig>> {
        if (!this.config) await this.loadConfig();
        return this.config!.agents;
    }

    getAvailableModels(): { provider: string; models: string[] }[] {
        return [
            {
                provider: 'openai',
                models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']
            },
            {
                provider: 'anthropic',
                models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku']
            },
            {
                provider: 'local',
                models: ['llama-3', 'mistral', 'custom']
            }
        ];
    }
}

export const configService = new ConfigService();
