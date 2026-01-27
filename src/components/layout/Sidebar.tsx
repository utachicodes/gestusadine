import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Video,
  Calendar,
  Settings,
  LogOut,
  BookOpen,
  Users,
  FileText,
  Circle,
  Globe,
  TestTube,
  Mic
} from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, isAdmin, refreshProfile } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  // Refresh profile on mount to ensure admin status is up to date
  React.useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: t('nav.daily'),
      path: '/dashboard',
      adminOnly: false
    },
    {
      icon: MessageSquare,
      label: t('nav.chat'),
      path: '/chat',
      adminOnly: false
    },
    {
      icon: Video,
      label: t('nav.videos'),
      path: '/media',
      adminOnly: false
    },
    {
      icon: Calendar,
      label: t('nav.events'),
      path: '/events',
      adminOnly: false
    },
    {
      icon: BookOpen,
      label: t('nav.library'),
      path: '/library',
      adminOnly: false
    },
    {
      icon: Mic,
      label: t('tarteel.title'),
      path: '/tarteel',
      adminOnly: false
    },
    {
      icon: Circle,
      label: t('nav.circle'),
      path: '/circle',
      adminOnly: true
    },
    {
      icon: Users,
      label: t('nav.admin'),
      path: '/admin',
      adminOnly: true
    },
    {
      icon: FileText,
      label: t('nav.documents'),
      path: '/documents',
      adminOnly: true
    },
    {
      icon: TestTube,
      label: t('nav.rag_test'),
      path: '/admin/rag-test',
      adminOnly: true
    },
    {
      icon: Settings,
      label: t('nav.settings'),
      path: '/language',
      adminOnly: false
    },
  ];

  const filteredItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside className="w-64 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r border-border h-screen sticky top-0 flex flex-col transition-colors duration-300">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/dashboard" className="flex items-center">
          <img
            src="/logofinal.png"
            alt="GëstuSaDine"
            className="h-10 w-auto object-contain dark:brightness-0 dark:invert"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Language Toggle */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
          <Globe className="w-5 h-5 flex-shrink-0" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'wo')}
            className="flex-1 bg-transparent border-none text-sm font-medium text-foreground focus:outline-none cursor-pointer appearance-none"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="wo">Wolof</option>
          </select>
        </div>
      </div>

      {/* Sign Out */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t('nav.signout')}</span>
        </button>
      </div>
    </aside>
  );
};
