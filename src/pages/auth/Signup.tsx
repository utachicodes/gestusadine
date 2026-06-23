import React, { useState } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ChevronLeft, Eye, EyeOff, ArrowRight, Mail, Lock, User, Users } from 'lucide-react';
import type { Gender } from '@/auth/AuthContext';

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white/70 px-4 py-2.5 text-base text-stone-900 placeholder-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 outline-none transition';
const labelClass = 'block text-sm font-medium text-stone-600 mb-1.5';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'credentials' | 'gender'>('credentials');
  const [gender, setGender] = useState<Gender | null>(null);

  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const upgradeTier = searchParams.get('upgrade');
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';
  const { language } = useLanguage();

  React.useEffect(() => {
    if (pendingRedirect && !loading && user) {
      navigate(pendingRedirect, { replace: true });
    }
  }, [pendingRedirect, loading, user, navigate]);

  const handleCredentialsNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError(language === 'fr' ? 'Veuillez entrer votre nom.' : 'Please enter your name.');
      return;
    }
    if (!email.trim()) {
      setError(language === 'fr' ? 'Veuillez entrer votre email.' : 'Please enter your email.');
      return;
    }
    if (!password.trim()) {
      setError(language === 'fr' ? 'Veuillez entrer un mot de passe.' : 'Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError(language === 'fr' ? 'Le mot de passe doit contenir au moins 6 caractères.' : 'Password must be at least 6 characters.');
      return;
    }
    setStep('gender');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signIn(email, password, name, gender ?? undefined);
      setPendingRedirect(upgradeTier ? `/dashboard?upgrade=${upgradeTier}` : from);
    } catch (err: any) {
      const msg = err?.message ?? '';
      if (msg.includes('already exists')) {
        setError(language === 'fr' ? 'Un compte avec cet email existe déjà.' : 'An account with this email already exists.');
      } else if (msg.includes('rate') || msg.includes('limit')) {
        setError(language === 'fr' ? 'Trop de tentatives. Veuillez patienter.' : 'Too many attempts. Please wait.');
      } else {
        setError(
          !msg.startsWith('[CONVEX')
            ? msg
            : language === 'fr'
              ? 'Une erreur est survenue. Veuillez réessayer.'
              : 'Something went wrong. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full bg-[#FAF7F0] flex items-center justify-center px-4"
      style={{
        paddingTop: 'calc(4rem + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-4xl font-bold text-stone-900">
              {language === 'fr' ? 'Créer un compte' : 'Create Account'}
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              {language === 'fr' ? 'Rejoignez la communauté GëstuSaDine.' : 'Join the GëstuSaDine community.'}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsNext} className="space-y-4">
              <div>
                <label htmlFor="name" className={labelClass}>
                  {language === 'fr' ? 'Nom complet' : 'Full Name'}
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    placeholder={language === 'fr' ? 'Votre nom' : 'Your name'}
                    className={inputClass + ' pl-10'}
                    autoComplete="name"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="name@example.com"
                    className={inputClass + ' pl-10'}
                    autoComplete="email"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  {language === 'fr' ? 'Mot de passe' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    className={inputClass + ' pl-10 pr-10'}
                    autoComplete="new-password"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-stone-400">
                  {language === 'fr' ? 'Minimum 6 caractères' : 'At least 6 characters'}
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-900 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-emerald-800 transition-colors"
              >
                {language === 'fr' ? 'Continuer' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-sm text-stone-500 mt-4">
                {language === 'fr' ? 'Déjà un compte ?' : 'Already have an account?'}{' '}
                <Link
                  to="/login"
                  className="font-semibold text-emerald-800 hover:text-emerald-700 transition-colors"
                >
                  {language === 'fr' ? 'Se connecter' : 'Sign In'}
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="flex items-center gap-1.5 text-sm font-medium text-stone-400 hover:text-stone-700 transition-colors mb-2"
              >
                <ChevronLeft className="w-4 h-4" />
                {language === 'fr' ? 'Retour' : 'Back'}
              </button>

              <div className="text-center mb-4">
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
          )}
        </motion.div>

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

export default Signup;
