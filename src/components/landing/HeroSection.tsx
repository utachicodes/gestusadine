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
      {/* Premium subtle grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2ded5_1px,transparent_1px),linear-gradient(to_bottom,#e2ded5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.4] pointer-events-none" />
      
      {/* Elegant radial lighting effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.06),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <span className="h-px w-8 bg-stone-300/80" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-500">
              {tr({ en: 'The Council of Knowledge', fr: 'Le Conseil du Savoir' })}
            </span>
            <span className="h-px w-8 bg-stone-300/80" />
          </motion.div>

          {/* Arabic mark - Calligraphic text only */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="font-arabic text-4xl text-emerald-800/60 mb-8 select-none"
          >
            اقْرَأْ
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.08 }}
            className="text-5xl sm:text-6xl lg:text-[4.75rem] font-medium tracking-tight text-stone-900 leading-[1.05]"
          >
            {tr({ en: 'Every question of faith,', fr: 'Chaque question de foi,' })}
            <br />
            <span className="italic text-emerald-800 font-serif">
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
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto rounded-full bg-emerald-900 px-9 py-3.5 text-sm font-semibold tracking-wide text-[#FAF7F0] shadow-md shadow-emerald-900/10 hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-900/20 transition-all duration-300"
            >
              {tr({ en: 'Begin', fr: 'Commencer' })}
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/chat')}
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 rounded-full border border-stone-300/80 bg-white/40 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-stone-700 hover:text-emerald-800 hover:border-emerald-800/30 hover:bg-white/80 transition-all duration-300"
            >
              {tr({ en: 'Ask the council', fr: 'Consulter le conseil' })}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
