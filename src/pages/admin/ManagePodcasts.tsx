import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Plus, Edit, Trash2, Headphones } from "lucide-react";
import { toast } from "sonner";
import { useTr } from "@/lib/i18n";
import { getErrorMessage } from "@/types/errors";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

const EMPTY = {
  title: "",
  description: "",
  audioUrl: "",
  coverUrl: "",
  duration: "",
  category: "general",
  guestName: "",
};

export default function ManagePodcasts() {
  const tr = useTr();
  const podcasts = useQuery(api.podcasts.list) ?? [];
  const createPodcast = useMutation(api.podcasts.create);
  const updatePodcast = useMutation(api.podcasts.update);
  const removePodcast = useMutation(api.podcasts.remove);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        audioUrl: formData.audioUrl,
        coverUrl: formData.coverUrl || undefined,
        duration: parseInt(formData.duration) || 0,
        category: formData.category,
        guestName: formData.guestName || undefined,
      };

      if (editingId) {
        await updatePodcast({ id: editingId as any, ...payload });
        toast.success(tr({ en: "Podcast updated", fr: "Podcast mis à jour" }));
        setEditingId(null);
      } else {
        await createPodcast(payload);
        toast.success(tr({ en: "Podcast created", fr: "Podcast créé" }));
        setIsCreating(false);
      }
      setFormData({ ...EMPTY });
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleEdit = (podcast: any) => {
    setEditingId(podcast._id);
    setFormData({
      title: podcast.title,
      description: podcast.description || "",
      audioUrl: podcast.audioUrl,
      coverUrl: podcast.coverUrl || "",
      duration: podcast.duration?.toString() || "",
      category: podcast.category || "general",
      guestName: podcast.guestName || "",
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr({ en: "Delete this podcast?", fr: "Supprimer ce podcast ?" }))) return;
    try {
      await removePodcast({ id: id as any });
      toast.success(tr({ en: "Podcast deleted", fr: "Podcast supprimé" }));
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{tr({ en: "Manage Podcasts", fr: "Gérer les podcasts" })}</h1>
          <p className="text-muted-foreground mt-1">{tr({ en: "Create and manage podcast episodes", fr: "Créez et gérez les épisodes de podcast" })}</p>
        </div>
        <Button onClick={() => { setIsCreating(true); setFormData({ ...EMPTY }); }}>
          <Plus className="mr-2 h-4 w-4" /> {tr({ en: "New Episode", fr: "Nouvel épisode" })}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? tr({ en: "Edit Episode", fr: "Modifier l'épisode" }) : tr({ en: "Create Episode", fr: "Créer un épisode" })}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">{tr({ en: "Title", fr: "Titre" })}</label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium">{tr({ en: "Description", fr: "Description" })}</label>
                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium">{tr({ en: "Audio URL", fr: "URL audio" })}</label>
                <Input value={formData.audioUrl} onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium">{tr({ en: "Cover Image URL", fr: "URL de couverture" })}</label>
                <Input value={formData.coverUrl} onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">{tr({ en: "Duration (seconds)", fr: "Durée (secondes)" })}</label>
                <Input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium">{tr({ en: "Category", fr: "Catégorie" })}</label>
                <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium">{tr({ en: "Guest Name (optional)", fr: "Nom de l'invité (optionnel)" })}</label>
                <Input value={formData.guestName} onChange={(e) => setFormData({ ...formData, guestName: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingId ? tr({ en: "Update", fr: "Mettre à jour" }) : tr({ en: "Create", fr: "Créer" })}</Button>
                <Button type="button" variant="outline" onClick={() => { setIsCreating(false); setEditingId(null); }}>
                  {tr({ en: "Cancel", fr: "Annuler" })}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {podcasts.length === 0 ? (
          <p className="text-muted-foreground">{tr({ en: "No podcasts yet.", fr: "Aucun podcast pour l'instant." })}</p>
        ) : (
          podcasts.map((podcast) => (
            <Card key={podcast._id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Headphones className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{podcast.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {podcast.guestName && `${podcast.guestName} · `}
                      {Math.floor(podcast.duration / 60)} min · {podcast.plays ?? 0} plays
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(podcast)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(podcast._id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
