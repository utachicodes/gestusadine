import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Edit, Trash2, Search, BookOpen, Layers } from "lucide-react";
import { toast } from "sonner";
import { useTr } from "@/lib/i18n";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";

const CATEGORIES = [
  { value: "quran", labelEn: "Quran / Tafsir", labelFr: "Coran / Tafsir" },
  { value: "hadith", labelEn: "Hadith", labelFr: "Hadith" },
  { value: "aqeedah", labelEn: "Aqeedah (Creed)", labelFr: "Aqida (Croyance)" },
  { value: "fiqh", labelEn: "Fiqh (Jurisprudence)", labelFr: "Fiqh (Jurisprudence)" },
  { value: "seerah", labelEn: "Seerah (Biography)", labelFr: "Sira (Biographie)" },
  { value: "general", labelEn: "General", labelFr: "Général" },
];

export default function ManageRag() {
  const tr = useTr();
  const documents = useQuery(api.rag.listDocuments) ?? [];
  const deleteDoc = useMutation(api.rag.deleteDocument);
  const upsertDoc = useAction(api.rag.upsertDocument);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [formData, setFormData] = useState({ title: "", content: "", source: "", category: "general" });

  const filteredDocs = (documents as any[]).filter((doc: any) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.source || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({ title: "", content: "", source: "", category: "general" });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (doc: any) => {
    setSelectedDoc(doc);
    setFormData({
      title: doc.title || "",
      content: doc.content || "",
      source: doc.source || "",
      category: doc.category || "general",
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveAdd = async () => {
    if (!formData.title || !formData.content) {
      toast.error(tr({ en: "Title and content are required", fr: "Le titre et le contenu sont requis" }));
      return;
    }
    try {
      await upsertDoc({
        title: formData.title,
        content: formData.content,
        source: formData.source || "",
        category: formData.category,
      });
      setIsAddDialogOpen(false);
      toast.success(tr({ en: "Document added", fr: "Document ajouté" }));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedDoc) return;
    if (!formData.title || !formData.content) {
      toast.error(tr({ en: "Title and content are required", fr: "Le titre et le contenu sont requis" }));
      return;
    }
    try {
      await deleteDoc({ id: selectedDoc._id });
      await upsertDoc({
        title: formData.title,
        content: formData.content,
        source: formData.source || "",
        category: formData.category,
      });
      setIsEditDialogOpen(false);
      setSelectedDoc(null);
      toast.success(tr({ en: "Document updated", fr: "Document mis à jour" }));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    try {
      await deleteDoc({ id: selectedDoc._id });
      setIsDeleteDialogOpen(false);
      setSelectedDoc(null);
      toast.success(tr({ en: "Document deleted", fr: "Document supprimé" }));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const catLabel = (val: string) => {
    const match = CATEGORIES.find((c) => c.value === val);
    return match ? (tr({ en: match.labelEn, fr: match.labelFr }) ?? match.labelEn) : val;
  };

  const DocForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rag-title">{tr({ en: "Title *", fr: "Titre *" })}</Label>
        <Input id="rag-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rag-content">{tr({ en: "Content *", fr: "Contenu *" })}</Label>
        <Textarea id="rag-content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={12} className="font-mono text-xs leading-relaxed" />
        <p className="text-[10px] text-muted-foreground">
          {tr({ en: "This text will be chunked and searchable by the AI assistant.", fr: "Ce texte sera découpé et consultable par l'assistant IA." })}
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="rag-source">{tr({ en: "Source", fr: "Source" })}</Label>
        <Input id="rag-source" value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} placeholder={tr({ en: "e.g. Sahih Bukhari #1234", fr: "Ex: Sahih Bukhari #1234" })} />
      </div>
      <div className="space-y-2">
        <Label>{tr({ en: "Category", fr: "Catégorie" })}</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>{catLabel(cat.value)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-10">
        <header className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">Admin</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {tr({ en: "Manage", fr: "Gérer" })} <span className="text-primary">{tr({ en: "Islamic References", fr: "les références islamiques" })}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {tr({ en: "Upload reference texts the AI assistant can search when answering questions.", fr: "Ajoutez des textes de référence que l'assistant IA peut consulter." })}
            </p>
          </div>
          <Button onClick={handleAdd} className="shrink-0"><Plus className="h-4 w-4 mr-2" />{tr({ en: "Add Document", fr: "Ajouter un document" })}</Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">{tr({ en: "Total Documents", fr: "Total documents" })}</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{(documents as any[]).length}</div></CardContent></Card>
          <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">{tr({ en: "Quran / Tafsir", fr: "Coran / Tafsir" })}</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-primary">{(documents as any[]).filter((d: any) => d.category === "quran").length}</div></CardContent></Card>
          <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">{tr({ en: "Hadith", fr: "Hadith" })}</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-amber-600">{(documents as any[]).filter((d: any) => d.category === "hadith").length}</div></CardContent></Card>
          <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">{tr({ en: "Fiqh / Aqeedah", fr: "Fiqh / Aqida" })}</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-emerald-600">{(documents as any[]).filter((d: any) => d.category === "fiqh" || d.category === "aqeedah").length}</div></CardContent></Card>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder={tr({ en: "Search by title, category, or source...", fr: "Rechercher par titre, catégorie ou source..." })} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>{tr({ en: "Reference Documents", fr: "Documents de référence" })} ({filteredDocs.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>{tr({ en: "Title", fr: "Titre" })}</TableHead>
                  <TableHead>{tr({ en: "Category", fr: "Catégorie" })}</TableHead>
                  <TableHead>{tr({ en: "Source", fr: "Source" })}</TableHead>
                  <TableHead className="text-right">{tr({ en: "Content", fr: "Contenu" })}</TableHead>
                  <TableHead className="text-right">{tr({ en: "Actions", fr: "Actions" })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">{tr({ en: "No documents yet. Add your first reference above.", fr: "Aucun document. Ajoutez votre première référence ci-dessus." })}</TableCell></TableRow>
                ) : (
                  filteredDocs.map((doc: any) => (
                    <TableRow key={doc._id}>
                      <TableCell>
                        {doc.category === "quran" ? <BookOpen className="h-4 w-4 text-primary" /> :
                         doc.category === "hadith" ? <Layers className="h-4 w-4 text-amber-600" /> :
                         <FileText className="h-4 w-4 text-emerald-600" />}
                      </TableCell>
                      <TableCell className="font-medium"><div className="max-w-xs truncate">{doc.title}</div></TableCell>
                      <TableCell><Badge variant="secondary">{catLabel(doc.category)}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{doc.source || "—"}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">{(doc.content || "").length.toLocaleString()} {tr({ en: "chars", fr: "car." })}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(doc)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedDoc(doc); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{tr({ en: "Add Reference Document", fr: "Ajouter un document de référence" })}</DialogTitle><DialogDescription>{tr({ en: "This text will be searchable by the AI assistant.", fr: "Ce texte sera consultable par l'assistant IA." })}</DialogDescription></DialogHeader>
          <DocForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>{tr({ en: "Cancel", fr: "Annuler" })}</Button>
            <Button onClick={handleSaveAdd}>{tr({ en: "Add Document", fr: "Ajouter" })}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{tr({ en: "Edit Document", fr: "Modifier le document" })}</DialogTitle><DialogDescription>{tr({ en: "Update the reference text.", fr: "Mettez à jour le texte de référence." })}</DialogDescription></DialogHeader>
          <DocForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>{tr({ en: "Cancel", fr: "Annuler" })}</Button>
            <Button onClick={handleSaveEdit}>{tr({ en: "Save Changes", fr: "Enregistrer" })}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{tr({ en: "Delete Document", fr: "Supprimer le document" })}</DialogTitle><DialogDescription>{tr({ en: "Are you sure you want to delete this reference document?", fr: "Êtes-vous sûr de vouloir supprimer ce document de référence ?" })}</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>{tr({ en: "Cancel", fr: "Annuler" })}</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>{tr({ en: "Delete", fr: "Supprimer" })}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}