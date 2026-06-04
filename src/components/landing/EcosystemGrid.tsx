import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTr, type Loc } from '@/lib/i18n';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Section 3 — The Ecosystem.
 * An asymmetrical editorial grid (not equal feature cards): one large featured
 * space for the Council, then secondary spaces. Typography-driven, no icons.
 * Hover: border darkens, card lifts 2px, background warms slightly.
 */

type Space = { n: string; title: Loc; desc: Loc; to: string };

const FEATURED: Space = {
  n: '01',
  title: { en: 'The Council', fr: 'Le Conseil' },
  desc: {
    en: 'Ask anything and receive a consensus answer drawn from authenticated sources, scholarly opinion, and established methodology — with references you can open and read.',
    fr: 'Posez n’importe quelle question et recevez une réponse de consensus, issue de sources authentifiées, d’avis savants et d’une méthodologie établie — avec des références consultables.',
  },
  to: '/chat',
};

const TALL: Space[] = [
  {
    n: '02',
    title: { en: 'Living Library', fr: 'Bibliothèque vivante' },
    desc: {
      en: 'Read and download works across Qur’an, hadith, fiqh, and aqeedah.',
      fr: 'Lisez et téléchargez des ouvrages sur le Coran, le hadith, le fiqh et l’aqida.',
    },
    to: '/library',
  },
  {
    n: '03',
    title: { en: 'Courses', fr: 'Cours' },
    desc: {
      en: 'Structured lessons from the fundamentals to deeper study, at your own pace.',
      fr: 'Des leçons structurées, des fondements à l’étude approfondie, à votre rythme.',
    },
    to: '/classes',
  },
];

const WIDE: Space[] = [
  {
    n: '04',
    title: { en: 'Circles', fr: 'Cercles' },
    desc: {
      en: 'Moderated community circles on fiqh, Qur’an, family, and youth.',
      fr: 'Des cercles communautaires modérés sur le fiqh, le Coran, la famille et la jeunesse.',
    },
    to: '/community',
  },
  {
    n: '05',
    title: { en: 'Daily Guidance', fr: 'Guidance quotidienne' },
    desc: {
      en: 'A daily ayah, dua, and prayer times to anchor your day.',
      fr: 'Un verset, une invocation et les horaires de prière chaque jour.',
    },
    to: '/dashboard',
  },
  {
    n: '06',
    title: { en: 'Podcasts', fr: 'Podcasts' },
    desc: {
      en: 'Long-form conversations with scholars from the region and beyond.',
      fr: 'Des conversations approfondies avec des savants de la région et d’ailleurs.',
    },
    to: '/podcasts',
  },
];

const cardBase =
  'group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#FDFBF6] p-7 text-left shadow-paper transition-all duration-300 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-paper-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/40';

const SpaceCard = ({
  space,
  featured = false,
  index,
}: {
  space: Space;
  featured?: boolean;
  index: number;
}) => {
  const navigate = useNavigate();
  const tr = useTr();
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={() => navigate(space.to)}
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease, delay: reduce ? 0 : index * 0.06 }}
      className={`${cardBase} ${featured ? 'h-full justify-between shadow-paper-lg sm:p-10' : ''}`}
    >
      {featured && (
        <div
          className="pointer-events-none absolute inset-0 bg-islamic-pattern opacity-[0.05]"
          aria-hidden="true"
        />
      )}
      <div className="relative flex items-start justify-between">
        <span className={`text-emerald-800/40 ${featured ? 'text-xl' : 'text-base'}`}>
          {space.n}
        </span>
        <ArrowUpRight className="h-4 w-4 text-stone-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-800" />
      </div>
      <div className={`relative ${featured ? 'mt-auto pt-10' : 'mt-5'}`}>
        {featured && (
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-emerald-800/40" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-800/70">
              {tr({ en: 'Where most begin', fr: 'Là où l’on commence' })}
            </span>
          </div>
        )}
        <h3
          className={`text-stone-900 transition-colors duration-300 group-hover:text-emerald-800 ${
            featured ? 'text-4xl sm:text-5xl' : 'text-2xl'
          }`}
        >
          {tr(space.title)}
        </h3>
        <p
          className={`mt-2 leading-relaxed text-stone-500 ${
            featured ? 'max-w-md text-base' : 'text-sm'
          }`}
        >
          {tr(space.desc)}
        </p>
      </div>
    </motion.button>
  );
};

const EcosystemGrid = () => {
  const tr = useTr();
  const reduce = useReducedMotion();

  return (
    <section className="border-t border-stone-200 bg-[#F3EDE1] py-28">
      <div className="container mx-auto max-w-5xl px-6">
        <motion.header
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-800/70">
            {tr({ en: 'The ecosystem', fr: 'L’écosystème' })}
          </p>
          <h2 className="text-4xl leading-tight text-stone-900 sm:text-5xl">
            {tr({ en: 'One place for the whole of your seeking.', fr: 'Un seul lieu pour toute votre quête.' })}
          </h2>
        </motion.header>

        {/* Asymmetrical grid */}
        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SpaceCard space={FEATURED} featured index={0} />
          </div>
          <div className="grid gap-5 lg:col-span-5">
            {TALL.map((s, i) => (
              <SpaceCard key={s.to} space={s} index={i + 1} />
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {WIDE.map((s, i) => (
            <SpaceCard key={s.to} space={s} index={i + 3} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemGrid;
