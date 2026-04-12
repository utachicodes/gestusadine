import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/landing/HeroSection';
import FeatureGrid from '@/components/landing/FeatureGrid';
import PricingComparison from '@/components/landing/PricingComparison';
import GrainShader from '@/components/effects/GrainShader';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-premium-gray selection:bg-slate-950 selection:text-white">
      {/* Global Texture Overlay */}
      <GrainShader />

      <main className="flex-grow">
        {/* --- Phase 1: Mirrored Hero --- */}
        <HeroSection />

        {/* --- Phase 2: High Contrast Feature Grid (Step 1-3) --- */}
        <FeatureGrid />

        {/* --- Phase 3: Centered Testimonial / Philosophy (Mirror Reference) --- */}
        <section className="py-32 lg:py-56 relative overflow-hidden bg-premium-gray border-t border-slate-950/[0.03]">
          <div className="container relative z-10 px-4 mx-auto text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              {/* Reference Check: Centered Circular Headshot */}
              <div className="w-20 h-20 rounded-full bg-slate-200 mx-auto mb-10 overflow-hidden border-2 border-white shadow-xl">
                 <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-2xl font-black text-slate-950 tracking-tighter mb-8 italic leading-relaxed">
                "Quick and Easy Setup"
              </h3>
              
              <blockquote className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
                "We've scaled to thousands of documents daily — Scribblit's dashboard is the only thing that keeps our research sane."
              </blockquote>

              <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-950">Jade Bird</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Event Manager, Blue Partner</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- Phase 4: Pricing Model --- */}
        <PricingComparison />

        {/* --- Phase 5: Final CTA (Stay High Contrast) --- */}
        <section className="py-48 lg:py-64 bg-slate-950 text-white relative overflow-hidden">
           <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
              <div className="absolute -top-[20%] -right-[20%] w-[100%] h-[100%] bg-brand-600 rounded-full blur-[200px]" />
           </div>

           <div className="container relative z-10 px-4 mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-5xl mx-auto"
              >
                  <h2 className="text-7xl md:text-9xl lg:text-[10vw] font-black leading-[0.8] tracking-tightest mb-16">
                    Start your <br />
                    <span className="text-slate-400">cultivation.</span>
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/login')}
                    className="px-20 py-8 bg-white text-slate-950 rounded-full font-black text-xl uppercase tracking-[0.3em] shadow-2xl transition-all"
                  >
                    Get Started Now
                  </motion.button>
              </motion.div>
           </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
