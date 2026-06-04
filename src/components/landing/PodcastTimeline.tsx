import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTr, type Loc } from '@/lib/i18n';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Section 6 — Podcasts.
 * An archive, not a carousel: episodes are milestones along a single horizontal
 * line. Each one expands on hover to reveal its scholar, duration and subject.
 * Typography leads; the line and nodes are kept to a hairline.
 *
 * NOTE: scholar names and episode details are placeholder/illustrative content
 * for layout. To be replaced with real episodes before launch.
 */

type Episode = { no: string; topic: Loc; scholar: string; duration: Loc; note: Loc };

const EPISODES: Episode[] = [
  {
    no: '01',
    topic: { en: 'On Sincerity in Seeking Knowledge', fr: 'La sincérité dans la quête du savoir' },
    scholar: 'Ustādh Mamadou Bâ',
    duration: { en: '52 min', fr: '52 min' },
    note: {
      en: 'Why intention comes before instruction, and how the early scholars guarded it.',
      fr: 'Pourquoi l’intention précède l’instruction, et comment les anciens savants la préservaient.',
    },
  },
  {
    no: '02',
    topic: { en: 'The Manners of the Student', fr: 'Les bonnes manières de l’étudiant' },
    scholar: 'Dr. Aïssatou Diop',
    duration: { en: '47 min', fr: '47 min' },
    note: {
      en: 'Adab toward the teacher, the book, and the self along the path of learning.',
      fr: 'L’adab envers le maître, le livre et soi-même sur le chemin de l’apprentissage.',
    },
  },
  {
    no: '03',
    topic: { en: 'Reading the Qur’an with Understanding', fr: 'Lire le Coran avec compréhension' },
    scholar: 'Shaykh Ousmane Touré',
    duration: { en: '61 min', fr: '61 min' },
    note: {
      en: 'Moving from recitation to reflection without overstepping the bounds of tafsīr.',
      fr: 'Passer de la récitation à la réflexion sans outrepasser les limites du tafsīr.',
    },
  },
  {
    no: '04',
    topic: { en: 'Fiqh of Everyday Worship', fr: 'Le fiqh du culte quotidien' },
    scholar: 'Ustādha Fatou Ndiaye',
    duration: { en: '58 min', fr: '58 min' },
    note: {
      en: 'Common questions of purity and prayer, answered across the four schools.',
      fr: 'Les questions courantes de pureté et de prière, traitées selon les quatre écoles.',
    },
  },
  {
    no: '05',
    topic: { en: 'Faith and the Modern World', fr: 'La foi et le monde moderne' },
    scholar: 'Dr. Ibrahima Fall',
    duration: { en: '44 min', fr: '44 min' },
    note: {
      en: 'Holding to certainty in an age of noise, without retreat or compromise.',
      fr: 'Garder la certitude à l’ère du bruit, sans repli ni compromis.',
    },
  },
];

const PodcastTimeline = () => {
  const tr = useTr();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  return (
    <section className="border-t border-stone-200 bg-[#FAF7F0] py-28">
      <div className="container mx-auto px-6">
        <motion.header
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-800/70">
            {tr({ en: 'Podcasts', fr: 'Podcasts' })}
          </p>
          <h2 className="text-4xl leading-tight text-stone-900 sm:text-5xl">
            {tr({ en: 'An archive of conversations.', fr: 'Une archive de conversations.' })}
          </h2>
        </motion.header>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease }}
          className="-mx-6 mt-16 overflow-x-auto px-6 pb-4"
        >
          <div className="flex min-w-max gap-0">
            {EPISODES.map((ep) => (
              <article
                key={ep.no}
                className="group w-[17rem] flex-none rounded-xl border-l border-stone-200 px-6 py-5 transition-all duration-300 first:border-l-0 first:pl-0 hover:border-transparent hover:bg-[#FDFBF6] hover:shadow-paper"
              >
                {/* Fixed-height header keeps every node on one continuous line */}
                <div className="flex h-28 flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-800/60">
                    {tr({ en: 'Episode', fr: 'Épisode' })} {ep.no}
                  </span>
                  <h3 className="mt-3 text-2xl leading-snug text-stone-900 transition-colors duration-300 group-hover:text-emerald-800">
                    {tr(ep.topic)}
                  </h3>
                </div>

                {/* The line + node */}
                <div className="relative border-t border-stone-300">
                  <span className="absolute -top-[5px] left-0 h-2.5 w-2.5 rounded-full border border-stone-300 bg-[#FAF7F0] transition-colors duration-300 group-hover:border-emerald-800 group-hover:bg-emerald-800" />
                </div>

                {/* Below the line — expands on hover */}
                <div className="pt-6">
                  <p className="text-lg italic text-stone-700">{ep.scholar}</p>
                  <div className="grid grid-rows-[0fr] transition-all duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="pt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-stone-400">
                        {tr(ep.duration)}
                      </p>
                      <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-stone-500">
                        {tr(ep.note)}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </motion.div>

        <motion.button
          type="button"
          onClick={() => navigate('/podcasts')}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease }}
          className="mt-12 text-sm font-semibold text-stone-700 underline decoration-stone-300 underline-offset-8 transition-colors hover:text-emerald-800 hover:decoration-emerald-800"
        >
          {tr({ en: 'Browse the full archive', fr: 'Parcourir toute l’archive' })}
        </motion.button>
      </div>
    </section>
  );
};

export default PodcastTimeline;
