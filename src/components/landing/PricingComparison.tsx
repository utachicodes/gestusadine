import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { useTr, type Loc } from '@/lib/i18n';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '@/auth/AuthContext';
import { toast } from 'sonner';

const ease = [0.22, 1, 0.36, 1] as const;

type Tier = {
  name: Loc;
  price: Loc;
  unit?: Loc;
  description: Loc;
  features: Loc[];
  cta: Loc;
  to: string;
  popular: boolean;
};

const tiers: Tier[] = [
  {
    name: { en: 'Seeker', fr: 'Chercheur' },
    price: { en: 'Free', fr: 'Gratuit' },
    description: { en: 'For anyone beginning their journey.', fr: 'Pour celles et ceux qui débutent.' },
    features: [
      { en: 'The public library', fr: 'La bibliothèque publique' },
      { en: 'A taste of the Council', fr: 'Un aperçu du Conseil' },
      { en: 'Daily ayah & dua', fr: 'Verset et invocation du jour' },
      { en: 'Daily quiz & prayer times', fr: 'Quiz quotidien & horaires de prière' },
    ],
    cta: { en: 'Start free', fr: 'Commencer' },
    to: '/login',
    popular: false,
  },
  {
    name: { en: 'Student', fr: 'Étudiant' },
    price: { en: '5,000', fr: '5 000' },
    unit: { en: 'FCFA / mo', fr: 'FCFA / mois' },
    description: { en: 'For those who want to go deeper.', fr: 'Pour aller plus loin.' },
    features: [
      { en: '500 Council questions / month', fr: '500 questions au Conseil / mois' },
      { en: 'Full scholarly archives', fr: 'Archives savantes complètes' },
      { en: 'Courses & classes', fr: 'Cours et leçons' },
      { en: 'Wellness tools & cycle tracker', fr: 'Outils bien-être & suivi de cycle' },
    ],
    cta: { en: 'Join the circle', fr: 'Rejoindre le cercle' },
    to: '/login',
    popular: true,
  },
  {
    name: { en: 'Pro', fr: 'Pro' },
    price: { en: 'Custom', fr: 'Sur mesure' },
    description: { en: 'For mosques, schools, and organisations.', fr: 'Pour mosquées, écoles et organisations.' },
    features: [
      { en: 'Multi-user console', fr: 'Console multi-utilisateurs' },
      { en: 'Private knowledge base', fr: 'Base de connaissances privée' },
      { en: 'White-labelled library', fr: 'Bibliothèque en marque blanche' },
      { en: 'Priority support', fr: 'Support prioritaire' },
    ],
    cta: { en: 'Contact us', fr: 'Nous contacter' },
    to: '/contact',
    popular: false,
  },
];

const PricingComparison = () => {
  const navigate = useNavigate();
  const tr = useTr();
  const { user, profile } = useAuth();
  const createCheckout = useAction(api.naboopay.createCheckoutSession);
  const [loading, setLoading] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (profile?.subscription_tier === 'pro') {
      navigate('/dashboard');
      return;
    }
    setShowMaintenanceModal(true);
  };

  return (
    <section className="bg-[#FAF7F0] py-28">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-800/70 mb-4">
            {tr({ en: 'Pricing', fr: 'Tarifs' })}
          </p>
          <h2 className="text-4xl sm:text-5xl leading-tight text-stone-900">
            {tr({ en: 'Begin free. Grow when you\'re ready.', fr: 'Gratuit pour commencer. Évoluez à votre rythme.' })}
          </h2>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name.en}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, ease, delay: i * 0.08 }}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                tier.popular
                  ? 'border-emerald-800/30 bg-white shadow-xl shadow-emerald-900/5'
                  : 'border-stone-200 bg-white/40'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-8 rounded-full bg-emerald-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FAF7F0]">
                  {tr({ en: 'Most chosen', fr: 'Le plus choisi' })}
                </span>
              )}

              <h3 className="text-2xl text-stone-900">{tr(tier.name)}</h3>
              <p className="mt-1 text-sm text-stone-500">{tr(tier.description)}</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl text-stone-900">{tr(tier.price)}</span>
                {tier.unit && <span className="text-sm font-medium text-stone-400">{tr(tier.unit)}</span>}
              </div>

              <div className="my-7 h-px bg-stone-200" />

              <ul className="flex-1 space-y-3.5">
                {tier.features.map((f) => (
                  <li key={f.en} className="flex items-start gap-3 text-sm text-stone-600">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700" />
                    <span>{tr(f)}</span>
                  </li>
                ))}
              </ul>

              {tier.popular ? (
                <button onClick={handleSubscribe} disabled={loading} className="btn-push mt-8 w-full inline-flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {tr(tier.cta)}
                </button>
              ) : (
                <button
                  onClick={() => navigate(tier.to)}
                  className="mt-8 w-full rounded-full border border-stone-300 py-3 text-sm font-semibold text-stone-800 transition-colors hover:border-emerald-800 hover:text-emerald-800"
                >
                  {tr(tier.cta)}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showMaintenanceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMaintenanceModal(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl z-10"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-amber-50 p-3 text-amber-600">
                  <AlertCircle className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-medium text-stone-900">
                  {tr({
                    en: "Upgrade Service Temporarily Offline",
                    fr: "Service de mise à niveau temporairement indisponible"
                  })}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  {tr({
                    en: "We are currently experiencing a temporary outage with our payment partner NabooPay. This upgrade service is a work in progress and will be up soon, Inshallah. We apologize for the inconvenience.",
                    fr: "Nous rencontrons actuellement une interruption temporaire avec notre partenaire de paiement NabooPay. Ce service de mise à niveau est en cours de rétablissement et sera bientôt disponible, Inshallah. Nous vous prions de nous excuser pour ce désagrément."
                  })}
                </p>

                <button
                  type="button"
                  onClick={() => setShowMaintenanceModal(false)}
                  className="mt-6 w-full rounded-full bg-emerald-900 py-3 text-sm font-semibold text-[#FAF7F0] transition-colors hover:bg-emerald-800"
                >
                  {tr({ en: "Dismiss", fr: "Fermer" })}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PricingComparison;
