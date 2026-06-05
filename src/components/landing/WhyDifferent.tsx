import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTr, type Loc } from '@/lib/i18n';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Section 4  Why it's different.
 * A split, scroll-driven editorial section. On desktop the left column is
 * sticky and shows the active number + topic; the right column scrolls through
 * four tall blocks, each of which promotes itself to "active" as it crosses the
 * viewport centre. On mobile it collapses to a stacked numbered list.
 */

type Topic = { n: string; title: Loc; body: Loc };

const TOPICS: Topic[] = [
  {
    n: '01',
    title: { en: 'Grounded in Sources', fr: 'Ancré dans les sources' },
    body: {
      en: 'Every answer is tied to authentic texts and scholarly consensus, with references you can verify yourself. Nothing is asserted that cannot be traced back to a source.',
      fr: 'Chaque réponse s’appuie sur des textes authentiques et le consensus des savants, avec des références que vous pouvez vérifier. Rien n’est affirmé qui ne puisse être retracé jusqu’à sa source.',
    },
  },
  {
    n: '02',
    title: { en: 'Made for the Region', fr: 'Pensé pour la région' },
    body: {
      en: 'French and English first, built for West Africa, and ready for mobile-money. Knowledge that meets you where you are, in the language you think in.',
      fr: 'Français et anglais d’abord, conçu pour l’Afrique de l’Ouest et prêt pour le mobile money. Un savoir qui vient à vous, dans la langue qui est la vôtre.',
    },
  },
  {
    n: '03',
    title: { en: 'Quietly Rigorous', fr: 'Rigoureux, sans bruit' },
    body: {
      en: 'The Council reasons only over vetted, reviewed knowledge  never the open web. And it tells you plainly when a matter is contested or not certain.',
      fr: 'Le Conseil ne raisonne que sur un savoir vérifié et relu  jamais sur le web ouvert. Et il vous dit clairement lorsqu’une question est débattue ou incertaine.',
    },
  },
  {
    n: '04',
    title: { en: 'Open to All', fr: 'Ouvert à tous' },
    body: {
      en: 'Core knowledge stays accessible to everyone, free of charge. You go deeper only when you choose to  never because a paywall demands it.',
      fr: 'Le savoir essentiel reste accessible à tous, gratuitement. Vous allez plus loin seulement si vous le choisissez  jamais sous la contrainte d’un péage.',
    },
  },
];

const WhyDifferent = () => {
  const tr = useTr();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <section className="border-y border-stone-200 bg-[#FAF7F0]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 lg:gap-16">
          {/* Left  sticky on desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen flex-col justify-center">
              <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-800/70">
                {tr({ en: 'Why it’s different', fr: 'Ce qui change' })}
              </p>
              <div className="relative h-[20rem]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -14 }}
                    transition={{ duration: 0.5, ease }}
                    className="absolute inset-0"
                  >
                    <span className="block text-[9rem] leading-[0.8] text-emerald-800">
                      {TOPICS[active].n}
                    </span>
                    <h3 className="mt-6 max-w-sm text-4xl leading-tight text-stone-900">
                      {tr(TOPICS[active].title)}
                    </h3>
                    <span className="mt-8 block h-px w-16 bg-emerald-800/40" />
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="mt-10 text-xs font-medium uppercase tracking-[0.25em] text-stone-400">
                {TOPICS[active].n} / {String(TOPICS.length).padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* Right  scrolling blocks */}
          <div className="py-20 lg:border-l lg:border-stone-300/50 lg:py-0 lg:pl-16">
            {TOPICS.map((t, i) => (
              <motion.div
                key={t.n}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: '-45% 0px -45% 0px' }}
                className="flex min-h-[60vh] flex-col justify-center border-b border-stone-300/60 py-12 last:border-b-0 lg:min-h-[85vh] lg:border-b-0"
              >
                {/* Mobile-only number + title (lives in the sticky column on desktop) */}
                <div className="lg:hidden">
                  <span className="text-6xl leading-none text-emerald-800">{t.n}</span>
                  <h3 className="mt-4 text-3xl text-stone-900">{tr(t.title)}</h3>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, ease }}
                  className="mt-5 max-w-md text-2xl leading-relaxed text-stone-700 lg:mt-0 lg:text-[1.75rem]"
                >
                  {tr(t.body)}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyDifferent;
