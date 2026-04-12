import * as React from 'react';
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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#050505] selection:bg-primary/30 selection:text-white">
      <main className="flex-grow">
        {/* Cinematic Hero */}
        <HeroSection />

        {/* --- The Manifesto: Language of the Heart --- */}
        <section className="py-40 lg:py-64 relative bg-[#050505] overflow-hidden border-y border-white/5">
           <IslamicPattern opacity={0.02} className="rotate-45 scale-150" />
           
           <div className="container relative z-10 mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "expo.out" }}
                className="max-w-4xl mx-auto"
              >
                 <div className="w-16 h-1 bg-primary mx-auto mb-16 rounded-full" />
                 
                 <h2 className="text-4xl md:text-6xl font-black text-white mb-16 tracking-tightest leading-tight">
                    "Knowledge is not locked behind foreign terms anymore—it is spoken in the <span className="text-gradient-emerald">language the heart</span> thinks, feels, and lives in."
                 </h2>

                 <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 rounded-full border border-primary/30 p-1 flex items-center justify-center">
                       <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" 
                        alt="Islamic Vision" 
                        className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700" 
                       />
                    </div>
                    <div>
                       <p className="text-sm font-black uppercase tracking-[0.4em] text-white">The Visionary Core</p>
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">GëstuSaDine Mission Team</p>
                    </div>
                 </div>
              </motion.div>
           </div>
        </section>

        {/* --- Interactive Feature Ecosystem --- */}
        <FeatureGrid />

        {/* --- Global Impact / Pricing --- */}
        <div className="relative bg-[#050505] py-40 overflow-hidden">
           <IslamicPattern opacity={0.015} scale={2} />
           <PricingComparison />
        </div>

        {/* --- Final Ascension CTA --- */}
        <section className="py-64 lg:py-96 bg-moving-gradient relative overflow-hidden">
           {/* Immersive Background */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[200px] pointer-events-none" />
           
           <div className="container relative z-10 px-4 mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "expo.out" }}
                className="max-w-6xl mx-auto"
              >
                  <h2 className="text-8xl md:text-[12vw] lg:text-[15vw] font-black leading-[0.75] tracking-tightest mb-24 text-white">
                    Start your <br />
                    <span className="text-white/20">ascension.</span>
                  </h2>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="inline-block"
                  >
                    <button
                      onClick={() => navigate('/login')}
                      className="btn-premium px-24 py-10 text-xl"
                    >
                      {t('nav.signin')}
                    </button>
                  </motion.div>

                  <p className="mt-16 text-white/30 font-black uppercase tracking-[0.5em] text-[10px]">
                    Making Islam Beautiful - As It Truly Is
                  </p>
              </motion.div>
           </div>
        </section>
      </main>
      
      {/* Simple Premium Footer */}
      <footer className="py-20 bg-[#050505] border-t border-white/5 relative z-10">
         <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-10">
            <img src="/logofinal.png" alt="Logo" className="h-6 brightness-0 invert opacity-40" />
            
            <div className="flex gap-10">
               {['About', 'Privacy', 'Terms', 'Contact'].map(link => (
                  <button key={link} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-primary transition-colors">
                     {link}
                  </button>
               ))}
            </div>
            
            <p className="text-[9px] font-medium text-white/10 uppercase tracking-widest">
               &copy; {new Date().getFullYear()} GëstuSaDine Platform. ALL RIGHTS RESERVED.
            </p>
         </div>
      </footer>
    </div>
  );
};

export default Index;

