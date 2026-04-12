import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import IslamicPattern from '@/components/effects/IslamicPattern';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(".hero-line", {
      y: 100,
      opacity: 0,
      stagger: 0.2,
      duration: 1.5,
      ease: "power4.out"
    })
    .from(".hero-sub", {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: "power2.out"
    }, "-=0.5")
    .from(".hero-cta", {
      scale: 0.9,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out"
    }, "-=0.2");
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-sacred-dark pt-32 pb-40"
    >
      <IslamicPattern opacity={0.03} scale={2} className="rotate-12 translate-x-1/4" />
      
      {/* Editorial Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-px h-64 bg-white/5 hidden lg:block" />
      <div className="absolute bottom-1/4 right-10 w-px h-64 bg-white/5 hidden lg:block" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center gap-4 mb-16"
        >
          <div className="w-12 h-px bg-accent/20" />
          <span className="text-[10px] font-black uppercase tracking-widest-xl text-accent/60">
             The Ascension begins
          </span>
          <div className="w-12 h-px bg-accent/20" />
        </motion.div>

        <div className="max-w-6xl mx-auto mb-20">
          <h1 className="hero-line font-serif-premium text-7xl md:text-[10vw] lg:text-[12vw] leading-[0.85] tracking-tightest text-white italic mb-12">
            Faith in a <br />
            <span className="not-italic text-accent">New Light.</span>
          </h1>
          <p className="hero-sub text-lg md:text-xl font-medium text-white/40 max-w-2xl mx-auto leading-relaxed uppercase tracking-widest">
            {t('hero.subtitle')}
          </p>
        </div>

        <div className="hero-cta">
           <button
             onClick={() => navigate('/login')}
             className="btn-premium group flex items-center gap-6"
           >
             {t('hero.cta')}
             <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
           </button>
           
           <div className="mt-12 flex items-center justify-center gap-8">
              {['Authentic', 'Secured', 'AI-Assisted'].map((item) => (
                 <span key={item} className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10">
                    {item}
                 </span>
              ))}
           </div>
        </div>
      </div>

      {/* Floating Star Elements */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="w-px h-12 bg-white/10" />
          <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20">Scroll to Explore</span>
      </div>
    </section>
  );
};

export default HeroSection;
