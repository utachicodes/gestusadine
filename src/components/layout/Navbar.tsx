import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const navLinks = [
  { label: 'Start Here', href: '/' },
  { label: 'Library', href: '/media' },
  { label: 'Podcasts', href: '/podcasts' },
  { label: 'Community', href: '/community' },
  { label: 'Shop', href: '/shop' },
];

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".pill-nav", {
      y: -100,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
      delay: 0.5
    });
  }, { scope: container });

  return (
    <div ref={container} className="fixed top-8 inset-x-0 z-[100] flex justify-center px-4 pointer-events-none">
      <header className="pill-nav pointer-events-auto bg-white/95 backdrop-blur-3xl border border-slate-200/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] rounded-full h-16 flex items-center px-6 lg:px-8 gap-10 max-w-fit mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center -ml-2 shrink-0">
          <img src="/logofinal.png" alt="Scribblit" className="h-8 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative px-5 py-2 rounded-full text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${
                location.pathname === link.href
                  ? 'text-slate-950'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {location.pathname === link.href && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-0 bg-slate-100/80 rounded-full z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Global Controls Hub */}
        <div className="flex items-center gap-6 pl-4 border-l border-slate-100">
           {/* Language Toggle (Pill Style) */}
           <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full p-1">
             <button 
              onClick={() => setLanguage('en')}
              className={`w-8 h-8 rounded-full text-[9px] font-black transition-all ${language === 'en' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400'}`}
             >
               EN
             </button>
             <button 
              onClick={() => setLanguage('fr')}
              className={`w-8 h-8 rounded-full text-[9px] font-black transition-all ${language === 'fr' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400'}`}
             >
               FR
             </button>
           </div>

           {/* User Action / CTA */}
           {user ? (
             <div className="flex items-center gap-4">
                <Link 
                  to="/dashboard"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-950 hover:opacity-70 transition-opacity"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
             </div>
           ) : (
             <Link
               to="/login"
               className="bg-slate-950 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
             >
               View Plans
             </Link>
           )}

           {/* Mobile Menu Trigger */}
           <button
             onClick={() => setMobileOpen(!mobileOpen)}
             className="lg:hidden p-2 text-slate-950"
           >
             {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </button>
        </div>
      </header>

      {/* Mobile Menu Redesign (Floating Panel) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-28 inset-x-4 z-[99] bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl lg:hidden pointer-events-auto"
          >
            <nav className="flex flex-col gap-4 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-black text-slate-950 tracking-tighter py-2"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-4" />
              <div className="flex justify-center gap-8">
                 <button onClick={() => setLanguage('en')} className={`text-sm font-black ${language === 'en' ? 'text-slate-950 underline' : 'text-slate-300'}`}>English</button>
                 <button onClick={() => setLanguage('fr')} className={`text-sm font-black ${language === 'fr' ? 'text-slate-950 underline' : 'text-slate-300'}`}>French</button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
