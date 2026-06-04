import * as React from "react";
import { useState } from "react";
import { BookOpen, Plus, Search, Edit, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTr } from "@/lib/i18n";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

const EMPTY = {
  title: "",
  author: "",
  description: "",
  category: "general",
  language: "en",
  format: "pdf",
  fileUrl: "",
  coverUrl: "",
  pages: 0,
  fileSizeMb: 0,
  featured: false,
  premium: false,
};

export default function ManageLibrary() {
  const tr = useTr();
  const books = useQuery(api.library.list) ?? [];
  const createBook = useMutation(api.library.create);
  const updateBook = useMutation(api.library.update);
  const removeBook = useMutation(api.library.remove);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ ...EMPTY });

  const filteredBooks = (books as any[]).filter((book: any) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryOptions = [
    { value: "quran", label: tr({ en: "Quran", fr: "Coran" }) },
    { value: "hadith", label: tr({ en: "Hadith", fr: "Hadith" }) },
    { value: "fiqh", label: tr({ en: "Fiqh", fr: "Fiqh" }) },
    { value: "aqeedah", label: tr({ en: "Aqeedah", fr: "Aqida" }) },
    { value: "seerah", label: tr({ en: "Seerah", fr: "Sîra" }) },
    { value: "tafsir", label: tr({ en: "Tafsir", fr: "Tafsir" }) },
    { value: "arabic", label: tr({ en: "Arabic Learning", fr: "Apprentissage de l'arabe" }) },
    { value: "dua", label: tr({ en: "Dua & Dhikr", fr: "Invocations et Dhikr" }) },
    { value: "general", label: tr({ en: "General", fr: "Général" }) },
  ];

  const languageOptions = [
    { value: "ar", label: tr({ en: "Arabic", fr: "Arabe" }) },
    { value: "en", label: tr({ en: "English", fr: "Anglais" }) },
    { value: "fr", label: tr({ en: "French", fr: "Français" }) },
  ];

  const formatOptions = [
    { value: "pdf", label: "PDF" },
    { value: "epub", label: "EPUB" },
    { value: "mobi", label: "MOBI" },
    { value: "audio", label: tr({ en: "Audio", fr: "Audio" }) },
  ];

  const handleAdd = () => {
    setFormData({ ...EMPTY });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (book: any) => {
    setSelectedBook(book);
    setFormData({
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      category: book.category || "general",
      language: book.language || "en",
      format: book.format || "pdf",
      fileUrl: book.fileUrl || "",
      coverUrl: book.coverUrl || "",
      pages: book.pages || 0,
      fileSizeMb: book.fileSizeMb || 0,
      featured: book.featured || false,
      premium: book.premium || false,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveAdd = async () => {
    if (!formData.title || !formData.author) {
      toast.error(tr({ en: "Missing required fields", fr: "Champs requis manquants" }));
      return;
    }
    try {
      await createBook({
        title: formData.title,
        author: formData.author,
        description: formData.description || "",
        category: formData.category || "general",
        language: formData.language || "en",
        format: formData.format || "pdf",
        fileUrl: formData.fileUrl || undefined,
        coverUrl: formData.coverUrl || undefined,
        pages: parseInt(formData.pages) || 0,
        fileSizeMb: parseFloat(formData.fileSizeMb) || 0,
        featured: formData.featured || false,
        premium: formData.premium || false,
      });
      setIsAddDialogOpen(false);
      toast.success(tr({ en: "Book added", fr: "Livre ajouté" }));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedBook) return;
    try {
      await updateBook({
        id: selectedBook._id,
        title: formData.title,
        author: formData.author,
        description: formData.description,
        category: formData.category,
        language: formData.language,
        format: formData.format,
        fileUrl: formData.fileUrl || undefined,
        coverUrl: formData.coverUrl || undefined,
        pages: parseInt(formData.pages) || 0,
        fileSizeMb: parseFloat(formData.fileSizeMb) || 0,
        featured: formData.featured,
        premium: formData.premium,
      });
      setIsEditDialogOpen(false);
      setSelectedBook(null);
      toast.success(tr({ en: "Book updated", fr: "Livre mis à jour" }));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedBook) return;
    try {
      await removeBook({ id: selectedBook._id });
      setIsDeleteDialogOpen(false);
      setSelectedBook(null);
      toast.success(tr({ en: "Book deleted", fr: "Livre supprimé" }));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleFeatured = async (bookId: string) => {
    const book = (books as any[]).find((b: any) => b._id === bookId);
    if (!book) return;
    try {
      await updateBook({ id: bookId as any, featured: !book.featured });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const BookForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">{tr({ en: "Title *", fr: "Titre *" })}</Label>
          <Input id="title" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">{tr({ en: "Author *", fr: "Auteur *" })}</Label>
          <Input id="author" value={formData.author || ""} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">{tr({ en: "Description", fr: "Description" })}</Label>
        <Textarea id="description" value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>{tr({ en: "Category", fr: "Catégorie" })}</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{tr({ en: "Language", fr: "Langue" })}</Label>
          <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {languageOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{tr({ en: "Format", fr: "Format" })}</Label>
          <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {formatOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>{tr({ en: "File URL", fr: "URL du fichier" })}</Label>
        <Input value={formData.fileUrl || ""} onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>{tr({ en: "Cover URL", fr: "URL de la couverture" })}</Label>
        <Input value={formData.coverUrl || ""} onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })} />
        {formData.coverUrl && (
          <img src={formData.coverUrl} alt="preview" className="mt-2 h-32 w-24 object-cover rounded" />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{tr({ en: "Pages", fr: "Pages" })}</Label>
          <Input type="number" value={formData.pages || ""} onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })} />
        </div>
        <div className="space-y-2">
          <Label>{tr({ en: "File Size (MB)", fr: "Taille fichier (Mo)" })}</Label>
          <Input type="number" step="0.1" value={formData.fileSizeMb || ""} onChange={(e) => setFormData({ ...formData, fileSizeMb: parseFloat(e.target.value) || 0 })} />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="featured" checked={formData.featured || false} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} />
        <Label htmlFor="featured">{tr({ en: "Featured Book", fr: "Livre mis en avant" })}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="premium" checked={formData.premium || false} onCheckedChange={(checked) => setFormData({ ...formData, premium: checked })} />
        <Label htmlFor="premium">{tr({ en: "Premium (Student+ only)", fr: "Premium (Étudiant seulement)" })}</Label>
      </div>
    </div>
  );

  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-10">
        <header className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
          <div>
            <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />Admin
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {tr({ en: "Manage", fr: "Gérer la" })} <span className="text-primary">{tr({ en: "Library", fr: "bibliothèque" })}</span>
            </h1>
          </div>
          <Button onClick={handleAdd} className="shrink-0"><Plus className="h-4 w-4 mr-2" />{tr({ en: "Add Book", fr: "Ajouter un livre" })}</Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">{tr({ en: "Total Books", fr: "Total des livres" })}</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{(books as any[]).length}</div></CardContent></Card>
          <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">{tr({ en: "Featured", fr: "Mis en avant" })}</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-primary">{(books as any[]).filter((b: any) => b.featured).length}</div></CardContent></Card>
          <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">{tr({ en: "Downloads", fr: "Téléchargements" })}</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{(books as any[]).reduce((s: number, b: any) => s + (b.downloads || 0), 0).toLocaleString()}</div></CardContent></Card>
          <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">{tr({ en: "Categories", fr: "Catégories" })}</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{new Set((books as any[]).map((b: any) => b.category)).size}</div></CardContent></Card>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder={tr({ en: "Search...", fr: "Rechercher..." })} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>{tr({ en: "Books", fr: "Livres" })} ({filteredBooks.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>{tr({ en: "Title", fr: "Titre" })}</TableHead>
                  <TableHead>{tr({ en: "Author", fr: "Auteur" })}</TableHead>
                  <TableHead>{tr({ en: "Category", fr: "Catégorie" })}</TableHead>
                  <TableHead>{tr({ en: "Language", fr: "Langue" })}</TableHead>
                  <TableHead>{tr({ en: "Format", fr: "Format" })}</TableHead>
                  <TableHead>{tr({ en: "Downloads", fr: "Téléchargements" })}</TableHead>
                  <TableHead>{tr({ en: "Featured", fr: "Mis en avant" })}</TableHead>
                  <TableHead className="text-right">{tr({ en: "Actions", fr: "Actions" })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">{tr({ en: "No books found", fr: "Aucun livre trouvé" })}</TableCell></TableRow>
                ) : (
                  filteredBooks.map((book: any) => (
                    <TableRow key={book._id}>
                      <TableCell>
                        {book.coverUrl ? (
                          <img src={book.coverUrl} alt={book.title} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center"><BookOpen className="h-5 w-5 text-muted-foreground" /></div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium"><div className="max-w-xs truncate">{book.title}</div></TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell><Badge variant="secondary">{categoryOptions.find((c: any) => c.value === book.category)?.label}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{languageOptions.find((l: any) => l.value === book.language)?.label}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{book.format?.toUpperCase()}</Badge></TableCell>
                      <TableCell>{(book.downloads || 0).toLocaleString()}</TableCell>
                      <TableCell><Switch checked={book.featured} onCheckedChange={() => toggleFeatured(book._id)} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(book)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedBook(book); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
          <DialogHeader><DialogTitle>{tr({ en: "Add New Book", fr: "Ajouter un livre" })}</DialogTitle><DialogDescription>{tr({ en: "Add a book to the library.", fr: "Ajoutez un livre à la bibliothèque." })}</DialogDescription></DialogHeader>
          <BookForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>{tr({ en: "Cancel", fr: "Annuler" })}</Button>
            <Button onClick={handleSaveAdd}>{tr({ en: "Add Book", fr: "Ajouter" })}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{tr({ en: "Edit Book", fr: "Modifier le livre" })}</DialogTitle><DialogDescription>{tr({ en: "Update book information.", fr: "Mettez à jour les informations du livre." })}</DialogDescription></DialogHeader>
          <BookForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>{tr({ en: "Cancel", fr: "Annuler" })}</Button>
            <Button onClick={handleSaveEdit}>{tr({ en: "Save Changes", fr: "Enregistrer" })}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{tr({ en: "Delete Book", fr: "Supprimer le livre" })}</DialogTitle><DialogDescription>{tr({ en: "Are you sure?", fr: "Êtes-vous sûr ?" })}</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>{tr({ en: "Cancel", fr: "Annuler" })}</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>{tr({ en: "Delete", fr: "Supprimer" })}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
