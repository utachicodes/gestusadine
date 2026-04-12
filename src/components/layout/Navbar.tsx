import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, LogOut, LayoutDashboard, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.media'), href: '/media' },
    { label: t('nav.podcasts'), href: '/podcasts' },
    { label: t('nav.community'), href: '/community' },
    { label: t('nav.shop'), href: '/shop' },
  ];

  useGSAP(() => {
    gsap.from(".nav-container", {
      y: -50,
      opacity: 0,
      duration: 1.5,
      ease: "expo.out",
      delay: 0.2
    });
  }, { scope: container });

  return (
    <div ref={container} className="fixed top-6 inset-x-0 z-[100] flex justify-center px-4 pointer-events-none">
      <header className="nav-container pointer-events-auto glass-premium rounded-full h-16 flex items-center px-4 lg:px-6 gap-8 max-w-fit mx-auto border-white/10">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0 hover:scale-105 transition-transform">
          <img src="/logofinal.png" alt={t('brand.name')} className="h-7 w-auto object-contain brightness-0 invert" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
                location.pathname === link.href
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {location.pathname === link.href && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white/10 rounded-full z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Global Controls Hub */}
        <div className="flex items-center gap-4 pl-4 border-l border-white/10">
           {/* Language Selector */}
           <div className="hidden md:flex items-center bg-white/5 rounded-full p-1 border border-white/5">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-black text-white/60 hover:text-white transition-colors"
              >
                <Globe className="w-3 h-3 text-primary" />
                {language.toUpperCase()}
              </button>
           </div>

           {/* User Action */}
           {user ? (
             <div className="flex items-center gap-2">
                <Link 
                  to="/dashboard"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-primary hover:border-primary/50 transition-all group"
                >
                  <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <LogOut className="w-4 h-4" />
                </button>
             </div>
           ) : (
             <Link
               to="/login"
               className="btn-premium py-2.5 px-6 text-[10px] h-10 flex items-center"
             >
               {t('nav.signin')}
             </Link>
           )}

           {/* Mobile Menu Trigger */}
           <button
             onClick={() => setMobileOpen(!mobileOpen)}
             className="lg:hidden w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"
           >
             {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
           </button>
        </div>
      </header>

      {/* Mobile Menu (Immersive Overlay) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[99] bg-black/60 flex items-center justify-center lg:hidden pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm px-8"
            >
              <nav className="flex flex-col gap-6 text-center">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-4xl font-black text-white hover:text-primary transition-colors tracking-tighter"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                
                <div className="h-px bg-white/10 my-6" />
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => { setLanguage(language === 'en' ? 'fr' : 'en'); setMobileOpen(false); }}
                    className="text-white/40 font-bold uppercase tracking-widest text-xs hover:text-white"
                  >
                    Switch to {language === 'en' ? 'French' : 'English'}
                  </button>
                  {!user && (
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="btn-premium"
                    >
                      {t('nav.signin')}
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
            
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-8 right-8 w-12 h-12 rounded-full glass-premium flex items-center justify-center text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
