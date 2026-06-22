import * as React from "react";
import { useState, useMemo } from "react";
import {
  BookOpen,
  Download,
  Search,
  Star,
  FileText,
  Globe,
  Lock
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import { useTr } from "@/lib/i18n";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VideoGrid } from "@/components/media/VideoGrid";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

export default function Library() {
  const { t } = useLanguage();
  const tr = useTr();
  const navigate = useNavigate();
  const books = useQuery(api.library.list) ?? [];
  const updateBook = useMutation(api.library.update);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");

  const filteredBooks = useMemo(() => {
    return books.filter((book: any) => {
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

  const handleDownload = async (book: any) => {
    try {
      await updateBook({ id: book._id, downloads: (book.downloads || 0) + 1 });
      window.open(book.fileUrl, '_blank');
      toast.success(tr({ en: `Downloading: ${book.title}`, fr: `Téléchargement : ${book.title}` }), {
        description: tr({ en: `Format: ${book.format.toUpperCase()} | Size: ${book.fileSizeMb || "?"} MB`, fr: `Format : ${book.format.toUpperCase()} | Taille : ${book.fileSizeMb || "?"} Mo` })
      });
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(tr({ en: 'Failed to download book', fr: 'Échec du téléchargement du livre' }));
    }
  };

  const getCategoryLabel = (cat: string) => t(`library.categories.${cat}`);
  const getLanguageLabel = (lang: string) => t(`library.languages.${lang}`);
  const getFormatLabel = (fmt: string) => t(`library.formats.${fmt}`);

  const categories = useMemo(() => [...new Set(books.map((b: any) => b.category))], [books]);
  const languages = useMemo(() => [...new Set(books.map((b: any) => b.language))], [books]);
  const formats = useMemo(() => [...new Set(books.map((b: any) => b.format))], [books]);

  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-10">
        <PageHeader
          eyebrow={t('library.sectionLabel')}
          title={t('library.title')}
          subtitle={t('library.subtitle')}
        />

        <Tabs defaultValue="books" className="space-y-10">
          <TabsList>
            <TabsTrigger value="books">{tr({ en: 'Books', fr: 'Livres' })}</TabsTrigger>
            <TabsTrigger value="videos">{tr({ en: 'Videos', fr: 'Vidéos' })}</TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="space-y-10">
        <div className="islamic-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-background/50 border-input text-foreground backdrop-blur-sm">
                <SelectValue placeholder={t('library.filter_category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('library.all_categories')}</SelectItem>
                {categories.map((cat: string) => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="bg-background/50 border-input text-foreground backdrop-blur-sm">
                <SelectValue placeholder={t('library.filter_language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('library.all_languages')}</SelectItem>
                {languages.map((lang: string) => (
                  <SelectItem key={lang} value={lang}>
                    {getLanguageLabel(lang)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex gap-2 flex-wrap">
            <Button
              variant={selectedFormat === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFormat("all")}
              className={selectedFormat === "all" ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-none" : "bg-background/50 text-foreground hover:bg-muted"}
            >
              {t('library.all_formats')}
            </Button>
            {formats.map((fmt: string) => (
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

        <div className="mb-6 text-muted-foreground font-medium">
          {filteredBooks.length} {filteredBooks.length === 1 ? tr({ en: 'book found', fr: 'livre trouvé' }) : tr({ en: 'books found', fr: 'livres trouvés' })}
        </div>

        {!books ? (
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
            {filteredBooks.map((book: any) => {
              const isLocked = false;
              return (
              <Card key={book._id} className="islamic-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group border-none">
                <CardHeader>
                  <div className="relative">
                    {book.coverUrl && (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className={`w-full h-48 object-cover rounded-md mb-4 transition-transform duration-300 group-hover:scale-105 ${isLocked ? 'grayscale opacity-80' : ''}`}
                      />
                    )}
                    {book.premium && (
                      <Badge className="absolute top-2 left-2 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white border-none shadow-md">
                        <Lock className="h-3 w-3 mr-1" />
                        {tr({ en: 'Student', fr: 'Étudiant' })}
                      </Badge>
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
                    {book.pages && (
                      <div>{book.pages} {t('library.pages')}</div>
                    )}
                    {book.fileSizeMb && (
                      <div>{book.fileSizeMb} {t('library.file_size')}</div>
                    )}
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {(book.downloads || 0).toLocaleString()} {t('library.downloads')}
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  {isLocked ? (
                    <Button
                      variant="outline"
                      className="w-full h-auto py-3 border-emerald-800/40 text-emerald-800 hover:bg-emerald-800/5"
                      onClick={() => navigate('/pricing')}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {tr({ en: 'Upgrade to unlock', fr: 'Débloquer' })}
                    </Button>
                  ) : (
                    <Button
                      className="w-full btn-islamic h-auto py-3 text-white"
                      onClick={() => handleDownload(book)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t('library.download_button')}
                    </Button>
                  )}
                </CardFooter>
              </Card>
              );
            })}
          </div>
        )}
          </TabsContent>

          <TabsContent value="videos">
            <VideoGrid />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
