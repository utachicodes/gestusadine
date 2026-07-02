import React, { useState } from 'react';
import { Chrome, Facebook, Instagram, Github, Twitter } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

type Provider = 'google' | 'facebook' | 'instagram';

interface SocialAuthButtonsProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ onSuccess, onError }) => {
  const { signInWithProvider } = useAuth();
  const { language } = useLanguage();
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);

  const handleClick = async (provider: Provider) => {
    setLoadingProvider(provider);
    try {
      await signInWithProvider(provider);
      onSuccess();
    } catch (err: any) {
      onError(err?.message ?? 'Sign in failed. Please try again.');
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-stone-200" />
        <span className="text-xs text-stone-400">
          {language === 'fr' ? 'ou continuer avec' : 'or continue with'}
        </span>
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleClick('google')}
          disabled={loadingProvider !== null}
          className="flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50 transition-colors"
          aria-label="Google"
        >
          <Chrome className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleClick('facebook')}
          disabled={loadingProvider !== null}
          className="flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50 transition-colors"
          aria-label="Facebook"
        >
          <Facebook className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleClick('instagram')}
          disabled={loadingProvider !== null}
          className="flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50 transition-colors"
          aria-label="Instagram"
        >
          <Instagram className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled
          className="flex items-center justify-center gap-2 rounded-lg border border-stone-200 bg-stone-50 py-2.5 text-xs font-medium text-stone-400 cursor-not-allowed"
        >
          <Twitter className="w-4 h-4" />
          {language === 'fr' ? 'Bientôt' : 'Coming soon'}
        </button>
        <button
          type="button"
          disabled
          className="flex items-center justify-center gap-2 rounded-lg border border-stone-200 bg-stone-50 py-2.5 text-xs font-medium text-stone-400 cursor-not-allowed"
        >
          <Github className="w-4 h-4" />
          {language === 'fr' ? 'Bientôt' : 'Coming soon'}
        </button>
      </div>
    </div>
  );
};

export default SocialAuthButtons;
