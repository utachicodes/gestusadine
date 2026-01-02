import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const [question, setQuestion] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animatedWords, setAnimatedWords] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  // Split heading into words for animation
  useEffect(() => {
    const heading = t('hero.heading');
    const lines = heading.split('\n');
    const words: string[] = [];
    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) words.push('\n');
      words.push(...line.split(' ').filter(w => w.length > 0));
    });
    setAnimatedWords(words);
  }, [t]);

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      toast({
        title: t("Error"),
        description: t("Please enter a question"),
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: t('auth.required'),
        description: t('auth.signin'),
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    navigate('/chat');
  };

  return (
    <section className="relative pt-32 pb-44 overflow-hidden">
      {/* Sky Gradient Background */}
      <div className="absolute inset-0 bg-hero-gradient-alt opacity-90"></div>
      <div className="absolute inset-0 bg-mesh-gradient opacity-25"></div>

      {/* Animated Clouds */}
      <div className="absolute -top-10 left-[-10%] w-[42rem] h-[16rem] rounded-[6rem] bg-white/40 blur-3xl animate-float" />
      <div className="absolute top-8 right-[-12%] w-[38rem] h-[14rem] rounded-[6rem] bg-white/35 blur-3xl animate-float animation-delay-2000" />
      <div className="absolute top-[36%] left-[-8%] w-[28rem] h-[12rem] rounded-[6rem] bg-white/25 blur-2xl animate-float animation-delay-4000" />

      {/* Soft glow orbs */}
      <div className="absolute top-24 right-[12%] w-72 h-72 bg-white/20 rounded-full filter blur-2xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-24 left-[12%] w-64 h-64 bg-white/16 rounded-full filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute top-44 left-[22%] w-60 h-60 bg-white/14 rounded-full filter blur-2xl opacity-35 animate-blob animation-delay-4000"></div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading - Interactive & Animated */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <div 
              className="relative inline-block"
              style={{
                transform: `perspective(1000px) rotateY(${mousePosition.x * 0.05}deg) rotateX(${-mousePosition.y * 0.05}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              {/* Light background behind text for visibility */}
              <div className="absolute inset-0 bg-white/90 dark:bg-slate-100/90 rounded-2xl blur-2xl -z-10"></div>
              
              {/* Animated words */}
              <div className="relative flex flex-wrap justify-center items-center gap-x-2 md:gap-x-3 gap-y-2">
                {animatedWords.map((word, index) => {
                  const isNewLine = word === '\n' || (index > 0 && animatedWords[index - 1] === '\n');
                  if (word === '\n') return <br key={`break-${index}`} className="w-full" />;
                  
                  return (
                    <span
                      key={`${word}-${index}`}
                      className="relative inline-block hero-word group cursor-default"
                      style={{
                        animationDelay: `${index * 0.08}s`,
                        animation: 'fadeInUp 0.8s ease-out forwards',
                        opacity: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.15) translateY(-8px) rotateZ(2deg)';
                        e.currentTarget.style.textShadow = '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 24px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.filter = 'brightness(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1) translateY(0) rotateZ(0deg)';
                        e.currentTarget.style.textShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
                        e.currentTarget.style.filter = 'brightness(1)';
                      }}
                    >
                      {/* Glow ring effect */}
                      <span className="absolute inset-0 rounded-lg bg-black/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                      
                      {/* Black text */}
                      <span className="relative text-black font-extrabold tracking-tight">
                        {word}
                      </span>
                      
                      {/* Shimmer effect on hover */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none"></span>
                      
                      {/* Decorative dot after each word (except last and before line breaks) */}
                      {index < animatedWords.length - 1 && animatedWords[index + 1] !== '\n' && (
                        <span className="inline-block w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/50 mx-1.5 animate-pulse group-hover:bg-white group-hover:scale-150 transition-all duration-300"></span>
                      )}
                    </span>
                  );
                })}
              </div>
              
              {/* Floating particles around text */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 40}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${3 + i * 0.5}s`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <Button
              className="btn-islamic px-6 py-3"
              onClick={() => navigate('/dashboard')}
            >
              {t('hero.get_started')}
            </Button>
            <Button
              variant="outline"
              className="px-6 py-3 rounded-full bg-white/40 backdrop-blur border-white/50 text-islamic-dark hover:bg-white/60"
              onClick={() => navigate('/media')}
            >
              {t('hero.watch_video')}
            </Button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="search-input text-islamic-dark dark:text-slate-100 placeholder:text-islamic-dark/40 dark:placeholder:text-slate-400 pr-40"
                placeholder={t('chat.placeholder')}
              />

              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-islamic"
              >
                <Search className="mr-2 h-4 w-4" />
                {t('hero.ask_now')}
              </Button>
            </div>
          </form>

          {/* Popular Topics */}
          <div className="flex flex-wrap justify-center gap-3 items-center">
            <span className="text-sm text-white/60 font-medium">{t('hero.popular')}</span>
            {[...(
              language === 'fr'
                ? ['Prière du voyageur', 'Ce qui annule mon jeûne', 'Guide du Hajj']
                : language === 'wo'
                ? ['Namaz bu ñu dox', 'Lu tëju suum gi', 'Jël Hajj']
                : ['Prayer of the traveller', 'What breaks my fast', 'Hajj guide']
            )].map((term, idx) => (
              <button
                key={term}
                className="group relative px-4 py-2 rounded-full text-sm font-medium text-white/90 transition-colors duration-200 hover:text-white"
                onClick={() => {
                  if (!user) {
                    toast({
                      title: t('auth.required'),
                      description: t('auth.signin'),
                      variant: "destructive"
                    });
                    navigate('/login');
                    return;
                  }
                  setQuestion(term);
                }}
              >
                {/* Glassmorphic background */}
                <div className="absolute inset-0 rounded-full bg-white/10 border border-white/20 group-hover:bg-white/18 group-hover:border-white/30 transition-all duration-200"></div>

                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-full bg-islamic-teal-400/18 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>

                <span className="relative">{term}</span>
              </button>
            ))}
          </div>

          {/* Floating hashtag chips */}
          <div className="pointer-events-none">
            {['#Fiqh', '#Qurʼan', '#Hadith', '#Maliki', '#Dua', '#Seerah'].map((tag, i) => (
              <div
                key={tag}
                className="absolute px-3 py-1.5 rounded-full bg-white/80 text-islamic-dark text-sm shadow glass-panel floating-element"
                style={{
                  left: `${8 + i * 15}%`,
                  top: i % 2 === 0 ? '18%' : '68%',
                  transform: `rotate(${i % 2 === 0 ? -8 : 8}deg)`,
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          {/* Spacer for better visual balance */}
          <div className="mt-16"></div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-islamic-light dark:from-slate-800 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
