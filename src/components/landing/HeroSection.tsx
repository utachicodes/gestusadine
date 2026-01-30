import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-islamic-cream/30 via-islamic-light to-islamic-green-100/20'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        {/* Floating Blobs */}
        <div
          className='absolute top-1/4 left-1/4 w-96 h-96 bg-islamic-green/10 rounded-full blur-3xl opacity-30'
          style={{ animation: 'float-continuous 15s ease-in-out infinite' }}
        />
        <div
          className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-islamic-blue/10 rounded-full blur-3xl opacity-30'
          style={{ animation: 'float-continuous 12s ease-in-out infinite 2s' }}
        />
        <div
          className='absolute top-1/2 right-1/3 w-72 h-72 bg-islamic-gold/5 rounded-full blur-3xl opacity-40'
          style={{ animation: 'float-continuous 18s ease-in-out infinite 4s' }}
        />

        {/* Animated Gradient Overlay */}
        <div
          className='absolute inset-0 opacity-20'
          style={{
            background: 'linear-gradient(135deg, rgba(143, 163, 196, 0.1) 0%, rgba(224, 232, 243, 0.05) 50%, rgba(143, 163, 196, 0.1) 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradient-flow 10s ease infinite'
          }}
        />
      </div>

      {/* Content */}
      <div className='container relative z-10 px-6'>
        <div className='max-w-5xl mx-auto text-center'>
          {/* Badge */}
          <div
            className='inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 islamic-card'
            style={{ animation: 'scale-in 0.6s ease-out' }}
          >
            <Sparkles className='w-4 h-4 text-islamic-green' />
            <span className='text-sm font-medium text-islamic-dark/80'>
              {t('hero.badge') || 'AI-Powered Islamic Guidance'}
            </span>
          </div>

          {/* Main Heading with Stagger Animation */}
          <h1
            className='text-5xl md:text-6xl lg:text-7xl font-bold text-islamic-dark mb-6 leading-tight'
            style={{ animation: 'slide-fade-up 0.8s ease-out 0.2s both' }}
          >
            {t('hero.title_1') || 'Your Digital'}{' '}
            <span
              className='text-gradient relative inline-block'
              style={{ animation: 'slide-fade-up 0.8s ease-out 0.4s both' }}
            >
              {t('hero.title_highlight') || 'Islamic Companion'}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className='text-xl md:text-2xl text-islamic-dark/70 mb-10 max-w-3xl mx-auto leading-relaxed'
            style={{ animation: 'slide-fade-up 0.8s ease-out 0.6s both' }}
          >
            {t('hero.subtitle') || 'Experience authentic Islamic knowledge powered by AI. Get instant answers, personalized guidance, and spiritual growth, all in one platform.'}
          </p>

          {/* CTA Buttons */}
          <div
            className='flex flex-col sm:flex-row gap-4 justify-center items-center'
            style={{ animation: 'slide-fade-up 0.8s ease-out 0.8s both' }}
          >
            <button
              onClick={() => navigate('/login')}
              className='btn-islamic group relative'
            >
              <span className='relative z-10 flex items-center gap-2'>
                {t('hero.cta_primary') || 'Start Your Journey'}
                <ArrowRight className='w-5 h-5 transition-transform group-hover:translate-x-1' />
              </span>
            </button>

            <button
              onClick={() => navigate('/about')}
              className='btn-islamic-outlined group'
            >
              <span className='flex items-center gap-2'>
                {t('hero.cta_secondary') || 'Learn More'}
                <Star className='w-4 h-4 transition-transform group-hover:rotate-12' />
              </span>
            </button>
          </div>

          {/* Social Proof / Trust Indicators */}
          <div
            className='mt-12 flex flex-wrap justify-center items-center gap-8 text-islamic-dark/60'
            style={{ animation: 'slide-fade-up 0.8s ease-out 1s both' }}
          >
            <div className='flex items-center gap-2'>
              <div className='flex -space-x-2'>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className='w-8 h-8 rounded-full bg-gradient-to-br from-islamic-green to-islamic-blue border-2 border-white'
                  />
                ))}
              </div>
              <span className='text-sm font-medium'>
                {t('hero.users') || '10,000+ Active Users'}
              </span>
            </div>

            <div className='flex items-center gap-1'>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className='w-4 h-4 fill-islamic-gold text-islamic-gold' />
              ))}
              <span className='text-sm font-medium ml-2'>
                {t('hero.rating') || '4.9/5 Rating'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className='absolute bottom-8 left-1/2 -translate-x-1/2'
        style={{ animation: 'bounce-subtle 2s ease-in-out infinite' }}
      >
        <div className='w-6 h-10 rounded-full border-2 border-islamic-dark/20 flex items-start justify-center p-2'>
          <div className='w-1.5 h-3 rounded-full bg-islamic-dark/40' />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
