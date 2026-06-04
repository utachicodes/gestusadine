import React, { useState } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft } from 'lucide-react';

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white/70 px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 outline-none transition';
const labelClass = 'block text-sm font-medium text-stone-600 mb-1.5';

const COPY = {
  en: { title: 'Welcome back', subtitle: 'Sign in to continue your journey.', cta: 'Sign in' },
  fr: { title: 'Bon retour', subtitle: 'Connectez-vous pour continuer votre cheminement.', cta: 'Se connecter' },
} as const;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signInWithPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const upgradeTier = searchParams.get('upgrade');
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard';

  const getErrorMessage = (error: any) => {
    const msg = error?.message || error?.toString() || '';
    if (msg.includes('auth/invalid-email')) return 'Invalid email address.';
    if (msg.includes('auth/user-not-found')) return 'No user found with this email.';
    if (msg.includes('auth/wrong-password')) return 'Incorrect password.';
    if (msg.includes('auth/email-already-in-use')) return 'Email is already in use.';
    if (msg.includes('auth/weak-password')) return 'Password should be at least 6 characters.';
    return 'An error occurred. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithPassword({ email, password });
      toast({
        title: 'Welcome back',
        description: 'Signed in successfully.',
      });
      navigate(upgradeTier ? `/dashboard?upgrade=${upgradeTier}` : from, { replace: true });
    } catch (error: any) {
      toast({ title: 'Error', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const copy = COPY[language];

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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-stone-900">{copy.title}</h1>
            <p className="mt-2 text-sm text-stone-500">{copy.subtitle}</p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
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

          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-emerald-900 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
                Please wait...
              </>
            ) : (
              <>
                {copy.cta}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

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
