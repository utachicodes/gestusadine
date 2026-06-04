import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft } from 'lucide-react';

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white/70 px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 outline-none transition';
const labelClass = 'block text-sm font-medium text-stone-600 mb-1.5';

const COPY = {
  signin: {
    en: { title: 'Welcome back', subtitle: 'Sign in to continue your journey.', cta: 'Sign in' },
    fr: { title: 'Bon retour', subtitle: 'Connectez-vous pour continuer votre cheminement.', cta: 'Se connecter' },
  },
  signup: {
    en: { title: 'Create your account', subtitle: 'Join a circle of seekers.', cta: 'Create account' },
    fr: { title: 'Créez votre compte', subtitle: 'Rejoignez un cercle de chercheurs.', cta: 'Créer le compte' },
  },
  'forgot-password': {
    en: { title: 'Reset password', subtitle: 'We’ll email you a reset link.', cta: 'Send reset link' },
    fr: { title: 'Réinitialiser', subtitle: 'Nous vous enverrons un lien de réinitialisation.', cta: 'Envoyer le lien' },
  },
} as const;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'signin' | 'signup' | 'forgot-password'>('signin');

  const { signInWithPassword, signUp, resetPassword, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const upgradeTier = searchParams.get('upgrade');

  const getErrorMessage = (error: any) => {
    const msg = error?.message || error?.toString() || '';
    if (msg.includes('auth/invalid-email')) return t('login.error_invalid_email') || 'Invalid email address.';
    if (msg.includes('auth/user-not-found')) return t('login.error_user_not_found') || 'No user found with this email.';
    if (msg.includes('auth/wrong-password')) return t('login.error_wrong_password') || 'Incorrect password.';
    if (msg.includes('auth/email-already-in-use')) return t('login.error_email_in_use') || 'Email is already in use.';
    if (msg.includes('auth/weak-password')) return t('login.error_weak_password') || 'Password should be at least 6 characters.';
    return t('login.error_generic') || 'An error occurred. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (view === 'forgot-password') {
        if (!email) throw new Error('Please enter your email address.');
        await resetPassword(email);
        toast({
          title: t('common.email_sent') || 'Email sent',
          description: t('login.reset_email_sent') || 'Check your inbox for reset instructions.',
        });
        setView('signin');
      } else if (view === 'signup') {
        if (!fullName.trim()) throw new Error(t('login.full_name_required') || 'Full name is required');
        const result = await signUp({ email, password, fullName: fullName.trim() });
        if (result.error) throw result.error;
        toast({
          title: t('common.welcome') || 'Welcome',
          description: t('login.success_signed_up') || 'Account created successfully.',
        });
      } else {
        await signInWithPassword({ email, password });
        await refreshProfile();
        toast({
          title: t('common.welcome_back') || 'Welcome back',
          description: t('login.success_signed_in') || 'Signed in successfully.',
        });
        navigate(upgradeTier ? `/dashboard?upgrade=${upgradeTier}` : '/');
      }
    } catch (error: any) {
      toast({ title: t('common.error') || 'Error', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const copy = COPY[view][language];

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
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-4xl font-bold text-stone-900">{copy.title}</h1>
              <p className="mt-2 text-sm text-stone-500">{copy.subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'signup' && (
            <div>
              <label htmlFor="fullName" className={labelClass}>{t('login.full_name') || 'Full name'}</label>
              <input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aïssatou Diallo"
                className={inputClass}
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className={labelClass}>{t('login.email') || 'Email'}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={inputClass}
              required
            />
          </div>

          {view !== 'forgot-password' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-medium text-stone-600">{t('login.password') || 'Password'}</label>
                {view === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setView('forgot-password')}
                    className="text-sm font-medium text-emerald-800 hover:text-emerald-700 transition-colors"
                  >
                    {t('login.forgot_password') || 'Forgot?'}
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-emerald-900 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
                {t('login.processing') || 'Please wait…'}
              </>
            ) : (
              <>
                {copy.cta}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-200 text-center text-sm text-stone-500">
          {view === 'signin' ? (
            <p>
              {t('login.no_account') || 'New here?'}{' '}
              <button onClick={() => setView('signup')} className="font-semibold text-emerald-800 hover:text-emerald-700 transition-colors">
                {t('login.sign_up') || 'Create an account'}
              </button>
            </p>
          ) : view === 'signup' ? (
            <p>
              {t('login.already_account') || 'Already a member?'}{' '}
              <button onClick={() => setView('signin')} className="font-semibold text-emerald-800 hover:text-emerald-700 transition-colors">
                {t('login.sign_in') || 'Sign in'}
              </button>
            </p>
          ) : (
            <button onClick={() => setView('signin')} className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              {t('login.back_to_login') || 'Back to sign in'}
            </button>
          )}
        </div>

        <p className="text-center text-xs text-stone-400 mt-8 leading-relaxed">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="underline underline-offset-2 hover:text-stone-600">Terms</Link> and{' '}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-stone-600">Privacy</Link>.
        </p>
      </div>
    </div>
  );
};

export default Login;
