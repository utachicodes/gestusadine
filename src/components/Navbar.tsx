import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navItems = user
    ? isAdmin
      ? [
        { title: t('nav.circle'), href: '/circle' },
        { title: t('nav.admin'), href: '/admin' },
        { title: t('nav.documents'), href: '/documents' },
      ]
      : []
    : location.pathname === '/login'
      ? []
      : [{ title: t('nav.signin'), href: '/login' }];

  return (
    <header className="sticky top-0 z-50 bg-[#efefec]/80 backdrop-blur-lg shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <div>
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="XamSaDine AI" 
              className="h-12 w-auto object-contain brightness-110 dark:brightness-0 dark:invert"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="text-sm font-medium text-gray-600 hover:text-islamic-green-600 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'wo')}
              className="appearance-none bg-transparent border border-gray-300 dark:border-slate-700 rounded-md pl-3 pr-8 py-1.5 text-sm font-medium text-gray-600 dark:text-slate-300 hover:border-islamic-green-600 focus:outline-none focus:ring-1 focus:ring-islamic-green-600 transition-colors"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="wo">WO</option>
            </select>
            <Globe className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-slate-400 pointer-events-none" />
          </div>

          {/* Sign Out Button for logged-in users */}
          {user && (
            <div className="hidden md:block">
              <Button
                variant="outline"
                size="sm"
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

        {/* Mobile Menu */}
        <div className="md:hidden">
          <div className="flex items-center space-x-2">
            {navItems.slice(0, user ? 2 : 1).map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="text-sm font-medium text-gray-600 hover:text-islamic-green-600 px-2"
              >
                {item.title}
              </Link>
            ))}
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  signOut();
                  window.location.href = '/';
                }}
              >
                {t('nav.signout')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
