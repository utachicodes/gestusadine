import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTr, type Loc } from '@/lib/i18n';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Section 7 — Pricing.
 * Three equal cards with the restraint of an archival document — no bright
 * highlights, no badges, no urgency. The Student plan carries only a quiet
 * one-line recommendation.
 */

type Tier = {
  name: Loc;
  price: Loc;
  unit?: Loc;
  description: Loc;
  features: Loc[];
  cta: Loc;
  to: string;
  note?: Loc;
};

const TIERS: Tier[] = [
  {
    name: { en: 'Seeker', fr: 'Chercheur' },
    price: { en: 'Free', fr: 'Gratuit' },
    description: { en: 'For anyone beginning their journey.', fr: 'Pour celles et ceux qui débutent.' },
    features: [
      { en: 'The public library', fr: 'La bibliothèque publique' },
      { en: 'A taste of the Council', fr: 'Un aperçu du Conseil' },
      { en: 'Daily ayah & dua', fr: 'Verset et invocation du jour' },
      { en: 'Read the community', fr: 'Lecture de la communauté' },
    ],
    cta: { en: 'Start free', fr: 'Commencer' },
    to: '/login',
  },
  {
    name: { en: 'Student', fr: 'Étudiant' },
    price: { en: '10,000', fr: '10 000' },
    unit: { en: 'FCFA / month', fr: 'FCFA / mois' },
    description: { en: 'For those who want to go deeper.', fr: 'Pour aller plus loin.' },
    features: [
      { en: '500 Council questions / month', fr: '500 questions au Conseil / mois' },
      { en: 'Full scholarly archives', fr: 'Archives savantes complètes' },
      { en: 'Courses & classes', fr: 'Cours et leçons' },
      { en: 'Full community access', fr: 'Accès complet à la communauté' },
    ],
    cta: { en: 'Join the circle', fr: 'Rejoindre le cercle' },
    to: '/login',
    note: { en: 'Recommended for serious students', fr: 'Recommandé pour les étudiants assidus' },
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
  },
];

const PricingSection = () => {
  const tr = useTr();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  return (
    <section className="border-t border-stone-200 bg-[#F3EDE1] py-28">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-800/70">
            {tr({ en: 'Pricing', fr: 'Tarifs' })}
          </p>
          <h2 className="text-4xl leading-tight text-stone-900 sm:text-5xl">
            {tr({ en: 'Begin free. Grow when you’re ready.', fr: 'Gratuit pour commencer. Évoluez à votre rythme.' })}
          </h2>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-5 lg:grid-cols-3">
          {TIERS.map((tier, i) => {
            const recommended = Boolean(tier.note);
            return (
              <motion.div
                key={tier.name.en}
                initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease, delay: reduce ? 0 : i * 0.08 }}
                className={`relative flex flex-col rounded-2xl border bg-[#FDFBF6] p-9 shadow-paper transition-shadow duration-300 hover:shadow-paper-lg ${
                  recommended ? 'border-emerald-800/40 shadow-paper-lg' : 'border-stone-300/70'
                }`}
              >
                <h3 className="text-2xl text-stone-900">{tr(tier.name)}</h3>
                <p className="mt-1.5 text-sm text-stone-500">{tr(tier.description)}</p>

                <div className="mt-7 flex items-baseline gap-2">
                  <span className="text-6xl leading-none text-stone-900">{tr(tier.price)}</span>
                  {tier.unit && <span className="text-sm font-medium text-stone-400">{tr(tier.unit)}</span>}
                </div>

                <div className="my-8 h-px bg-stone-200" />

                <ul className="flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f.en} className="flex items-baseline gap-3 text-sm text-stone-600">
                      <span className="mt-px h-px w-3 flex-none translate-y-2 bg-emerald-800/50" />
                      <span>{tr(f)}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate(tier.to)}
                  className={`mt-9 w-full rounded-full py-3 text-sm font-semibold transition-colors ${
                    recommended
                      ? 'bg-emerald-900 text-[#FAF7F0] hover:bg-emerald-800'
                      : 'border border-stone-300 text-stone-800 hover:border-emerald-800 hover:text-emerald-800'
                  }`}
                >
                  {tr(tier.cta)}
                </button>

                <p className="mt-4 h-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-800/70">
                  {tier.note ? tr(tier.note) : ''}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
