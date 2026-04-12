import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  MessageSquare, Play, Users, Shirt, Radio, 
  ArrowUpRight, Sparkles
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FeatureCard = ({ step, title, descr, image, index }: any) => {
  const cardRef = useRef(null);

  return (
    <div ref={cardRef} className="group relative h-full">
      <div className="relative h-full flex flex-col justify-between overflow-hidden transition-all duration-700 p-8 lg:p-12 border-l border-white/5 hover:border-accent/20">
        <div className="relative z-10 mb-20">
          <div className="flex justify-between items-start mb-12">
            <span className="text-[10px] font-black tracking-[0.6em] text-accent/30 uppercase italic font-serif-premium">Pillar {step}</span>
             <Sparkles className="w-4 h-4 text-white/10 group-hover:text-accent transition-colors duration-700" />
          </div>
          
          <h3 className="font-serif-premium text-4xl lg:text-5xl text-white mb-8 tracking-tightest leading-none group-hover:italic transition-all">
            {title}
          </h3>
          <p className="text-sm font-medium text-white/30 leading-relaxed max-w-[280px] tracking-wide">
            {descr}
          </p>
        </div>

        {/* Artisanal Photography Mask */}
        <div className="relative h-96 w-full mt-auto mask-radial-faded grayscale hover:grayscale-0 transition-all duration-1000 opacity-40 group-hover:opacity-100">
           <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover rounded-[3rem] scale-110 group-hover:scale-100 transition-transform duration-1000" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-sacred-dark to-transparent opacity-60" />
        </div>
        
        <div className="mt-8 flex justify-end">
           <div className="flex items-center gap-4 text-white/20 group-hover:text-accent transition-colors">
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Learn more</span>
              <ArrowUpRight className="w-5 h-5" />
           </div>
        </div>
      </div>
    </div>
  );
};

const FeatureGrid = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const container = useRef(null);

  return (
    <section ref={container} className="py-24 bg-sacred-dark relative border-y border-white/5">
      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="mb-32 flex flex-col lg:flex-row items-end justify-between gap-12">
           <div className="max-w-2xl">
              <h2 className="font-serif-premium text-5xl md:text-8xl text-white tracking-tightest leading-[0.85] mb-8">
                The Anatomy of <br />
                <span className="text-gradient-platinum italic">Ascension.</span>
              </h2>
           </div>
           <p className="text-white/30 font-medium max-w-sm mb-4 leading-relaxed tracking-wide">
              We've crafted an ecosystem that speaks to the soul, merging traditional wisdom with modern elegance.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          
          <FeatureCard 
            step="01"
            index={0}
            title={t('pillar.education.title')}
            descr={t('pillar.education.desc')}
            image="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800"
          />

          <FeatureCard 
            step="02"
            index={1}
            title={t('pillar.ai.title')}
            descr={t('pillar.ai.desc')}
            image="https://images.unsplash.com/photo-1614850523296-e811cf9ee16d?auto=format&fit=crop&q=80&w=800"
          />

          <FeatureCard 
            step="03"
            index={2}
            title={t('pillar.community.title')}
            descr={t('pillar.community.desc')}
            image="https://images.unsplash.com/photo-1528605248644-14dd04cb11c1?auto=format&fit=crop&q=80&w=800"
          />

          <FeatureCard 
            step="04"
            index={3}
            title={t('pillar.fashion.title')}
            descr={t('pillar.fashion.desc')}
            image="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
          />

          <FeatureCard 
            step="05"
            index={4}
            title={t('pillar.podcasts.title')}
            descr={t('pillar.podcasts.desc')}
            image="https://images.unsplash.com/photo-1478737270239-2fccd2c7fd94?auto=format&fit=crop&q=80&w=800"
          />

          {/* Editorial CTA */}
          <div className="flex flex-col items-center justify-center p-12 text-center group">
              <h4 className="font-serif-premium text-4xl text-white mb-10 opacity-40 group-hover:opacity-100 transition-opacity">
                Your path is unique. <br /> Start it today.
              </h4>
              <button 
                onClick={() => navigate('/login')}
                className="btn-premium-outline px-12 group-hover:bg-accent group-hover:text-black transition-all"
              >
                Enter the Sacred
              </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
