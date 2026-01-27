import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();


  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <div>
          <Link to="/" className="flex items-center">
            <img
              src="/logofinal.png"
              alt="GëstuSaDine"
              className="h-12 w-auto object-contain brightness-110 dark:brightness-0 dark:invert"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4">


          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'wo')}
              className="appearance-none bg-transparent border border-input rounded-md pl-3 pr-8 py-1.5 text-sm font-medium text-foreground hover:border-primary focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="wo">WO</option>
            </select>
            <Globe className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
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


      </div>
    </header>
  );
};

export default Navbar;
