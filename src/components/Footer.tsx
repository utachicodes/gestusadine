import * as React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowUp, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-background to-islamic-cream/10 border-t border-border/50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-islamic-green/30 to-transparent rounded-full blur-3xl"
          style={{ animation: 'float-continuous 20s ease-in-out infinite' }}
        />
        <div 
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-islamic-blue/30 to-transparent rounded-full blur-3xl"
          style={{ animation: 'float-continuous 25s ease-in-out infinite reverse' }}
        />
      </div>

      <div className="container relative z-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gradient mb-3">GëstuSaDine</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {t('footer.description') || 'Your comprehensive Islamic platform powered by AI, providing authentic guidance, education, and spiritual growth.'}
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Youtube, href: '#', label: 'YouTube' }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-islamic-cream/50 dark:bg-muted/30 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-islamic-green hover:border-islamic-green/50 hover:shadow-lg transition-all hover:scale-110 group"
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-islamic-green to-islamic-blue rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/fatwa', label: 'Ask Question' },
                { to: '/library', label: 'Library' },
                { to: '/about', label: 'About Us' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-islamic-green transition-colors inline-flex items-center gap-2 group text-sm"
                  >
                    <span className="w-0 h-px bg-islamic-green transition-all group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-islamic-blue to-islamic-gold rounded-full" />
              Features
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/council', label: 'AI Council' },
                { to: '/hadith', label: 'Hadith Collection' },
                { to: '/events', label: 'Events' },
                { to: '/media', label: 'Media Library' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-islamic-blue transition-colors inline-flex items-center gap-2 group text-sm"
                  >
                    <span className="w-0 h-px bg-islamic-blue transition-all group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-islamic-gold to-islamic-green rounded-full" />
              {t('footer.contact') || 'Contact'}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground group">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5 text-islamic-green group-hover:scale-110 transition-transform" />
                <a href="mailto:contact@gestusadine.com" className="hover:text-islamic-green transition-colors">
                  contact@gestusadine.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground group">
                <Phone className="w-5 h-5 flex-shrink-0 mt-0.5 text-islamic-blue group-hover:scale-110 transition-transform" />
                <a href="tel:+221123456789" className="hover:text-islamic-blue transition-colors">
                  +221 12 345 67 89
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-islamic-gold" />
                <span>Dakar, Senegal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
               {currentYear} GëstuSaDine. {t('footer.rights') || 'All rights reserved.'}
              <span className="hidden md:inline"></span>
              <span className="flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" /> for the Ummah
              </span>
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-islamic-green transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-islamic-green transition-colors">
                Terms
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-islamic-green transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-islamic-green to-islamic-blue text-white shadow-xl hover:shadow-2xl transition-all z-50 flex items-center justify-center group ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
      </button>
    </footer>
  );
};

export default Footer;
