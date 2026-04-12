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
    <aside className="w-64 h-screen sticky top-0 flex flex-col transition-all duration-300 border-r border-white/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      {/* Logo Area with Glass Effect */}
      <div className="p-6 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-islamic-gold/5 to-transparent opacity-50" />
        <Link to="/dashboard" className="flex items-center relative z-10 hover:opacity-80 transition-opacity">
          <img
            src="/logofinal.png"
            alt="GëstuSaDine"
            className="h-10 w-auto object-contain dark:brightness-0 dark:invert drop-shadow-sm"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                ? 'bg-gradient-to-r from-islamic-gold/20 to-islamic-gold/5 text-islamic-gold border border-islamic-gold/20 shadow-sm'
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground hover:border-white/10 border border-transparent'
                }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-islamic-gold/5 animate-pulse-slow" />
              )}
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-medium relative z-10">{item.label}</span>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-islamic-gold shadow-[0_0_10px_#D4AF37]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10 bg-black/5 space-y-2">
        {/* Language Toggle */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:text-foreground transition-all hover:bg-white/10 hover:border-white/10">
          <Globe className="w-5 h-5 flex-shrink-0" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
            className="flex-1 bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer appearance-none text-foreground"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 border border-transparent transition-all w-full group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">{t('nav.signout')}</span>
        </button>
      </div>
    </aside>
  );
};
