import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  CalendarDays,
  Clock,
  Calculator,
  BookOpenText,
  LogOut,
  BookOpen,
  Users,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
  BookMarked,
  Heart,
  HandHeart,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { useAuthz } from '@/auth/useAuthz';
import { Permission } from '@/auth/rbac';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Label = { en: string; fr: string };

interface NavItem {
  icon: LucideIcon;
  label: Label;
  path: string;
  permission?: Permission;
  /** If true, only show when user gender is 'female' */
  femaleOnly?: boolean;
  tourId?: string;
}

interface NavSection {
  label: Label;
  items: NavItem[];
}

const ALL_SECTIONS: NavSection[] = [
  {
    label: { en: 'Workspace', fr: 'Espace de travail' },
    items: [
      { icon: LayoutDashboard, label: { en: 'Dashboard', fr: 'Tableau de bord' }, path: '/dashboard', tourId: 'nav-dashboard' },
      { icon: MessageSquare, label: { en: 'The Council', fr: 'Le Conseil' }, path: '/chat', tourId: 'nav-council' },
    ],
  },
  {
    label: { en: 'Knowledge', fr: 'Savoir' },
    items: [
      { icon: BookOpenText, label: { en: 'Quran', fr: 'Coran' }, path: '/quran', tourId: 'nav-quran' },
      { icon: BookOpen, label: { en: 'Library', fr: 'Bibliothèque' }, path: '/library' },
      { icon: Calendar, label: { en: 'Events', fr: 'Événements' }, path: '/events' },
      { icon: GraduationCap, label: { en: 'Classes', fr: 'Cours' }, path: '/classes' },
    ],
  },
  {
    label: { en: 'Tools', fr: 'Outils' },
    items: [
      { icon: Clock, label: { en: 'Prayer Times', fr: 'Horaires de prière' }, path: '/prayer-times', tourId: 'nav-prayer' },
      { icon: CalendarDays, label: { en: 'Calendar', fr: 'Calendrier' }, path: '/calendar' },
      { icon: Calculator, label: { en: 'Zakat', fr: 'Zakât' }, path: '/zakat' },
      { icon: BookOpenText, label: { en: 'Du\'as', fr: 'Du\'as' }, path: '/duas' },
      { icon: HandHeart, label: { en: 'Adhkar', fr: 'Adhkar' }, path: '/azkar' },
    ],
  },
  {
    label: { en: 'Wellness', fr: 'Bien-être' },
    items: [
      { icon: BookMarked, label: { en: 'Journal', fr: 'Journal' }, path: '/journal', tourId: 'nav-journal' },
      { icon: Heart, label: { en: 'Cycle Tracker', fr: 'Suivi du cycle' }, path: '/period-tracker', femaleOnly: true, tourId: 'nav-period' },
    ],
  },
  {
    label: { en: 'Administration', fr: 'Administration' },
    items: [
      { icon: Users, label: { en: 'Admin', fr: 'Admin' }, path: '/admin', permission: 'admin.access' },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  /** Called after a nav item is clicked — used to close the mobile drawer. */
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapsed, onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, refreshProfile, profile } = useAuth();
  const { can } = useAuthz();
  const { language } = useLanguage();
  const { theme } = useTheme();

  const isFemale = profile?.gender === 'female';

  // Refresh profile on mount so admin-gated sections appear once role loads.
  React.useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const handleSignOut = () => {
    signOut();
    navigate('/');
    onNavigate?.();
  };

  const tr = (l: Label) => l[language] ?? l.en;

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const visibleSections = ALL_SECTIONS
    .map((s) => ({
      ...s,
      items: s.items.filter((i) => {
        if (i.permission && !can(i.permission)) return false;
        if (i.femaleOnly && !isFemale) return false;
        return true;
      }),
    }))
    .filter((s) => s.items.length > 0);

  const NavLink = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    const link = (
      <Link
        to={item.path}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        data-tour={item.tourId}
        className={`group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200
          ${collapsed ? 'justify-center px-0 py-2.5 mx-auto w-11 h-11' : 'gap-3 px-3 py-2.5'}
          ${active
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
      >
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary" />
        )}
        <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-primary' : ''}`} />
        {!collapsed && <span className="truncate">{tr(item.label)}</span>}
      </Link>
    );

    if (!collapsed) return link;
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{tr(item.label)}</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <aside
      className={`h-full flex flex-col bg-sidebar border-r border-sidebar-border transition-[width] duration-300 ease-in-out
        ${collapsed ? 'w-[76px]' : 'w-64'}`}
      style={{ backgroundColor: theme.colors.sidebar, borderColor: theme.colors.border }}
    >
      {/* Logo + collapse toggle */}
      <div className={`flex items-center min-h-[4rem] pt-safe border-b border-sidebar-border ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
        {!collapsed && (
          <Link to="/dashboard" onClick={onNavigate} className="flex items-center hover:opacity-80 transition-opacity">
            <img src="/logofinal.png" alt="GëstuSaDine" className="h-7 w-auto object-contain brightness-0 dark:brightness-0 dark:invert" />
          </Link>
        )}
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          {collapsed ? <PanelLeftOpen className="w-[18px] h-[18px]" /> : <PanelLeftClose className="w-[18px] h-[18px]" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain py-4 px-3 space-y-5 custom-scrollbar">
        {visibleSections.map((section) => (
          <div key={section.label.en} className="space-y-1">
            {collapsed ? (
              <div className="mx-auto mb-1 h-px w-6 bg-sidebar-border" />
            ) : (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                {tr(section.label)}
              </p>
            )}
            {section.items.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>
        ))}
      </nav>

      {/* Account footer */}
      <div className="border-t border-sidebar-border p-3 pb-safe space-y-1">
        {/* Sign out */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleSignOut}
                aria-label={language === 'fr' ? 'Déconnexion' : 'Sign out'}
                className="flex items-center justify-center mx-auto w-11 h-11 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="w-[18px] h-[18px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{language === 'fr' ? 'Déconnexion' : 'Sign out'}</TooltipContent>
          </Tooltip>
        ) : (
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleSignOut}
              className="btn-logout"
              aria-label={language === 'fr' ? 'Déconnexion' : 'Sign out'}
            >
              <span className="btn-logout__sign">
                <LogOut className="w-[17px] h-[17px]" />
              </span>
              <span className="btn-logout__text">{language === 'fr' ? 'Déconnexion' : 'Logout'}</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
