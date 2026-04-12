import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import HeroSection from '@/components/landing/HeroSection';
import FeatureGrid from '@/components/landing/FeatureGrid';
import PricingComparison from '@/components/landing/PricingComparison';
import IslamicPattern from '@/components/effects/IslamicPattern';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-sacred-dark selection:bg-white/10 selection:text-white">
      <main className="flex-grow">
        {/* Cinematic Soulful Hero */}
        <HeroSection />

        {/* --- The Manifesto: Editorial Hook --- */}
        <section className="py-32 lg:py-48 relative border-y border-white/5 overflow-hidden">
           <IslamicPattern opacity={0.02} scale={1.5} className="-rotate-12" />
           
           <div className="container relative z-10 mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "expo.out" }}
                className="max-w-5xl mx-auto"
              >
                 <div className="flex items-center justify-center gap-6 mb-16 opacity-30">
                    <div className="w-12 h-px bg-white" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">The Sacred Mandate</span>
                    <div className="w-12 h-px bg-white" />
                 </div>
                 
                 <h2 className="font-serif-premium text-4xl md:text-7xl lg:text-8xl text-white mb-20 tracking-tightest leading-tight">
                    "Knowledge is not locked behind foreign terms—it is spoken in the <span className="text-accent italic">language the heart</span> understands."
                 </h2>

                 <div className="flex flex-col items-center gap-8">
                    <div className="w-32 h-32 rounded-full border border-white/5 p-1 flex items-center justify-center bg-white/[0.02]">
                       <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" 
                        alt="Visionary" 
                        className="w-full h-full object-cover rounded-full grayscale opacity-40 hover:opacity-100 transition-opacity duration-1000" 
                       />
                    </div>
                    <div className="text-center">
                       <p className="font-serif-premium text-2xl text-white italic mb-1">GëstuSaDine Vision Team</p>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/50">Mission Core</p>
                    </div>
                 </div>
              </motion.div>
           </div>
        </section>

        {/* --- Feature Ecosystem: Artisanal Grid --- */}
        <FeatureGrid />

        {/* --- Pricing: Typographic Comparison --- */}
        <PricingComparison />

        {/* --- Final Ascension: Editorial CTA --- */}
        <section className="py-48 lg:py-72 relative overflow-hidden bg-sacred-dark">
           {/* Atmospheric Light */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80vh] bg-accent/5 blur-[200px] pointer-events-none" />
           
           <div className="container relative z-10 px-4 mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "expo.out" }}
                className="max-w-7xl mx-auto"
              >
                  <h2 className="font-serif-premium text-[12vw] lg:text-[15vw] leading-[0.75] tracking-tightest mb-32 text-white italic">
                    Begin the <br />
                    <span className="not-italic text-accent/20">Journey.</span>
                  </h2>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/login')}
                    className="btn-premium px-24 py-8 shadow-2xl"
                  >
                    {t('nav.signin')}
                  </motion.button>

                  <p className="mt-24 text-white/20 font-black uppercase tracking-[0.8em] text-[9px] italic">
                    The Modern Islamic Lifestyle Ecosystem
                  </p>
              </motion.div>
           </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
