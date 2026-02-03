import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, PlayCircle, ShieldCheck, Globe, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
      {/* Background - Soft Fintech-like Ambience */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-background to-background" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-[100px] opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px] opacity-60" />

      {/* Grid Pattern Overlay - Subtle Tech feel */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] -z-10" />

      <div className="container px-4 md:px-6 mx-auto text-center relative z-10">

        {/* Badge - Clean & Pill-shaped */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center rounded-full border border-blue-200/50 bg-white/60 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-slate-600 mb-8 shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
          {t('hero.badge') || 'Smart Islamic Companion'}
        </motion.div>

        {/* Main Heading - Clean High-Contrast Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 max-w-5xl mx-auto leading-[1.1]"
        >
          GestuSaDine
          <span className="block text-gradient-blue mt-2 pb-2">
            {t('hero.title_highlight') || 'Faith Meets Intelligence'}
          </span>
        </motion.h1>

        {/* Subtitle - Crisp Slate Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          {t('hero.subtitle') || 'A unified platform for authentic knowledge, daily guidance, and scholarly fatwas—powered by ethical AI.'}
        </motion.p>

        {/* CTA Buttons - Smart Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="btn-primary-smart flex items-center gap-3 group"
          >
            {t('hero.cta_primary') || 'Get Started Now'}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/about')}
            className="btn-secondary-smart flex items-center gap-3 group"
          >
            <PlayCircle className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            {t('hero.cta_secondary') || 'Watch Demo'}
          </motion.button>
        </motion.div>

        {/* Hero Visual - "Connected Ecosystem" - Floating Elements */}
        <div className="relative w-full max-w-6xl mx-auto h-[400px] md:h-[600px] perspective-1000 hidden md:block">

          {/* Centerpiece - AI Core */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-3xl shadow-2xl flex items-center justify-center z-20 border border-slate-100 animate-float-slow"
          >
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="w-16 h-16" />
            </div>
          </motion.div>

          {/* Floating Cards around Center */}
          <FloatingCard
            delay={0.7}
            className="top-[20%] left-[20%] w-64 animate-float-medium"
            icon={<Globe className="text-blue-500" />}
            title="Universal Knowledge"
            desc="Access global scholarly wisdom"
          />

          <FloatingCard
            delay={0.9}
            className="bottom-[25%] right-[20%] w-64 animate-float-slow"
            icon={<Zap className="text-amber-500" />}
            title="Instant Fatwa"
            desc="Context-aware answers in seconds"
          />

          {/* Connecting Lines (SVG) */}
          <svg className="absolute inset-0 z-10 w-full h-full pointer-events-none opacity-20">
            <motion.path
              d="M 400 300 Q 550 300 600 300" // Example curve
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1 }}
              stroke="#2563EB"
              strokeWidth="2"
              fill="none"
            />
            {/* Add more decorative lines ideally responsive */}
          </svg>

          {/* Background Glow behind centerpiece */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[120px] -z-10" />

        </div>
      </div>
    </section>
  );
};

// Helper for floating cards
const FloatingCard = ({ className, icon, title, desc, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    className={`absolute glass-card p-4 rounded-2xl flex items-center gap-4 ${className}`}
  >
    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner">
      {icon}
    </div>
    <div className="text-left">
      <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  </motion.div>
);

export default HeroSection;
