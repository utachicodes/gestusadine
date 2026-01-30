import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, PlayCircle, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Mouse tilt effect state
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for tilt
  const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5);
    y.set((clientY - top) / height - 0.5);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  return (
    <section
      className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20"
      onMouseMove={handleMouseMove}
    >
      {/* 1. Dynamic Background - Animated Gradient Aura */}
      <div className="absolute inset-0 -z-10 bg-background">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-islamic-green/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-islamic-blue/10 rounded-full blur-[100px]"
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center">

        {/* 2. Badge - Pop In */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="inline-flex items-center rounded-full border border-islamic-green/20 bg-islamic-green/5 px-3 py-1 text-sm text-islamic-green mb-8 backdrop-blur"
        >
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-islamic-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-islamic-green"></span>
          </span>
          {t('hero.badge') || 'New Feature'}
        </motion.div>

        {/* 3. Main Title - Staggered Letters/Words */}
        <div className="text-center max-w-5xl mx-auto mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1]"
          >
            GestuSaDine
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-islamic-green via-islamic-gold to-islamic-green bg-[length:200%_auto] animate-gradient"
          >
            {t('hero.title_highlight') || 'Islamic Companion'}
          </motion.div>
        </div>

        {/* 4. Subtitle - Fade Up */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto text-center leading-relaxed"
        >
          {t('hero.subtitle') || 'Authentic knowledge, prayer tools, and AI guidance in one beautiful platform.'}
        </motion.p>

        {/* 5. Buttons - Hover Bounce */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20 w-full"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="h-14 px-8 rounded-2xl bg-gradient-to-r from-islamic-green to-islamic-green-600 text-white font-semibold text-lg hover:shadow-lg hover:shadow-islamic-green/25 transition-all flex items-center gap-3 w-full sm:w-auto justify-center"
          >
            {t('hero.cta_primary') || 'Get Started'}
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/about')}
            className="h-14 px-8 rounded-2xl border-2 border-border bg-background/50 hover:bg-accent/50 hover:border-islamic-gold/30 font-semibold text-lg transition-all flex items-center gap-3 w-full sm:w-auto justify-center backdrop-blur-sm"
          >
            <PlayCircle className="w-5 h-5 text-islamic-gold" />
            {t('hero.cta_secondary') || 'How it Works'}
          </motion.button>
        </motion.div>

        {/* 6. Dashboard Preview - Interactive 3D Tilt */}
        <motion.div
          style={{ rotateX, rotateY, perspective: 1000 }}
          initial={{ opacity: 0, y: 50, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.4, duration: 1, type: "spring" }}
          className="relative w-full max-w-6xl mx-auto perspective-1000"
        >
          {/* Glow Underneath */}
          <div className="absolute inset-0 bg-gradient-to-t from-islamic-green/20 via-islamic-blue/10 to-transparent blur-3xl -z-10 translate-y-10" />

          {/* Card Container */}
          <div className="relative rounded-2xl border border-white/10 bg-background/40 backdrop-blur-md shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[21/9] ring-1 ring-white/20 group">

            {/* Interactive Gloss/Sheen effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-50 pointer-events-none" />

            {/* Browser UI Header */}
            <div className="h-10 border-b border-white/10 bg-black/5 flex items-center px-4 gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="ml-4 h-5 w-64 bg-black/5 rounded-full" />
            </div>

            {/* Internal Dashboard Mockup */}
            <div className="p-6 grid grid-cols-12 gap-6 h-full text-left">
              {/* Sidebar */}
              <div className="hidden md:flex col-span-2 flex-col gap-3 border-r border-white/5 pr-4">
                <div className="h-10 w-full bg-islamic-green/10 rounded-lg border border-islamic-green/20" />
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 w-full bg-white/5 rounded-lg" />
                ))}
              </div>

              {/* Main Feed */}
              <div className="col-span-12 md:col-span-7 space-y-4">
                {/* Welcome Banner */}
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="h-40 w-full bg-gradient-to-r from-islamic-green/20 to-islamic-blue/20 rounded-xl border border-white/10 flex items-center justify-center"
                >
                  <div className="h-12 w-12 rounded-full bg-white/20 animate-pulse" />
                </motion.div>

                {/* Activity Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 w-full bg-white/5 rounded-xl border border-white/5 hover:border-islamic-green/30 transition-colors" />
                  <div className="h-32 w-full bg-white/5 rounded-xl border border-white/5 hover:border-islamic-blue/30 transition-colors" />
                </div>
              </div>

              {/* Right Widgets */}
              <div className="hidden md:flex col-span-3 flex-col gap-4 pl-2">
                <div className="h-48 w-full bg-gradient-to-b from-white/5 to-transparent rounded-xl border border-white/5 p-4">
                  <div className="h-4 w-1/2 bg-white/10 rounded mb-4" />
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-white/5 rounded" />
                    <div className="h-2 w-full bg-white/5 rounded" />
                    <div className="h-2 w-3/4 bg-white/5 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
