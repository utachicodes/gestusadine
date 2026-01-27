import * as React from "react";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import type { DigitalBook, BookCategory, BookLanguage, BookFormat } from "@/types/ecosystem";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDocuments, addDocument, updateDocument, deleteDocument, uploadFile, deleteFile, orderBy } from "@/lib/firebase-helpers";

export default function ManageLibrary() {
  const { t } = useLanguage();
  const [books, setBooks] = useState<DigitalBook[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<DigitalBook | null>(null);
  const [formData, setFormData] = useState<Partial<DigitalBook>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await getDocuments('library_books', [
        orderBy('created_at', 'desc')
      ]);
      setBooks(data as DigitalBook[]);
    } catch (error: any) {
      console.error('Failed to load books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'book' | 'cover') => {
    if (type === 'book') {
      setUploadingFile(true);
    } else {
      setUploadingCover(true);
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const folder = type === 'book' ? 'library' : 'library-covers';
      const filePath = `${folder}/${fileName}`;

      const url = await uploadFile(filePath, file);

      if (type === 'book') {
        setFormData({ ...formData, file_url: url });
      } else {
        setFormData({ ...formData, cover_image_url: url });
      }

      toast.success(`${type === 'book' ? 'File' : 'Cover'} uploaded successfully`);
    } catch (error: any) {
      console.error(`Failed to upload ${type}:`, error);
      toast.error(`Failed to upload ${type}`);
    } finally {
      if (type === 'book') {
        setUploadingFile(false);
      } else {
        setUploadingCover(false);
      }
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryOptions: { value: BookCategory; label: string }[] = [
    { value: 'quran', label: 'Quran' },
    { value: 'hadith', label: 'Hadith' },
    { value: 'fiqh', label: 'Fiqh' },
    { value: 'aqeedah', label: 'Aqeedah' },
    { value: 'seerah', label: 'Seerah' },
    { value: 'tafsir', label: 'Tafsir' },
    { value: 'arabic', label: 'Arabic Learning' },
    { value: 'dua', label: 'Dua & Dhikr' },
    { value: 'general', label: 'General' },
  ];

  const languageOptions: { value: BookLanguage; label: string }[] = [
    { value: 'ar', label: 'Arabic' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'wo', label: 'Wolof' },
  ];

  const formatOptions: { value: BookFormat; label: string }[] = [
    { value: 'pdf', label: 'PDF' },
    { value: 'epub', label: 'EPUB' },
    { value: 'mobi', label: 'MOBI' },
    { value: 'audio', label: 'Audio' },
  ];

  const handleAdd = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      category: 'general',
      language: 'en',
      format: 'pdf',
      file_url: '',
      cover_image_url: '',
      downloads: 0,
      featured: false,
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (book: DigitalBook) => {
    setSelectedBook(book);
    setFormData(book);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (book: DigitalBook) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = async () => {
    if (!formData.title || !formData.author || !formData.file_url) {
      toast.error('Missing required fields', {
        description: 'Please fill in title, author, and file URL'
      });
      return;
    }

    try {
      const bookData = {
        title: formData.title || '',
        author: formData.author || '',
        description: formData.description || '',
        category: formData.category as BookCategory || 'general',
        language: formData.language as BookLanguage || 'en',
        format: formData.format as BookFormat || 'pdf',
        file_url: formData.file_url || '',
        cover_image_url: formData.cover_image_url || null,
        page_count: formData.page_count || null,
        file_size_mb: formData.file_size_mb || null,
        isbn: formData.isbn || null,
        publisher: formData.publisher || null,
        publication_year: formData.publication_year || null,
        downloads: 0,
        featured: formData.featured || false,
      };

      await addDocument('library_books', bookData);
      setIsAddDialogOpen(false);
      setFormData({});
      await loadBooks();
      toast.success('Book added successfully', {
        description: `${bookData.title} has been added to the library`
      });
    } catch (error: any) {
      console.error('Failed to add book:', error);
      toast.error('Failed to add book', {
        description: error.message
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedBook) return;

    if (!formData.title || !formData.author || !formData.file_url) {
      toast.error('Missing required fields', {
        description: 'Please fill in title, author, and file URL'
      });
      return;
    }

    try {
      const bookData = {
        title: formData.title || '',
        author: formData.author || '',
        description: formData.description || '',
        category: formData.category as BookCategory || 'general',
        language: formData.language as BookLanguage || 'en',
        format: formData.format as BookFormat || 'pdf',
        file_url: formData.file_url || '',
        cover_image_url: formData.cover_image_url || null,
        page_count: formData.page_count || null,
        file_size_mb: formData.file_size_mb || null,
        isbn: formData.isbn || null,
        publisher: formData.publisher || null,
        publication_year: formData.publication_year || null,
        featured: formData.featured || false,
      };

      await updateDocument('library_books', selectedBook.id, bookData);
      setIsEditDialogOpen(false);
      setSelectedBook(null);
      setFormData({});
      await loadBooks();
      toast.success('Book updated successfully', {
        description: `${bookData.title} has been updated`
      });
    } catch (error: any) {
      console.error('Failed to update book:', error);
      toast.error('Failed to update book', {
        description: error.message
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedBook) return;

    try {
      // Delete associated files from storage
      if (selectedBook.file_url && selectedBook.file_url.includes('library/')) {
        try {
          const filePath = selectedBook.file_url.split('/library/')[1].split('?')[0];
          if (filePath) {
            await deleteFile(`library/${filePath}`);
          }
        } catch (err) {
          console.warn('Failed to delete book file:', err);
        }
      }
      if (selectedBook.cover_image_url && selectedBook.cover_image_url.includes('library-covers/')) {
        try {
          const coverPath = selectedBook.cover_image_url.split('/library-covers/')[1].split('?')[0];
          if (coverPath) {
            await deleteFile(`library-covers/${coverPath}`);
          }
        } catch (err) {
          console.warn('Failed to delete cover:', err);
        }
      }

      await deleteDocument('library_books', selectedBook.id);
      const bookTitle = selectedBook.title;
      setIsDeleteDialogOpen(false);
      setSelectedBook(null);
      await loadBooks();
      toast.success('Book deleted successfully', {
        description: `${bookTitle} and associated files have been removed`
      });
    } catch (error: any) {
      console.error('Failed to delete book:', error);
      toast.error('Failed to delete book', {
        description: error.message
      });
    }
  };

  const toggleFeatured = async (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    try {
      await updateDocument('library_books', bookId, { featured: !book.featured });
      await loadBooks();
      toast.info(
        book.featured ? 'Removed from featured' : 'Added to featured',
        { description: book.title }
      );
    } catch (error: any) {
      console.error('Failed to toggle featured:', error);
      toast.error('Failed to update featured status');
    }
  };

  const BookForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter book title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author *</Label>
          <Input
            id="author"
            value={formData.author || ''}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Enter author name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter book description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as BookCategory })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('admin.select_category')} />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language *</Label>
          <Select
            value={formData.language}
            onValueChange={(value) => setFormData({ ...formData, language: value as BookLanguage })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('admin.select_language')} />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="format">Format *</Label>
          <Select
            value={formData.format}
            onValueChange={(value) => setFormData({ ...formData, format: value as BookFormat })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('admin.select_format')} />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file_url">File URL *</Label>
        <div className="flex gap-2">
          <Input
            id="file_url"
            value={formData.file_url || ''}
            onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
            placeholder="/books/filename.pdf"
            className="flex-1"
          />
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf,.epub,.mobi,.mp3,.mp4"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'book');
              }}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploadingFile}
              className="whitespace-nowrap"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadingFile ? 'Uploading...' : 'Upload'}
            </Button>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover_image_url">Cover Image URL</Label>
        <div className="flex gap-2">
          <Input
            id="cover_image_url"
            value={formData.cover_image_url || ''}
            onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
            placeholder="https://example.com/cover.jpg"
            className="flex-1"
          />
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'cover');
              }}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploadingCover}
              className="whitespace-nowrap"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadingCover ? 'Uploading...' : 'Upload'}
            </Button>
          </label>
        </div>
        {formData.cover_image_url && (
          <img src={formData.cover_image_url} alt="Cover preview" className="mt-2 h-32 w-24 object-cover rounded" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="page_count">Page Count</Label>
          <Input
            id="page_count"
            type="number"
            value={formData.page_count || ''}
            onChange={(e) => setFormData({ ...formData, page_count: parseInt(e.target.value) || undefined })}
            placeholder="450"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file_size_mb">File Size (MB)</Label>
          <Input
            id="file_size_mb"
            type="number"
            step="0.1"
            value={formData.file_size_mb || ''}
            onChange={(e) => setFormData({ ...formData, file_size_mb: parseFloat(e.target.value) || undefined })}
            placeholder="12.5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="publication_year">Publication Year</Label>
          <Input
            id="publication_year"
            type="number"
            value={formData.publication_year || ''}
            onChange={(e) => setFormData({ ...formData, publication_year: parseInt(e.target.value) || undefined })}
            placeholder="2020"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input
            id="isbn"
            value={formData.isbn || ''}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            placeholder="978-1234567890"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="publisher">Publisher</Label>
          <Input
            id="publisher"
            value={formData.publisher || ''}
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
            placeholder={t('admin.publisher_name')}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.featured || false}
          onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
        />
        <Label htmlFor="featured" className="cursor-pointer">
          Featured Book
        </Label>
      </div>
    </div>
  );

  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-10">
        {/* Header */}
        <header className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
          <div>
            <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
              Admin
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Manage <span className="text-primary">Library</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Add, edit, and manage digital books in your Islamic library
            </p>
          </div>
          <Button onClick={handleAdd} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Books
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{books.length}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Featured Books
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {books.filter(b => b.featured).length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {books.reduce((sum, b) => sum + b.downloads, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {new Set(books.map(b => b.category)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search books by title, author, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Books Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Books ({filteredBooks.length})</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your digital library collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No books found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>
                          {book.cover_image_url ? (
                            <img
                              src={book.cover_image_url}
                              alt={book.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                              <BookOpen className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="max-w-xs truncate">{book.title}</div>
                        </TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {categoryOptions.find(c => c.value === book.category)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {languageOptions.find(l => l.value === book.language)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{book.format.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>{book.downloads.toLocaleString()}</TableCell>
                        <TableCell>
                          <Switch
                            checked={book.featured}
                            onCheckedChange={() => toggleFeatured(book.id)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(book)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(book)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription>
              Add a new book to your digital library. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <BookForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAdd}>Add Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update book information. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <BookForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedBook?.title}"? This action cannot be undone and will also delete associated files.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
