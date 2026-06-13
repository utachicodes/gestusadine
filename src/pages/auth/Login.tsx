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
              <p className="text-sm font-medium text-stone-500 text-center mb-1">
                {language === 'fr'
                  ? 'Connectez-vous avec vos réseaux sociaux préférés'
                  : 'Login with your favorite social media accounts'}
              </p>

              {/* Google */}
              <button
                type="button"
                onClick={() => { setStep('google'); setError(''); }}
                className="w-full flex items-center gap-4 rounded-xl border-2 border-stone-200 bg-white/70 px-4 py-3.5 text-left transition-all hover:border-stone-300 hover:bg-white"
              >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm border border-stone-100">
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-stone-800">
                    {language === 'fr' ? 'Continuer avec Google' : 'Continue with Google'}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300" />
              </button>

              {/* Instagram */}
              <button
                type="button"
                onClick={() => { setStep('instagram'); setError(''); }}
                className="w-full flex items-center gap-4 rounded-xl border-2 border-stone-200 bg-white/70 px-4 py-3.5 text-left transition-all hover:border-stone-300 hover:bg-white"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm border border-stone-100" style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-stone-800">
                    {language === 'fr' ? 'Continuer avec Instagram' : 'Continue with Instagram'}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300" />
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#FAF7F0] px-2 text-stone-400">
                    {language === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
                  </span>
                </div>
              </div>

              {/* X (Twitter) - Coming Soon */}
              <button
                type="button"
                disabled
                className="w-full flex items-center gap-4 rounded-xl border-2 border-stone-100 bg-stone-50/50 px-4 py-3.5 text-left opacity-50 cursor-not-allowed"
              >
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-stone-500">X</p>
                </div>
                <span className="text-[10px] font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                  {language === 'fr' ? 'Bientôt' : 'Soon'}
                </span>
              </button>

              {/* Snapchat - Coming Soon */}
              <button
                type="button"
                disabled
                className="w-full flex items-center gap-4 rounded-xl border-2 border-stone-100 bg-stone-50/50 px-4 py-3.5 text-left opacity-50 cursor-not-allowed"
              >
                <div className="w-9 h-9 rounded-full bg-[#FFFC00] flex items-center justify-center">
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="black">
                    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.922-.214.095-.04.195-.06.3-.06.334 0 .65.136.859.365.135.15.24.33.3.51.06.18.12.36.12.54 0 .27-.09.525-.255.735a1.36 1.36 0 01-.735.435c-.105.03-.21.045-.315.045-.12 0-.255-.015-.39-.045a2.27 2.27 0 00-.63-.075c-.33 0-.66.075-.96.195a4.86 4.86 0 01-.48.15c-.18.045-.36.075-.54.075a5.13 5.13 0 01-.54-.03 3.615 3.615 0 00-1.035-.18c-.33 0-.66.06-.96.18-.195.075-.39.15-.57.195-.12.03-.24.045-.345.045-.105 0-.21-.015-.3-.03-.39-.075-.72-.285-.945-.57a1.66 1.66 0 01-.315-.9c0-.195.045-.39.12-.57.09-.21.195-.39.33-.54.15-.165.33-.3.525-.39a2.16 2.16 0 00-.36-.45c-.255-.27-.42-.615-.42-1.005 0-.345.105-.675.3-.945.21-.285.495-.51.825-.66.24-.105.495-.18.75-.21.195-.03.39-.03.57-.03h.12c.27.015.51.06.735.135l.36.12c.105.045.21.09.3.135.12.06.225.105.315.135.255.075.465.255.555.51.06.165.09.345.09.525 0 .21-.045.405-.12.585-.09.21-.195.39-.33.54a2.04 2.04 0 01-.6.405c.06.105.12.225.165.345.165.405.255.84.255 1.29 0 .18-.015.36-.045.54a4.68 4.68 0 01-.12.51c.045.075.09.15.12.225.12.3.18.615.18.93 0 .255-.045.495-.12.72a1.875 1.875 0 01-.48.72c-.21.195-.45.345-.72.45-.27.105-.555.165-.84.18-.18.015-.36.015-.54.015-.39 0-.765-.045-1.125-.12a5.745 5.745 0 00-.96-.09c-.33 0-.66.03-.975.09-.3.06-.585.12-.855.15-.255.03-.495.045-.72.045-.135 0-.27-.015-.39-.03-.345-.045-.66-.165-.915-.345a1.635 1.635 0 01-.51-.615c-.105-.24-.165-.51-.165-.78 0-.27.06-.53.165-.765.12-.255.285-.48.48-.66.21-.195.45-.345.72-.45.27-.105.555-.165.84-.18.18-.015.36-.015.54-.015.39 0 .765.045 1.125.12.36.06.69.12.99.15.225.015.435.03.63.03.375 0 .72-.06 1.035-.18.27-.105.51-.255.705-.435.195-.195.33-.42.39-.675.06-.24.075-.495.075-.75 0-.24-.045-.465-.12-.675a2.1 2.1 0 00-.36-.6c.24-.15.45-.33.615-.54.21-.27.345-.585.39-.93.03-.21.045-.42.045-.63 0-.36-.075-.705-.21-1.02a2.235 2.235 0 00-.6-.735c.21-.18.375-.39.495-.63.15-.3.225-.63.225-.96 0-.33-.075-.645-.21-.93a2.37 2.37 0 00-.6-.705c.21-.18.375-.39.495-.63.15-.3.225-.63.225-.96 0-.12-.015-.24-.045-.36-.12-.6-.48-1.065-.945-1.365-.39-.24-.84-.36-1.32-.39a7.77 7.77 0 00-.87.015c-.39.03-.765.09-1.125.18-.345.09-.675.195-.975.33-.285.12-.54.27-.765.435-.21.165-.39.345-.525.54-.12.18-.21.375-.255.57-.045.195-.06.39-.06.57 0 .195.03.39.075.57.06.195.135.375.24.54.12.165.255.315.405.435.165.135.345.24.525.315.195.075.39.12.585.12.12 0 .24-.015.345-.045.12-.03.225-.075.33-.12.195-.09.375-.195.54-.33.21-.165.375-.375.495-.615.12-.24.18-.51.18-.78 0-.27-.06-.53-.165-.765a2.16 2.16 0 00-.48-.66c.15-.15.27-.33.36-.525.12-.255.18-.525.18-.795 0-.255-.045-.51-.135-.75a1.89 1.89 0 00-.405-.6c.15-.15.27-.33.36-.525.12-.255.18-.525.18-.795 0-.12-.015-.24-.045-.36-.105-.555-.42-.975-.825-1.23-.345-.21-.735-.315-1.14-.33a6.465 6.465 0 00-.78.015c-.345.03-.675.09-.99.18-.3.09-.585.195-.84.33-.24.12-.45.27-.63.435-.165.165-.3.345-.39.54-.09.195-.15.39-.15.585 0 .195.045.39.12.57.09.195.195.375.33.525.15.165.33.3.525.39.195.09.39.135.585.135.12 0 .24-.015.345-.045.12-.03.225-.075.33-.12.195-.09.375-.195.54-.33.21-.165.375-.375.495-.615.12-.24.18-.51.18-.78 0-.27-.06-.53-.165-.765a2.16 2.16 0 00-.48-.66c.15-.15.27-.33.36-.525.12-.255.18-.525.18-.795 0-.255-.045-.51-.135-.75a1.89 1.89 0 00-.405-.6c.15-.15.27-.33.36-.525.12-.255.18-.525.18-.795z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-stone-500">Snapchat</p>
                </div>
                <span className="text-[10px] font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                  {language === 'fr' ? 'Bientôt' : 'Soon'}
                </span>
              </button>

              {/* GitHub - Coming Soon */}
              <button
                type="button"
                disabled
                className="w-full flex items-center gap-4 rounded-xl border-2 border-stone-100 bg-stone-50/50 px-4 py-3.5 text-left opacity-50 cursor-not-allowed"
              >
                <div className="w-9 h-9 rounded-full bg-[#24292e] flex items-center justify-center">
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-stone-500">GitHub</p>
                </div>
                <span className="text-[10px] font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                  {language === 'fr' ? 'Bientôt' : 'Soon'}
                </span>
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
