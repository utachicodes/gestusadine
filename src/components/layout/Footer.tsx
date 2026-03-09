import * as React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Mail, Phone, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-deep-green pt-16 pb-8 overflow-hidden">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-warm-gold/20 border border-warm-gold/30 flex items-center justify-center">
                <span className="font-arabic text-lg text-warm-gold leading-none">خ</span>
              </div>
              <span className="font-serif text-lg font-bold text-warm-cream tracking-tight">
                GëstuSaDine
              </span>
            </Link>
            <p className="text-warm-cream/45 text-sm leading-relaxed">
              Islamic guidance backed by multiple AI scholars. Built for West African Muslims.
            </p>
            <div className="flex gap-2">
              <a href="https://x.com/deenakdiamano" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-warm-cream/5 border border-warm-cream/10 text-warm-cream/40 hover:text-warm-gold transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="mailto:contact@gestusadine.com" className="p-2 rounded-lg bg-warm-cream/5 border border-warm-cream/10 text-warm-cream/40 hover:text-warm-gold transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-warm-gold/80 font-bold uppercase tracking-[0.15em] text-xs mb-5">
              Pages
            </h4>
            <ul className="space-y-2.5">
              <FooterLink to="/" label={t('nav.home') || 'Home'} />
              <FooterLink to="/about" label={t('nav.about') || 'About'} />
              <FooterLink to="/faq" label={t('nav.faq') || 'FAQ'} />
              <FooterLink to="/contact" label={t('nav.contact') || 'Contact'} />
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-warm-gold/80 font-bold uppercase tracking-[0.15em] text-xs mb-5">
              Features
            </h4>
            <ul className="space-y-2.5">
              <FooterLink to="/media" label={t('nav.learn') || 'Learn'} />
              <FooterLink to="/podcasts" label={t('nav.podcasts') || 'Podcasts'} />
              <FooterLink to="/community" label={t('nav.community') || 'Community'} />
              <FooterLink to="/chat" label={t('nav.ai_companion') || 'AI Companion'} />
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-warm-gold/80 font-bold uppercase tracking-[0.15em] text-xs mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail className="w-3.5 h-3.5 text-warm-gold/50" />
                <a href="mailto:contact@gestusadine.com" className="text-warm-cream/50 hover:text-warm-gold transition-colors text-sm">
                  contact@gestusadine.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-3.5 h-3.5 text-warm-gold/50" />
                <a href="tel:+221765770810" className="text-warm-cream/50 hover:text-warm-gold transition-colors text-sm">
                  +221 76 577 08 10
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-warm-cream/10 mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-warm-cream/35 text-xs">
            &copy; {new Date().getFullYear()} GëstuSaDine
          </p>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-full bg-warm-cream/5 border border-warm-cream/10 text-warm-cream/40 hover:text-warm-gold transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          <div className="flex gap-5">
            <Link to="/privacy" className="text-xs text-warm-cream/35 hover:text-warm-gold transition-colors">
              {t('footer.privacy') || 'Privacy'}
            </Link>
            <Link to="/terms" className="text-xs text-warm-cream/35 hover:text-warm-gold transition-colors">
              {t('footer.terms') || 'Terms'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, label }: { to: string; label: string }) => (
  <li>
    <Link
      to={to}
      className="text-warm-cream/45 hover:text-warm-gold transition-colors text-sm"
    >
      {label}
    </Link>
  </li>
);

export default Footer;
