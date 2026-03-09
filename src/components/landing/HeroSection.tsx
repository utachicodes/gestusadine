import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="relative pt-24 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-warm-base" />

      <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-deep-green mb-6 max-w-4xl mx-auto leading-[1.08]"
        >
          Ask Islamic questions.{' '}
          <span className="text-gradient-gold">Get scholar-backed answers.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl text-deep-green/55 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          GëstuSaDine checks your question against four AI scholars — Fiqh, Aqeedah, modern context, and epistemic caution — then gives you one clear answer across all four Sunni madhhabs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => navigate('/login')}
            className="btn-spiritual flex items-center gap-3 group"
          >
            {t('hero.cta_primary') || 'Try it free'}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => navigate('/about')}
            className="btn-spiritual-outline flex items-center gap-3"
          >
            {t('hero.cta_secondary') || 'How it works'}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
