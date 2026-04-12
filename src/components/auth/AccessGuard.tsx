import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, SubscriptionTier } from '@/auth/AuthContext';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AccessGuardProps {
  children: React.ReactNode;
  requiredTier: SubscriptionTier;
  fallback?: React.ReactNode;
}

const TIER_STRENGTH: Record<SubscriptionTier, number> = {
  free: 0,
  student: 1,
  institution: 2,
};

export const AccessGuard: React.FC<AccessGuardProps> = ({ 
  children, 
  requiredTier, 
  fallback 
}) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    );
  }

  const userTierStrength = TIER_STRENGTH[profile?.subscription_tier || 'free'];
  const requiredTierStrength = TIER_STRENGTH[requiredTier];

  const hasAccess = userTierStrength >= requiredTierStrength;

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-8 rounded-[2rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 text-center"
      >
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
          <Lock className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-black text-slate-950 mb-3 tracking-tight">
          Upgrade Required
        </h2>
        
        <p className="text-slate-500 font-medium mb-8 leading-relaxed">
          Access to this specialized feature requires a <span className="text-slate-950 font-bold capitalize">{requiredTier}</span> subscription. Expand your knowledge circle today.
        </p>

        <div className="space-y-4">
          <Link
            to="/#pricing"
            className="w-full btn-saas-primary flex items-center justify-center gap-2"
          >
            See Pricing Plans
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link
            to="/dashboard"
            className="block text-sm font-bold text-slate-400 hover:text-slate-950 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
