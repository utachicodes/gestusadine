import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTr, type Loc } from '@/lib/i18n';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Section 5 — Daily Guidance.
 * Emotional, not explanatory: a dark, manuscript-like surface. The ayah is
 * revealed with a right-to-left clip mask (matching the Arabic reading order),
 * followed by three quiet entries — today's ayah, dua, and prayer times.
 *
 * NOTE: ayah, dua and prayer times below are static, illustrative content
 * (prayer times shown for Dakar). To be reviewed before launch.
 */

type Entry = { label: Loc; arabic: string; translation: Loc; meta: Loc };

const ENTRIES: Entry[] = [
  {
    label: { en: 'Today’s ayah', fr: 'Verset du jour' },
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    translation: {
      en: 'So remember Me; I will remember you.',
      fr: 'Souvenez-vous de Moi, Je Me souviendrai de vous.',
    },
    meta: { en: 'Qur’an 2:152', fr: 'Coran 2:152' },
  },
  {
    label: { en: 'Today’s dua', fr: 'Invocation du jour' },
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً',
    translation: {
      en: 'Our Lord, grant us good in this world and good in the Hereafter.',
      fr: 'Notre Seigneur, accorde-nous le bien ici-bas et le bien dans l’au-delà.',
    },
    meta: { en: 'Qur’an 2:201', fr: 'Coran 2:201' },
  },
];

const PRAYERS: { name: Loc; time: string }[] = [
  { name: { en: 'Fajr', fr: 'Fajr' }, time: '05:34' },
  { name: { en: 'Ẓuhr', fr: 'Ẓuhr' }, time: '13:42' },
  { name: { en: 'ʿAṣr', fr: 'ʿAṣr' }, time: '16:58' },
  { name: { en: 'Maghrib', fr: 'Maghrib' }, time: '19:21' },
  { name: { en: 'ʿIshāʾ', fr: 'ʿIshāʾ' }, time: '20:32' },
];

const DailyGuidance = () => {
  const tr = useTr();
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#16130E] py-32">
      {/* Faint manuscript pattern */}
      <div className="pointer-events-none absolute inset-0 bg-islamic-pattern opacity-[0.04]" aria-hidden="true" />

      <div className="container relative mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C2A878]"
        >
          {tr({ en: 'Daily Guidance', fr: 'Guidance quotidienne' })}
        </motion.p>

        {/* Calligraphy with right-to-left mask reveal */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            dir="rtl"
            initial={{ clipPath: reduce ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)' }}
            whileInView={{ clipPath: 'inset(0 0 0 0)' }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: reduce ? 0 : 1.7, ease }}
            className="font-arabic text-5xl leading-[1.5] text-[#FAF7F0] sm:text-6xl lg:text-7xl"
          >
            وَقُل رَّبِّ زِدْنِي عِلْمًا
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, delay: reduce ? 0 : 0.9, ease }}
            className="mt-8 text-xl italic text-white/55"
          >
            {tr({
              en: '“And say: My Lord, increase me in knowledge.”',
              fr: '« Et dis : Mon Seigneur, accrois mes connaissances. »',
            })}
            <span className="mt-2 block text-xs not-italic uppercase tracking-[0.25em] text-[#C2A878]/70">
              {tr({ en: 'Qur’an 20:114', fr: 'Coran 20:114' })}
            </span>
          </motion.p>
        </div>

        {/* Three manuscript entries */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: reduce ? 0 : 0.3, ease }}
          className="mx-auto mt-24 grid max-w-5xl gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] md:grid-cols-3"
        >
          {ENTRIES.map((e) => (
            <div key={e.label.en} className="bg-[#16130E] p-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C2A878]">
                {tr(e.label)}
              </p>
              <p dir="rtl" className="mt-5 font-arabic text-3xl leading-relaxed text-[#FAF7F0]">
                {e.arabic}
              </p>
              <p className="mt-4 text-lg italic leading-relaxed text-white/60">
                {tr(e.translation)}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-white/35">{tr(e.meta)}</p>
            </div>
          ))}

          {/* Prayer times */}
          <div className="bg-[#16130E] p-9">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C2A878]">
                {tr({ en: 'Prayer times', fr: 'Horaires de prière' })}
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                {tr({ en: 'Dakar', fr: 'Dakar' })}
              </p>
            </div>
            <ul className="mt-5 space-y-3">
              {PRAYERS.map((p) => (
                <li
                  key={p.name.en}
                  className="flex items-baseline justify-between border-b border-white/5 pb-3 last:border-b-0 last:pb-0"
                >
                  <span className="text-lg text-white/80">{tr(p.name)}</span>
                  <span className="text-lg tabular-nums text-[#FAF7F0]">{p.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DailyGuidance;
