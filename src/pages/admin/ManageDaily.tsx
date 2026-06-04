import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus, Edit, Trash2, Sparkles, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { useTr } from "@/lib/i18n";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

const EMPTY_AYAH = { content: "", source: "", translation: "" };
const EMPTY_DUA = { content: "", source: "", translation: "" };
const EMPTY_FACT = { content: "", source: "" };

export default function ManageDaily() {
  const tr = useTr();
  const items = useQuery(api.daily.list) ?? [];
  const createItem = useMutation(api.daily.create);
  const updateItem = useMutation(api.daily.update);
  const removeItem = useMutation(api.daily.remove);

  const [activeTab, setActiveTab] = useState<"ayah" | "dua" | "fact">("ayah");
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [ayahForm, setAyahForm] = useState({ ...EMPTY_AYAH });
  const [duaForm, setDuaForm] = useState({ ...EMPTY_DUA });
  const [factForm, setFactForm] = useState({ ...EMPTY_FACT });

  const filtered = (items as any[]).filter((i: any) => i.contentType === activeTab);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const contentType = activeTab;
      let content = "";
      let source = "";
      let translation = "";

      if (contentType === "ayah") {
        content = ayahForm.content;
        source = ayahForm.source;
        translation = ayahForm.translation;
      } else if (contentType === "dua") {
        content = duaForm.content;
        source = duaForm.source;
        translation = duaForm.translation;
      } else {
        content = factForm.content;
        source = factForm.source;
      }

      if (editingId) {
        await updateItem({
          id: editingId as any,
          content,
          source,
          translation: translation || undefined,
        });
        toast.success(tr({ en: "Updated", fr: "Mis à jour" }));
        setEditingId(null);
      } else {
        await createItem({
          contentType,
          content,
          source,
          translation: translation || undefined,
          date: Date.now(),
        });
        toast.success(tr({ en: "Created", fr: "Créé" }));
        setIsCreating(false);
      }
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setAyahForm({ ...EMPTY_AYAH });
    setDuaForm({ ...EMPTY_DUA });
    setFactForm({ ...EMPTY_FACT });
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setIsCreating(true);
    const f = { content: item.content || "", source: item.source || "", translation: item.translation || "" };
    if (activeTab === "ayah") setAyahForm(f);
    else if (activeTab === "dua") setDuaForm(f);
    else setFactForm(f);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr({ en: "Delete this item?", fr: "Supprimer cet élément ?" }))) return;
    try {
      await removeItem({ id: id as any });
      toast.success(tr({ en: "Deleted", fr: "Supprimé" }));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const tabs = [
    { id: "ayah" as const, label: tr({ en: "Ayahs", fr: "Versets" }), icon: BookOpen },
    { id: "dua" as const, label: tr({ en: "Duas", fr: "Invocations" }), icon: Sparkles },
    { id: "fact" as const, label: tr({ en: "Facts", fr: "Faits" }), icon: HelpCircle },
  ];

  const currentForm = activeTab === "ayah" ? ayahForm : activeTab === "dua" ? duaForm : factForm;
  const setForm = (v: any) => {
    if (activeTab === "ayah") setAyahForm(v);
    else if (activeTab === "dua") setDuaForm(v);
    else setFactForm(v);
  };

  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-10">
        <header className="flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-2">Admin
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark">
              {tr({ en: "Manage", fr: "Gérer le" })} <span className="text-gradient">{tr({ en: "Daily Content", fr: "contenu quotidien" })}</span>
            </h1>
          </div>
          <Button onClick={() => { setIsCreating(true); setEditingId(null); resetForm(); }} className="btn-islamic">
            <Plus className="mr-2 h-4 w-4" />{tr({ en: "Add New", fr: "Ajouter" })}
          </Button>
        </header>

        <div className="flex gap-2 border-b border-islamic-cream/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsCreating(false); setEditingId(null); }}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${activeTab === tab.id
                  ? "border-islamic-green-600 text-islamic-green-600 font-semibold"
                  : "border-transparent text-islamic-dark/60 hover:text-islamic-dark"}`}
              >
                <Icon className="w-4 h-4" />{tab.label}
              </button>
            );
          })}
        </div>

        {isCreating && (
          <Card className="bg-[#efefec]/90 backdrop-blur-sm border border-islamic-gold/30">
            <CardHeader>
              <CardTitle>{editingId ? tr({ en: "Edit", fr: "Modifier" }) : tr({ en: "Add New", fr: "Ajouter" })} {tabs.find((t) => t.id === activeTab)?.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{tr({ en: "Content", fr: "Contenu" })}</label>
                  <textarea value={currentForm.content} onChange={(e) => setForm({ ...currentForm, content: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows={3} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{tr({ en: "Source", fr: "Source" })}</label>
                  <Input value={currentForm.source} onChange={(e) => setForm({ ...currentForm, source: e.target.value })} required />
                </div>
                {activeTab !== "fact" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">{tr({ en: "Translation", fr: "Traduction" })}</label>
                    <textarea value={currentForm.translation} onChange={(e) => setForm({ ...currentForm, translation: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows={2} />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button type="submit" className="btn-islamic">{tr({ en: "Save", fr: "Enregistrer" })}</Button>
                  <Button type="button" variant="outline" onClick={() => { setIsCreating(false); setEditingId(null); }}>{tr({ en: "Cancel", fr: "Annuler" })}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {filtered.map((item: any) => (
            <Card key={item._id} className="bg-[#efefec]/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-islamic-dark mb-2">{item.source}</p>
                    <p className="text-sm text-islamic-dark/70 mb-1">{item.content}</p>
                    {item.translation && <p className="text-xs text-islamic-dark/60 italic">{item.translation}</p>}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(item._id)}><Trash2 className="w-4 h-4" /></Button>
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
