import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getNavLinks = (t: (key: string) => string) => [
  { label: t('nav.learn') || 'Learn', href: '/media' },
  { label: t('nav.podcasts') || 'Podcasts', href: '/podcasts' },
  { label: t('nav.community') || 'Community', href: '/community' },
  { label: t('nav.ai_companion') || 'AI Companion', href: '/chat' },
];

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = getNavLinks(t);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-warm-sand/60'
            : 'bg-white/80 backdrop-blur-md border-b border-warm-sand/30'
        }`}
      >
        <div className="container flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-deep-green flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-warm-cream font-arabic text-lg leading-none">خ</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-xl font-bold text-deep-green tracking-tight group-hover:text-deep-green-light transition-colors">
                GëstuSaDine
              </span>
              <span className="text-[10px] font-medium text-warm-gold tracking-widest uppercase">
                Islamic Knowledge
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.href
                    ? 'text-deep-green bg-deep-green/8 font-semibold'
                    : 'text-deep-green/70 hover:text-deep-green hover:bg-deep-green/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative group hidden sm:block">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
                className="appearance-none bg-warm-sand/40 border border-warm-sand rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-deep-green hover:border-warm-gold/50 focus:outline-none focus:ring-2 focus:ring-warm-gold/30 transition-all cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="fr">FR</option>
              </select>
              <Globe className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-deep-green/50 pointer-events-none" />
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="hidden sm:block px-4 py-2 rounded-lg text-sm font-semibold text-deep-green bg-deep-green/8 hover:bg-deep-green/12 transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { signOut(); window.location.href = '/'; }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-warm-gold/80 hover:text-warm-gold transition-colors"
                >
                  {t('nav.signout') || 'Sign out'}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-spiritual text-sm py-2 px-5"
              >
                {t('nav.signin') || 'Sign in'}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-deep-green hover:bg-deep-green/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[4.5rem] inset-x-0 z-40 bg-white border-b border-warm-sand shadow-lg md:hidden"
          >
            <nav className="container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.href
                      ? 'text-deep-green bg-deep-green/8 font-semibold'
                      : 'text-deep-green/70 hover:bg-deep-green/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-warm-sand/60 mt-2 pt-3 flex items-center gap-3">
                <Globe className="w-4 h-4 text-deep-green/50" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
                  className="bg-warm-sand/40 border border-warm-sand rounded-lg px-3 py-1.5 text-xs font-bold text-deep-green focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              {!user && (
                <Link to="/login" className="btn-spiritual text-sm py-2.5 px-5 mt-2 text-center">
                  Sign in
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
