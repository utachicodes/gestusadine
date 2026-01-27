import * as React from "react";
import { Settings, Save, RefreshCw, CheckCircle, XCircle, Loader2, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { openRouter } from "@/lib/openrouter";
import { COUNCIL_MODELS_CONFIG, SYNTHESIS_MODEL } from "@/lib/council-models";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AgentConfig {
    agentId: string;
    agentName: string;
    llmConfig: {
        provider: string;
        model: string;
        apiKey?: string;
        endpoint?: string;
        temperature?: number;
        maxTokens?: number;
    };
    enabled: boolean;
}

interface AvailableModel {
    provider: string;
    models: string[];
}

const AdminConfig: React.FC = () => {
    const [agents, setAgents] = React.useState<Record<string, AgentConfig>>({});
    const [availableModels, setAvailableModels] = React.useState<AvailableModel[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [testing, setTesting] = React.useState<string | null>(null);
    const [testResults, setTestResults] = React.useState<Record<string, { success: boolean; message: string }>>({});
    const { toast } = useToast();

    React.useEffect(() => {
        const loadConfig = async () => {
            setLoading(true);
            try {
                // Load from localStorage or use defaults
                const savedAgents = localStorage.getItem('admin_agents_config');
                if (savedAgents) {
                    setAgents(JSON.parse(savedAgents));
                } else {
                    // Default agent configurations based on COUNCIL_MODELS_CONFIG
                    const defaultAgents: Record<string, AgentConfig> = {};
                    COUNCIL_MODELS_CONFIG.forEach(member => {
                        defaultAgents[member.memberId] = {
                            agentId: member.memberId,
                            agentName: member.memberName,
                            llmConfig: {
                                provider: member.provider.toLowerCase().replace(' ', ''),
                                model: member.modelId,
                                apiKey: '', // Will use VITE_OPENROUTER_API_KEY
                                temperature: member.temperature,
                                maxTokens: member.maxTokens
                            },
                            enabled: true
                        };
                    });
                    setAgents(defaultAgents);
                }

                // Available models from OpenRouter (grouped by provider)
                // FREE models prioritized
                setAvailableModels([
                    {
                        provider: 'allenai',
                        models: [
                            'allenai/olmo-3.1-32b-think', // FREE - Reasoning
                            'allenai/olmo-3-32b-think'   // FREE - Reasoning
                        ]
                    },
                    {
                        provider: 'xiaomi',
                        models: [
                            'xiaomi/mimo-v2-flash' // FREE - Top reasoning, coding, agent scenarios
                        ]
                    },
                    {
                        provider: 'nvidia',
                        models: [
                            'nvidia/nemotron-3-nano-30b-a3b' // FREE - Agentic AI
                        ]
                    },
                    {
                        provider: 'mistralai',
                        models: [
                            'mistralai/devstral-2-2512', // FREE - Agentic coding
                            'mistralai/mistral-large',
                            'mistralai/mixtral-8x7b'
                        ]
                    },
                    {
                        provider: 'tngtech',
                        models: [
                            'tngtech/r1t-chimera' // FREE - Creative storytelling
                        ]
                    },
                    {
                        provider: 'nex-agi',
                        models: [
                            'nex-agi/deepseek-v3.1-nex-n1' // FREE - Agent autonomy
                        ]
                    },
                    {
                        provider: 'arcee-ai',
                        models: [
                            'arcee-ai/trinity-mini' // FREE - Reasoning, function calling
                        ]
                    },
                    {
                        provider: 'kwaipilot',
                        models: [
                            'kwaipilot/kat-coder-pro-v1' // FREE - Agentic coding
                        ]
                    },
                    // Paid models (fallback options)
                    { provider: 'openai', models: ['openai/gpt-4o', 'openai/gpt-4-turbo', 'openai/gpt-3.5-turbo', 'openai/gpt-4o-mini'] },
                    { provider: 'anthropic', models: ['anthropic/claude-3-opus', 'anthropic/claude-3-sonnet', 'anthropic/claude-3-haiku'] },
                    { provider: 'meta', models: ['meta-llama/llama-3-70b-instruct', 'meta-llama/llama-3-8b-instruct'] },
                    { provider: 'google', models: ['google/gemini-pro', 'google/gemini-pro-vision'] }
                ]);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Could not load configuration.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        loadConfig();
    }, [toast]);

    const updateAgent = async (agentId: string, updates: Partial<AgentConfig>) => {
        setSaving(true);
        try {
            const updatedAgent = { ...agents[agentId], ...updates };
            const newAgents = { ...agents, [agentId]: updatedAgent };

            // Save to localStorage
            localStorage.setItem('admin_agents_config', JSON.stringify(newAgents));
            setAgents(newAgents);

            toast({
                title: "Saved!",
                description: `${updatedAgent.agentName} configuration updated.`
            });
        } catch (error) {
            toast({
                title: "Save Failed",
                description: "Could not save configuration.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    const updateLLMField = (agentId: string, field: string, value: string | number) => {
        setAgents(prev => ({
            ...prev,
            [agentId]: {
                ...prev[agentId],
                llmConfig: {
                    ...prev[agentId].llmConfig,
                    [field]: value
                }
            }
        }));
    };

    const testModel = async (agentId: string) => {
        setTesting(agentId);
        try {
            const agent = agents[agentId];
            if (!agent) throw new Error('Agent not found');

            const testMessage = `You are ${agent.agentName}. Respond with "Hello, I am ${agent.agentName} and I am working correctly."`;

            const response = await openRouter.generateCompletion([
                {
                    role: 'system',
                    content: `You are ${agent.agentName}, ${COUNCIL_MODELS_CONFIG.find(m => m.memberId === agentId)?.role || 'a council member'}.`
                },
                {
                    role: 'user',
                    content: testMessage
                }
            ], {
                model: agent.llmConfig.model,
                temperature: agent.llmConfig.temperature,
                maxTokens: 100
            });

            if (response && response.length > 0) {
                setTestResults(prev => ({
                    ...prev,
                    [agentId]: {
                        success: true,
                        message: 'Model is working correctly!'
                    }
                }));
                toast({
                    title: "Test Successful",
                    description: `${agent.agentName} is responding correctly.`
                });
            } else {
                throw new Error('Empty response');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setTestResults(prev => ({
                ...prev,
                [agentId]: {
                    success: false,
                    message: errorMessage || 'Test failed'
                }
            }));
            toast({
                title: "Test Failed",
                description: errorMessage || 'Could not test model',
                variant: "destructive"
            });
        } finally {
            setTesting(null);
        }
    };

    const testAllModels = async () => {
        for (const agentId of Object.keys(agents)) {
            await testModel(agentId);
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    };

    if (loading) {
        return (
            <div className="flex-1 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-islamic-dark/70">Loading configuration...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-screen bg-gradient-to-br from-islamic-cream/30 via-white to-islamic-gold/10">
            <section className="container py-10 md:py-16">
                <header className="mb-12">
                    <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
                        Admin Panel
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-islamic-dark mb-4">
                        <span className="text-gradient">Model Configuration</span>
                    </h1>
                    <p className="text-islamic-dark/70 max-w-2xl leading-relaxed">
                        Assign LLMs to each epistemic agent and configure their parameters.
                    </p>
                </header>

                {/* OpenRouter Status Check */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-islamic-dark mb-1">OpenRouter API Status</h3>
                            <p className="text-xs text-primary dark:text-primary-foreground mt-1 font-medium">
                                💰 All recommended models are FREE on OpenRouter!
                            </p>
                        </div>
                        <Button
                            onClick={testAllModels}
                            disabled={testing !== null || !import.meta.env.VITE_OPENROUTER_API_KEY}
                            className="btn-islamic"
                        >
                            <TestTube className="w-4 h-4 mr-2" />
                            Test All Models
                        </Button>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto space-y-6">
                    {Object.entries(agents).map(([agentId, agent]) => {
                        const modelConfig = COUNCIL_MODELS_CONFIG.find(m => m.memberId === agentId);
                        const isRecommended = modelConfig && agent.llmConfig.model === modelConfig.modelId;
                        const testResult = testResults[agentId];

                        return (
                            <div key={agentId} className="islamic-card p-6 bg-card/95">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Settings className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-islamic-dark">{agent.agentName}</h3>
                                                {isRecommended && (
                                                    <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
                                                )}
                                                {testResult && (
                                                    testResult.success ? (
                                                        <CheckCircle className="w-5 h-5 text-primary" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-500" />
                                                    )
                                                )}
                                            </div>
                                            <p className="text-xs text-islamic-dark/60">
                                                {modelConfig?.role || 'Agent ID: ' + agentId}
                                            </p>
                                            {modelConfig && (
                                                <p className="text-xs text-islamic-dark/50 mt-1">
                                                    {modelConfig.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => testModel(agentId)}
                                            disabled={testing === agentId || !import.meta.env.VITE_OPENROUTER_API_KEY}
                                            variant="outline"
                                            size="sm"
                                        >
                                            {testing === agentId ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Testing...
                                                </>
                                            ) : (
                                                <>
                                                    <TestTube className="w-4 h-4 mr-2" />
                                                    Test
                                                </>
                                            )}
                                        </Button>
                                        <button
                                            onClick={() => updateAgent(agentId, agent)}
                                            disabled={saving}
                                            className="btn-islamic-outlined flex items-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save
                                        </button>
                                    </div>
                                </div>

                                {testResult && (
                                    <div className={`mb-4 p-3 rounded-lg ${testResult.success ? 'bg-primary/10 dark:bg-primary/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                        <p className={`text-sm ${testResult.success ? 'text-primary dark:text-primary-foreground' : 'text-red-700 dark:text-red-300'}`}>
                                            {testResult.message}
                                        </p>
                                    </div>
                                )}

                                {modelConfig && agent.llmConfig.model !== modelConfig.modelId && (
                                    <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                            💡 Recommended model: <strong>{modelConfig.recommendedModel}</strong> ({modelConfig.modelId})
                                        </p>
                                        <Button
                                            onClick={() => {
                                                updateLLMField(agentId, 'model', modelConfig.modelId);
                                                updateLLMField(agentId, 'temperature', modelConfig.temperature);
                                                updateLLMField(agentId, 'maxTokens', modelConfig.maxTokens);
                                            }}
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                        >
                                            Use Recommended Model
                                        </Button>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-islamic-dark mb-2">
                                            Provider
                                        </label>
                                        <select
                                            value={agent.llmConfig.provider}
                                            onChange={(e) => updateLLMField(agentId, 'provider', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary/40"
                                        >
                                            {availableModels.map((p) => (
                                                <option key={p.provider} value={p.provider}>
                                                    {p.provider.charAt(0).toUpperCase() + p.provider.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-islamic-dark mb-2">
                                            Model
                                        </label>
                                        <select
                                            value={agent.llmConfig.model}
                                            onChange={(e) => updateLLMField(agentId, 'model', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary/40"
                                        >
                                            {availableModels
                                                .find(p => p.provider === agent.llmConfig.provider)
                                                ?.models.map((model) => (
                                                    <option key={model} value={model}>{model}</option>
                                                ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-islamic-dark mb-2">
                                            Temperature
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="2"
                                            value={agent.llmConfig.temperature}
                                            onChange={(e) => updateLLMField(agentId, 'temperature', parseFloat(e.target.value))}
                                            className="w-full px-4 py-2 rounded-lg border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary/40"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-islamic-dark mb-2">
                                            Max Tokens
                                        </label>
                                        <input
                                            type="number"
                                            step="100"
                                            value={agent.llmConfig.maxTokens}
                                            onChange={(e) => updateLLMField(agentId, 'maxTokens', parseInt(e.target.value))}
                                            className="w-full px-4 py-2 rounded-lg border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary/40"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-islamic-dark mb-2">
                                            API Key (Uses VITE_OPENROUTER_API_KEY from .env)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Uses environment variable (VITE_OPENROUTER_API_KEY)"
                                            value={import.meta.env.VITE_OPENROUTER_API_KEY ? '••••••••••••' : 'Not configured'}
                                            disabled
                                            className="w-full px-4 py-2 rounded-lg border border-islamic-cream bg-gray-100 text-islamic-dark/60 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-islamic-dark/50 mt-1">
                                            All models use the same OpenRouter API key from your .env file
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div >

                {/* Synthesis Model Info */}
                < div className="mt-8 p-6 bg-primary/5 dark:bg-primary/20 rounded-lg border border-primary/20 dark:border-primary/30" >
                    <h3 className="font-semibold text-islamic-dark mb-2">Epistemic Synthesis Engine</h3>
                    <p className="text-sm text-islamic-dark/70 mb-2">
                        The synthesis engine combines all council member responses into a final answer.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                        <div>
                            <span className="font-medium">Recommended Model:</span> {SYNTHESIS_MODEL.name}
                        </div>
                        <div>
                            <span className="font-medium">Model ID:</span> {SYNTHESIS_MODEL.modelId}
                        </div>
                        <div>
                            <span className="font-medium">Temperature:</span> {SYNTHESIS_MODEL.temperature}
                        </div>
                    </div>
                    <p className="text-xs text-islamic-dark/50 mt-2">
                        {SYNTHESIS_MODEL.description}
                    </p>
                </div >
            </section >
        </div >
    );
};

export default AdminConfig;
