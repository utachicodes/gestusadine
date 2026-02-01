import * as React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, BookOpen, Sparkles, ArrowRight, Library } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PricingComparison } from '@/components/landing/PricingComparison';

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Global Ambient Background - Connecting sections */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-islamic-blue/5 rounded-full blur-[150px] animate-pulse-glow" />
         <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-islamic-gold/5 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
         <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-islamic-green/5 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '4s' }} />
      </div>

      <main className="flex-grow relative z-10">
        <HeroSection />

        <section className="py-24 relative">
          <div className="container relative z-10">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div
                className="islamic-card p-8 space-y-4 topic-card group bg-card/40 backdrop-blur-md border-white/5 hover:border-islamic-green/30"
                style={{ animation: 'slide-fade-up 0.6s ease-out 0.1s both' }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-islamic-green/20 to-islamic-green/5 flex items-center justify-center text-islamic-green mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-[0_0_15px_rgba(74,222,128,0.15)]">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{t('index.guided_fatwa_title') || "AI-Guided Fatwa"}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('index.guided_fatwa_desc') || "Get precise, context-aware answers derived from authentic Islamic sources instantly."}
                </p>
                <Link to="/fatwa" className="inline-flex items-center text-islamic-green font-semibold  hover:gap-3 transition-all mt-2 group-hover:translate-x-1">
                  {t('index.try_it_now') || "Explore Fatwas"} <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>

              <div
                className="islamic-card p-8 space-y-4 topic-card group bg-card/40 backdrop-blur-md border-white/5 hover:border-islamic-blue/30"
                style={{ animation: 'slide-fade-up 0.6s ease-out 0.2s both' }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-islamic-blue/20 to-islamic-blue/5 flex items-center justify-center text-islamic-blue mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{t('index.daily_islam_title') || "Daily Guidance"}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('index.daily_islam_desc') || "Stay connected with daily reminders, prayer times, and personalized spiritual tracking."}
                </p>
                <Link to="/dashboard" className="inline-flex items-center text-islamic-blue font-semibold hover:gap-3 transition-all mt-2 group-hover:translate-x-1">
                  {t('index.see_today') || "Go to Dashboard"} <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>

              <div
                className="islamic-card p-8 space-y-4 topic-card group bg-card/40 backdrop-blur-md border-white/5 hover:border-islamic-gold/30"
                style={{ animation: 'slide-fade-up 0.6s ease-out 0.3s both' }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-islamic-gold/30 to-islamic-gold/5 flex items-center justify-center text-islamic-gold mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-[0_0_15px_rgba(255,215,0,0.15)]">
                  <Library className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{t('index.library_title') || "Rich Library"}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('index.library_desc') || "Access a vast collection of Islamic texts, hadiths, and scholarly works in multiple languages."}
                </p>
                <Link to="/library" className="inline-flex items-center text-islamic-gold font-semibold hover:gap-3 transition-all mt-2 group-hover:translate-x-1">
                  {t('index.browse_books') || "Browse Library"} <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works - with glass styling */}
        <section className="py-20 relative overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto">
              <div
                className="text-center mb-12"
                style={{ animation: 'slide-fade-down 0.6s ease-out' }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t('index.how_title_prefix')} <span className="text-gradient drop-shadow-lg">{t('index.how_title_gradient')}</span>
                </h2>
                <p className="text-lg text-muted-foreground">{t('index.how_subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((step, idx) => (
                   <div
                    key={step}
                    className="islamic-card p-8 bg-card/30 backdrop-blur-sm border border-white/5 group hover:bg-card/50 transition-all duration-500"
                    style={{ animation: `scale-in 0.5s ease-out ${0.1 * (idx + 1)}s both` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                        step === 1 ? 'from-islamic-green to-islamic-green/30' :
                        step === 2 ? 'from-islamic-blue to-islamic-blue/30' :
                        step === 3 ? 'from-islamic-gold to-islamic-gold/30' :
                        'from-purple-500 to-indigo-500'
                      } flex items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-xl`}>
                        <span className="text-white font-bold text-lg">{step}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-2">{t(`index.step${step}_title`)}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{t(`index.step${step}_desc`)}</p>
                      </div>
                    </div>
                  </div>
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
        <section className="py-24 relative overflow-hidden">

          <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

          <div className="container relative z-10">
            <div
              className="max-w-4xl mx-auto text-center islamic-card-dark p-12 border-white/10 shadow-2xl relative overflow-hidden"
              style={{ animation: 'scale-in 0.8s ease-out' }}
            >
              {/* Internal Glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-islamic-gold/50 to-transparent"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-islamic-blue/20 rounded-full blur-[80px]"></div>

              <div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-islamic-gold/20 to-islamic-gold/5 flex items-center justify-center mx-auto mb-6 border border-islamic-gold/20 shadow-[0_0_20px_rgba(255,215,0,0.1)]"
                style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
              >
                <Sparkles className="w-10 h-10 text-islamic-gold" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                {t('index.final_cta_title')}
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                {t('index.final_cta_desc')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/login" className="btn-islamic group px-10 py-5 text-lg">
                  <span className="flex items-center gap-3">
                    {t('index.ask_question_btn')}
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                  </span>
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
