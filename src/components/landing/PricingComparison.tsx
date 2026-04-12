import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';

const tiers = [
  {
    name: "Seeker",
    price: "Free",
    icon: Sparkles,
    description: "Ideal for individual explorers beginning their journey into Islamic knowledge.",
    features: [
      "Access to Public Library",
      "Limited AI Council Consultations",
      "Daily Hadith & Ayah Widgets"
    ],
    cta: "Start Learning",
    popular: false
  },
  {
    name: "Student",
    price: "10,000",
    unit: "/mo",
    icon: Zap,
    description: "For serious students seeking deep traditional guidance and AI-powered research tools.",
    features: [
      "Unlimited AI Council Access",
      "Advanced Scholarly Archives",
      "Priority Podcast Access",
      "Full Community Participation"
    ],
    cta: "Join the Circle",
    popular: true
  },
  {
    name: "Institution",
    price: "Custom",
    icon: Shield,
    description: "Custom solutions for mosques, schools, and organizations to manage their own knowledge.",
    features: [
      "Multi-user Admin Console",
      "Private RAG Knowledge Base",
      "White-labeled Library",
      "API Access for Developers"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

const PricingComparison = () => {
  return (
    <section className="py-24 bg-sacred-dark relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-12">
            <div className="max-w-2xl">
               <h2 className="font-serif-premium text-5xl md:text-8xl text-white tracking-tightest leading-none">
                 The Path to <br />
                 <span className="text-accent italic">Knowledge.</span>
               </h2>
            </div>
            <p className="text-white/30 font-medium max-w-sm mb-4 tracking-wide">
              Investment in your growth, guided by wisdom and supported by modern intelligence.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/5 bg-white/[0.01]">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.2 }}
              className={`group relative p-12 lg:p-16 flex flex-col transition-all duration-700 hover:bg-white/[0.02] ${
                index !== 2 ? 'border-b md:border-b-0 md:border-r border-white/10' : ''
              } ${tier.popular ? 'bg-white/[0.02]' : ''}`}
            >
              <div className="relative z-10 mb-16">
                <div className="text-accent/20 mb-8">
                   <tier.icon className="w-8 h-8" />
                </div>
                
                <h3 className="font-serif-premium text-2xl text-white mb-10 tracking-widest uppercase italic">
                  {tier.name}
                </h3>
                
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-6xl font-serif-premium text-white">{tier.price}</span>
                  {tier.unit && (
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-accent">{tier.unit}</span>
                       <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">FCFA</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="relative z-10 text-sm font-medium leading-relaxed mb-16 text-white/40 h-20 overflow-hidden">
                {tier.description}
              </p>

              <div className="relative z-10 space-y-6 mb-20 flex-1">
                {tier.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-4">
                    <Check className="w-4 h-4 text-accent/40 mt-0.5" />
                    <span className="text-[13px] font-bold tracking-tight text-white/60">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`relative z-10 w-full py-6 rounded-none text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700 border ${
                  tier.popular 
                    ? 'bg-accent text-black border-accent' 
                    : 'bg-transparent text-white border-white/10 hover:border-white/40'
                }`}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingComparison;
