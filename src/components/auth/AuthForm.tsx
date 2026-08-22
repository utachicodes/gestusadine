import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ChevronLeft, User, Users } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import type { Gender } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess: () => void;
}

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white/70 px-4 py-2.5 text-base text-stone-900 placeholder-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 outline-none transition';

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess }) => {
  const { signIn } = useAuth();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'gender'>('form');
  const [gender, setGender] = useState<Gender | null>(null);

  const doSignIn = async (selectedGender?: Gender) => {
    setIsLoading(true);
    try {
      await signIn(email, password, name || undefined, selectedGender);
      onSuccess();
    } catch (err: any) {
      setError(err?.message ?? (language === 'fr' ? 'Une erreur est survenue.' : 'Something went wrong.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError(language === 'fr' ? 'Veuillez remplir tous les champs.' : 'Please fill in all fields.');
      return;
    }
    if (mode === 'signup') {
      setStep('gender');
      return;
    }
    await doSignIn();
  };

  const handleGenderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gender) return;
    setError('');
    await doSignIn(gender);
  };

  if (step === 'gender') {
    return (
      <form onSubmit={handleGenderSubmit} className="space-y-4">
        <button
          type="button"
          onClick={() => { setStep('form'); setError(''); }}
          className="flex items-center gap-1.5 text-sm font-medium text-stone-400 hover:text-stone-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {language === 'fr' ? 'Retour' : 'Back'}
        </button>

        <div className="text-center mb-2">
          <h2 className="text-xl font-bold text-stone-900">
            {language === 'fr' ? 'Vous êtes…' : 'You identify as…'}
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {language === 'fr'
              ? 'Cela nous aide à personnaliser votre expérience.'
              : 'This helps us personalise your experience.'}
          </p>
        </div>

        <div className="flex gap-3">
          {(['male', 'female'] as Gender[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`flex-1 flex flex-col items-center gap-2 px-4 py-5 rounded-xl border-2 transition-all ${
                gender === g
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                  : 'border-stone-200 text-stone-500 hover:border-stone-300'
              }`}
            >
              {g === 'male' ? <User className="w-6 h-6" /> : <Users className="w-6 h-6" />}
              <span className="text-sm font-semibold">
                {g === 'male'
                  ? (language === 'fr' ? 'Homme' : 'Male')
                  : (language === 'fr' ? 'Femme' : 'Female')}
              </span>
            </button>
          ))}
        </div>

        <p className="text-xs text-stone-400 text-center">
          {language === 'fr'
            ? 'Les utilisatrices ont accès au Suivi du cycle.'
            : 'Female users get access to the Cycle Tracker.'}
        </p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || !gender}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-900 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="h-4 w-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {language === 'fr' ? "S'inscrire" : 'Sign Up'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(''); }}
        placeholder={language === 'fr' ? 'Votre email' : 'Your email'}
        className={inputClass}
        autoComplete="username"
        required
      />

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
          placeholder={language === 'fr' ? 'Votre mot de passe' : 'Your password'}
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
            {mode === 'signin'
              ? (language === 'fr' ? 'Se connecter' : 'Sign In')
              : (language === 'fr' ? 'Continuer' : 'Continue')}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

export default AuthForm;
