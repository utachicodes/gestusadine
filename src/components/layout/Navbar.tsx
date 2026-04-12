import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.media'), href: '/media' },
    { label: t('nav.podcasts'), href: '/podcasts' },
    { label: t('nav.community'), href: '/community' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed top-12 inset-x-0 z-[100] flex justify-center px-6 pointer-events-none">
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "expo.out" }}
        className={`pointer-events-auto relative px-10 h-16 flex items-center gap-12 transition-all duration-700 ${
          isScrolled 
            ? 'glass-pill bg-white/[0.04] border-white/10 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)]' 
            : 'bg-transparent border-transparent'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0 hover:scale-105 transition-all relative z-10 group mr-4">
          <img src="/logofinal.png" alt="GëstuSaDine" className="h-5 w-auto object-contain brightness-0 invert opacity-40 group-hover:opacity-100 transition-opacity" />
        </Link>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 relative z-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-[10px] font-bold uppercase tracking-[0.35em] transition-all relative group h-16 flex items-center ${
                isActive(link.href) ? 'text-white' : 'text-white/30 hover:text-white'
              }`}
            >
              <span className="relative z-10">{link.label}</span>
              {isActive(link.href) && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-8 relative z-10 pl-8 border-l border-white/5">
           <button 
             onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
             className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-accent transition-colors"
           >
             {language === 'fr' ? 'EN' : 'FR'}
           </button>

           {user ? (
             <button
               onClick={() => navigate('/chat')}
               className="text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:text-white transition-all underline underline-offset-8 decoration-white/10"
             >
               Council
             </button>
           ) : (
             <button
               onClick={() => navigate('/login')}
               className="btn-premium px-8 py-2 text-[9px] bg-white text-black hover:bg-slate-200 transition-all font-black h-10 flex items-center justify-center"
             >
               {t('nav.signin')}
             </button>
           )}
        </div>
      </motion.header>
    </div>
  );
};

export default Navbar;
