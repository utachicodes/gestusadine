import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, TestTube, FileText, Search, Brain, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useTr } from "@/lib/i18n";
import { api } from "../../../convex/_generated/api";
import { useAction } from "convex/react";

interface TestResult {
  name: string;
  status: "pending" | "running" | "passed" | "failed";
  message: string;
  details?: string;
  duration?: number;
}

export default function RAGTest() {
  const tr = useTr();
  const testModelAction = useAction(api.llm.testModel);
  const generateAction = useAction(api.llm.generate);

  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [testDocument, setTestDocument] = useState("");
  const [testQuery, setTestQuery] = useState("");

  const updateResult = (name: string, updates: Partial<TestResult>) => {
    setResults((prev) => {
      const existing = prev.find((r) => r.name === name);
      if (existing) return prev.map((r) => (r.name === name ? { ...r, ...updates } : r));
      return [...prev, { name, status: "pending" as const, message: "", ...updates }];
    });
  };

  const testChatModels = async (): Promise<boolean> => {
    updateResult("Chat Models", { status: "running", message: tr({ en: "Testing chat models...", fr: "Test des modèles..." }) });
    const startTime = Date.now();
    const models = [
      { id: "Fanar", name: "Fanar" },
      { id: "Fanar-Sadiq", name: "Fanar-Sadiq" },
    ];
    const failures: string[] = [];
    for (const model of models) {
      try {
        await testModelAction({ model: model.id });
      } catch (e: any) {
        failures.push(`${model.name}: ${e.message}`);
      }
    }
    const duration = Date.now() - startTime;
    const allPassed = failures.length === 0;
    updateResult("Chat Models", {
      status: allPassed ? "passed" : "failed",
      message: allPassed ? tr({ en: `✅ ${models.length} models working`, fr: `✅ ${models.length} modèles fonctionnent` }) : tr({ en: `❌ ${failures.length} failed`, fr: `❌ ${failures.length} échecs` }),
      details: failures.join("\n") || "All models responded",
      duration,
    });
    return allPassed;
  };

  const runAllTests = async () => {
    setTesting(true);
    setResults([]);
    try {
      await testChatModels();
    } catch (error: any) {
      updateResult("Tests", { status: "failed", message: error.message });
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "passed": return <CheckCircle className="w-5 h-5 text-primary" />;
      case "failed": return <XCircle className="w-5 h-5 text-red-500" />;
      case "running": return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-islamic-cream/30 via-[#efefec] to-islamic-gold/10 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-islamic-dark mb-2">{tr({ en: "RAG System Verification", fr: "Vérification du système RAG" })}</h1>
          <p className="text-islamic-dark/70">{tr({ en: "Test LLM functionality via server-side Convex actions", fr: "Testez les LLM via les actions Convex côté serveur" })}</p>
        </div>

        <Card className="bg-[#efefec]/80 backdrop-blur-sm border border-islamic-gold/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5" />{tr({ en: "API Status", fr: "État de l'API" })}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-islamic-dark/70 mb-4">
              {tr({ en: "All LLM calls are made server-side via Convex actions. No API key is exposed to the browser.", fr: "Tous les appels LLM sont côté serveur via les actions Convex. Aucune clé API n'est exposée." })}
            </p>
            <Button onClick={runAllTests} disabled={testing} className="btn-islamic w-full">
              <TestTube className="w-4 h-4 mr-2" />
              {testing ? tr({ en: "Running Tests...", fr: "Tests en cours..." }) : tr({ en: "Run All Tests", fr: "Lancer tous les tests" })}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-islamic-dark">{tr({ en: "Test Results", fr: "Résultats" })}</h2>
          {results.length === 0 ? (
            <Card className="bg-[#efefec]/80 backdrop-blur-sm border border-islamic-gold/30">
              <CardContent className="p-6 text-center text-islamic-dark/60">
                {tr({ en: 'Click "Run All Tests" to begin', fr: 'Cliquez sur "Lancer tous les tests"' })}
              </CardContent>
            </Card>
          ) : (
            results.map((result, index) => (
              <Card key={index} className={`bg-[#efefec]/80 backdrop-blur-sm border ${
                result.status === "passed" ? "border-primary" : result.status === "failed" ? "border-red-300" : result.status === "running" ? "border-blue-300" : "border-islamic-gold/30"
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <CardTitle className="text-lg">{result.name}</CardTitle>
                    </div>
                    {result.duration && <Badge variant="outline">{result.duration}ms</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-islamic-dark/80 mb-2">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-islamic-dark/60 cursor-pointer">{tr({ en: "View Details", fr: "Détails" })}</summary>
                      <pre className="mt-2 p-3 bg-islamic-dark/5 rounded text-xs text-islamic-dark/70 overflow-auto max-h-40">{result.details}</pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
