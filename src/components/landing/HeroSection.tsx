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
      {/* Background - Clean & Subtle */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-islamic-green/10 via-background to-background" />

      <div className="container px-4 md:px-6 mx-auto text-center">
        {/* Badge - Minimal Text Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground mb-8 backdrop-blur-sm bg-background/50"
        >
          <span className="flex h-2 w-2 rounded-full bg-islamic-green mr-2 animate-pulse"></span>
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
          <span className="block text-gradient mt-2">
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

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <button
            onClick={() => navigate('/login')}
            className="h-12 px-8 rounded-full bg-foreground text-background font-medium text-lg hover:bg-foreground/90 transition-all flex items-center gap-2"
          >
            {t('hero.cta_primary') || 'Get Started'}
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate('/about')}
            className="h-12 px-8 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium text-lg transition-all flex items-center gap-2"
          >
            <PlayCircle className="w-5 h-5" />
            {t('hero.cta_secondary') || 'Learn More'}
          </button>
        </motion.div>

        {/* Hero Visual - Single Cohesive Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Glow Effect behind image */}
          <div className="absolute -inset-1 bg-gradient-to-r from-islamic-green to-islamic-blue opacity-20 blur-2xl rounded-[30px]" />

          {/* Dashboard Preview Container */}
          <div className="relative rounded-2xl border bg-background/50 backdrop-blur shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] ring-1 ring-white/10">
            {/* Mock Browser Header */}
            <div className="h-8 border-b bg-muted/30 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
              <div className="w-3 h-3 rounded-full bg-green-400/50" />
            </div>

            {/* Mock Dashboard Content - Simplified wireframe look */}
            <div className="p-6 grid grid-cols-12 gap-6 h-full bg-muted/5">
              {/* Sidebar */}
              <div className="hidden md:block col-span-2 space-y-3">
                <div className="h-8 w-24 bg-muted/20 rounded-lg animate-pulse" />
                <div className="h-4 w-full bg-muted/20 rounded animate-pulse delay-100" />
                <div className="h-4 w-full bg-muted/20 rounded animate-pulse delay-200" />
                <div className="h-4 w-3/4 bg-muted/20 rounded animate-pulse delay-300" />
              </div>

              {/* Main Content */}
              <div className="col-span-12 md:col-span-7 space-y-4">
                <div className="h-32 w-full bg-gradient-to-r from-islamic-green/10 to-islamic-blue/5 rounded-xl border border-white/5" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 w-full bg-background rounded-xl border shadow-sm" />
                  <div className="h-24 w-full bg-background rounded-xl border shadow-sm" />
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="hidden md:block col-span-3 space-y-4">
                <div className="h-40 w-full bg-background rounded-xl border shadow-sm flex items-center justify-center text-muted-foreground/20 text-sm">
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
          <p>{t('hero.users') || 'Trusted by 10,000+ Muslims worldwide'}</p>
          <div className="flex justify-center gap-1 mt-2 text-islamic-gold">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
