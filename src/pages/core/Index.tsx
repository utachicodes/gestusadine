import * as React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, BookOpen, Sparkles, ArrowRight, Library, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PricingComparison } from '@/components/landing/PricingComparison';
import { GlassTiltCard } from '@/components/ui/GlassTiltCard';
import { motion, useScroll, useTransform } from 'framer-motion';

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Parallax effect for background elements
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-deep-slate text-white selection:bg-cyan-glow/30 selection:text-white">
      {/* Global Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div style={{ y: y1 }} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-glow/5 rounded-full blur-[150px]" />
        <motion.div style={{ y: y2 }} className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[150px]" />
      </div>

      <main className="flex-grow relative z-10">
        <HeroSection />

        {/* Features Section */}
        <section className="py-32 relative">
          <div className="container relative z-10 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-24"
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                Discover Your <span className="text-glow-cyan text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow to-blue-400">Digital Gateway</span>
              </h2>
              <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
                Everything you need to strengthen your faith, powered by the convergence of authentic scholarship and advanced intelligence.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <GlassTiltCard delay={0.1}>
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-glow mb-10 group-hover:border-cyan-glow/50 group-hover:bg-cyan-glow/5 transition-all shadow-[0_0_20px_rgba(0,245,255,0.05)]">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{t('index.guided_fatwa_title') || "AI-Guided Fatwa"}</h3>
                <p className="text-white/40 leading-relaxed mb-10 font-medium">
                  {t('index.guided_fatwa_desc') || "Get precise, context-aware answers derived from authentic Islamic sources instantly."}
                </p>
                <Link to="/fatwa" className="inline-flex items-center text-cyan-glow font-black uppercase tracking-widest text-xs hover:gap-4 transition-all group/link">
                  {t('index.try_it_now') || "Explore Fatwas"} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </GlassTiltCard>

              <GlassTiltCard delay={0.2}>
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-glow mb-10 group-hover:border-cyan-glow/50 group-hover:bg-cyan-glow/5 transition-all shadow-[0_0_20px_rgba(0,245,255,0.05)]">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{t('index.daily_islam_title') || "Daily Guidance"}</h3>
                <p className="text-white/40 leading-relaxed mb-10 font-medium">
                  {t('index.daily_islam_desc') || "Stay connected with daily reminders, prayer times, and personalized spiritual tracking."}
                </p>
                <Link to="/dashboard" className="inline-flex items-center text-cyan-glow font-black uppercase tracking-widest text-xs hover:gap-4 transition-all group/link">
                  {t('index.see_today') || "Go to Dashboard"} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </GlassTiltCard>

              <GlassTiltCard delay={0.3}>
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-glow mb-10 group-hover:border-cyan-glow/50 group-hover:bg-cyan-glow/5 transition-all shadow-[0_0_20px_rgba(0,245,255,0.05)]">
                  <Library className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{t('index.library_title') || "Rich Library"}</h3>
                <p className="text-white/40 leading-relaxed mb-10 font-medium">
                  {t('index.library_desc') || "Access a vast collection of Islamic texts, hadiths, and scholarly works in multiple languages."}
                </p>
                <Link to="/library" className="inline-flex items-center text-cyan-glow font-black uppercase tracking-widest text-xs hover:gap-4 transition-all group/link">
                  {t('index.browse_books') || "Browse Library"} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </GlassTiltCard>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-32 relative bg-white/[0.01] border-y border-white/5">
          <div className="container relative z-10 px-4">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-24"
              >
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                  The Journey to <span className="text-glow-cyan">Enlightenment</span>
                </h2>
                <p className="text-xl text-white/40 font-medium leading-relaxed">{t('index.how_subtitle')}</p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((step, idx) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="glass-card-premium p-10 border border-white/5 hover:border-cyan-glow/20 transition-all group"
                  >
                    <div className="flex items-start gap-8">
                      <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-cyan-glow group-hover:border-cyan-glow/50 group-hover:bg-cyan-glow/5 transition-all font-black text-xl shadow-[0_0_20px_rgba(0,245,255,0.05)]`}>
                        {step}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-white mb-3 tracking-tight">{t(`index.step${step}_title`)}</h4>
                        <p className="text-white/40 leading-relaxed font-medium text-sm">{t(`index.step${step}_desc`)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Comparison */}
        <PricingComparison onSelectPlan={(tier) => {
          if (tier === 'free') {
            navigate('/login');
          } else {
            navigate('/login?upgrade=' + tier);
          }
        }} />

        {/* Final CTA */}
        <section className="py-48 relative overflow-hidden">
          <div className="container relative z-10 px-4">
            <div className="glass-card-premium max-w-5xl mx-auto text-center !p-20 relative border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-glow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-10 group-hover:border-cyan-glow/50 group-hover:bg-cyan-glow/5 transition-all shadow-[0_0_30px_rgba(0,245,255,0.1)]">
                <Sparkles className="w-12 h-12 text-cyan-glow animate-pulse" />
              </div>

              <h2 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-tight">
                {t('index.final_cta_title')}
              </h2>

              <p className="text-2xl text-white/40 mb-16 leading-relaxed max-w-3xl mx-auto font-medium">
                {t('index.final_cta_desc')}
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <Link to="/login" className="btn-premium px-16 py-6 text-xl">
                  {t('index.ask_question_btn')}
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
