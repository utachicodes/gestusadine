import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, Library, Sparkles, PlusCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FeatureCard = ({ step, title, descr, children, index }: any) => {
  const cardRef = useRef(null);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top bottom-=100px",
        toggleActions: "play none none reverse"
      },
      y: 50,
      opacity: 0,
      duration: 1,
      delay: index * 0.1,
      ease: "power2.out"
    });
  }, { scope: cardRef });

  return (
    <div ref={cardRef} className="flex flex-col gap-8">
      <div className="relative aspect-square w-full bg-white rounded-[3rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex items-center justify-center p-8 group">
         {/* Tilted Mockup Container */}
         <div className="w-full h-full relative transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1">
            {children}
         </div>
      </div>
      
      <div className="px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-4">Step {step}:</p>
        <h3 className="text-xl font-black text-slate-950 mb-3 tracking-tight">{title}</h3>
        <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-[240px]">{descr}</p>
      </div>
    </div>
  );
};

const FeatureGrid = () => {
  const container = useRef(null);

  return (
    <section ref={container} className="py-32 bg-premium-gray">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          
          {/* Feature 1: The Library */}
          <FeatureCard 
            step="1"
            index={0}
            title="Set up your Library in minutes"
            descr="Organize your scholarly papers, books, and notes in one unified space."
          >
            <div className="absolute inset-0 flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform duration-1000">
               <div className="w-4/5 aspect-video bg-slate-950 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-white/10">
                  <div className="h-6 w-1/2 bg-white/20 rounded-full" />
                  <div className="space-y-2">
                     <div className="h-2 w-full bg-white/10 rounded-full" />
                     <div className="h-2 w-full bg-white/10 rounded-full" />
                     <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                  </div>
                  <div className="mt-auto flex justify-end">
                     <div className="px-4 py-2 bg-brand-500 rounded-lg text-[9px] font-black text-white uppercase tracking-widest">
                        Document Uploaded
                     </div>
                  </div>
               </div>
            </div>
          </FeatureCard>

          {/* Feature 2: The Council */}
          <FeatureCard 
            step="2"
            index={1}
            title="Consult the Council like a pro"
            descr="Engage with specialized AI agents that interpret tradition with modern clarity."
          >
            <div className="absolute inset-0 flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform duration-1000">
               <div className="w-4/5 h-[80%] bg-[#f0f9f6] rounded-[2.5rem] shadow-xl p-6 border border-brand-200/50 flex flex-col gap-4">
                  <div className="flex gap-3">
                     <div className="w-8 h-8 rounded-full bg-white border border-brand-100" />
                     <div className="space-y-1 flex-1">
                        <div className="h-2 w-20 bg-slate-900 rounded-full" />
                        <div className="h-1.5 w-32 bg-slate-300 rounded-full" />
                     </div>
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-2xl shadow-sm border border-brand-100">
                     <div className="h-2 w-full bg-slate-100 rounded-full mb-2" />
                     <div className="h-2 w-2/3 bg-slate-100 rounded-full" />
                  </div>
               </div>
            </div>
          </FeatureCard>

          {/* Feature 3: Deep Insights */}
          <FeatureCard 
            step="3"
            index={2}
            title="Visualize your research journey"
            descr="Watch your scholarly network grow as you connect the dots between ideas."
          >
            <div className="absolute inset-0 flex items-center justify-center -rotate-2 group-hover:rotate-0 transition-transform duration-1000">
               <div className="w-4/5 h-4/5 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col">
                  {/* Mock Chart Header */}
                  <div className="h-10 border-b border-slate-50 px-4 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-red-400" />
                     <div className="w-2 h-2 rounded-full bg-amber-400" />
                     <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-end gap-3">
                     <div className="flex items-end gap-2 h-32">
                        <div className="flex-1 bg-slate-100 rounded-t-lg h-[40%]" />
                        <div className="flex-1 bg-brand-500 rounded-t-lg h-[80%] shadow-lg shadow-brand-200" />
                        <div className="flex-1 bg-slate-100 rounded-t-lg h-[60%]" />
                        <div className="flex-1 bg-slate-100 rounded-t-lg h-[90%]" />
                        <div className="flex-1 bg-slate-100 rounded-t-lg h-[30%]" />
                     </div>
                     <div className="h-2 w-1/2 bg-slate-200 rounded-full mx-auto" />
                  </div>
               </div>
            </div>
          </FeatureCard>

        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
