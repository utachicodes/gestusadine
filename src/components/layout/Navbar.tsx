import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Globe, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();


  return (
    <header className="sticky top-0 z-50 bg-deep-slate/50 backdrop-blur-2xl border-b border-white/5">
      <div className="container flex items-center justify-between h-20">
        <div>
          <Link to="/" className="flex items-center group">
            <img
              src="/logofinal.png"
              alt="GestuSaDine"
              className="h-14 w-auto object-contain brightness-200 contrast-125 transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          {/* Language Selector */}
          <div className="relative group">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'wo')}
              className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-2 text-sm font-bold text-white/80 hover:border-cyan-glow/50 hover:text-white focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-all cursor-pointer"
            >
              <option value="en" className="bg-deep-slate">EN</option>
              <option value="fr" className="bg-deep-slate">FR</option>
              <option value="wo" className="bg-deep-slate">WO</option>
            </select>
            <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-glow/60 pointer-events-none group-hover:text-cyan-glow transition-colors" />
          </div>

          {/* Theme Toggle (Hidden or stylized for dark-first) */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-cyan-glow/50 hover:bg-cyan-glow/5 transition-all text-white/60 hover:text-cyan-glow"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4.5 h-4.5" />
            ) : (
              <Moon className="w-4.5 h-4.5" />
            )}
          </button>

          {/* Sign Out Button */}
          {user && (
            <div className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl font-bold text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                onClick={() => {
                  signOut();
                  window.location.href = '/';
                }}
              >
                {t('nav.signout')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
