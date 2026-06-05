import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTr, type Loc } from '@/lib/i18n';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Section 1  Product Demonstration.
 * Proves the Council rather than describing it: a real question on the left,
 * a scholarly reference document on the right. The answer card is deliberately
 * shaped like a citation page, not a chat bubble.
 *
 * NOTE: The ruling and citations below are the exact example provided in the
 * brief (travel-prayer / jamʿ). Treat as illustrative  to be reviewed by a
 * qualified scholar before launch.
 */

const SOURCES: { ref: string; work: Loc }[] = [
  { ref: 'Qur’an 4:101', work: { en: 'Sūrat an-Nisāʾ', fr: 'Sourate an-Nisāʾ' } },
  { ref: 'Ṣaḥīḥ Muslim 686', work: { en: 'Book of Travellers’ Prayer', fr: 'Livre de la prière du voyageur' } },
  { ref: 'Al-Mughnī', work: { en: 'Ibn Qudāmah', fr: 'Ibn Qudāma' } },
];

const ProductDemo = () => {
  const tr = useTr();
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.8, ease, delay: reduce ? 0 : delay },
  });

  return (
    <section className="border-t border-stone-200 bg-[#F3EDE1] py-28">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left  the question, treated editorially */}
          <motion.div {...rise(0)}>
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-800/70">
              {tr({ en: 'A question, answered', fr: 'Une question, une réponse' })}
            </p>
            <blockquote className="text-4xl italic leading-tight text-stone-900 sm:text-5xl">
              {tr({
                en: '“Can I combine prayers while travelling?”',
                fr: '« Puis-je regrouper mes prières en voyage ? »',
              })}
            </blockquote>
            <p className="mt-8 max-w-md text-base leading-relaxed text-stone-500">
              {tr({
                en: 'Every answer returns the way a scholar would write it  the ruling, the reasoning, and the sources you can open and read yourself.',
                fr: 'Chaque réponse vous parvient comme l’écrirait un savant  l’avis, le raisonnement, et les sources que vous pouvez ouvrir et lire vous-même.',
              })}
            </p>
          </motion.div>

          {/* Right  the scholarly reference card */}
          <motion.figure
            {...rise(0.15)}
            className="relative rounded-2xl border border-stone-300/80 bg-[#FDFBF6] p-8 shadow-paper-lg sm:p-10"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-stone-200 pb-5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400">
                {tr({ en: 'Council ruling', fr: 'Avis du Conseil' })}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-800/80">
                {tr({ en: 'Consensus · High confidence', fr: 'Consensus · Confiance élevée' })}
              </span>
            </header>

            {/* Consensus answer */}
            <motion.div {...rise(0.3)}>
              <h3 className="mt-7 text-2xl text-stone-900">
                {tr({ en: 'Consensus answer', fr: 'Réponse de consensus' })}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-stone-600">
                {tr({
                  en: 'According to the majority of scholars, a traveller may shorten and combine Ẓuhr with ʿAṣr, and Maghrib with ʿIshāʾ. This concession (jamʿ) is a mercy granted for the hardship of travel and is established across the four Sunni schools.',
                  fr: 'Selon la majorité des savants, le voyageur peut raccourcir et regrouper le Ẓuhr avec le ʿAṣr, ainsi que le Maghrib avec le ʿIshāʾ. Cette facilité (jamʿ) est une miséricorde accordée pour la difficulté du voyage et est établie dans les quatre écoles sunnites.',
                })}
              </p>
            </motion.div>

            {/* Sources  revealed last */}
            <motion.div
              {...rise(0.5)}
              className="mt-7 border-t border-stone-200 pt-5"
            >
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400">
                {tr({ en: 'Sources', fr: 'Sources' })}
              </p>
              <ul className="space-y-2.5">
                {SOURCES.map((s) => (
                  <li key={s.ref} className="flex items-baseline justify-between gap-4">
                    <span className="text-base text-emerald-900">{s.ref}</span>
                    <span className="flex-1 translate-y-[-3px] border-b border-dotted border-stone-300" />
                    <span className="text-xs text-stone-500">{tr(s.work)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.figure>
        </div>
      </div>
    </section>
  );
};

export default ProductDemo;
