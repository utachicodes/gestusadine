import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useTr } from "@/lib/i18n";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

const EMPTY = {
  title: "",
  description: "",
  date: "",
  location: "",
  image: "",
  capacity: "",
};

export default function ManageEvents() {
  const tr = useTr();
  const events = useQuery(api.events.list) ?? [];
  const createEvent = useMutation(api.events.create);
  const updateEvent = useMutation(api.events.update);
  const removeEvent = useMutation(api.events.remove);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateMs = new Date(formData.date).getTime();
      if (editingId) {
        await updateEvent({
          id: editingId as any,
          title: formData.title,
          description: formData.description,
          date: dateMs,
          location: formData.location,
          image: formData.image || undefined,
          capacity: parseInt(formData.capacity) || 0,
        });
        toast.success(tr({ en: "Event updated", fr: "Événement mis à jour" }));
        setEditingId(null);
      } else {
        await createEvent({
          title: formData.title,
          description: formData.description,
          date: dateMs,
          location: formData.location,
          image: formData.image || undefined,
          category: "general",
          capacity: parseInt(formData.capacity) || 0,
        });
        toast.success(tr({ en: "Event created", fr: "Événement créé" }));
        setIsCreating(false);
      }
      setFormData({ ...EMPTY });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (event: any) => {
    setEditingId(event._id);
    setFormData({
      title: event.title,
      description: event.description || "",
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location || "",
      image: event.image || "",
      capacity: event.capacity?.toString() || "",
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr({ en: "Delete this event?", fr: "Supprimer cet événement ?" }))) return;
    try {
      await removeEvent({ id: id as any });
      toast.success(tr({ en: "Event deleted", fr: "Événement supprimé" }));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-10">
        <header className="flex justify-between items-center">
          <div>
            <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
              Admin
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark">
              {tr({ en: "Manage", fr: "Gérer les" })} <span className="text-gradient">{tr({ en: "Events", fr: "événements" })}</span>
            </h1>
          </div>
          <Button
            onClick={() => { setIsCreating(true); setEditingId(null); setFormData({ ...EMPTY }); }}
            className="btn-islamic"
          >
            <Plus className="mr-2 h-4 w-4" />
            {tr({ en: "Create Event", fr: "Créer un événement" })}
          </Button>
        </header>

        {isCreating && (
          <Card className="bg-[#efefec]/80 backdrop-blur-sm border border-islamic-gold/30">
            <CardHeader>
              <CardTitle>{editingId ? tr({ en: "Edit Event", fr: "Modifier l'événement" }) : tr({ en: "New Event", fr: "Nouvel événement" })}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder={tr({ en: "Title", fr: "Titre" })} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                <textarea placeholder={tr({ en: "Description", fr: "Description" })} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows={4} required />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">{tr({ en: "Date", fr: "Date" })}</label>
                    <Input type="datetime-local" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">{tr({ en: "Capacity", fr: "Capacité" })}</label>
                    <Input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
                  </div>
                </div>
                <Input placeholder={tr({ en: "Location", fr: "Lieu" })} value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                <Input placeholder={tr({ en: "Image URL", fr: "URL de l'image" })} value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                <div className="flex gap-2">
                  <Button type="submit" className="btn-islamic">{editingId ? tr({ en: "Update", fr: "Mettre à jour" }) : tr({ en: "Create", fr: "Créer" })}</Button>
                  <Button type="button" variant="outline" onClick={() => { setIsCreating(false); setEditingId(null); }}>{tr({ en: "Cancel", fr: "Annuler" })}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event: any) => (
            <Card key={event._id} className="bg-[#efefec]/80 backdrop-blur-sm border border-islamic-gold/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-islamic-dark">{event.title}</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(event._id)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <p className="text-islamic-dark/70 mb-4">{event.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-islamic-dark/70">
                    <Calendar size={16} />
                    <span>{format(new Date(event.date), "MMM d, yyyy h:mm a")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-islamic-dark/70">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-islamic-dark/70">
                    <Users size={16} />
                    <span>{event.registered}/{event.capacity}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
