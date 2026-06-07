import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useTr } from "@/lib/i18n";
import { getErrorMessage } from "@/types/errors";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

const EMPTY = {
  title: "",
  description: "",
  url: "",
  thumbnail: "",
  duration: "",
  category: "general",
};

export default function ManageVideos() {
  const tr = useTr();
  const videos = useQuery(api.videos.list) ?? [];
  const createVideo = useMutation(api.videos.create);
  const updateVideo = useMutation(api.videos.update);
  const removeVideo = useMutation(api.videos.remove);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateVideo({
          id: editingId as any,
          title: formData.title,
          description: formData.description,
          url: formData.url,
          thumbnail: formData.thumbnail || undefined,
          duration: parseInt(formData.duration) || 0,
          category: formData.category,
        });
        toast.success(tr({ en: "Video updated", fr: "Vidéo mise à jour" }));
        setEditingId(null);
      } else {
        await createVideo({
          title: formData.title,
          description: formData.description,
          url: formData.url,
          thumbnail: formData.thumbnail || undefined,
          duration: parseInt(formData.duration) || 0,
          category: formData.category,
        });
        toast.success(tr({ en: "Video created", fr: "Vidéo créée" }));
        setIsCreating(false);
      }
      setFormData({ ...EMPTY });
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleEdit = (video: any) => {
    setEditingId(video._id);
    setFormData({
      title: video.title,
      description: video.description || "",
      url: video.url,
      thumbnail: video.thumbnail || "",
      duration: video.duration?.toString() || "",
      category: video.category || "general",
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr({ en: "Delete this video?", fr: "Supprimer cette vidéo ?" }))) return;
    try {
      await removeVideo({ id: id as any });
      toast.success(tr({ en: "Video deleted", fr: "Vidéo supprimée" }));
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-10">
        <header className="flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-2">Admin
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark">
              {tr({ en: "Manage", fr: "Gérer les" })} <span className="text-gradient">{tr({ en: "Videos", fr: "vidéos" })}</span>
            </h1>
          </div>
          <Button onClick={() => { setIsCreating(true); setEditingId(null); setFormData({ ...EMPTY }); }} className="btn-islamic">
            <Plus className="mr-2 h-4 w-4" />{tr({ en: "Add Video", fr: "Ajouter une vidéo" })}
          </Button>
        </header>

        {isCreating && (
          <Card className="bg-[#efefec]/80 backdrop-blur-sm border border-islamic-gold/30">
            <CardHeader><CardTitle>{editingId ? tr({ en: "Edit Video", fr: "Modifier la vidéo" }) : tr({ en: "New Video", fr: "Nouvelle vidéo" })}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder={tr({ en: "Title", fr: "Titre" })} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                <textarea placeholder={tr({ en: "Description", fr: "Description" })} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows={3} required />
                <Input placeholder={tr({ en: "Video URL", fr: "URL de la vidéo" })} value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} required />
                <Input placeholder={tr({ en: "Thumbnail URL", fr: "URL de la miniature" })} value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">{tr({ en: "Duration (sec)", fr: "Durée (sec)" })}</label>
                    <Input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">{tr({ en: "Category", fr: "Catégorie" })}</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option value="general">{tr({ en: "General", fr: "Général" })}</option>
                      <option value="fiqh">{tr({ en: "Fiqh", fr: "Fiqh" })}</option>
                      <option value="aqeedah">{tr({ en: "Aqeedah", fr: "Aqida" })}</option>
                      <option value="quran">{tr({ en: "Quran", fr: "Coran" })}</option>
                      <option value="hadith">{tr({ en: "Hadith", fr: "Hadith" })}</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="btn-islamic">{editingId ? tr({ en: "Update", fr: "Mettre à jour" }) : tr({ en: "Create", fr: "Créer" })}</Button>
                  <Button type="button" variant="outline" onClick={() => { setIsCreating(false); setEditingId(null); }}>{tr({ en: "Cancel", fr: "Annuler" })}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video: any) => (
            <Card key={video._id} className="bg-[#efefec]/80 backdrop-blur-sm border border-islamic-gold/30 overflow-hidden">
              <div className="aspect-video relative bg-islamic-dark/10">
                {video.thumbnail ? (
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full"><PlayCircle size={48} className="text-islamic-dark/40" /></div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-islamic-dark line-clamp-2">{video.title}</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(video)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(video._id)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <p className="text-sm text-islamic-dark/70 line-clamp-2 mb-3">{video.description}</p>
                <div className="flex gap-2">
                  <Badge>{video.category}</Badge>
                  <Badge variant="outline">{Math.floor((video.duration || 0) / 60)} min</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
