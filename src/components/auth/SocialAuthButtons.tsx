import React, { useState } from 'react';
import { Chrome, Facebook, Instagram, Github, Twitter, Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import type { AuthProvider } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SocialAuthButtonsProps {
  mode: 'signin' | 'signup';
  onSuccess: () => void;
}

const PROVIDERS: {
  id: AuthProvider;
  label: string;
  icon: React.ElementType;
  accent: string;
  identifierType: 'email' | 'text';
  identifierPlaceholder: string;
  identifierAutoComplete: string;
  passwordPlaceholder: string;
}[] = [
  {
    id: 'google',
    label: 'Google',
    icon: Chrome,
    accent: 'border-stone-300 hover:bg-stone-50 text-stone-700',
    identifierType: 'email',
    identifierPlaceholder: 'Email or phone',
    identifierAutoComplete: 'username',
    passwordPlaceholder: 'Enter your password',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    accent: 'border-[#1877F2]/30 hover:bg-[#1877F2]/5 text-[#1877F2]',
    identifierType: 'text',
    identifierPlaceholder: 'Email address or phone number',
    identifierAutoComplete: 'username',
    passwordPlaceholder: 'Password',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    accent: 'border-[#E1306C]/30 hover:bg-[#E1306C]/5 text-[#E1306C]',
    identifierType: 'text',
    identifierPlaceholder: 'Phone number, username, or email',
    identifierAutoComplete: 'username',
    passwordPlaceholder: 'Password',
  },
];

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white/70 px-4 py-2.5 text-base text-stone-900 placeholder-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 outline-none transition';

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ mode, onSuccess }) => {
  const { signIn } = useAuth();
  const { language } = useLanguage();
  const [activeProvider, setActiveProvider] = useState<AuthProvider | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activeMeta = PROVIDERS.find((p) => p.id === activeProvider);

  const handleOpen = (provider: AuthProvider) => {
    setActiveProvider(provider);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleBack = () => {
    setActiveProvider(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProvider) return;
    setError('');
    if (!email.trim() || !password.trim()) {
      setError(language === 'fr' ? 'Veuillez remplir tous les champs.' : 'Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    try {
      await signIn(email, password, activeProvider, name || undefined);
      onSuccess();
    } catch (err: any) {
      setError(err?.message ?? (language === 'fr' ? 'Une erreur est survenue.' : 'Something went wrong.'));
    } finally {
      setIsLoading(false);
    }
  };

  if (activeProvider && activeMeta) {
    const Icon = activeMeta.icon;
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm font-medium text-stone-400 hover:text-stone-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {language === 'fr' ? 'Retour' : 'Back'}
        </button>

        <div className="flex items-center gap-2 text-stone-800 font-semibold">
          <Icon className="w-5 h-5" />
          {mode === 'signin'
            ? (language === 'fr' ? `Continuer avec ${activeMeta.label}` : `Continue with ${activeMeta.label}`)
            : (language === 'fr' ? `S'inscrire avec ${activeMeta.label}` : `Sign up with ${activeMeta.label}`)}
        </div>

        {mode === 'signup' && (
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder={language === 'fr' ? 'Votre nom' : 'Your name'}
            className={inputClass}
            autoComplete="name"
            required
          />
        )}

        <input
          type={activeMeta.identifierType}
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          placeholder={activeMeta.identifierPlaceholder}
          className={inputClass}
          autoComplete={activeMeta.identifierAutoComplete}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder={activeMeta.passwordPlaceholder}
            className={inputClass + ' pr-10'}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-900 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="h-4 w-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {language === 'fr' ? 'Continuer' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-3">
      {PROVIDERS.map(({ id, label, icon: Icon, accent }) => (
        <button
          key={id}
          type="button"
          onClick={() => handleOpen(id)}
          className={`w-full flex items-center justify-center gap-2.5 rounded-lg border bg-white py-2.5 text-sm font-medium transition-colors ${accent}`}
        >
          <Icon className="w-4 h-4" />
          {mode === 'signin'
            ? (language === 'fr' ? `Continuer avec ${label}` : `Continue with ${label}`)
            : (language === 'fr' ? `S'inscrire avec ${label}` : `Sign up with ${label}`)}
        </button>
      ))}

      <div className="grid grid-cols-2 gap-3 pt-1">
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
