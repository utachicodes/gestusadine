import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Sparkles, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithPassword, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { refreshProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          toast({
            title: t('common.error'),
            description: t('login.full_name_required') || 'Full name is required',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
        const result = await signUp({ email, password, fullName: fullName.trim() });
        if (result.error) {
          throw result.error;
        }
        toast({
          title: t('common.success'),
          description: t('login.success_signed_up'),
        });
        setIsSignUp(false); 
      } else {
        await signInWithPassword({ email, password });
        // Refresh profile to ensure admin status is updated
        await refreshProfile();
        // Navigate after profile refresh
        navigate('/');
        toast({
          title: t('common.success'),
          description: t('login.success_signed_in'),
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('login.failed_desc');
      toast({
        title: t('common.error'),
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-sand-50 via-white to-sand-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-islamic-primary-green/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-islamic-primary-gold/10 blur-3xl rounded-full" />
      </motion.div>

      <div className="container relative z-10 py-16">
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-center gap-2 mb-8">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                !isSignUp ? 'bg-[#efefec] dark:bg-slate-800 text-islamic-dark dark:text-slate-100 border border-islamic-primary-green dark:border-islamic-green shadow' : 'bg-sand-200 dark:bg-slate-700 text-islamic-dark dark:text-slate-300'
              }`}
            >
              <LogIn className="w-4 h-4" />
              {t('login.sign_in')}
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                isSignUp ? 'bg-[#efefec] dark:bg-slate-800 text-islamic-dark dark:text-slate-100 border border-islamic-primary-gold dark:border-islamic-gold shadow' : 'bg-sand-200 dark:bg-slate-700 text-islamic-dark dark:text-slate-300'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              {t('login.sign_up')}
            </button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-islamic-dark dark:text-slate-100">
            {isSignUp ? t('login.create_account_title') : t('login.title')}
          </h1>
          <p className="text-center text-islamic-dark/70 dark:text-slate-300 mt-2">
            {isSignUp ? t('login.create_account_subtitle') : t('login.subtitle')}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="max-w-xl mx-auto mt-10 space-y-6"
        >
          {isSignUp && (
            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                {t('login.full_name') || 'Full Name'}
              </label>
              <Input
                id="full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                required={isSignUp}
                aria-required={isSignUp}
                className="w-full px-4 py-3 border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded-lg focus:ring-islamic-primary-green focus:border-islamic-primary-green"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                aria-label="Full name"
              />
            </div>
          )}
          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              {t('login.email')}
            </label>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-required="true"
              className="w-full px-4 py-3 border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded-lg focus:ring-islamic-primary-green focus:border-islamic-primary-green"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              {t('login.password')}
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                aria-required="true"
                className="w-full px-4 py-3 pr-10 border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded-lg focus:ring-islamic-primary-green focus:border-islamic-primary-green"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {!isSignUp && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-islamic-primary-green focus:ring-islamic-primary-green border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-slate-200">
                  {t('login.remember_me')}
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-islamic-primary-green dark:text-islamic-green hover:text-islamic-primary-gold dark:hover:text-islamic-gold">
                  {t('login.forgot_password')}
                </a>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 text-sm font-semibold rounded-lg text-islamic-dark dark:text-slate-100 bg-[#efefec] dark:bg-slate-800 border transition-all ${
              isSignUp ? 'border-islamic-primary-gold dark:border-islamic-gold hover:bg-islamic-primary-gold/10 dark:hover:bg-islamic-gold/20' : 'border-islamic-primary-green dark:border-islamic-green hover:bg-islamic-primary-green/10 dark:hover:bg-islamic-green/20'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-islamic-primary-green dark:focus:ring-islamic-green active:scale-98`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="h-5 w-5 border-2 border-islamic-dark dark:border-slate-300 border-t-transparent rounded-full animate-spin" />
                <span>{t('login.processing')}</span>
              </div>
            ) : (
              <span>{isSignUp ? t('login.sign_up') : t('login.sign_in')}</span>
            )}
          </Button>
        </motion.form>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-[#efefec]/60 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-islamic-primary-green dark:bg-islamic-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 bg-islamic-primary-gold dark:bg-islamic-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 bg-islamic-primary-teal dark:bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-islamic-dark/80 dark:text-slate-200">{t('login.processing')}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
