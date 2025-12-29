import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Brain, Database, Settings, Plus, Trash2, Edit, Save, X } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  provider: string;
  modelId: string;
  role: string;
  knowledgeBase: string;
  isActive: boolean;
}

interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  documents: number;
  lastUpdated: string;
  language: string;
}

export const CircleKnowledge = () => {
  const { toast } = useToast();
  const [models, setModels] = useState<Model[]>([
    {
      id: 'agent-fiqh',
      name: 'Fiqh Reasoning Agent',
      provider: 'openrouter',
      modelId: 'meta-llama/llama-3.2-3b-instruct:free',
      role: 'fiqh_reasoning',
      knowledgeBase: 'islamic_jurisprudence',
      isActive: true,
    },
    {
      id: 'agent-aqeedah',
      name: 'Aqeedah Boundary Agent',
      provider: 'openrouter',
      modelId: 'meta-llama/llama-3.2-3b-instruct:free',
      role: 'aqeedah_guardian',
      knowledgeBase: 'islamic_creed',
      isActive: true,
    },
    {
      id: 'agent-humility',
      name: 'Humility & Abstention Agent',
      provider: 'openrouter',
      modelId: 'meta-llama/llama-3.2-3b-instruct:free',
      role: 'epistemic_humility',
      knowledgeBase: 'islamic_scholarship',
      isActive: true,
    },
    {
      id: 'agent-context',
      name: 'Contemporary Context Agent',
      provider: 'openrouter',
      modelId: 'meta-llama/llama-3.2-3b-instruct:free',
      role: 'contemporary_application',
      knowledgeBase: 'modern_islamic_context',
      isActive: true,
    },
  ]);

  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>(() => {
    const today = new Date();
    const getRecentDate = (daysAgo: number) => {
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      return date.toISOString().split('T')[0];
    };

    return [
      {
        id: 'islamic_jurisprudence',
        name: 'Islamic Jurisprudence Knowledge Base',
        description: 'Comprehensive fiqh rulings from Quran, Sunnah, and scholarly consensus',
        documents: 2450,
        lastUpdated: getRecentDate(1),
        language: 'en',
      },
      {
        id: 'islamic_creed',
        name: 'Islamic Creed (Aqeedah) Knowledge Base',
        description: 'Orthodox Islamic theology and foundational beliefs',
        documents: 890,
        lastUpdated: getRecentDate(2),
        language: 'en',
      },
      {
        id: 'islamic_scholarship',
        name: 'Islamic Scholarship Knowledge Base',
        description: 'Scholarly works on epistemic limits and proper methodology',
        documents: 650,
        lastUpdated: getRecentDate(3),
        language: 'en',
      },
      {
        id: 'modern_islamic_context',
        name: 'Contemporary Islamic Context Knowledge Base',
        description: 'Application of Islamic principles in modern contexts',
        documents: 1200,
        lastUpdated: getRecentDate(1),
        language: 'en',
      },
    ];
  });

  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [newModel, setNewModel] = useState<Partial<Model>>({
    name: '',
    provider: 'openrouter',
    modelId: '',
    role: '',
    knowledgeBase: '',
    isActive: true,
  });

  const [newKB, setNewKB] = useState<Partial<KnowledgeBase>>({
    name: '',
    description: '',
    language: 'en',
  });

  const handleSaveModel = () => {
    if (!editingModel) return;

    setModels(prev => prev.map(m =>
      m.id === editingModel.id ? editingModel : m
    ));
    setEditingModel(null);
    toast({
      title: 'Success',
      description: 'Model configuration updated successfully',
    });
  };

  const handleAddModel = () => {
    if (!newModel.name || !newModel.modelId || !newModel.role) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    const model: Model = {
      id: Date.now().toString(),
      name: newModel.name,
      provider: newModel.provider || 'openrouter',
      modelId: newModel.modelId,
      role: newModel.role,
      knowledgeBase: newModel.knowledgeBase || '',
      isActive: newModel.isActive || true,
    };

    setModels(prev => [...prev, model]);
    setNewModel({
      name: '',
      provider: 'openrouter',
      modelId: '',
      role: '',
      knowledgeBase: '',
      isActive: true,
    });
    toast({
      title: 'Success',
      description: 'Model added successfully',
    });
  };

  const handleDeleteModel = (id: string) => {
    setModels(prev => prev.filter(m => m.id !== id));
    toast({
      title: 'Success',
      description: 'Model deleted successfully',
    });
  };

  const handleAddKnowledgeBase = () => {
    if (!newKB.name || !newKB.description) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    const kb: KnowledgeBase = {
      id: Date.now().toString(),
      name: newKB.name,
      description: newKB.description,
      documents: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      language: newKB.language || 'en',
    };

    setKnowledgeBases(prev => [...prev, kb]);
    setNewKB({
      name: '',
      description: '',
      language: 'en',
    });
    toast({
      title: 'Success',
      description: 'Knowledge base created successfully',
    });
  };

  const handleDeleteKB = (id: string) => {
    setKnowledgeBases(prev => prev.filter(kb => kb.id !== id));
    toast({
      title: 'Success',
      description: 'Knowledge base deleted successfully',
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Circle of Knowledge</h1>
          <p className="text-gray-600">Configure AI models and knowledge bases for the Islamic council</p>
        </div>
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="knowledge-bases">Knowledge Bases</TabsTrigger>
          <TabsTrigger value="settings">Global Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Council Models
              </CardTitle>
              <CardDescription>
                Configure the AI models that serve as members of the Islamic knowledge council
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {models.map((model) => (
                <div key={model.id} className="border rounded-lg p-4 space-y-3">
                  {editingModel?.id === model.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Model Name</Label>
                          <Input
                            id="name"
                            value={editingModel.name}
                            onChange={(e) => setEditingModel({ ...editingModel, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="provider">Provider</Label>
                          <Select
                            value={editingModel.provider}
                            onValueChange={(value) => setEditingModel({ ...editingModel, provider: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="openrouter">OpenRouter</SelectItem>
                              <SelectItem value="openai">OpenAI</SelectItem>
                              <SelectItem value="anthropic">Anthropic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="modelId">Model ID</Label>
                          <Input
                            id="modelId"
                            value={editingModel.modelId}
                            onChange={(e) => setEditingModel({ ...editingModel, modelId: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select
                            value={editingModel.role}
                            onValueChange={(value) => setEditingModel({ ...editingModel, role: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fiqh_reasoning">Fiqh Reasoning Agent</SelectItem>
                              <SelectItem value="aqeedah_guardian">Aqeedah Boundary Agent</SelectItem>
                              <SelectItem value="epistemic_humility">Humility & Abstention Agent</SelectItem>
                              <SelectItem value="contemporary_application">Contemporary Context Agent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={handleSaveModel} size="sm">
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={() => setEditingModel(null)} size="sm">
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{model.name}</h3>
                          <Badge variant={model.isActive ? 'default' : 'secondary'}>
                            {model.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Provider: {model.provider}</p>
                          <p>Model: {model.modelId}</p>
                          <p>Role: {model.role.replace('_', ' ')}</p>
                          <p>Knowledge Base: {model.knowledgeBase || 'None'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingModel(model)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteModel(model.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold">Add New Model</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-name">Model Name</Label>
                    <Input
                      id="new-name"
                      value={newModel.name}
                      onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                      placeholder="e.g., Quran Expert"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-provider">Provider</Label>
                    <Select
                      value={newModel.provider}
                      onValueChange={(value) => setNewModel({ ...newModel, provider: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openrouter">OpenRouter</SelectItem>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-modelId">Model ID</Label>
                    <Input
                      id="new-modelId"
                      value={newModel.modelId}
                      onChange={(e) => setNewModel({ ...newModel, modelId: e.target.value })}
                      placeholder="e.g., anthropic/claude-3-haiku"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-role">Role</Label>
                    <Select
                      value={newModel.role}
                      onValueChange={(value) => setNewModel({ ...newModel, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fiqh_reasoning">Fiqh Reasoning Agent</SelectItem>
                        <SelectItem value="aqeedah_guardian">Aqeedah Boundary Agent</SelectItem>
                        <SelectItem value="epistemic_humility">Humility & Abstention Agent</SelectItem>
                        <SelectItem value="contemporary_application">Contemporary Context Agent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddModel}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Model
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge-bases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Knowledge Bases
              </CardTitle>
              <CardDescription>
                Manage knowledge bases for different Islamic schools of thought
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {knowledgeBases.map((kb) => (
                <div key={kb.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{kb.name}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteKB(kb.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{kb.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Documents: {kb.documents}</span>
                    <span>Language: {kb.language.toUpperCase()}</span>
                    <span>Last updated: {kb.lastUpdated}</span>
                  </div>
                </div>
              ))}

              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold">Create New Knowledge Base</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="kb-name">Name</Label>
                    <Input
                      id="kb-name"
                      value={newKB.name}
                      onChange={(e) => setNewKB({ ...newKB, name: e.target.value })}
                      placeholder="e.g., Quranic Sciences Knowledge Base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="kb-description">Description</Label>
                    <Textarea
                      id="kb-description"
                      value={newKB.description}
                      onChange={(e) => setNewKB({ ...newKB, description: e.target.value })}
                      placeholder="Describe the purpose and scope of this knowledge base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="kb-language">Language</Label>
                    <Select
                      value={newKB.language}
                      onValueChange={(value) => setNewKB({ ...newKB, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="wo">Wolof</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddKnowledgeBase}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Knowledge Base
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Global Settings
              </CardTitle>
              <CardDescription>
                Configure global settings for the Circle of Knowledge system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="consensus-threshold">Consensus Threshold</Label>
                <Input
                  id="consensus-threshold"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.7"
                />
                <p className="text-sm text-gray-600">
                  Minimum agreement level required for consensus (0.0 - 1.0)
                </p>
              </div>
              <div className="space-y-3">
                <Label htmlFor="max-council-members">Max Council Members</Label>
                <Input
                  id="max-council-members"
                  type="number"
                  min="1"
                  max="10"
                  defaultValue="5"
                />
                <p className="text-sm text-gray-600">
                  Maximum number of AI models to include in council discussions
                </p>
              </div>
              <div className="space-y-3">
                <Label htmlFor="response-timeout">Response Timeout (seconds)</Label>
                <Input
                  id="response-timeout"
                  type="number"
                  min="10"
                  max="300"
                  defaultValue="60"
                />
                <p className="text-sm text-gray-600">
                  Maximum time to wait for each model response
                </p>
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
