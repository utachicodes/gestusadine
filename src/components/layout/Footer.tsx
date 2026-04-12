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
    <footer className="relative bg-white pt-24 pb-12 overflow-hidden border-t border-slate-100">
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center group">
              <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110">
                <img src="/logofinal.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Empowering the West African Ummah with authentic, AI-assisted Islamic knowledge. Documented guidance for the modern world.
            </p>
            <div className="flex gap-3">
              <a href="https://x.com/deenakdiamano" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-brand-600 hover:border-brand-200 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="mailto:contact@gestusadine.com" className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-brand-600 hover:border-brand-200 transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-slate-900 font-bold uppercase tracking-[0.2em] text-[11px] mb-6">
              Platform
            </h4>
            <ul className="space-y-4">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/about" label="Mission" />
              <FooterLink to="/faq" label="Help Center" />
              <FooterLink to="/contact" label="Contact" />
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-slate-900 font-bold uppercase tracking-[0.2em] text-[11px] mb-6">
              Resources
            </h4>
            <ul className="space-y-4">
              <FooterLink to="/media" label="Library" />
              <FooterLink to="/podcasts" label="Podcasts" />
              <FooterLink to="/community" label="Community" />
              <FooterLink to="/chat" label="Council" />
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-slate-900 font-bold uppercase tracking-[0.2em] text-[11px] mb-6">
              Support
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:contact@gestusadine.com" className="text-slate-500 hover:text-brand-600 transition-colors text-sm font-semibold">
                  contact@gestusadine.com
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <a href="tel:+221765770810" className="text-slate-500 hover:text-brand-600 transition-colors text-sm font-semibold">
                  +221 76 577 08 10
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-bold tracking-wide">
            &copy; {new Date().getFullYear()} GËSTUSADINE. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-8">
            <Link to="/privacy" className="text-xs font-bold text-slate-400 hover:text-brand-600 transition-colors uppercase tracking-widest">
              Privacy
            </Link>
            <Link to="/terms" className="text-xs font-bold text-slate-400 hover:text-brand-600 transition-colors uppercase tracking-widest">
              Terms
            </Link>
            <button
              onClick={scrollToTop}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all shadow-sm"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
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
      className="text-slate-500 hover:text-brand-600 transition-colors text-sm font-semibold"
    >
      {label}
    </Link>
  </li>
);

export default Footer;
