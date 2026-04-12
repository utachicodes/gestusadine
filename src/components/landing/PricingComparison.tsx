import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

const tiers = [
  {
    name: "Seeker",
    price: "Free",
    description: "Ideal for individual explorers beginning their journey into Islamic knowledge.",
    features: [
      "Access to Public Library",
      "Limited AI Council Consultations",
      "Daily Hadith & Ayah Widgets",
      "Community Read Access"
    ],
    cta: "Start Learning",
    popular: false,
    dark: false
  },
  {
    name: "Student",
    price: "10,000",
    unit: "/mo",
    description: "For serious students seeking deep traditional guidance and AI-powered research tools.",
    features: [
      "Unlimited AI Council Access",
      "Advanced Scholarly Archives",
      "Priority Podcast Access",
      "Full Community Participation",
      "Document Analysis Tools"
    ],
    cta: "Join the Circle",
    popular: true,
    dark: true
  },
  {
    name: "Institution",
    price: "Negotiable",
    description: "Custom solutions for mosques, schools, and organizations to manage their own RAG knowledge.",
    features: [
      "Multi-user Admin Console",
      "Private RAG Knowledge Base",
      "White-labeled Library",
      "Advanced Analytic Insights",
      "API Access for Developers"
    ],
    cta: "Contact Sales",
    popular: false,
    dark: false
  }
];

const PricingComparison = () => {
  return (
    <section className="py-32 bg-premium-gray relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-24">
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-600 mb-8"
          >
            The Investment
          </motion.h3>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter leading-tight"
          >
            A path for every <br />
            <span className="text-slate-300">student of knowledge.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -12 }}
              className={`relative p-12 rounded-[3.5rem] flex flex-col border transition-all duration-500 ${
                tier.dark 
                  ? 'bg-slate-950 border-slate-900 text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] z-10' 
                  : 'bg-white border-slate-100 text-slate-950 hover:border-slate-200 shadow-xl shadow-slate-200/50'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-12 -translate-y-1/2 px-6 py-2 bg-brand-600 text-[10px] font-black uppercase tracking-[0.2em] text-white rounded-full shadow-lg shadow-brand-500/30">
                   recommended
                </div>
              )}

              <div className="mb-12">
                <p className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${tier.dark ? 'text-brand-400' : 'text-slate-400'}`}>
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tightest">{tier.price}</span>
                  {tier.unit && <span className={`text-lg font-bold ${tier.dark ? 'text-slate-500' : 'text-slate-400'}`}>{tier.unit}</span>}
                </div>
                {tier.price !== 'Free' && tier.price !== 'Negotiable' && (
                   <p className={`text-[10px] mt-2 font-black tracking-widest uppercase opacity-40`}>fcfa / month</p>
                )}
              </div>

              <p className={`text-base font-medium leading-relaxed mb-12 ${tier.dark ? 'text-slate-400' : 'text-slate-500'}`}>
                {tier.description}
              </p>

              <div className="space-y-5 mb-12 flex-1">
                {tier.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-4">
                    <div className={`p-1.5 rounded-full ${tier.dark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                      <Check className={`w-3.5 h-3.5 ${tier.dark ? 'text-brand-400' : 'text-brand-600'}`} />
                    </div>
                    <span className={`text-sm font-bold tracking-tight ${tier.dark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-3 ${
                  tier.dark 
                    ? 'bg-white text-slate-950 hover:bg-slate-100' 
                    : 'bg-slate-950 text-white hover:bg-slate-800'
                }`}
              >
                {tier.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingComparison;
