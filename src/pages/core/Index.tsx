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
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />

        <section className="py-24 bg-background relative border-t border-border/50">
          <div className="container relative z-10">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div
                className="islamic-card p-8 space-y-4 topic-card group"
                style={{ animation: 'slide-fade-up 0.6s ease-out 0.1s both' }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-islamic-green/20 to-islamic-green/10 flex items-center justify-center text-islamic-green mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3">
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
                className="islamic-card p-8 space-y-4 topic-card group"
                style={{ animation: 'slide-fade-up 0.6s ease-out 0.2s both' }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-islamic-blue/20 to-islamic-blue/10 flex items-center justify-center text-islamic-blue mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3">
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
                className="islamic-card p-8 space-y-4 topic-card group"
                style={{ animation: 'slide-fade-up 0.6s ease-out 0.3s both' }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-islamic-gold/30 to-islamic-gold/10 flex items-center justify-center text-islamic-gold mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3">
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

        {/* How it works */}
        <section className="py-20 bg-background relative overflow-hidden">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div
                className="text-center mb-12"
                style={{ animation: 'slide-fade-down 0.6s ease-out' }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t('index.how_title_prefix')} <span className="text-gradient">{t('index.how_title_gradient')}</span>
                </h2>
                <p className="text-lg text-muted-foreground">{t('index.how_subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div
                  className="islamic-card p-8 bg-card border border-border group"
                  style={{ animation: 'scale-in 0.5s ease-out 0.1s both' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-islamic-green to-islamic-green/50 flex items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-xl">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-2">{t('index.step1_title')}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t('index.step1_desc')}</p>
                    </div>
                  </div>
                </div>

                <div
                  className="islamic-card p-8 bg-card border border-border group"
                  style={{ animation: 'scale-in 0.5s ease-out 0.2s both' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-islamic-blue to-islamic-blue/50 flex items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-xl">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-2">{t('index.step2_title')}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t('index.step2_desc')}</p>
                    </div>
                  </div>
                </div>

                <div
                  className="islamic-card p-8 bg-card border border-border group"
                  style={{ animation: 'scale-in 0.5s ease-out 0.3s both' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-islamic-gold to-islamic-gold/50 flex items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-xl">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-2">{t('index.step3_title')}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t('index.step3_desc')}</p>
                    </div>
                  </div>
                </div>

                <div
                  className="islamic-card p-8 bg-card border border-border group"
                  style={{ animation: 'scale-in 0.5s ease-out 0.4s both' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-islamic-green to-islamic-blue flex items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-xl">
                      <span className="text-white font-bold text-lg">4</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-2">{t('index.step4_title')}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t('index.step4_desc')}</p>
                    </div>
                  </div>
                </div>
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
        <section className="py-24 bg-gradient-to-br from-islamic-cream/50 via-islamic-green-100/30 to-islamic-blue/10 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: 'linear-gradient(135deg, rgba(143, 163, 196, 0.1) 0%, rgba(224, 232, 243, 0.05) 100%)',
              animation: 'gradient-flow 15s ease infinite'
            }}
          ></div>
          <div className="container relative z-10">
            <div
              className="max-w-3xl mx-auto text-center islamic-card p-12"
              style={{ animation: 'scale-in 0.8s ease-out' }}
            >
              <div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-islamic-gold/30 to-islamic-gold/10 flex items-center justify-center mx-auto mb-6"
                style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
              >
                <Sparkles className="w-8 h-8 text-islamic-gold" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t('index.final_cta_title')}
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {t('index.final_cta_desc')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/login" className="btn-islamic group">
                  <span className="flex items-center gap-2">
                    {t('index.ask_question_btn')}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
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
