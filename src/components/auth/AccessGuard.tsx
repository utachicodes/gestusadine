import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, SubscriptionTier } from '@/auth/AuthContext';
import { Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTr, type Loc } from '@/lib/i18n';
import { tierRank } from '@/data/subscription';

interface AccessGuardProps {
  children: React.ReactNode;
  requiredTier: SubscriptionTier;
  fallback?: React.ReactNode;
}

const TIER_LABEL: Record<SubscriptionTier, Loc> = {
  free: { en: 'Seeker', fr: 'Chercheur' },
  student: { en: 'Student', fr: 'Étudiant' },
  institution: { en: 'Institution', fr: 'Institution' },
};

export const AccessGuard: React.FC<AccessGuardProps> = ({
  children,
  requiredTier,
  fallback,
}) => {
  const { profile, loading } = useAuth();
  const tr = useTr();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-800" />
      </div>
    );
  }

  const hasAccess = tierRank(profile?.subscription_tier || 'free') >= tierRank(requiredTier);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const tierName = tr(TIER_LABEL[requiredTier]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 bg-[#FAF7F0]">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full p-10 rounded-2xl border border-stone-200 bg-white shadow-xl shadow-emerald-900/5 text-center"
      >
        <div className="w-14 h-14 bg-emerald-900/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-800">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="text-3xl text-stone-900 mb-3">
          {tr({ en: 'A paid plan unlocks this', fr: 'Une offre payante débloque ceci' })}
        </h2>

        <p className="text-stone-500 leading-relaxed mb-8">
          {tr({
            en: `This feature is part of the ${tierName} plan. Expand your circle of knowledge when you’re ready.`,
            fr: `Cette fonctionnalité fait partie de l’offre ${tierName}. Élargissez votre cercle du savoir quand vous le souhaitez.`,
          })}
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/pricing')}
            className="btn-push w-full flex items-center justify-center gap-2"
          >
            {tr({ en: 'See pricing plans', fr: 'Voir les offres' })}
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="block w-full text-sm font-semibold text-stone-400 hover:text-emerald-800 transition-colors"
          >
            {tr({ en: 'Return to dashboard', fr: 'Retour au tableau de bord' })}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
