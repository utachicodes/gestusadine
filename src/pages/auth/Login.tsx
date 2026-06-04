import React, { useState } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, UserPlus, LogIn } from 'lucide-react';

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white/70 px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 outline-none transition';
const labelClass = 'block text-sm font-medium text-stone-600 mb-1.5';

type Mode = 'signin' | 'signup';

const MIN_PASSWORD = 8;

const Login = () => {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  const { signInWithPassword, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const upgradeTier = searchParams.get('upgrade');
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard';

  React.useEffect(() => {
    if (pendingRedirect && !loading && user) {
      navigate(pendingRedirect, { replace: true });
    }
  }, [pendingRedirect, loading, user, navigate]);

  const validatePassword = (pw: string): string | null => {
    if (pw.length < MIN_PASSWORD) {
      return language === 'fr'
        ? `Le mot de passe doit contenir au moins ${MIN_PASSWORD} caractères.`
        : `Password must be at least ${MIN_PASSWORD} characters.`;
    }
    if (!/[A-Z]/.test(pw)) {
      return language === 'fr'
        ? 'Le mot de passe doit contenir une majuscule.'
        : 'Password must contain an uppercase letter.';
    }
    if (!/[0-9]/.test(pw)) {
      return language === 'fr'
        ? 'Le mot de passe doit contenir un chiffre.'
        : 'Password must contain a number.';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) {
      return language === 'fr'
        ? 'Le mot de passe doit contenir un caractère spécial.'
        : 'Password must contain a special character.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup') {
      const pwError = validatePassword(password);
      if (pwError) {
        setError(pwError);
        return;
      }
    }
    setIsLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithPassword({ email, password });
      } else {
        const { error: signUpError } = await signUp({ email, password, fullName });
        if (signUpError) {
          setError(signUpError.message);
          setIsLoading(false);
          return;
        }
      }
      setPendingRedirect(upgradeTier ? `/dashboard?upgrade=${upgradeTier}` : from);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F0] flex items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-400 hover:text-stone-700 transition-colors mb-10"
        >
          <ChevronLeft className="w-4 h-4" /> Home
        </Link>

        <div className="text-center mb-8">
          <p className="font-arabic text-3xl text-emerald-800/80 mb-4" dir="rtl">اقْرَأْ</p>
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-stone-900">
              {mode === 'signin'
                ? (language === 'fr' ? 'Bon retour' : 'Welcome back')
                : (language === 'fr' ? 'Rejoignez-nous' : 'Join us')}
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              {mode === 'signin'
                ? (language === 'fr' ? 'Connectez-vous pour continuer.' : 'Sign in to continue.')
                : (language === 'fr' ? 'Créez votre compte gratuitement.' : 'Create your account for free.')}
            </p>
          </motion.div>
        </div>

        {/* Mode tabs */}
        <div className="flex rounded-lg border border-stone-200 bg-white/50 p-0.5 mb-6">
          <button
            type="button"
            onClick={() => mode !== 'signin' && switchMode()}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === 'signin'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            {language === 'fr' ? 'Connexion' : 'Sign in'}
          </button>
          <button
            type="button"
            onClick={() => mode !== 'signup' && switchMode()}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === 'signup'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            {language === 'fr' ? 'Inscription' : 'Sign up'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className={labelClass}>
                {language === 'fr' ? 'Nom complet' : 'Full name'}
              </label>
              <input
                id="name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={language === 'fr' ? 'Votre nom' : 'Your name'}
                className={inputClass}
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="name@example.com"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              {language === 'fr' ? 'Mot de passe' : 'Password'}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="••••••••"
              className={inputClass}
              required
            />
            {mode === 'signup' && (
              <ul className="text-[11px] text-stone-400 mt-1 space-y-0.5 list-disc list-inside">
                <li>{language === 'fr' ? 'Min. 8 caractères' : 'Min. 8 characters'}</li>
                <li>{language === 'fr' ? '1 majuscule' : '1 uppercase letter'}</li>
                <li>{language === 'fr' ? '1 chiffre' : '1 number'}</li>
                <li>{language === 'fr' ? '1 caractère spécial' : '1 special character'}</li>
              </ul>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-emerald-900 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
                {language === 'fr' ? 'Patientez...' : 'Please wait...'}
              </>
            ) : (
              <>
                {mode === 'signin'
                  ? (language === 'fr' ? 'Se connecter' : 'Sign in')
                  : (language === 'fr' ? 'Créer mon compte' : 'Create account')}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-stone-400 mt-8 leading-relaxed">
          {language === 'fr'
            ? 'En continuant, vous acceptez nos'
            : 'By continuing, you agree to our'}{' '}
          <Link to="/terms" className="underline underline-offset-2 hover:text-stone-600">
            {language === 'fr' ? 'Conditions' : 'Terms'}
          </Link>{' '}
          {language === 'fr' ? 'et notre' : 'and'}{' '}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-stone-600">
            {language === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}
          </Link>.
        </p>
      </div>
    </div>
  );
};

export default Login;
