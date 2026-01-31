import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, PlayCircle, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background - Cosmic & Glowy */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-background to-background" />

      {/* Animated Ambient Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDuration: '7s' }} />

      <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
        {/* Badge - Glassmorphic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center rounded-full border border-white/10 px-4 py-1.5 text-sm text-muted-foreground mb-8 backdrop-blur-md bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        >
          <span className="flex h-2 w-2 rounded-full bg-islamic-green mr-2 animate-pulse shadow-[0_0_10px_currentColor]"></span>
          {t('hero.badge') || 'New Feature'}
        </motion.div>

        {/* Main Heading - Bold & Centered */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-tight"
        >
          GestuSaDine
          <span className="block text-gradient mt-2 drop-shadow-lg">
            {t('hero.title_highlight') || 'Islamic Companion'}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {t('hero.subtitle') || 'Authentic knowledge, prayer tools, and AI guidance in one beautiful platform.'}
        </motion.p>

        {/* CTA Buttons - Using Custom Classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <button
            onClick={() => navigate('/login')}
            className="btn-islamic flex items-center gap-2 group"
          >
            {t('hero.cta_primary') || 'Get Started'}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => navigate('/about')}
            className="btn-islamic-outlined flex items-center gap-2 group"
          >
            <PlayCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
            {t('hero.cta_secondary') || 'Learn More'}
          </button>
        </motion.div>

        {/* Hero Visual - Enhanced Glass Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Glow Effect behind image - Stronger */}
          <div className="absolute -inset-1 bg-gradient-to-r from-islamic-green/40 to-islamic-blue/40 opacity-40 blur-3xl rounded-[30px] animate-pulse-glow" />

          {/* Dashboard Preview Container - Using islamic-card-dark */}
          <div className="islamic-card-dark border-white/10 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] ring-1 ring-white/10 backdrop-blur-xl">
            {/* Mock Browser Header */}
            <div className="h-10 border-b border-white/5 bg-black/20 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-[0_0_8px_rgba(248,113,113,0.4)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80 shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
              <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-[0_0_8px_rgba(74,222,128,0.4)]" />

              {/* Fake URL Bar */}
              <div className="ml-4 h-6 w-64 bg-white/5 rounded-full" />
            </div>

            {/* Mock Dashboard Content - Glassy Cards */}
            <div className="p-6 grid grid-cols-12 gap-6 h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50">
              {/* Sidebar */}
              <div className="hidden md:block col-span-2 space-y-3">
                <div className="h-8 w-24 bg-white/10 rounded-lg animate-pulse" />
                <div className="h-4 w-full bg-white/5 rounded animate-pulse delay-100" />
                <div className="h-4 w-full bg-white/5 rounded animate-pulse delay-200" />
                <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse delay-300" />
              </div>

              {/* Main Content */}
              <div className="col-span-12 md:col-span-7 space-y-4">
                <div className="h-32 w-full bg-gradient-to-r from-islamic-green/10 to-islamic-blue/10 rounded-xl border border-white/10 shadow-inner backdrop-blur-sm" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 w-full bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors" />
                  <div className="h-24 w-full bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors" />
                </div>
              </div>

              {/* Right Sidebar - Floating Widget */}
              <div className="hidden md:block col-span-3 space-y-4">
                <div
                   className="h-40 w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg flex items-center justify-center text-muted-foreground/40 text-sm"
                   style={{ animation: 'float-slow 6s ease-in-out infinite' }}
                >
                  Prayer Times Widget
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-sm text-muted-foreground"
        >
          <p className="mb-2">{t('hero.users') || 'Trusted by 10,000+ Muslims worldwide'}</p>
          <div className="flex justify-center gap-1 text-islamic-gold drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
