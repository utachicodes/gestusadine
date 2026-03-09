import * as React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, Library, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PricingComparison } from '@/components/landing/PricingComparison';
import { motion } from 'framer-motion';

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">

      <main className="flex-grow">
        <HeroSection />

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="container relative z-10 px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-deep-green mb-4 tracking-tight">
                {t('index.features_title') || 'What you get'}
              </h2>
              <p className="text-base text-deep-green/55 max-w-xl mx-auto leading-relaxed">
                {t('index.features_subtitle') || 'Islamic guidance, daily content, and a full library — all in one place.'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="glass-card-warm p-7 rounded-2xl transition-all duration-200 hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-deep-green/8 flex items-center justify-center text-deep-green mb-5">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-deep-green mb-2">{t('index.guided_fatwa_title') || "Ask a Question"}</h3>
                <p className="text-deep-green/50 leading-relaxed mb-5 text-sm">
                  {t('index.guided_fatwa_desc') || "Get a structured fatwa with the ruling, evidence, and explanation — checked across four madhhabs."}
                </p>
                <Link to="/fatwa" className="inline-flex items-center gap-1.5 text-warm-gold font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all">
                  {t('index.try_it_now') || "Try it"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="glass-card-warm p-7 rounded-2xl transition-all duration-200 hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-warm-gold/8 flex items-center justify-center text-warm-gold mb-5">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-deep-green mb-2">{t('index.daily_islam_title') || "Daily Reminders"}</h3>
                <p className="text-deep-green/50 leading-relaxed mb-5 text-sm">
                  {t('index.daily_islam_desc') || "A daily ayah, hadith, and dua. Plus a weekly quiz to keep your knowledge sharp."}
                </p>
                <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-warm-gold font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all">
                  {t('index.see_today') || "See today's"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="glass-card-warm p-7 rounded-2xl transition-all duration-200 hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-sage-green/8 flex items-center justify-center text-sage-green-dark mb-5">
                  <Library className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-deep-green mb-2">{t('index.library_title') || "Islamic Library"}</h3>
                <p className="text-deep-green/50 leading-relaxed mb-5 text-sm">
                  {t('index.library_desc') || "Books, PDFs, and resources on Fiqh, Aqeedah, Seerah, and more."}
                </p>
                <Link to="/library" className="inline-flex items-center gap-1.5 text-warm-gold font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all">
                  {t('index.browse_books') || "Browse"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 relative bg-warm-sand/20 border-y border-warm-sand/60">
          <div className="container relative z-10 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-deep-green mb-4 tracking-tight">
                  {t('index.how_title_prefix') || 'How it works'}
                </h2>
                <p className="text-base text-deep-green/55">{t('index.how_subtitle') || 'Every answer follows a structured process rooted in authentic sources.'}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className="glass-card-warm p-6 rounded-2xl transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-deep-green flex items-center justify-center flex-shrink-0 text-warm-cream font-bold text-sm">
                        {step}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-deep-green mb-1.5">{t(`index.step${step}_title`)}</h4>
                        <p className="text-deep-green/50 leading-relaxed text-sm">{t(`index.step${step}_desc`)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <PricingComparison onSelectPlan={(tier) => {
          if (tier === 'free') {
            navigate('/login');
          } else {
            navigate('/login?upgrade=' + tier);
          }
        }} />

        {/* Final CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-deep-green -z-10" />

          <div className="container relative z-10 px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <p className="font-arabic text-4xl text-warm-gold/50 mb-5">بسم الله الرحمن الرحيم</p>

              <h2 className="text-3xl md:text-5xl font-serif font-bold text-warm-cream mb-6 leading-tight">
                {t('index.final_cta_title') || 'Ready to ask your first question?'}
              </h2>

              <p className="text-lg text-warm-cream/50 mb-10 max-w-xl mx-auto">
                {t('index.final_cta_desc') || 'Start a fatwa session or explore the daily content. Free to try, no credit card needed.'}
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/login" className="btn-gold flex items-center gap-3 group">
                  {t('index.ask_question_btn') || 'Get started'}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/about" className="btn-spiritual-outline text-warm-cream border-warm-cream/20 hover:bg-warm-cream/5 hover:border-warm-cream/40 flex items-center gap-2">
                  {t('index.learn_more') || 'Learn more'}
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
