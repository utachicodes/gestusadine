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
      "Daily Hadith & Ayah Widgets",
      "Community Read Access"
    ],
    cta: "Start Learning",
    popular: false,
    gradient: "from-blue-500/10 to-transparent"
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
      "Full Community Participation",
      "Document Analysis Tools"
    ],
    cta: "Join the Circle",
    popular: true,
    gradient: "from-primary/20 to-transparent"
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
      "Advanced Analytic Insights",
      "API Access for Developers"
    ],
    cta: "Contact Sales",
    popular: false,
    gradient: "from-purple-500/10 to-transparent"
  }
];

const PricingComparison = () => {
  return (
    <section className="py-40 bg-[#050505] relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill border-white/5 mb-8"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Investment</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "expo.out" }}
            className="text-5xl md:text-8xl font-black text-white tracking-tightest leading-[0.85]"
          >
            A path for every <br />
            <span className="text-white/20">student.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch max-w-7xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.1, ease: "expo.out" }}
              className={`group relative p-12 rounded-[3.5rem] flex flex-col glass-premium border-white/5 transition-all duration-700 hover:border-white/10 ${
                tier.popular ? 'ring-2 ring-primary/20' : ''
              }`}
            >
              {/* Card Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} rounded-[3.5rem] opacity-50 pointer-events-none`} />

              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-[10px] font-black uppercase tracking-[0.3em] text-black rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)] z-20">
                   recommended
                </div>
              )}

              <div className="relative z-10 mb-12">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                   <tier.icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-white/40 mb-6 group-hover:text-primary transition-colors">
                  {tier.name}
                </h3>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black tracking-tightest text-white">{tier.price}</span>
                  {tier.unit && <span className="text-lg font-bold text-white/20">{tier.unit}</span>}
                </div>
                {tier.price !== 'Free' && tier.name !== 'Institution' && (
                   <p className="text-[10px] mt-2 font-black tracking-widest uppercase text-white/20">fcfa / month</p>
                )}
              </div>

              <p className="relative z-10 text-sm font-medium leading-relaxed mb-12 text-white/50">
                {tier.description}
              </p>

              <div className="relative z-10 space-y-5 mb-12 flex-1">
                {tier.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-[13px] font-bold tracking-tight text-white/70">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative z-10 w-full py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-500 flex items-center justify-center gap-3 ${
                  tier.popular 
                    ? 'btn-premium' 
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {tier.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingComparison;

