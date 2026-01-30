import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, PlayCircle, Clock, MessageCircle, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Floating animation variants
  const floatingAnimation = (duration: number, delay: number = 0) => ({
    y: [0, -15, 0],
    transition: {
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: "easeInOut"
    }
  });

  return (
    <section className='relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-background via-islamic-cream/20 to-background'>
      {/* Background - subtle geometric depth */}
      <div className='absolute inset-0 z-0 opacity-10 pointer-events-none'>
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-islamic-green/20 to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-islamic-blue/20 to-transparent blur-3xl" />
      </div>

      <div className='container relative z-10 px-6'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-20 items-center'>

          {/* LEFT: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className='max-w-2xl'
          >
            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6'>
              GestuSaDine
              <span className='block text-gradient mt-2'>
                {t('hero.title_highlight') || 'Islamic Companion'}
              </span>
            </h1>

            <p className='text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg'>
              {t('hero.subtitle') || 'Your complete Islamic ecosystem. Authentic knowledge, daily spiritual tools, and community connection in one premium platform.'}
            </p>

            <div className='flex flex-wrap gap-4'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className='btn-islamic px-8 py-4 text-lg rounded-xl shadow-lg shadow-islamic-green/20 flex items-center gap-3'
              >
                {t('hero.cta_primary') || 'Get Started'}
                <ArrowRight className='w-5 h-5' />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/about')}
                className='px-8 py-4 text-lg font-medium text-foreground bg-background border border-border/50 rounded-xl hover:bg-accent/5 transition-colors flex items-center gap-3 shadow-sm'
              >
                <PlayCircle className='w-5 h-5 text-islamic-gold' />
                {t('hero.cta_secondary') || 'How it works'}
              </motion.button>
            </div>

            <div className='mt-12 flex items-center gap-6 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-white border-2 border-background shadow-sm" />
                  ))}
                </div>
                <span className="font-medium ml-2">{t('hero.users') || '10k+ Users'}</span>
              </div>
              <div className="w-px h-8 bg-border/50" />
              <div className='flex items-center gap-1.5'>
                <Star className='w-4 h-4 fill-islamic-gold text-islamic-gold' />
                <span className="font-medium">{t('hero.rating') || '4.9/5 Rating'}</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Visual composition */}
          <div className='relative h-[600px] hidden lg:block perspective-1000'>

            {/* Main Dashboard Card (Center) */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] bg-background/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 z-20"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-islamic-green/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-islamic-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Imam AI</h3>
                    <p className="text-xs text-muted-foreground">Online • Replies instantly</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-xl rounded-tl-none max-w-[85%] text-sm">
                  As-salamu alaykum! How can I assist you with your questions today?
                </div>
                <div className="p-3 bg-islamic-green/10 text-islamic-dark rounded-xl rounded-tr-none max-w-[85%] ml-auto text-sm">
                  What is the ruling on combining prayers during travel?
                </div>
                <div className="p-3 bg-muted/50 rounded-xl rounded-tl-none max-w-[90%] text-sm">
                  According to the majority of scholars, it is permissible to combine Dhuhr with Asr, and Maghrib with Isha when traveling...
                </div>
              </div>
            </motion.div>

            {/* Floating Element 1: Prayer Card (Top Right) */}
            <motion.div
              animate={floatingAnimation(6, 0)}
              className="absolute top-20 -right-4 w-60 bg-white/80 dark:bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-4 z-30"
            >
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-islamic-gold" />
                <span className="font-semibold text-sm">Next Prayer: Asr</span>
              </div>
              <div className="text-2xl font-bold text-foreground">16:45</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-islamic-gold h-full w-[65%]" />
              </div>
            </motion.div>

            {/* Floating Element 2: Book/Library (Bottom Left) */}
            <motion.div
              animate={floatingAnimation(7, 1)}
              className="absolute bottom-32 -left-8 w-64 bg-white/80 dark:bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-4 z-30"
            >
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-5 h-5 text-islamic-blue" />
                <span className="font-semibold text-sm">Daily Reading</span>
              </div>
              <div className="text-sm text-foreground/80 font-medium">Riyad as-Salihin</div>
              <p className="text-xs text-muted-foreground mt-1">Book 1, Hadith 5</p>
              <div className="flex -space-x-1 mt-3">
                <div className="w-6 h-6 rounded-full bg-islamic-blue/20 flex items-center justify-center text-[10px]">A</div>
                <div className="w-6 h-6 rounded-full bg-islamic-green/20 flex items-center justify-center text-[10px]">M</div>
                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] text-muted-foreground">+5</div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
