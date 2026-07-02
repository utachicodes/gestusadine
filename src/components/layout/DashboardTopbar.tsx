import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Sparkles,
  HelpCircle,
  ChevronRight,
  LogOut,
  Globe,
  type LucideIcon,
  LayoutDashboard,
  MessageSquare,
  UserCircle,
  BookOpen,
  BookOpenText,
  BookMarked,
  Video,
  Calendar,
  GraduationCap,
  Settings,
  Users,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

type Label = { en: string; fr: string };

interface RouteMeta {
  icon: LucideIcon;
  title: Label;
  section: Label;
  keywords?: string;
}

// Single source of route titles for the breadcrumb + quick-search.
const ROUTE_META: Record<string, RouteMeta> = {
  '/dashboard': { icon: LayoutDashboard, title: { en: 'Dashboard', fr: 'Tableau de bord' }, section: { en: 'Workspace', fr: 'Espace de travail' }, keywords: 'home daily accueil' },
  '/chat': { icon: MessageSquare, title: { en: 'The Council', fr: 'Le Conseil' }, section: { en: 'Workspace', fr: 'Espace de travail' }, keywords: 'ask ai conseil fatwa' },
  '/profile': { icon: UserCircle, title: { en: 'Profile', fr: 'Profil' }, section: { en: 'Workspace', fr: 'Espace de travail' }, keywords: 'account badges xp' },
  '/library': { icon: BookOpen, title: { en: 'Library', fr: 'Bibliothèque' }, section: { en: 'Knowledge', fr: 'Savoir' }, keywords: 'books read livres' },
  '/media': { icon: Video, title: { en: 'Media', fr: 'Médias' }, section: { en: 'Knowledge', fr: 'Savoir' }, keywords: 'videos studio' },
  '/events': { icon: Calendar, title: { en: 'Events', fr: 'Événements' }, section: { en: 'Knowledge', fr: 'Savoir' }, keywords: 'meetups circles' },
  '/classes': { icon: GraduationCap, title: { en: 'Classes', fr: 'Cours' }, section: { en: 'Knowledge', fr: 'Savoir' }, keywords: 'courses learn cours' },
  '/settings': { icon: Settings, title: { en: 'Settings', fr: 'Paramètres' }, section: { en: 'Account', fr: 'Compte' }, keywords: 'theme language preferences' },
  '/admin': { icon: Users, title: { en: 'Admin', fr: 'Admin' }, section: { en: 'Administration', fr: 'Administration' }, keywords: 'manage' },
  '/admin/config': { icon: Settings, title: { en: 'Agent Config', fr: 'Config des agents' }, section: { en: 'Administration', fr: 'Administration' } },
  '/admin/events': { icon: Calendar, title: { en: 'Manage Events', fr: 'Gérer les événements' }, section: { en: 'Administration', fr: 'Administration' } },
  '/admin/videos': { icon: Video, title: { en: 'Manage Videos', fr: 'Gérer les vidéos' }, section: { en: 'Administration', fr: 'Administration' } },
  '/admin/daily': { icon: Sparkles, title: { en: 'Manage Daily', fr: 'Gérer le quotidien' }, section: { en: 'Administration', fr: 'Administration' } },
  '/admin/library': { icon: BookOpen, title: { en: 'Manage Library', fr: 'Gérer la bibliothèque' }, section: { en: 'Administration', fr: 'Administration' } },
  '/admin/rag': { icon: FileText, title: { en: 'Islamic References', fr: 'Références islamiques' }, section: { en: 'Administration', fr: 'Administration' } },

  '/duas': { icon: BookOpenText, title: { en: 'Du\'as', fr: 'Du\'as' }, section: { en: 'Tools', fr: 'Outils' }, keywords: 'supplication dua prayer' },
  '/azkar': { icon: BookMarked, title: { en: 'Adhkar', fr: 'Adhkar' }, section: { en: 'Tools', fr: 'Outils' }, keywords: 'remembrance dhikr azkar' },

  '/language': { icon: Settings, title: { en: 'Language', fr: 'Langue' }, section: { en: 'Account', fr: 'Compte' } },
};

// Routes offered in quick-search (only the user-reachable, titled ones).
const SEARCHABLE = Object.entries(ROUTE_META).filter(([p]) => !p.startsWith('/admin/') && p !== '/language');

interface DashboardTopbarProps {
  onOpenMobileSidebar: () => void;
}

export const DashboardTopbar: React.FC<DashboardTopbarProps> = ({ onOpenMobileSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const tr = (l: Label) => l[language] ?? l.en;

  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const meta =
    ROUTE_META[location.pathname] ??
    // fall back to the closest parent match for nested paths
    ROUTE_META[Object.keys(ROUTE_META).filter((p) => location.pathname.startsWith(p)).sort((a, b) => b.length - a.length)[0]] ??
    { icon: LayoutDashboard, title: { en: 'Dashboard', fr: 'Tableau de bord' }, section: { en: 'Workspace', fr: 'Espace de travail' } };

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as typeof SEARCHABLE;
    return SEARCHABLE.filter(([path, m]) =>
      tr(m.title).toLowerCase().includes(q) ||
      path.toLowerCase().includes(q) ||
      (m.keywords ?? '').toLowerCase().includes(q),
    ).slice(0, 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, language]);

  // ⌘K / Ctrl+K focuses search; close on outside click.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, []);

  const go = (path: string) => {
    setQuery('');
    setOpen(false);
    searchRef.current?.blur();
    navigate(path);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results.length > 0) go(results[0][0]);
  };

  const initials = (() => {
    const name = profile?.full_name || user?.displayName || user?.email || 'U';
    return name
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');
  })();

  const displayName = profile?.full_name || user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 min-h-[4rem] pt-safe px-4 md:px-6 border-b border-border bg-background/80 backdrop-blur-xl">
      {/* Mobile menu */}
      <button
        type="button"
        onClick={onOpenMobileSidebar}
        aria-label={language === 'fr' ? 'Ouvrir le menu' : 'Open menu'}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb / title */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="hidden sm:inline text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
          {tr(meta.section)}
        </span>
        <ChevronRight className="hidden sm:inline w-3.5 h-3.5 text-muted-foreground/40" />
        <span className="text-base md:text-lg font-semibold text-foreground truncate">{tr(meta.title)}</span>
      </div>

      {/* Quick search */}
      <div ref={containerRef} className="relative ml-auto hidden md:block w-56 lg:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          ref={searchRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onSearchKeyDown}
          placeholder={language === 'fr' ? 'Recherche rapide' : 'Quick search'}
          aria-label={language === 'fr' ? 'Recherche rapide' : 'Quick search'}
          className="w-full h-10 pl-9 pr-12 rounded-xl bg-secondary border border-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:bg-card transition-colors"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground border border-border rounded px-1.5 py-0.5 pointer-events-none">
          ⌘K
        </kbd>

        {open && results.length > 0 && (
          <div className="absolute top-12 left-0 right-0 rounded-xl border border-border bg-popover shadow-lg overflow-hidden py-1.5 z-50">
            {results.map(([path, m]) => {
              const Icon = m.icon;
              return (
                <button
                  key={path}
                  type="button"
                  onClick={() => go(path)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{tr(m.title)}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground/60">{tr(m.section)}</span>
                </button>
              );
            })}
          </div>
        )}
        {open && query.trim() && results.length === 0 && (
          <div className="absolute top-12 left-0 right-0 rounded-xl border border-border bg-popover shadow-lg px-3 py-3 text-sm text-muted-foreground z-50">
            {language === 'fr' ? 'Aucun résultat' : 'No results'}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 md:gap-2 ml-auto md:ml-0">
        <button
          type="button"
          onClick={() => navigate('/chat')}
          className="hidden sm:inline-flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          {language === 'fr' ? 'Le Conseil' : 'Ask the Council'}
        </button>

        <Link
          to="/help"
          aria-label={language === 'fr' ? 'Aide' : 'Help'}
          className="flex items-center justify-center w-10 h-10 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <HelpCircle className="w-[18px] h-[18px]" />
        </Link>

        {/* Language toggle */}
        <div className="flex items-center rounded-xl border border-border bg-secondary/50 p-0.5 gap-0.5">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            aria-label="Switch to English"
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 ${
              language === 'en'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('fr')}
            aria-label="Passer en français"
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 ${
              language === 'fr'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            FR
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl pl-1 pr-1 md:pr-2 py-1 hover:bg-secondary transition-colors"
              aria-label={language === 'fr' ? 'Menu du compte' : 'Account menu'}
            >
              <Avatar className="h-8 w-8">
                {profile?.avatar_url || user?.photoURL ? (
                  <AvatarImage src={(profile?.avatar_url || user?.photoURL) as string} alt={displayName} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium text-foreground max-w-[120px] truncate">{displayName}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold truncate">{displayName}</span>
                {user?.email && <span className="text-xs font-normal text-muted-foreground truncate">{user.email}</span>}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <UserCircle className="w-4 h-4 mr-2" />
              {language === 'fr' ? 'Profil' : 'Profile'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              {language === 'fr' ? 'Paramètres' : 'Settings'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => { signOut(); navigate('/'); }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {language === 'fr' ? 'Déconnexion' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
