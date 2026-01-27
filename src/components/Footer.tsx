import React from 'react';
import { Facebook, Instagram, Mail, Phone, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-islamic-dark dark:bg-gray-900 text-islamic-cream dark:text-gray-300 py-12 border-t border-islamic-gold/20 dark:border-gray-700">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-islamic-gold/5 to-transparent dark:via-primary/5" />
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <img
                src="/logo.png"
                alt="GëstuSaDine"
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-secondary-foreground/70 mb-4">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-primary mr-3 mt-1" />
                <a href="tel:+221765770810" className="text-secondary-foreground/70 hover:text-primary transition-colors">+221 76 577 08 10</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 pt-8 mt-8 text-center text-secondary-foreground/50 text-sm">
          <p>Â© {new Date().getFullYear()} GëstuSaDine. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;