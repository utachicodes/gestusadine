import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Database, Settings, Plus, Trash2, Edit, Save, X } from "lucide-react";
import { useTr } from "@/lib/i18n";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";

export const CircleKnowledge = () => {
  const tr = useTr();
  const agentConfigs = useQuery(api.config.list) ?? [];
  const upsertAgent = useMutation(api.config.upsert);
  const removeAgent = useMutation(api.config.remove);

  const [editingModel, setEditingModel] = useState<any>(null);
  const [newModel, setNewModel] = useState<any>({
    agentId: `agent-${Date.now()}`,
    name: "",
    provider: "fanar",
    model: "Fanar-Sadiq",
    temperature: 0.5,
    enabled: true,
  });

  const handleSaveModel = async () => {
    if (!editingModel) return;
    try {
      await upsertAgent({
        agentId: editingModel.agentId,
        name: editingModel.name,
        provider: editingModel.provider,
        model: editingModel.model,
        temperature: editingModel.temperature ?? 0.5,
        enabled: editingModel.enabled ?? true,
      });
      setEditingModel(null);
      toast.success(tr({ en: "Saved", fr: "Enregistré" }));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleAddModel = async () => {
    if (!newModel.name || !newModel.model) return;
    try {
      await upsertAgent({
        agentId: newModel.agentId,
        name: newModel.name,
        provider: newModel.provider,
        model: newModel.model,
        temperature: newModel.temperature ?? 0.5,
        enabled: true,
      });
      setNewModel({
        agentId: `agent-${Date.now()}`,
        name: "",
        provider: "fanar",
        model: "Fanar-Sadiq",
        temperature: 0.5,
        enabled: true,
      });
      toast.success(tr({ en: "Model added", fr: "Modèle ajouté" }));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteModel = async (id: string) => {
    try {
      await removeAgent({ id: id as any });
      toast.success(tr({ en: "Deleted", fr: "Supprimé" }));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{tr({ en: "Circle of Knowledge", fr: "Cercle du Savoir" })}</h1>
          <p className="text-gray-600">{tr({ en: "Configure AI models and knowledge bases", fr: "Configurez les modèles IA" })}</p>
        </div>
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList>
          <TabsTrigger value="models">{tr({ en: "AI Models", fr: "Modèles IA" })}</TabsTrigger>
          <TabsTrigger value="settings">{tr({ en: "Global Settings", fr: "Paramètres" })}</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {tr({ en: "AI Council Models", fr: "Modèles du conseil IA" })}
              </CardTitle>
              <CardDescription>
                {tr({ en: "Configure the AI models that serve as council members", fr: "Configurez les modèles IA du conseil" })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(agentConfigs as any[]).map((cfg: any) => (
                <div key={cfg._id} className="border rounded-lg p-4 space-y-3">
                  {editingModel?._id === cfg._id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>{tr({ en: "Name", fr: "Nom" })}</Label>
                          <Input value={editingModel.name} onChange={(e) => setEditingModel({ ...editingModel, name: e.target.value })} />
                        </div>
                        <div>
                          <Label>{tr({ en: "Model", fr: "Modèle" })}</Label>
                          <Input value={editingModel.model} onChange={(e) => setEditingModel({ ...editingModel, model: e.target.value })} />
                        </div>
                        <div>
                          <Label>{tr({ en: "Provider", fr: "Fournisseur" })}</Label>
                          <Select value={editingModel.provider} onValueChange={(v) => setEditingModel({ ...editingModel, provider: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fanar">Fanar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>{tr({ en: "Temperature", fr: "Température" })}</Label>
                          <Input type="number" step="0.1" min="0" max="2" value={editingModel.temperature} onChange={(e) => setEditingModel({ ...editingModel, temperature: parseFloat(e.target.value) })} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveModel} size="sm"><Save className="h-4 w-4 mr-1" />{tr({ en: "Save", fr: "Enregistrer" })}</Button>
                        <Button variant="outline" onClick={() => setEditingModel(null)} size="sm"><X className="h-4 w-4 mr-1" />{tr({ en: "Cancel", fr: "Annuler" })}</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{cfg.name}</h3>
                          <Badge variant={cfg.enabled ? "default" : "secondary"}>
                            {cfg.enabled ? tr({ en: "Active", fr: "Actif" }) : tr({ en: "Inactive", fr: "Inactif" })}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{tr({ en: "Model:", fr: "Modèle :" })} {cfg.model}</p>
                          <p>{tr({ en: "Temperature:", fr: "Température :" })} {cfg.temperature}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingModel(cfg)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteModel(cfg._id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold">{tr({ en: "Add New Model", fr: "Ajouter un modèle" })}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{tr({ en: "Name", fr: "Nom" })}</Label>
                    <Input value={newModel.name} onChange={(e) => setNewModel({ ...newModel, name: e.target.value })} placeholder="e.g., Quran Expert" />
                  </div>
                  <div>
                    <Label>{tr({ en: "Model ID", fr: "ID du modèle" })}</Label>
                    <Input value={newModel.model} onChange={(e) => setNewModel({ ...newModel, model: e.target.value })} placeholder="e.g., anthropic/claude-3-haiku" />
                  </div>
                  <div>
                    <Label>{tr({ en: "Provider", fr: "Fournisseur" })}</Label>
                    <Select value={newModel.provider} onValueChange={(v) => setNewModel({ ...newModel, provider: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fanar">Fanar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{tr({ en: "Temperature", fr: "Température" })}</Label>
                    <Input type="number" step="0.1" min="0" max="2" value={newModel.temperature} onChange={(e) => setNewModel({ ...newModel, temperature: parseFloat(e.target.value) })} />
                  </div>
                </div>
                <Button onClick={handleAddModel}><Plus className="h-4 w-4 mr-2" />{tr({ en: "Add Model", fr: "Ajouter" })}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {tr({ en: "Global Settings", fr: "Paramètres globaux" })}
              </CardTitle>
              <CardDescription>
                {tr({ en: "Configure global settings for the council system", fr: "Configurez les paramètres globaux" })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                {tr({ en: "Fanar API key is configured server-side via Convex environment variables. No key is exposed to the browser.", fr: "La clé API Fanar est configurée côté serveur via les variables d'environnement Convex. Aucune clé n'est exposée au navigateur." })}
              </p>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {tr({ en: "✓ API Key secured server-side", fr: "✓ Clé API sécurisée côté serveur" })}
              </Badge>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CircleKnowledge;
