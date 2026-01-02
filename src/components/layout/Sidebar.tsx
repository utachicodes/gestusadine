import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Video, 
  Calendar, 
  ShoppingBag,
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
      icon: ShoppingBag, 
      label: t('nav.shop'), 
      path: '/shop',
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
      label: 'Qirah', 
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
      label: 'RAG Test', 
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
    <aside className="w-64 bg-[#efefec]/90 dark:bg-slate-800/90 backdrop-blur-sm border-r border-islamic-cream/50 dark:border-slate-700/50 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-islamic-cream/50">
        <Link to="/dashboard" className="flex items-center">
          <img 
            src="/logo.png" 
            alt="XamSaDine AI" 
            className="h-10 w-auto object-contain brightness-110 dark:brightness-0 dark:invert"
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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-islamic-green/10 dark:bg-islamic-green/20 text-islamic-green-600 dark:text-islamic-green border border-islamic-green/20 dark:border-islamic-green/30'
                  : 'text-islamic-dark/70 dark:text-slate-300 hover:bg-islamic-cream/30 dark:hover:bg-slate-700/50 hover:text-islamic-dark dark:hover:text-slate-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Language Toggle */}
      <div className="p-4 border-t border-islamic-cream/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-islamic-dark/70 dark:text-slate-300">
                <Globe className="w-5 h-5 flex-shrink-0" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'wo')}
                  className="flex-1 bg-transparent border-none text-sm font-medium text-islamic-dark dark:text-slate-300 focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="wo">Wolof</option>
                </select>
              </div>
      </div>

      {/* Sign Out */}
      <div className="p-4 border-t border-islamic-cream/50 dark:border-slate-700/50">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-islamic-dark/70 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">{t('nav.signout')}</span>
              </button>
      </div>
    </aside>
  );
};
