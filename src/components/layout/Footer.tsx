import * as React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-deep-slate border-t border-white/5 pt-24 pb-12 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_50%_100%,rgba(0,245,255,0.1),transparent_70%)] rounded-full blur-3xl"
        />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="inline-block group">
              <img
                src="/logofinal.png"
                alt="GestuSaDine"
                className="h-14 w-auto brightness-200 contrast-125 transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-white/40 text-sm leading-relaxed font-medium">
              {t('footer.description') || 'The Digital Ecosystem for Modern Islamic Living. Merging authentic scholarship with advanced artificial intelligence.'}
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Twitter className="w-5 h-5" />} href="https://x.com/deenakdiamano" />
              <SocialIcon icon={<Mail className="w-5 h-5" />} href="mailto:contact@gestusadine.com" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">{t('footer.quick_links') || 'Explore'}</h4>
            <ul className="space-y-4">
              <FooterLink to="/" label={t('nav.home') || 'Home'} />
              <FooterLink to="/about" label={t('nav.about') || 'About'} />
              <FooterLink to="/pricing" label={t('nav.pricing') || 'Pricing'} />
              <FooterLink to="/contact" label={t('nav.contact') || 'Contact'} />
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">{t('footer.features') || 'Modules'}</h4>
            <ul className="space-y-4">
              <FooterLink to="/fiqh" label="Islamic Law (Fiqh)" />
              <FooterLink to="/tawhid" label="Theology (Tawhid)" />
              <FooterLink to="/hadith" label="Prophetic Traditions" />
              <FooterLink to="/library" label="Digital Archive" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">{t('footer.contact_us') || 'Reach Out'}</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4 group">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-glow group-hover:border-cyan-glow/30 transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Email</p>
                  <a href="mailto:contact@gestusadine.com" className="text-white/70 hover:text-cyan-glow transition-colors font-medium">contact@gestusadine.com</a>
                </div>
              </li>
              <li className="flex items-start space-x-4 group">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-glow group-hover:border-cyan-glow/30 transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Phone</p>
                  <a href="tel:+221765770810" className="text-white/70 hover:text-cyan-glow transition-colors font-medium">+221 76 577 08 10</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-xs font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} GESTUSADINE. FAITH MEETS INTELLIGENCE.
          </p>

          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-cyan-glow hover:border-cyan-glow/50 hover:bg-cyan-glow/5 transition-all group"
          >
            <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
          </button>

          <div className="flex gap-8">
            <Link to="/privacy" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">{t('footer.privacy') || 'Privacy'}</Link>
            <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">{t('footer.terms') || 'Terms'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-cyan-glow hover:border-cyan-glow/50 hover:bg-cyan-glow/5 transition-all"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, label }: { to: string; label: string }) => (
  <li>
    <Link to={to} className="text-white/40 hover:text-cyan-glow transition-all flex items-center group font-medium text-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-white/10 mr-3 group-hover:bg-cyan-glow group-hover:shadow-[0_0_8px_rgba(0,245,255,0.5)] transition-all" />
      {label}
    </Link>
  </li>
);

export default Footer;
