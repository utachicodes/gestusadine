import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTr, type Loc } from '@/lib/i18n';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Section 2  The Council.
 * A scholarly map (closer to an observatory than a UI): a central node with six
 * sources around it, connected by thin lines that draw in like ink on paper.
 * Hovering or tapping a node traces its path and reveals what it contributes.
 *
 * Geometry lives in a normalised 1000×800 space. The container is locked to that
 * 5:4 aspect ratio so the SVG line endpoints and the absolutely-positioned HTML
 * nodes (placed by the same fractional coordinates) align exactly at every size.
 */

const CENTER = { x: 500, y: 400 };

type Node = { key: string; label: Loc; count: Loc; desc: Loc; x: number; y: number };

const NODES: Node[] = [
  {
    key: 'quran',
    label: { en: 'Qur’an', fr: 'Coran' },
    count: { en: '114 sūrah · 6,236 āyāt', fr: '114 sourates · 6 236 āyāt' },
    desc: {
      en: 'The revealed word  the first and final reference for every ruling.',
      fr: 'La parole révélée  la première et la dernière référence de tout avis.',
    },
    x: 500, y: 100,
  },
  {
    key: 'hadith',
    label: { en: 'Hadith', fr: 'Hadith' },
    count: { en: 'Kutub al-Sittah', fr: 'Kutub al-Sittah' },
    desc: {
      en: 'Authenticated prophetic traditions, graded by chain and by text.',
      fr: 'Traditions prophétiques authentifiées, classées par chaîne et par texte.',
    },
    x: 820, y: 250,
  },
  {
    key: 'fiqh',
    label: { en: 'Fiqh', fr: 'Fiqh' },
    count: { en: '4 madhāhib', fr: '4 madhāhib' },
    desc: {
      en: 'Jurisprudence across the Ḥanafī, Mālikī, Shāfiʿī and Ḥanbalī schools.',
      fr: 'La jurisprudence des écoles ḥanafite, mālikite, shāfiʿite et ḥanbalite.',
    },
    x: 820, y: 550,
  },
  {
    key: 'aqeedah',
    label: { en: 'Aqeedah', fr: 'Aqīda' },
    count: { en: 'Sunni consensus', fr: 'Consensus sunnite' },
    desc: {
      en: 'Creed  the boundaries of belief, and the Council’s guard against error.',
      fr: 'Le credo  les limites de la croyance, et le garde-fou du Conseil contre l’erreur.',
    },
    x: 500, y: 700,
  },
  {
    key: 'usul',
    label: { en: 'Uṣūl', fr: 'Uṣūl' },
    count: { en: 'Uṣūl al-fiqh', fr: 'Uṣūl al-fiqh' },
    desc: {
      en: 'The methodology by which rulings are derived from the sources.',
      fr: 'La méthodologie par laquelle les avis sont dérivés des sources.',
    },
    x: 180, y: 550,
  },
  {
    key: 'tafsir',
    label: { en: 'Tafsīr', fr: 'Tafsīr' },
    count: { en: 'Classical works', fr: 'Œuvres classiques' },
    desc: {
      en: 'Exegesis of the Qur’an drawn from the recognised mufassirūn.',
      fr: 'L’exégèse du Coran issue des mufassirūn reconnus.',
    },
    x: 180, y: 250,
  },
];

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

const CouncilDiagram = () => {
  const tr = useTr();
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const active = hover ?? selected;

  return (
    <section className="border-t border-stone-200 bg-[#FAF7F0] py-28">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <motion.header
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-800/70">
            {tr({ en: 'The Council', fr: 'Le Conseil' })}
          </p>
          <h2 className="text-4xl leading-tight text-stone-900 sm:text-5xl">
            {tr({ en: 'How an answer takes shape.', fr: 'Comment une réponse prend forme.' })}
          </h2>
        </motion.header>

        {/* Diagram */}
        <motion.div
          onViewportEnter={() => setInView(true)}
          viewport={{ once: true, margin: '-120px' }}
          className="relative mx-auto mt-16 aspect-[5/4] w-full max-w-3xl"
        >
          {/* Lines + guide ellipse */}
          <svg
            viewBox="0 0 1000 800"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <ellipse
              cx={CENTER.x}
              cy={CENTER.y}
              rx={340}
              ry={304}
              fill="none"
              stroke="#d6d3d1"
              strokeWidth={1}
              strokeDasharray="2 7"
              vectorEffect="non-scaling-stroke"
              opacity={0.7}
            />
            {NODES.map((n, i) => {
              const isActive = active === i;
              const dimmed = active !== null && !isActive;
              return (
                <motion.line
                  key={n.key}
                  x1={CENTER.x}
                  y1={CENTER.y}
                  x2={n.x}
                  y2={n.y}
                  stroke={isActive ? '#065f46' : '#a8a29e'}
                  strokeWidth={isActive ? 2 : 1.25}
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: reduce ? 1 : 0 }}
                  animate={{ pathLength: inView || reduce ? 1 : 0 }}
                  transition={{ duration: 1.1, ease, delay: reduce ? 0 : 0.2 + i * 0.12 }}
                  style={{
                    opacity: dimmed ? 0.3 : 1,
                    transition: 'stroke 0.4s ease, stroke-width 0.4s ease, opacity 0.4s ease',
                  }}
                />
              );
            })}
          </svg>

          {/* Center node */}
          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
            animate={{ opacity: inView || reduce ? 1 : 0, scale: inView || reduce ? 1 : 0.85 }}
            transition={{ duration: 0.7, ease, delay: reduce ? 0 : 0.1 }}
            className="absolute z-10 flex flex-col items-center justify-center rounded-full bg-emerald-900 text-center text-[#FAF7F0] shadow-lg shadow-emerald-900/20"
            style={{
              left: pct(CENTER.x, 1000),
              top: pct(CENTER.y, 800),
              width: '30%',
              aspectRatio: '1 / 1',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span className="text-lg leading-none sm:text-2xl">
              {tr({ en: 'The Council', fr: 'Le Conseil' })}
            </span>
            <span className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.25em] text-emerald-200/70 sm:text-[10px]">
              {tr({ en: 'Synthesis', fr: 'Synthèse' })}
            </span>
          </motion.div>

          {/* Source nodes */}
          {NODES.map((n, i) => {
            const isActive = active === i;
            const dimmed = active !== null && !isActive;
            return (
              <motion.button
                key={n.key}
                type="button"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.8 }}
                animate={{
                  opacity: inView || reduce ? (dimmed ? 0.55 : 1) : 0,
                  scale: inView || reduce ? 1 : 0.8,
                }}
                transition={{ duration: 0.6, ease, delay: reduce ? 0 : 0.5 + i * 0.1 }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                onClick={() => setSelected((p) => (p === i ? null : i))}
                aria-label={tr(n.label)}
                className={`absolute z-10 flex aspect-square items-center justify-center rounded-full border bg-[#FDFBF6] text-center shadow-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/50 ${
                  isActive
                    ? 'border-emerald-800 shadow-md shadow-emerald-900/10'
                    : 'border-stone-300 hover:border-emerald-800/60 hover:shadow'
                }`}
                style={{
                  left: pct(n.x, 1000),
                  top: pct(n.y, 800),
                  width: '21%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <span
                  className={`text-sm leading-none transition-colors duration-300 sm:text-xl ${
                    isActive ? 'text-emerald-900' : 'text-stone-700'
                  }`}
                >
                  {tr(n.label)}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Detail panel  synthesis copy by default, node detail on hover/tap */}
        <div className="mx-auto mt-14 min-h-[7.5rem] max-w-2xl text-center">
          <AnimatePresence mode="wait">
            {active === null ? (
              <motion.p
                key="lead"
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                transition={{ duration: 0.4, ease }}
                className="text-xl leading-relaxed text-stone-600 sm:text-2xl"
              >
                {tr({
                  en: 'Every answer is synthesized from authenticated sources, scholarly opinions, and established methodology  never generated from the open web.',
                  fr: 'Chaque réponse est synthétisée à partir de sources authentifiées, d’avis savants et d’une méthodologie établie  jamais générée depuis le web ouvert.',
                })}
              </motion.p>
            ) : (
              <motion.div
                key={NODES[active].key}
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                transition={{ duration: 0.4, ease }}
              >
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-800/70">
                  {tr(NODES[active].count)}
                </p>
                <h3 className="text-3xl text-stone-900">{tr(NODES[active].label)}</h3>
                <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-stone-500">
                  {tr(NODES[active].desc)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default CouncilDiagram;
