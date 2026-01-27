import * as React from 'react';
import HeroSection from '@/components/HeroSection';
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
            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{t('index.guided_fatwa_title') || "AI-Guided Fatwa"}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('index.guided_fatwa_desc') || "Get precise, context-aware answers derived from authentic Islamic sources instantly."}
                </p>
                <Link to="/fatwa" className="inline-flex items-center text-primary font-medium hover:underline mt-2">
                  {t('index.try_it_now') || "Explore Fatwas"} <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{t('index.daily_islam_title') || "Daily Guidance"}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('index.daily_islam_desc') || "Stay connected with daily reminders, prayer times, and personalized spiritual tracking."}
                </p>
                <Link to="/dashboard" className="inline-flex items-center text-primary font-medium hover:underline mt-2">
                  {t('index.see_today') || "Go to Dashboard"} <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Library className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{t('index.library_title') || "Rich Library"}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('index.library_desc') || "Access a vast collection of Islamic texts, hadiths, and scholarly works in multiple languages."}
                </p>
                <Link to="/library" className="inline-flex items-center text-primary font-medium hover:underline mt-2">
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
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t('index.how_title_prefix')} <span className="text-gradient">{t('index.how_title_gradient')}</span>
                </h2>
                <p className="text-lg text-muted-foreground">{t('index.how_subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="islamic-card p-6 bg-card border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{t('index.step1_title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('index.step1_desc')}</p>
                    </div>
                  </div>
                </div>

                <div className="islamic-card p-6 bg-card border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{t('index.step2_title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('index.step2_desc')}</p>
                    </div>
                  </div>
                </div>

                <div className="islamic-card p-6 bg-card border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{t('index.step3_title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('index.step3_desc')}</p>
                    </div>
                  </div>
                </div>

                <div className="islamic-card p-6 bg-card border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{t('index.step4_title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('index.step4_desc')}</p>
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
        <section className="py-24 bg-islamic-green-100/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient opacity-90 dark:opacity-40"></div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t('index.final_cta_title')}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {t('index.final_cta_desc')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/fatwa" className="btn-islamic">
                  {t('index.ask_question_btn')}
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
