import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTr } from '@/lib/i18n';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Section 8 — Final call to action.
 * Full viewport height, centred, typography-led. A geometric pattern sits at
 * extremely low opacity and warms slightly when the section is hovered.
 */

const FinalCTA = () => {
  const navigate = useNavigate();
  const tr = useTr();
  const reduce = useReducedMotion();

  return (
    <section className="group relative flex min-h-screen items-center justify-center overflow-hidden border-t border-stone-200 bg-[#FAF7F0]">
      {/* Geometric pattern — barely there, intensifies on hover */}
      <div
        className="pointer-events-none absolute inset-0 bg-islamic-pattern opacity-[0.025] transition-opacity duration-700 ease-out group-hover:opacity-[0.07]"
        aria-hidden="true"
      />
      {/* Soft vignette so the centre stays the focus */}
      <div
        className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_center,transparent_35%,#FAF7F0_85%)]"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease }}
        className="relative mx-auto max-w-3xl px-6 text-center"
      >
        <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-800/70">
          {tr({ en: 'Begin', fr: 'Commencer' })}
        </p>
        <h2 className="text-5xl leading-[1.04] text-stone-900 sm:text-6xl lg:text-7xl">
          {tr({ en: 'Begin where every', fr: 'Commencez là où' })}
          <br />
          <span className="italic text-emerald-800">
            {tr({ en: 'seeker begins.', fr: 'commence toute quête.' })}
          </span>
        </h2>
        <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-stone-500 sm:text-lg">
          {tr({
            en: 'Ask your first question. No card, no clutter — just guidance.',
            fr: 'Posez votre première question. Sans carte, sans superflu — juste de la guidance.',
          })}
        </p>
        <div className="mt-12 flex flex-col items-center gap-6">
          <motion.button
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            onClick={() => navigate('/chat')}
            className="rounded-full bg-emerald-900 px-10 py-4 text-sm font-semibold tracking-wide text-[#FAF7F0] shadow-lg shadow-emerald-900/15 transition-colors hover:bg-emerald-800"
          >
            {tr({ en: 'Enter the Council', fr: 'Entrer au Conseil' })}
          </motion.button>
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-stone-500 underline decoration-stone-300 underline-offset-8 transition-colors hover:text-emerald-800 hover:decoration-emerald-800"
          >
            {tr({ en: 'or create an account', fr: 'ou créer un compte' })}
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default FinalCTA;
