import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, ArrowRight, CheckCircle2, AlertCircle, ChevronLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // States: 'signin' | 'signup' | 'forgot-password'
  const [view, setView] = useState<'signin' | 'signup' | 'forgot-password'>('signin');

  const { signInWithPassword, signUp, resetPassword, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
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
        if (!email) {
          throw new Error('Please enter your email address.');
        }
        await resetPassword(email);
        toast({
          title: t('common.email_sent') || "Email Sent",
          description: t('login.reset_email_sent') || "Check your inbox for password reset instructions.",
        });
        setView('signin');
      } else if (view === 'signup') {
        if (!fullName.trim()) {
          throw new Error(t('login.full_name_required') || 'Full name is required');
        }
        const result = await signUp({ email, password, fullName: fullName.trim() });
        if (result.error) throw result.error;

        toast({
          title: t('common.welcome') || "Welcome!",
          description: t('login.success_signed_up') || "Account created successfully.",
        });
        // Auto navigate handled by auth state change usually, but we can force it
      } else {
        await signInWithPassword({ email, password });
        await refreshProfile();
        toast({
          title: t('common.welcome_back') || "Welcome back",
          description: t('login.success_signed_in') || "Signed in successfully.",
        });
        navigate(upgradeTier ? `/dashboard?upgrade=${upgradeTier}` : '/');
      }
    } catch (error: any) {
      toast({
        title: t('common.error') || "Error",
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card border border-border/50 shadow-xl rounded-2xl p-8 md:p-10 backdrop-blur-sm">

          {/* Header Area */}
          <div className="text-center mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {view === 'signin' && (
                  <>
                    <h1 className="text-2xl font-bold tracking-tight mb-2">{t('login.title') || "Welcome Back"}</h1>
                    <p className="text-muted-foreground text-sm">{t('login.subtitle') || "Sign in to your account"}</p>
                  </>
                )}
                {view === 'signup' && (
                  <>
                    <h1 className="text-2xl font-bold tracking-tight mb-2">{t('login.create_account_title') || "Create Account"}</h1>
                    <p className="text-muted-foreground text-sm">{t('login.create_account_subtitle') || "Join our community today"}</p>
                  </>
                )}
                {view === 'forgot-password' && (
                  <>
                    <h1 className="text-2xl font-bold tracking-tight mb-2">{t('login.forgot_password') || "Reset Password"}</h1>
                    <p className="text-muted-foreground text-sm">{t('login.reset_desc') || "Enter your email to receive reset instructions"}</p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {view === 'signup' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 mb-4">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('login.full_name') || "Full Name"}</label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="bg-background/50"
                      required={view === 'signup'}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('login.email') || "Email"}</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="bg-background/50"
                required
              />
            </div>

            {view !== 'forgot-password' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('login.password') || "Password"}</label>
                  {view === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setView('forgot-password')}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      {t('login.forgot_password') || "Forgot password?"}
                    </button>
                  )}
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>
            )}

            <Button disabled={isLoading} type="submit" className="w-full mt-6" size="lg">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {t('login.processing') || "Processing..."}
                </span>
              ) : (
                <>
                  {view === 'signin' && (t('login.sign_in') || "Sign In")}
                  {view === 'signup' && (t('login.sign_up') || "Sign Up")}
                  {view === 'forgot-password' && (t('login.send_reset_link') || "Send Reset Link")}
                </>
              )}
            </Button>
          </form>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-4 text-sm text-muted-foreground">
            {view === 'signin' ? (
              <p>
                {t('login.no_account') || "Don't have an account?"}{" "}
                <button onClick={() => setView('signup')} className="text-primary hover:underline font-medium">
                  {t('login.sign_up') || "Sign up"}
                </button>
              </p>
            ) : view === 'signup' ? (
              <p>
                {t('login.already_account') || "Already have an account?"}{" "}
                <button onClick={() => setView('signin')} className="text-primary hover:underline font-medium">
                  {t('login.sign_in') || "Sign in"}
                </button>
              </p>
            ) : (
              <button onClick={() => setView('signin')} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <ChevronLeft className="w-4 h-4" />
                {t('login.back_to_login') || "Back to login"}
              </button>
            )}
          </div>
        </div>

        {/* Simple Legal Text */}
        <p className="text-center text-xs text-muted-foreground mt-8 opacity-60">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
