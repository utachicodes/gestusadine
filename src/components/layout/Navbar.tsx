import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border/70'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <img
            src="/logofinal.png"
            alt="GëstuSaDine"
            className="h-10 w-auto object-contain brightness-0 opacity-80 group-hover:opacity-100 transition-opacity"
          />
        </Link>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
          >
            {language === 'fr' ? 'EN' : 'FR'}
          </button>

          {user ? (
            <button
              onClick={() => navigate('/chat')}
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {language === 'fr' ? 'Le Conseil' : 'The Council'}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t('nav.signin')}
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
