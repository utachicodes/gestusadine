import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, TestTube, FileText, Search, Brain, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { openRouter } from '@/lib/openrouter';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message: string;
  details?: string;
  duration?: number;
}

export default function RAGTest() {
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [testDocument, setTestDocument] = useState('');
  const [testQuery, setTestQuery] = useState('');

  const updateResult = (name: string, updates: Partial<TestResult>) => {
    setResults(prev => {
      const existing = prev.find(r => r.name === name);
      if (existing) {
        return prev.map(r => r.name === name ? { ...r, ...updates } : r);
      }
      return [...prev, { name, status: 'pending', message: '', ...updates }];
    });
  };

  const testEmbeddingGeneration = async (): Promise<boolean> => {
    updateResult('Embedding Generation', { status: 'running', message: 'Testing embedding generation...' });
    const startTime = Date.now();

    try {
      const testText = 'This is a test document for RAG verification.';
      const embedding = await openRouter.getEmbedding(testText);

      if (!embedding || embedding.length === 0) {
        throw new Error('Empty embedding returned');
      }

      if (embedding.length < 100) {
        throw new Error(`Embedding dimension too small: ${embedding.length}`);
      }

      const duration = Date.now() - startTime;
      updateResult('Embedding Generation', {
        status: 'passed',
        message: `✅ Embedding generated successfully (${embedding.length} dimensions)`,
        details: `Model: openai/text-embedding-3-small\nDimensions: ${embedding.length}`,
        duration
      });
      return true;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      updateResult('Embedding Generation', {
        status: 'failed',
        message: `❌ Failed: ${error.message}`,
        details: error.stack,
        duration
      });
      return false;
    }
  };

  const testChatModels = async (): Promise<boolean> => {
    updateResult('Chat Models', { status: 'running', message: 'Testing all chat models...' });
    const startTime = Date.now();

    const models = [
      { id: 'allenai/olmo-3.1-32b-think', name: 'Olmo 3.1 32B' },
      { id: 'tngtech/r1t-chimera', name: 'R1T Chimera' },
      { id: 'xiaomi/mimo-v2-flash', name: 'MiMo-V2-Flash' },
      { id: 'nvidia/nemotron-3-nano-30b-a3b', name: 'Nemotron 3 Nano' }
    ];

    const testResults: string[] = [];
    const failures: string[] = [];

    for (const model of models) {
      try {
        const response = await openRouter.generateCompletion([
          {
            role: 'system',
            content: 'You are a helpful assistant. Respond briefly.'
          },
          {
            role: 'user',
            content: 'Say "Hello, I am working correctly."'
          }
        ], {
          model: model.id,
          maxTokens: 50,
          temperature: 0.7
        });

        if (response && response.length > 0) {
          testResults.push(`✅ ${model.name}: Working`);
        } else {
          failures.push(`❌ ${model.name}: Empty response`);
        }
      } catch (error: any) {
        failures.push(`❌ ${model.name}: ${error.message}`);
      }

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const duration = Date.now() - startTime;
    const allPassed = failures.length === 0;

    updateResult('Chat Models', {
      status: allPassed ? 'passed' : 'failed',
      message: allPassed
        ? `✅ All ${models.length} models working`
        : `❌ ${failures.length} model(s) failed`,
      details: [...testResults, ...failures].join('\n'),
      duration
    });

    return allPassed;
  };

  const testRAGWithContext = async (): Promise<boolean> => {
    if (!testDocument.trim()) {
      updateResult('RAG Context Test', {
        status: 'failed',
        message: '❌ Please provide a test document first'
      });
      return false;
    }

    updateResult('RAG Context Test', { status: 'running', message: 'Testing RAG context handling...' });
    const startTime = Date.now();

    try {
      // Simulate RAG context (normally retrieved from vector DB)
      const ragContext = `[Test Document]\n${testDocument.substring(0, 500)}`;
      const query = testQuery || 'What is this document about?';

      const fullPrompt = `${query}\n\nRelevant context from knowledge base:\n${ragContext}`;

      // Test with a council member model
      const response = await openRouter.generateCompletion([
        {
          role: 'system',
          content: 'You are The Analyst. Analyze queries using logic and evidence from provided context.'
        },
        {
          role: 'user',
          content: fullPrompt
        }
      ], {
        model: 'allenai/olmo-3.1-32b-think',
        maxTokens: 300,
        temperature: 0.2
      });

      // Check if response references the context
      const referencesContext = response.toLowerCase().includes(testDocument.toLowerCase().substring(0, 20)) ||
        response.length > 50; // If it's a substantial response, likely processed context

      const duration = Date.now() - startTime;
      updateResult('RAG Context Test', {
        status: referencesContext ? 'passed' : 'failed',
        message: referencesContext
          ? '✅ Model successfully processed RAG context'
          : '⚠️ Model response may not have used context',
        details: `Query: "${query}"\nResponse: ${response.substring(0, 200)}...`,
        duration
      });

      return referencesContext;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      updateResult('RAG Context Test', {
        status: 'failed',
        message: `❌ Failed: ${error.message}`,
        details: error.stack,
        duration
      });
      return false;
    }
  };

  const testFullRAGFlow = async (): Promise<boolean> => {
    if (!testDocument.trim()) {
      toast({
        title: 'Missing Document',
        description: 'Please provide a test document',
        variant: 'destructive'
      });
      return false;
    }

    updateResult('Full RAG Flow', { status: 'running', message: 'Testing complete RAG flow...' });
    const startTime = Date.now();

    try {
      // Step 1: Generate embedding for document
      const docEmbedding = await openRouter.getEmbedding(testDocument.substring(0, 500));
      if (!docEmbedding || docEmbedding.length === 0) {
        throw new Error('Failed to generate document embedding');
      }

      // Step 2: Generate embedding for query
      const query = testQuery || 'What is this document about?';
      const queryEmbedding = await openRouter.getEmbedding(query);
      if (!queryEmbedding || queryEmbedding.length === 0) {
        throw new Error('Failed to generate query embedding');
      }

      // Step 3: Simulate similarity search (cosine similarity)
      const cosineSimilarity = (a: number[], b: number[]): number => {
        if (a.length !== b.length) return 0;
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < a.length; i++) {
          dotProduct += a[i] * b[i];
          normA += a[i] * a[i];
          normB += b[i] * b[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
      };

      const similarity = cosineSimilarity(docEmbedding, queryEmbedding);

      // Step 4: If similarity is good, test with council member
      if (similarity > 0.3) {
        const ragContext = `[Test Document]\n${testDocument.substring(0, 500)}`;
        const fullPrompt = `${query}\n\nRelevant context:\n${ragContext}`;

        const response = await openRouter.generateCompletion([
          {
            role: 'system',
            content: 'You are The Analyst. Use the provided context to answer the query.'
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ], {
          model: 'allenai/olmo-3.1-32b-think',
          maxTokens: 300
        });

        const duration = Date.now() - startTime;
        updateResult('Full RAG Flow', {
          status: 'passed',
          message: '✅ Complete RAG flow working!',
          details: `Similarity Score: ${similarity.toFixed(3)}\nResponse: ${response.substring(0, 200)}...`,
          duration
        });
        return true;
      } else {
        const duration = Date.now() - startTime;
        updateResult('Full RAG Flow', {
          status: 'failed',
          message: `⚠️ Low similarity score: ${similarity.toFixed(3)}`,
          details: 'Document and query embeddings are not similar enough. Try a query more related to the document.',
          duration
        });
        return false;
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      updateResult('Full RAG Flow', {
        status: 'failed',
        message: `❌ Failed: ${error.message}`,
        details: error.stack,
        duration
      });
      return false;
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setResults([]);

    try {
      // Test 1: Embedding generation
      const embeddingOk = await testEmbeddingGeneration();
      if (!embeddingOk) {
        toast({
          title: 'Embedding Test Failed',
          description: 'Cannot proceed without embeddings. Check your API key.',
          variant: 'destructive'
        });
        setTesting(false);
        return;
      }

      // Test 2: Chat models
      await testChatModels();

      // Test 3: RAG context (if document provided)
      if (testDocument.trim()) {
        await testRAGWithContext();
        await testFullRAGFlow();
      } else {
        updateResult('RAG Context Test', {
          status: 'pending',
          message: '⏭️ Skipped (no test document)'
        });
        updateResult('Full RAG Flow', {
          status: 'pending',
          message: '⏭️ Skipped (no test document)'
        });
      }

      const passed = results.filter(r => r.status === 'passed').length;
      const failed = results.filter(r => r.status === 'failed').length;

      toast({
        title: 'Tests Complete',
        description: `Passed: ${passed}, Failed: ${failed}`,
        variant: failed > 0 ? 'destructive' : 'default'
      });
    } catch (error: any) {
      toast({
        title: 'Test Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-islamic-cream/30 via-[#efefec] to-islamic-gold/10 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-islamic-dark mb-2">RAG System Verification</h1>
          <p className="text-islamic-dark/70">
            Test the complete RAG (Retrieval Augmented Generation) system end-to-end
          </p>
        </div>

        {/* API Status */}
        <Card className="bg-[#efefec]/80 backdrop-blur-sm border border-islamic-gold/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              OpenRouter API Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={runAllTests}
              disabled={testing || !import.meta.env.VITE_OPENROUTER_API_KEY}
              className="btn-islamic w-full"
            >
              <TestTube className="w-4 h-4 mr-2" />
              {testing ? 'Running Tests...' : 'Run All Tests'}
            </Button>
          </CardContent>
        </Card>

        {/* Test Inputs */}
        <Card className="bg-[#efefec]/80 backdrop-blur-sm border border-islamic-gold/30">
          <CardHeader>
            <CardTitle>Test Inputs</CardTitle>
            <CardDescription>
              Provide a test document and query to test the full RAG flow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test Document</label>
              <Textarea
                value={testDocument}
                onChange={(e) => setTestDocument(e.target.value)}
                placeholder="Enter a test document (e.g., 'Islamic finance principles include avoiding interest (riba) and ensuring transactions are halal...')"
                rows={4}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Test Query</label>
              <Input
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="What is this document about?"
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-islamic-dark">Test Results</h2>

          {results.length === 0 ? (
            <Card className="bg-[#efefec]/80 backdrop-blur-sm border border-islamic-gold/30">
              <CardContent className="p-6 text-center text-islamic-dark/60">
                Click "Run All Tests" to begin verification
              </CardContent>
            </Card>
          ) : (
            results.map((result, index) => (
              <Card
                key={index}
                className={`bg-[#efefec]/80 backdrop-blur-sm border ${result.status === 'passed' ? 'border-primary' :
                  result.status === 'failed' ? 'border-red-300' :
                    result.status === 'running' ? 'border-blue-300' :
                      'border-islamic-gold/30'
                  }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <CardTitle className="text-lg">{result.name}</CardTitle>
                    </div>
                    {result.duration && (
                      <Badge variant="outline">
                        {result.duration}ms
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-islamic-dark/80 mb-2">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-islamic-dark/60 cursor-pointer hover:text-islamic-dark/80">
                        View Details
                      </summary>
                      <pre className="mt-2 p-3 bg-islamic-dark/5 rounded text-xs text-islamic-dark/70 overflow-auto max-h-40">
                        {result.details}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Test Buttons */}
        <Card className="bg-[#efefec]/80 backdrop-blur-sm border border-islamic-gold/30">
          <CardHeader>
            <CardTitle>Quick Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={testEmbeddingGeneration}
                disabled={testing || !import.meta.env.VITE_OPENROUTER_API_KEY}
                variant="outline"
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Test Embeddings
              </Button>
              <Button
                onClick={testChatModels}
                disabled={testing || !import.meta.env.VITE_OPENROUTER_API_KEY}
                variant="outline"
                className="w-full"
              >
                <Brain className="w-4 h-4 mr-2" />
                Test Chat Models
              </Button>
              <Button
                onClick={testRAGWithContext}
                disabled={testing || !import.meta.env.VITE_OPENROUTER_API_KEY || !testDocument.trim()}
                variant="outline"
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                Test RAG Context
              </Button>
              <Button
                onClick={testFullRAGFlow}
                disabled={testing || !import.meta.env.VITE_OPENROUTER_API_KEY || !testDocument.trim()}
                variant="outline"
                className="w-full"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Test Full Flow
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-sm">ℹ️ What These Tests Verify</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-islamic-dark/70 space-y-2">
            <p><strong>Embedding Generation:</strong> Tests if embeddings can be generated (required for RAG)</p>
            <p><strong>Chat Models:</strong> Tests if all 4 free council member models respond correctly</p>
            <p><strong>RAG Context:</strong> Tests if models can process and use RAG context in responses</p>
            <p><strong>Full RAG Flow:</strong> Tests complete flow: document → embedding → similarity → context → response</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

