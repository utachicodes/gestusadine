import React, { useState } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Eye, EyeOff, ArrowRight, Mail, AtSign } from 'lucide-react';

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white/70 px-4 py-2.5 text-base text-stone-900 placeholder-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 outline-none transition';
const labelClass = 'block text-sm font-medium text-stone-600 mb-1.5';

type Step = 'choose' | 'google' | 'instagram';

const Login = () => {
  const [step, setStep] = useState<Step>('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [igUsername, setIgUsername] = useState('');
  const [igPassword, setIgPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showIgPassword, setShowIgPassword] = useState(false);

  const { signInWithGoogle, signInWithInstagram, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const upgradeTier = searchParams.get('upgrade');
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard';
  const { language } = useLanguage();

  React.useEffect(() => {
    if (pendingRedirect && !loading && user) {
      navigate(pendingRedirect, { replace: true });
    }
  }, [pendingRedirect, loading, user, navigate]);

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError(language === 'fr' ? 'Veuillez remplir tous les champs.' : 'Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    try {
      await signInWithGoogle(email, password);
      setPendingRedirect(upgradeTier ? `/dashboard?upgrade=${upgradeTier}` : from);
    } catch (err: any) {
      setError(
        err?.message && !err.message.startsWith('[CONVEX')
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstagramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!igUsername.trim() || !igPassword.trim()) {
      setError(language === 'fr' ? 'Veuillez remplir tous les champs.' : 'Please fill in all fields.');
      return;
    }
    if (!/^[a-zA-Z0-9._]{1,30}$/.test(igUsername)) {
      setError(
        language === 'fr'
          ? "Nom d'utilisateur invalide. Utilisez uniquement des lettres, chiffres, points et underscores."
          : 'Invalid username. Use only letters, numbers, dots, and underscores.'
      );
      return;
    }
    setIsLoading(true);
    try {
      await signInWithInstagram(igUsername, igPassword);
      setPendingRedirect(upgradeTier ? `/dashboard?upgrade=${upgradeTier}` : from);
    } catch (err: any) {
      setError(
        err?.message && !err.message.startsWith('[CONVEX')
          ? err.message
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
              {step === 'choose' ? (
                <>
                  <h1 className="text-4xl font-bold text-stone-900">
                    {language === 'fr' ? 'Bienvenue' : 'Welcome'}
                  </h1>
                  <p className="mt-2 text-sm text-stone-500">
                    {language === 'fr'
                      ? 'Connectez-vous pour continuer.'
                      : 'Sign in to continue.'}
                  </p>
                </>
              ) : step === 'google' ? (
                <>
                  <h1 className="text-4xl font-bold text-stone-900">
                    {language === 'fr' ? 'Connexion Google' : 'Google Sign In'}
                  </h1>
                  <p className="mt-2 text-sm text-stone-500">
                    {language === 'fr'
                      ? 'Entrez votre email et mot de passe Google.'
                      : 'Enter your Google email and password.'}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-stone-900">
                    {language === 'fr' ? 'Connexion Instagram' : 'Instagram Sign In'}
                  </h1>
                  <p className="mt-2 text-sm text-stone-500">
                    {language === 'fr'
                      ? 'Entrez vos identifiants Instagram.'
                      : 'Enter your Instagram credentials.'}
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {step === 'choose' ? (
            <motion.div
              key="choose"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.22 }}
              className="space-y-3"
            >
              {/* Google button */}
              <button
                type="button"
                onClick={() => { setStep('google'); setError(''); }}
                className="w-full flex items-center gap-4 rounded-xl border-2 border-stone-200 bg-white/70 px-4 py-4 text-left transition-all hover:border-stone-300 hover:bg-white"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-stone-100">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-stone-800">
                    {language === 'fr' ? 'Continuer avec Google' : 'Continue with Google'}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {language === 'fr' ? 'Email et mot de passe' : 'Email & password'}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 ml-auto" />
              </button>

              {/* Instagram button */}
              <button
                type="button"
                onClick={() => { setStep('instagram'); setError(''); }}
                className="w-full flex items-center gap-4 rounded-xl border-2 border-stone-200 bg-white/70 px-4 py-4 text-left transition-all hover:border-stone-300 hover:bg-white"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-stone-100" style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-stone-800">
                    {language === 'fr' ? 'Continuer avec Instagram' : 'Continue with Instagram'}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {language === 'fr' ? "Nom d'utilisateur et mot de passe" : 'Username & password'}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 ml-auto" />
              </button>
            </motion.div>
          ) : step === 'google' ? (
            <motion.form
              key="google-form"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              onSubmit={handleGoogleSubmit}
              className="space-y-4"
            >
              <div>
                <label htmlFor="g-email" className={labelClass}>Email</label>
                <div className="relative">
                  <input
                    id="g-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="name@gmail.com"
                    className={inputClass + ' pl-10'}
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                </div>
              </div>

              <div>
                <label htmlFor="g-password" className={labelClass}>
                  {language === 'fr' ? 'Mot de passe' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    id="g-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    className={inputClass + ' pr-10'}
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
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setStep('choose'); setError(''); setEmail(''); setPassword(''); }}
                  className="flex-shrink-0 flex items-center justify-center gap-2 rounded-lg border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-900 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <span className="h-4 w-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {language === 'fr' ? 'Se connecter' : 'Sign in'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="instagram-form"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              onSubmit={handleInstagramSubmit}
              className="space-y-4"
            >
              <div>
                <label htmlFor="ig-username" className={labelClass}>
                  {language === 'fr' ? "Nom d'utilisateur" : 'Username'}
                </label>
                <div className="relative">
                  <input
                    id="ig-username"
                    type="text"
                    value={igUsername}
                    onChange={(e) => { setIgUsername(e.target.value); setError(''); }}
                    placeholder="username"
                    className={inputClass + ' pl-10'}
                    required
                  />
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                </div>
              </div>

              <div>
                <label htmlFor="ig-password" className={labelClass}>
                  {language === 'fr' ? 'Mot de passe' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    id="ig-password"
                    type={showIgPassword ? 'text' : 'password'}
                    value={igPassword}
                    onChange={(e) => { setIgPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    className={inputClass + ' pr-10'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowIgPassword(!showIgPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showIgPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setStep('choose'); setError(''); setIgUsername(''); setIgPassword(''); }}
                  className="flex-shrink-0 flex items-center justify-center gap-2 rounded-lg border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-900 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <span className="h-4 w-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {language === 'fr' ? 'Se connecter' : 'Sign in'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
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
