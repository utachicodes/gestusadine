import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  BookOpen,
  Download,
  Search,
  Star,
  FileText,
  Globe
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DigitalBook, BookCategory, BookLanguage, BookFormat } from "@/types/ecosystem";
import { toast } from "sonner";
import { getDocuments, updateDocument, orderBy } from "@/lib/firebase-helpers";

export default function Library() {
  const { t } = useLanguage();

  const [books, setBooks] = useState<DigitalBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");

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

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
      const matchesLanguage = selectedLanguage === "all" || book.language === selectedLanguage;
      const matchesFormat = selectedFormat === "all" || book.format === selectedFormat;

      return matchesSearch && matchesCategory && matchesLanguage && matchesFormat;
    });
  }, [books, searchQuery, selectedCategory, selectedLanguage, selectedFormat]);

  const handleDownload = async (book: DigitalBook) => {
    try {
      // Increment download count
      await updateDocument('library_books', book.id, {
        downloads: book.downloads + 1
      });

      // Trigger download
      window.open(book.file_url, '_blank');

      toast.success(`Downloading: ${book.title}`, {
        description: `Format: ${book.format.toUpperCase()} | Size: ${book.file_size_mb} MB`
      });

      // Reload books to update download count
      await loadBooks();
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error('Failed to download book');
    }
  };

  // Helper to get translated category/language/format
  const getCategoryLabel = (cat: string) => t(`library.categories.${cat}`);
  const getLanguageLabel = (lang: string) => t(`library.languages.${lang}`);
  const getFormatLabel = (fmt: string) => t(`library.formats.${fmt}`);

  // Get unique values for filters
  const categories = useMemo(() => [...new Set(books.map(b => b.category))], [books]);
  const languages = useMemo(() => [...new Set(books.map(b => b.language))], [books]);
  const formats = useMemo(() => [...new Set(books.map(b => b.format))], [books]);

  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
              {t('library.title')}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('library.title')}
            </h1>
            <p className="mt-2 text-muted-foreground max-w-xl">
              {t('library.subtitle')}
            </p>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="islamic-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('library.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-input text-foreground placeholder:text-muted-foreground focus:ring-primary backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-background/50 border-input text-foreground backdrop-blur-sm">
                <SelectValue placeholder={t('library.filter_category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('library.all_categories')}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Language Filter */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="bg-background/50 border-input text-foreground backdrop-blur-sm">
                <SelectValue placeholder={t('library.filter_language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('library.all_languages')}</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {getLanguageLabel(lang)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Format Filter */}
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button
              variant={selectedFormat === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFormat("all")}
              className={selectedFormat === "all" ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-none" : "bg-background/50 text-foreground hover:bg-muted"}
            >
              {t('library.all_formats')}
            </Button>
            {formats.map((fmt) => (
              <Button
                key={fmt}
                variant={selectedFormat === fmt ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFormat(fmt)}
                className={selectedFormat === fmt ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-none" : "bg-background/50 text-foreground hover:bg-muted"}
              >
                {getFormatLabel(fmt)}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-muted-foreground font-medium">
          {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-primary-green"></div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-xl text-muted-foreground">{t('library.no_results')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="islamic-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group border-none">
                <CardHeader>
                  <div className="relative">
                    {book.cover_image_url && (
                      <img
                        src={book.cover_image_url}
                        alt={book.title}
                        className="w-full h-48 object-cover rounded-md mb-4 transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    {book.featured && (
                      <Badge className="absolute top-2 right-2 bg-gradient-to-r from-primary to-primary/80 text-white border-none shadow-md">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {t('library.featured')}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 text-foreground">{book.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{book.author}</CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {book.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-muted text-foreground">
                      {getCategoryLabel(book.category)}
                    </Badge>
                    <Badge variant="outline" className="border-border text-muted-foreground">
                      <Globe className="h-3 w-3 mr-1" />
                      {getLanguageLabel(book.language)}
                    </Badge>
                    <Badge variant="outline" className="border-border text-muted-foreground">
                      <FileText className="h-3 w-3 mr-1" />
                      {getFormatLabel(book.format)}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    {book.page_count && (
                      <div>{book.page_count} {t('library.pages')}</div>
                    )}
                    {book.file_size_mb && (
                      <div>{book.file_size_mb} {t('library.file_size')}</div>
                    )}
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {book.downloads.toLocaleString()} {t('library.downloads')}
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full btn-islamic h-auto py-3 text-white"
                    onClick={() => handleDownload(book)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('library.download_button')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
