import * as React from 'react';
import HeroSection from '@/components/HeroSection';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, BookOpen, Sparkles, ArrowRight, Library } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        
        {/* What XamSaDine Does */}
        <section className="py-20 bg-secondary/30 relative overflow-hidden">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t('index.what_title_prefix')} <span className="text-gradient">{t('index.what_title_gradient')}</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {t('index.what_subtitle')}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Link to="/fatwa" className="islamic-card p-6 hover:scale-105 transition-transform bg-card border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{t('index.guided_fatwa_title')}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{t('index.guided_fatwa_desc')}</p>
                  <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                    {t('index.try_it_now')} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <Link to="/dashboard" className="islamic-card p-6 hover:scale-105 transition-transform bg-card border border-border">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{t('index.daily_islam_title')}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{t('index.daily_islam_desc')}</p>
                  <span className="text-sm text-secondary-foreground font-medium inline-flex items-center gap-1">
                    {t('index.see_today')} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <Link to="/fiqh" className="islamic-card p-6 hover:scale-105 transition-transform bg-card border border-border">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{t('index.fiqh_map_title')}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{t('index.fiqh_map_desc')}</p>
                  <span className="text-sm text-accent-foreground font-medium inline-flex items-center gap-1">
                    {t('index.explore')} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <Link to="/library" className="islamic-card p-6 hover:scale-105 transition-transform bg-card border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Library className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{t('index.library_title')}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{t('index.library_desc')}</p>
                  <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                    {t('index.browse_books')} <ArrowRight className="w-4 h-4" />
                  </span>
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
        
        {/* Final CTA */}
        <section className="py-24 bg-primary/10 relative overflow-hidden">
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
