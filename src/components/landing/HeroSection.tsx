import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const HeroSection = () => {
  const navigate = useNavigate();
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(".hero-badge", { y: 20, opacity: 0, duration: 0.8, ease: "back.out(1.7)" })
      .from(".hero-title", { y: 100, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.4")
      .from(".hero-descr", { y: 20, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6")
      .from(".hero-cta", { y: 20, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }, "-=0.6");
  }, { scope: container });

  return (
    <section ref={container} className="relative pt-44 pb-32 lg:pt-64 lg:pb-48 bg-premium-gray overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 flex flex-col items-center text-center">
        
        {/* Mirror: "Make your guests feel special with Guest Feature" Badge */}
        <div className="hero-badge mb-10">
          <button className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/[0.03] border border-slate-950/[0.05] hover:bg-slate-950/[0.05] transition-all">
            <span className="bg-slate-950 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Now</span>
            <span className="text-[11px] font-bold text-slate-600">The Council is ready to consult with you —</span>
            <span className="text-[11px] font-black text-slate-950 border-b border-slate-950/20 group-hover:border-slate-950 transition-all">Start consultation →</span>
          </button>
        </div>

        {/* Mirror: THE BIG TITLE */}
        <h1 className="hero-title max-w-5xl text-6xl md:text-8xl lg:text-[7vw] font-black text-slate-950 tracking-tightest leading-[0.9] mb-12">
          A knowledge system <br className="hidden md:block" />
          that works like a <span className="pill-highlight-mint animate-pulse">Council</span>
        </h1>

        {/* Mirror: Description */}
        <p className="hero-descr max-w-3xl text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-14 px-4">
          Great journeys deserve a system that does it all—from making sense of 1,400 years of tradition to providing documented clarity for every modern inquiry.
        </p>

        {/* Mirror: DUAL CTAs */}
        <div className="hero-cta flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="pill-primary shadow-2xl shadow-slate-300"
          >
            <span>Start Consultation</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1" />
          </button>
          
          <button
            onClick={() => navigate('/podcasts')}
            className="pill-secondary"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center -ml-5 mr-3 overflow-hidden border border-slate-200">
               <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=50" className="w-full h-full object-cover" />
            </div>
            <span>Listen to Library</span>
          </button>
        </div>

        {/* --- Background Shader Decorations --- */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 opacity-20 -z-1" />
        <div className="absolute top-1/2 left-1/4 w-px h-64 bg-slate-200 opacity-20 -z-1" />
        <div className="absolute top-1/2 right-1/4 w-px h-64 bg-slate-200 opacity-20 -z-1" />
      </div>
    </section>
  );
};

export default HeroSection;
