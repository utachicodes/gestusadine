import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import IslamicPattern from '@/components/effects/IslamicPattern';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(".hero-glow", { 
      scale: 0.8, 
      opacity: 0, 
      duration: 2.5, 
      ease: "expo.out" 
    })
    .from(".hero-content > *", { 
      y: 40, 
      opacity: 0, 
      duration: 1.2, 
      stagger: 0.15, 
      ease: "expo.out" 
    }, "-=1.8")
    .to(".hero-pattern", {
      opacity: 0.1,
      duration: 3,
      ease: "power2.inOut"
    }, "-=1.5");

    // Interactive mouse glow
    const glow = document.querySelector(".mouse-glow") as HTMLElement;
    window.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      gsap.to(glow, {
        x: clientX,
        y: clientY,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  }, { scope: container });

  return (
    <section ref={container} className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-moving-gradient">
      {/* Background Layers */}
      <IslamicPattern opacity={0.03} className="hero-pattern" />
      
      {/* Immersive Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-primary/20 rounded-full blur-[150px] hero-glow pointer-events-none" />
      
      {/* Mouse Interaction Glow */}
      <div className="mouse-glow fixed top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="hero-content flex flex-col items-center max-w-5xl mx-auto">
          
          {/* Elite Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill border-white/10 mb-8 hover:border-primary/30 transition-all cursor-pointer group">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition-colors">
              {t('hero.badge_text')}
            </span>
            <ArrowRight className="w-3 h-3 text-primary group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Main Title - Out of this world animations would involve more custom work, but let's start with strong GSAP foundation */}
          <h1 className="text-6xl md:text-8xl lg:text-[8vw] font-black text-white tracking-tightest leading-[0.85] mb-12">
            <span className="block text-reveal">
               <span>{t('hero.title_part1')}</span>
            </span>
            <span className="block text-reveal text-gradient-emerald">
               <span>{t('hero.title_part2')} {t('hero.title_highlight')}</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-lg md:text-xl text-white/50 font-medium leading-relaxed mb-16 px-4">
            {t('hero.description')}
          </p>

          {/* Premium CTAs */}
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => navigate('/login')}
              className="btn-premium group"
            >
              <span className="relative z-10 flex items-center gap-3">
                {t('hero.cta_primary')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
            
            <button
              onClick={() => navigate('/media')}
              className="btn-premium-outline group"
            >
              <span className="relative z-10">
                 {t('hero.cta_secondary')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <div className="w-px h-12 bg-gradient-to-b from-primary/0 via-primary to-primary/0" />
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">Scroll</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;

