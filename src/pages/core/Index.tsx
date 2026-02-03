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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Global Ambient Background - Connecting sections */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div style={{ y: y1 }} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-islamic-blue/5 rounded-full blur-[150px] animate-pulse-glow" />
        <motion.div style={{ y: y2 }} className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-islamic-gold/5 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-islamic-green/5 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '4s' }} />

        {/* Subtle Noise Texture overlay for paper feel */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: 'url("/noise.png")' }}></div>
      </div>

      <main className="flex-grow relative z-10">
        <HeroSection />

        <section className="py-32 relative">
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('index.features_title') || "Discover Your Spiritual Tools"}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('index.features_subtitle') || "Everything you need to strengthen your faith in one beautiful platform."}</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto perspective-1000">
              <GlassTiltCard delay={0.1} className="h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-islamic-green/20 to-islamic-green/5 flex items-center justify-center text-islamic-green mb-8 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{t('index.guided_fatwa_title') || "AI-Guided Fatwa"}</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {t('index.guided_fatwa_desc') || "Get precise, context-aware answers derived from authentic Islamic sources instantly."}
                </p>
                <Link to="/fatwa" className="inline-flex items-center text-islamic-green font-semibold hover:gap-3 transition-all group">
                  {t('index.try_it_now') || "Explore Fatwas"} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </GlassTiltCard>

              <GlassTiltCard delay={0.2} className="h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-islamic-blue/20 to-islamic-blue/5 flex items-center justify-center text-islamic-blue mb-8 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{t('index.daily_islam_title') || "Daily Guidance"}</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {t('index.daily_islam_desc') || "Stay connected with daily reminders, prayer times, and personalized spiritual tracking."}
                </p>
                <Link to="/dashboard" className="inline-flex items-center text-islamic-blue font-semibold hover:gap-3 transition-all group">
                  {t('index.see_today') || "Go to Dashboard"} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </GlassTiltCard>

              <GlassTiltCard delay={0.3} className="h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-islamic-gold/30 to-islamic-gold/5 flex items-center justify-center text-islamic-gold mb-8 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                  <Library className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{t('index.library_title') || "Rich Library"}</h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {t('index.library_desc') || "Access a vast collection of Islamic texts, hadiths, and scholarly works in multiple languages."}
                </p>
                <Link to="/library" className="inline-flex items-center text-islamic-gold font-semibold hover:gap-3 transition-all group">
                  {t('index.browse_books') || "Browse Library"} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </GlassTiltCard>
            </div>
          </div>
        </section>

        {/* How it works - with glass styling */}
        <section className="py-24 relative overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {t('index.how_title_prefix')} <span className="text-gradient-gold drop-shadow-sm">{t('index.how_title_gradient')}</span>
                </h2>
                <p className="text-xl text-muted-foreground">{t('index.how_subtitle')}</p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((step, idx) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="p-8 rounded-2xl bg-card/30 backdrop-blur-sm border border-white/5 hover:bg-card/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-6">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${step === 1 ? 'from-islamic-green to-islamic-green/30' :
                          step === 2 ? 'from-islamic-blue to-islamic-blue/30' :
                            step === 3 ? 'from-islamic-gold to-islamic-gold/30' :
                              'from-purple-500 to-indigo-500'
                        } flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <span className="text-white font-bold text-xl">{step}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-foreground mb-3">{t(`index.step${step}_title`)}</h4>
                        <p className="text-muted-foreground leading-relaxed">{t(`index.step${step}_desc`)}</p>
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

        {/* Final CTA - Enhanced */}
        <section className="py-32 relative overflow-hidden">
          <div className="container relative z-10">
            <GlassTiltCard className="max-w-5xl mx-auto text-center !p-16 border-islamic-gold/20">
              {/* Internal Glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-islamic-gold/50 to-transparent"></div>

              <div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-islamic-gold/20 to-islamic-gold/5 flex items-center justify-center mx-auto mb-8 border border-islamic-gold/20 shadow-[0_0_30px_rgba(255,215,0,0.15)]"
              >
                <Sparkles className="w-12 h-12 text-islamic-gold animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-8">
                {t('index.final_cta_title')}
              </h2>
              <p className="text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
                {t('index.final_cta_desc')}
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link to="/login" className="btn-islamic group px-12 py-6 text-xl rounded-full relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    {t('index.ask_question_btn')}
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                  </span>
                  {/* Sheen effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] animate-shimmer-sweep group-hover:animate-none" />
                </Link>
              </div>
            </GlassTiltCard>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
