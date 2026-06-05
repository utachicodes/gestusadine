import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { X } from 'lucide-react';

const STORAGE_KEY = 'gestu_cookie_consent_dismissed';

export const CookieConsent = () => {
  const { t } = useLanguage();
  const [show, setShow] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) !== 'true';
  });

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background px-4 py-3 shadow-lg"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">{t('cookie.message')}</p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={dismiss}
                className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {t('cookie.accept')}
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
