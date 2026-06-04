import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTr } from '@/lib/i18n';

const ease = [0.22, 1, 0.36, 1] as const;

const HeroSection = () => {
  const navigate = useNavigate();
  const tr = useTr();

  return (
    <section className="relative overflow-hidden bg-[#FAF7F0] pt-40 pb-28 lg:pt-48">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-10"
          >
            <span className="h-px w-10 bg-stone-300" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
              {tr({ en: 'The Council of Knowledge', fr: 'Le Conseil du Savoir' })}
            </span>
            <span className="h-px w-10 bg-stone-300" />
          </motion.div>

          {/* Arabic mark */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="font-arabic text-4xl text-emerald-800/80 mb-7"
            dir="rtl"
          >
            اقْرَأْ
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.08 }}
            className="text-5xl sm:text-6xl lg:text-[5.25rem] leading-[1.02] text-stone-900"
          >
            {tr({ en: 'Every question of faith,', fr: 'Chaque question de foi,' })}
            <br />
            <span className="italic text-emerald-800">
              {tr({ en: 'answered with wisdom.', fr: 'éclairée par la sagesse.' })}
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.18 }}
            className="mx-auto mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-stone-500"
          >
            {tr({
              en: 'A council of specialized agents, grounded in authentic sources, guiding your deen in French and English.',
              fr: 'Un conseil d’agents spécialisés, ancré dans des sources authentiques, pour guider votre dîn, en français comme en anglais.',
            })}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.28 }}
            className="mt-11 flex items-center justify-center gap-7"
          >
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="rounded-full bg-emerald-900 px-9 py-3.5 text-sm font-semibold tracking-wide text-[#FAF7F0] shadow-lg shadow-emerald-900/15 hover:bg-emerald-800 transition-colors"
            >
              {tr({ en: 'Begin', fr: 'Commencer' })}
            </motion.button>
            <button
              onClick={() => navigate('/chat')}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-emerald-800 transition-colors"
            >
              {tr({ en: 'Ask the council', fr: 'Consulter le conseil' })}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

        {/* A real example, treated editorially — no fake UI chrome */}
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.4 }}
          className="mx-auto mt-24 max-w-2xl border-t border-stone-200 pt-12 text-center"
        >
          <p className="text-2xl sm:text-3xl italic leading-snug text-stone-800">
            {tr({
              en: '“Is it permissible to combine prayers while travelling?”',
              fr: '« Peut-on regrouper les prières en voyage ? »',
            })}
          </p>
          <figcaption className="mt-5 text-sm leading-relaxed text-stone-500">
            {tr({
              en: 'Answered in seconds, with the ruling across all four Sunni schools and citations you can verify.',
              fr: 'Une réponse en quelques secondes, avec l’avis des quatre écoles sunnites et des sources vérifiables.',
            })}
          </figcaption>
          <div className="mt-8 flex items-center justify-center gap-4 text-stone-400">
            <span className="h-px w-12 bg-stone-300" />
            <span className="text-[11px] font-medium uppercase tracking-[0.25em]">
              {tr({ en: 'Fiqh · ʿAqīdah · Context · Humility', fr: 'Fiqh · ʿAqīda · Contexte · Humilité' })}
            </span>
            <span className="h-px w-12 bg-stone-300" />
          </div>
        </motion.figure>
      </div>
    </section>
  );
};

export default HeroSection;
