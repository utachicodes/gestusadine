import React, { useState } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Eye, EyeOff, ArrowRight, Mail, Lock, User, Users } from 'lucide-react';
import type { Gender } from '@/auth/AuthContext';

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white/70 px-4 py-2.5 text-base text-stone-900 placeholder-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 outline-none transition';
const labelClass = 'block text-sm font-medium text-stone-600 mb-1.5';

type Step = 'signin' | 'signup' | 'gender';

const Login = () => {
  const [step, setStep] = useState<Step>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 'gender') {
      if (!gender) {
        setError(language === 'fr' ? 'Veuillez sélectionner votre genre.' : 'Please select your gender.');
        return;
      }
      setIsLoading(true);
      try {
        await signIn(email, password, name, gender);
        setPendingRedirect(upgradeTier ? `/dashboard?upgrade=${upgradeTier}` : from);
      } catch (err: any) {
        setError(
          err?.message && !err.message.startsWith('[CONVEX')
            ? err.message
            : language === 'fr'
              ? 'Une erreur est survenue. Veuillez réessayer.'
              : 'Something went wrong. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError(language === 'fr' ? 'Veuillez remplir tous les champs.' : 'Please fill in all fields.');
      return;
    }

    if (step === 'signup' && !name.trim()) {
      setError(language === 'fr' ? 'Veuillez entrer votre nom.' : 'Please enter your name.');
      return;
    }

    if (password.length < 6) {
      setError(language === 'fr' ? 'Le mot de passe doit contenir au moins 6 caractères.' : 'Password must be at least 6 characters.');
      return;
    }

    if (step === 'signup') {
      setStep('gender');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      setPendingRedirect(upgradeTier ? `/dashboard?upgrade=${upgradeTier}` : from);
    } catch (err: any) {
      setError(
        err?.message && !err.message.startsWith('[CONVEX')
          ? err.message
          : language === 'fr'
            ? 'Une erreur est survenue. Veuillez réessayer.'
            : 'Something went wrong. Please try again.'
      );
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
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-4xl font-bold text-stone-900">
                {step === 'signin'
                  ? (language === 'fr' ? 'Connexion' : 'Sign In')
                  : step === 'gender'
                  ? (language === 'fr' ? 'Vous êtes…' : 'You are…')
                  : (language === 'fr' ? 'Créer un compte' : 'Create Account')}
              </h1>
              <p className="mt-2 text-sm text-stone-500">
                {step === 'signin'
                  ? (language === 'fr' ? 'Connectez-vous pour continuer.' : 'Sign in to continue.')
                  : step === 'gender'
                  ? (language === 'fr' ? 'Pour personnaliser votre expérience.' : 'To personalise your experience.')
                  : (language === 'fr' ? 'Rejoignez la communauté.' : 'Join the community.')}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={step}
            initial={{ opacity: 0, x: step === 'signin' ? -24 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step === 'signin' ? 24 : -24 }}
            transition={{ duration: 0.22 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {step === 'gender' && (
              <>
                <button
                  type="button"
                  onClick={() => setStep('signup')}
                  className="flex items-center gap-1.5 text-sm font-medium text-stone-400 hover:text-stone-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {language === 'fr' ? 'Retour' : 'Back'}
                </button>
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
              </>
            )}

            {step === 'signup' && (
              <div>
                <label htmlFor="name" className={labelClass}>
                  {language === 'fr' ? 'Nom' : 'Name'}
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    placeholder={language === 'fr' ? 'Votre nom' : 'Your name'}
                    className={inputClass + ' pl-10'}
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                </div>
              </div>
            )}

            {step !== 'gender' && (
              <>
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
                </div>
              </>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || (step === 'gender' && !gender)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-900 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="h-4 w-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {step === 'signin'
                    ? (language === 'fr' ? 'Se connecter' : 'Sign In')
                    : step === 'gender'
                    ? (language === 'fr' ? "S'inscrire" : 'Sign Up')
                    : (language === 'fr' ? 'Continuer' : 'Continue')}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {step !== 'gender' && (
              <p className="text-center text-sm text-stone-500 mt-4">
                {step === 'signin' ? (
                  <>
                    {language === 'fr' ? "Pas encore de compte ?" : "Don't have an account?"}{' '}
                    <button
                      type="button"
                      onClick={() => { setStep('signup'); setError(''); }}
                      className="font-semibold text-emerald-800 hover:text-emerald-700 transition-colors"
                    >
                      {language === 'fr' ? "S'inscrire" : 'Sign Up'}
                    </button>
                  </>
                ) : (
                  <>
                    {language === 'fr' ? 'Déjà un compte ?' : 'Already have an account?'}{' '}
                    <button
                      type="button"
                      onClick={() => { setStep('signin'); setError(''); }}
                      className="font-semibold text-emerald-800 hover:text-emerald-700 transition-colors"
                    >
                      {language === 'fr' ? 'Se connecter' : 'Sign In'}
                    </button>
                  </>
                )}
              </p>
            )}
          </motion.form>
        </AnimatePresence>

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
