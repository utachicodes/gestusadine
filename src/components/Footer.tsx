import React from 'react';
import { Facebook, Instagram, Mail, Phone, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <img
                src="/logo.png"
                alt="XamSaDine AI"
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
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-primary mr-3 mt-1" />
                <a href="mailto:xamsadineai@gmail.com" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                  xamsadineai@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 pt-8 mt-8 text-center text-secondary-foreground/50 text-sm">
          <p>© {new Date().getFullYear()} XamSaDine AI. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;