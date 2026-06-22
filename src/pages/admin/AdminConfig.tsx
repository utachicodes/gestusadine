import * as React from "react";
import { logger } from "@/lib/logger";
import { Settings, Save, RefreshCw, CheckCircle, XCircle, Loader2, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTr } from "@/lib/i18n";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

const AVAILABLE_MODELS = [
  { provider: "allenai", models: ["allenai/olmo-3.1-32b-think", "allenai/olmo-3-32b-think"] },
  { provider: "xiaomi", models: ["xiaomi/mimo-v2-flash"] },
  { provider: "nvidia", models: ["nvidia/nemotron-3-nano-30b-a3b"] },
  { provider: "mistralai", models: ["mistralai/devstral-2-2512", "mistralai/mistral-large", "mistralai/mixtral-8x7b"] },
  { provider: "tngtech", models: ["tngtech/r1t-chimera"] },
  { provider: "nex-agi", models: ["nex-agi/deepseek-v3.1-nex-n1"] },
  { provider: "arcee-ai", models: ["arcee-ai/trinity-mini"] },
  { provider: "kwaipilot", models: ["kwaipilot/kat-coder-pro-v1"] },
  { provider: "openai", models: ["openai/gpt-4o", "openai/gpt-4-turbo", "openai/gpt-3.5-turbo", "openai/gpt-4o-mini"] },
  { provider: "anthropic", models: ["anthropic/claude-3-opus", "anthropic/claude-3-sonnet", "anthropic/claude-3-haiku"] },
  { provider: "meta", models: ["meta-llama/llama-3-70b-instruct", "meta-llama/llama-3-8b-instruct"] },
  { provider: "google", models: ["google/gemini-pro"] },
];

const DEFAULT_AGENTS = [
  { agentId: "agent-fiqh", name: "Fiqh Reasoning Agent", provider: "meta", model: "meta-llama/llama-3.3-70b-instruct:free", temperature: 0.3, enabled: true },
  { agentId: "agent-aqeedah", name: "Aqeedah Boundary Agent", provider: "meta", model: "meta-llama/llama-3.1-405b-instruct:free", temperature: 0.2, enabled: true },
  { agentId: "agent-humility", name: "Humility & Abstention Agent", provider: "meta", model: "meta-llama/llama-3.2-3b-instruct:free", temperature: 0.4, enabled: true },
  { agentId: "agent-context", name: "Contemporary Context Agent", provider: "nousresearch", model: "nousresearch/hermes-3-llama-3.1-405b:free", temperature: 0.6, enabled: true },
];

const AdminConfig: React.FC = () => {
  const tr = useTr();
  const savedAgents = useQuery(api.config.list);
  const upsertAgent = useMutation(api.config.upsert);

  const [agents, setAgents] = React.useState<Record<string, any>>({});
  const [testResults, setTestResults] = React.useState<Record<string, { success: boolean; message: string }>>({});
  const [testing, setTesting] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (savedAgents && savedAgents.length > 0) {
      const map: Record<string, any> = {};
      for (const a of savedAgents as any[]) {
        map[a.agentId] = a;
      }
      setAgents(map);
    } else if (savedAgents) {
      const map: Record<string, any> = {};
      for (const a of DEFAULT_AGENTS) {
        map[a.agentId] = { ...a };
      }
      setAgents(map);
    }
  }, [savedAgents]);

  const updateLLMField = (agentId: string, field: string, value: any) => {
    setAgents((prev: any) => ({
      ...prev,
      [agentId]: { ...prev[agentId], [field]: field === "temperature" ? parseFloat(value) : value },
    }));
  };

  const saveAgent = async (agentId: string) => {
    const agent = agents[agentId];
    if (!agent) return;
    try {
      await upsertAgent({
        agentId,
        name: agent.name,
        provider: agent.provider,
        model: agent.model,
        temperature: agent.temperature ?? 0.5,
        enabled: agent.enabled ?? true,
      });
    } catch (e: any) {
      logger.error("Failed to save agent:", { error: e });
    }
  };

  const testModel = async (agentId: string) => {
    const agent = agents[agentId];
    if (!agent) return;
    setTesting(agentId);
    try {
      setTestResults((prev) => ({
        ...prev,
        [agentId]: { success: true, message: tr({ en: "Model configured. Test via RAG Test page.", fr: "Modèle configuré. Testez via la page Test RAG." }) },
      }));
    } catch (e: any) {
      setTestResults((prev) => ({
        ...prev,
        [agentId]: { success: false, message: e.message },
      }));
    } finally {
      setTesting(null);
    }
  };

  const availableModels = AVAILABLE_MODELS;

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-islamic-cream/30 via-white to-islamic-gold/10">
      <section className="container py-10 md:py-16">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-3">
            {tr({ en: "Admin Panel", fr: "Panneau admin" })}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-islamic-dark mb-4">
            <span className="text-gradient">{tr({ en: "Model Configuration", fr: "Configuration des modèles" })}</span>
          </h1>
          <p className="text-islamic-dark/70 max-w-2xl leading-relaxed">
            {tr({ en: "Assign LLMs to each epistemic agent and configure their parameters.", fr: "Attribuez un LLM à chaque agent épistémique et configurez ses paramètres." })}
          </p>
        </header>

        <div className="max-w-5xl mx-auto space-y-6">
          {Object.entries(agents).map(([agentId, agent]: [string, any]) => {
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
                        <h3 className="font-semibold text-islamic-dark">{agent.name}</h3>
                        {testResult && (testResult.success ? <CheckCircle className="w-5 h-5 text-primary" /> : <XCircle className="w-5 h-5 text-red-500" />)}
                      </div>
                      <p className="text-xs text-islamic-dark/60">ID: {agentId}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => testModel(agentId)}
                      disabled={testing === agentId}
                      variant="outline"
                      size="sm"
                    >
                      {testing === agentId ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{tr({ en: "Testing...", fr: "Test..." })}</>
                      ) : (
                        <><TestTube className="w-4 h-4 mr-2" />{tr({ en: "Test", fr: "Tester" })}</>
                      )}
                    </Button>
                    <button onClick={() => saveAgent(agentId)} className="btn-islamic-outlined flex items-center gap-2">
                      <Save className="w-4 h-4" />{tr({ en: "Save", fr: "Enregistrer" })}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-islamic-dark mb-2">{tr({ en: "Provider", fr: "Fournisseur" })}</label>
                    <select
                      value={agent.provider}
                      onChange={(e) => updateLLMField(agentId, "provider", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background/50 text-foreground"
                    >
                      {availableModels.map((p) => (
                        <option key={p.provider} value={p.provider}>
                          {p.provider.charAt(0).toUpperCase() + p.provider.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-islamic-dark mb-2">{tr({ en: "Model", fr: "Modèle" })}</label>
                    <select
                      value={agent.model}
                      onChange={(e) => updateLLMField(agentId, "model", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background/50 text-foreground"
                    >
                      {availableModels.find((p) => p.provider === agent.provider)?.models.map((model: string) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-islamic-dark mb-2">{tr({ en: "Temperature", fr: "Température" })}</label>
                    <input
                      type="number" step="0.1" min="0" max="2"
                      value={agent.temperature ?? 0.5}
                      onChange={(e) => updateLLMField(agentId, "temperature", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background/50 text-foreground"
                    />
                  </div>
                  <div className="flex items-center pt-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agent.enabled ?? true}
                        onChange={(e) => updateLLMField(agentId, "enabled", e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">{tr({ en: "Enabled", fr: "Activé" })}</span>
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default AdminConfig;
