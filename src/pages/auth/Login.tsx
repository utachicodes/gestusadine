import React, { useState } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useAuth, type Gender } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, UserPlus, LogIn, Eye, EyeOff, User, Users } from 'lucide-react';

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white/70 px-4 py-2.5 text-base text-stone-900 placeholder-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 outline-none transition';
const labelClass = 'block text-sm font-medium text-stone-600 mb-1.5';

type Mode = 'signin' | 'signup';
type SignupStep = 'credentials' | 'gender';

const MIN_PASSWORD = 8;

const Login = () => {
  const [mode, setMode] = useState<Mode>('signin');
  const [step, setStep] = useState<SignupStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const { language } = useLanguage();

  const passwordChecks = React.useMemo(() => [
    { label: language === 'fr' ? 'Min. 8 caractères' : 'Min. 8 characters', check: password.length >= 8 },
    { label: language === 'fr' ? '1 majuscule' : '1 uppercase letter', check: /[A-Z]/.test(password) },
    { label: language === 'fr' ? '1 chiffre' : '1 number', check: /[0-9]/.test(password) },
    { label: language === 'fr' ? '1 caractère spécial' : '1 special character', check: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
  ], [password, language]);

  const { signInWithPassword, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) {
      return language === 'fr'
        ? 'Le mot de passe doit contenir un caractère spécial.'
        : 'Password must contain a special character.';
    }
    return null;
  };

  const handleCredentialsNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError(language === 'fr' ? 'Veuillez entrer votre nom complet.' : 'Please enter your full name.');
        return;
      }
      const pwError = validatePassword(password);
      if (pwError) { setError(pwError); return; }
      setStep('gender');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signInWithPassword({ email, password });
      setPendingRedirect(upgradeTier ? `/dashboard?upgrade=${upgradeTier}` : from);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError('');
    setIsLoading(true);
    try {
      const { error: signUpError } = await signUp({
        email,
        password,
        fullName,
        gender: gender ?? undefined,
      });
      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }
      switchMode();
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setStep('credentials');
    setGender(null);
    setError('');
  };

  const goBackToCredentials = () => {
    setStep('credentials');
    setError('');
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
              key={mode + step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {step === 'gender' ? (
                <>
                  <h1 className="text-4xl font-bold text-stone-900">
                    {language === 'fr' ? 'Dernière étape' : 'One last step'}
                  </h1>
                  <p className="mt-2 text-sm text-stone-500">
                    {language === 'fr'
                      ? 'Cela nous aide à personnaliser votre expérience.'
                      : 'This helps us personalise your experience.'}
                  </p>
                </>
              ) : (
                <>
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
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mode tabs — only show on credentials step */}
        {step === 'credentials' && (
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
        )}

        <AnimatePresence mode="wait">
          {step === 'gender' ? (
            /* ── Gender selection step ── */
            <motion.div
              key="gender-step"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
            >
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-stone-600 mb-3">
                  {language === 'fr' ? 'Je suis…' : 'I am…'}
                </p>
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`w-full flex items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left transition-all ${
                    gender === 'male'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                      : 'border-stone-200 bg-white/70 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    gender === 'male' ? 'bg-emerald-100' : 'bg-stone-100'
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{language === 'fr' ? 'Un homme' : 'Male'}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {language === 'fr' ? 'Journal & outils islamiques' : 'Journal & Islamic tools'}
                    </p>
                  </div>
                  {gender === 'male' && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`w-full flex items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left transition-all ${
                    gender === 'female'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                      : 'border-stone-200 bg-white/70 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    gender === 'female' ? 'bg-emerald-100' : 'bg-stone-100'
                  }`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{language === 'fr' ? 'Une femme' : 'Female'}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {language === 'fr' ? 'Journal, cycle & outils islamiques' : 'Journal, cycle & Islamic tools'}
                    </p>
                  </div>
                  {gender === 'female' && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-stone-400 text-center mb-4">
                {language === 'fr'
                  ? 'Optionnel — vous pouvez modifier cela plus tard dans vos paramètres.'
                  : 'Optional — you can change this later in your settings.'}
              </p>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={goBackToCredentials}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-stone-300 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {language === 'fr' ? 'Retour' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="flex-[2] flex items-center justify-center gap-2 rounded-lg bg-emerald-900 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
                      {language === 'fr' ? 'Patientez...' : 'Please wait...'}
                    </>
                  ) : (
                    <>
                      {language === 'fr' ? 'Créer mon compte' : 'Create account'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            /* ── Credentials step ── */
            <motion.form
              key="credentials-step"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.22 }}
              onSubmit={mode === 'signin' ? handleSignIn : handleCredentialsNext}
              className="space-y-4"
            >
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
                <div className="relative">
                  <input
                    id="password"
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
                {mode === 'signup' && (
                  <ul className="text-[11px] mt-1.5 space-y-1">
                    {passwordChecks.map((item, i) => (
                      <li key={i} className={`flex items-center gap-1.5 ${item.check ? 'text-emerald-600' : 'text-stone-400'}`}>
                        <span className="text-xs">{item.check ? '✓' : '•'}</span>
                        {item.label}
                      </li>
                    ))}
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
                ) : mode === 'signin' ? (
                  <>
                    {language === 'fr' ? 'Se connecter' : 'Sign in'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    {language === 'fr' ? 'Continuer' : 'Continue'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
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
