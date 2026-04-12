import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, Play, Users, Shirt, Radio, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FeatureCard = ({ step, title, descr, children, index }: any) => {
  const cardRef = useRef(null);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top bottom-=50px",
        toggleActions: "play none none reverse"
      },
      y: 100,
      opacity: 0,
      duration: 1.5,
      delay: index * 0.2,
      ease: "expo.out"
    });
  }, { scope: cardRef });

  return (
    <div ref={cardRef} className="group relative">
      <div className="relative h-[500px] w-full glass-premium rounded-[3rem] p-10 flex flex-col justify-between overflow-hidden transition-all duration-700 hover:shadow-[0_0_80px_rgba(16,185,129,0.1)] group-hover:-translate-y-4">
        {/* Animated Background Decoration */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-12">
            <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">Pillar {step}</span>
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-500">
               <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          
          <h3 className="text-3xl font-black text-white mb-6 tracking-tight leading-none group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm font-medium text-white/40 leading-relaxed max-w-[200px]">
            {descr}
          </p>
        </div>

        {/* Dynamic Visual Content */}
        <div className="relative h-48 w-full mt-8 preserve-3d perspective-1000">
           <div className="w-full h-full transition-transform duration-1000 group-hover:rotate-y-12 group-hover:rotate-x-6">
              {children}
           </div>
        </div>
      </div>
    </div>
  );
};

const FeatureGrid = () => {
  const { t } = useLanguage();
  const container = useRef(null);

  return (
    <section ref={container} className="py-40 bg-[#050505] relative">
      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="mb-32 text-center max-w-3xl mx-auto">
           <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tightest">
              Built for the <br />
              <span className="text-gradient-emerald">Next Generation</span>
           </h2>
           <p className="text-white/40 font-medium">
              We've redesigned the Islamic experience from the ground up, merging ancient wisdom with future technology.
           </p>
        </div>

        {/* Row 1: The Core 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          
          <FeatureCard 
            step="01"
            index={0}
            title={t('pillar.education.title')}
            descr={t('pillar.education.desc')}
          >
            <div className="w-full h-full flex items-center justify-center">
               <div className="w-4/5 aspect-video bg-emerald-950/40 rounded-2xl border border-primary/20 flex flex-col gap-3 p-4 relative overflow-hidden">
                  <Play className="w-8 h-8 text-primary/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <div className="h-4 w-1/2 bg-white/5 rounded-full" />
                  <div className="space-y-2">
                     <div className="h-1.5 w-full bg-white/5 rounded-full" />
                     <div className="h-1.5 w-2/3 bg-white/5 rounded-full" />
                  </div>
                  <div className="mt-auto h-8 w-full bg-primary/10 rounded-lg border border-primary/10" />
               </div>
            </div>
          </FeatureCard>

          <FeatureCard 
            step="02"
            index={1}
            title={t('pillar.ai.title')}
            descr={t('pillar.ai.desc')}
          >
            <div className="w-full h-full flex items-center justify-center">
               <div className="w-4/5 h-full glass-premium rounded-3xl border-primary/30 flex flex-col gap-4 p-6 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                  <div className="flex gap-3">
                     <div className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center">
                        <MessageSquare className="w-5 h-5" />
                     </div>
                     <div className="space-y-1.5">
                        <div className="h-2 w-20 bg-white/20 rounded-full" />
                        <div className="h-1.5 w-32 bg-white/5 rounded-full" />
                     </div>
                  </div>
                  <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/5">
                     <div className="h-1.5 w-full bg-white/10 rounded-full mb-2" />
                     <div className="h-1.5 w-2/3 bg-white/10 rounded-full" />
                  </div>
               </div>
            </div>
          </FeatureCard>

          <FeatureCard 
            step="03"
            index={2}
            title={t('pillar.community.title')}
            descr={t('pillar.community.desc')}
          >
           <div className="w-full h-full flex items-center justify-center">
               <div className="w-4/5 h-4/5 bg-white/5 rounded-3xl border border-white/10 flex flex-col p-6">
                  <div className="flex items-center gap-4 mb-8">
                     <Users className="w-6 h-6 text-primary" />
                     <div className="h-2 w-32 bg-white/10 rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 flex-1">
                     <div className="bg-primary/20 rounded-2xl border border-primary/20 p-4" />
                     <div className="bg-white/5 rounded-2xl border border-white/5 p-4" />
                     <div className="bg-white/5 rounded-2xl border border-white/5 p-4" />
                     <div className="bg-white/5 rounded-2xl border border-white/5 p-4" />
                  </div>
               </div>
            </div>
          </FeatureCard>

          <FeatureCard 
            step="04"
            index={3}
            title={t('pillar.fashion.title')}
            descr={t('pillar.fashion.desc')}
          >
            <div className="w-full h-full flex items-center justify-center">
               <div className="w-4/5 h-full bg-zinc-900 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center gap-6 shadow-2xl">
                  <Shirt className="w-16 h-16 text-primary/50" />
                  <div className="flex gap-2">
                     <div className="w-8 h-8 rounded-full border border-white/10" />
                     <div className="w-8 h-8 rounded-full bg-primary" />
                     <div className="w-8 h-8 rounded-full border border-white/10" />
                  </div>
               </div>
            </div>
          </FeatureCard>

          <FeatureCard 
            step="05"
            index={4}
            title={t('pillar.podcasts.title')}
            descr={t('pillar.podcasts.desc')}
          >
            <div className="w-full h-full flex items-center justify-center p-8">
               <div className="w-full h-full glass-premium rounded-[2.5rem] border-white/10 flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-white/5 flex gap-4">
                     <Radio className="w-6 h-6 text-primary" />
                     <div className="h-2 w-24 bg-white/20 rounded-full" />
                  </div>
                  <div className="flex-1 flex items-end gap-1 px-4 py-8">
                     {[40, 70, 50, 90, 60, 80, 45, 65, 85].map((h, i) => (
                        <div key={i} className="flex-1 bg-primary/20 rounded-full group-hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }} />
                     ))}
                  </div>
               </div>
            </div>
          </FeatureCard>

          {/* New Interactive Pillar / Join CTA */}
          <div className="h-[500px] flex items-center justify-center">
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => navigate('/login')}
               className="w-full h-full bg-primary/10 border border-primary/20 rounded-[3rem] p-10 flex flex-col items-center justify-center gap-6 group hover:bg-primary/20 transition-all duration-700"
             >
                <div className="w-20 h-20 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
                   <ArrowUpRight className="w-10 h-10" />
                </div>
                <span className="text-xl font-black text-white uppercase tracking-widest">
                   {t('index.learn_more')}
                </span>
             </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;

