
import React from 'react';
import { BookOpen, Compass, Globe, Heart, LayoutList, Scale } from 'lucide-react';

const topics = [
  {
    title: 'Islamic Beliefs',
    description: 'Understanding Tawheed, Prophethood, etc.',
    icon: BookOpen,
    gradient: 'from-islamic-green to-islamic-teal',
    question: 'What are the six articles of faith in Islam?'
  },
  {
    title: 'Islamic Law (Sharia)',
    description: 'Fiqh, Halal, and Haram',
    icon: Scale,
    gradient: 'from-islamic-blue to-islamic-teal',
    question: 'What is the concept of Halal in Islamic law?'
  },
  {
    title: 'Prophet Muhammad (PBUH)',
    description: 'His Life and Teachings',
    icon: Heart,
    gradient: 'from-islamic-gold to-yellow-500',
    question: 'What are some important teachings of Prophet Muhammad?'
  },
  {
    title: 'Islamic History',
    description: 'Key Events and Figures',
    icon: Globe,
    gradient: 'from-islamic-green to-islamic-blue',
    question: 'Can you explain the early history of Islam?'
  },
  {
    title: 'Islamic Ethics',
    description: 'Moral Values in Islam',
    icon: Compass,
    gradient: 'from-islamic-teal to-islamic-blue',
    question: 'What are the core ethical values in Islam?'
  },
  {
    title: 'Islamic Practices',
    description: 'Prayer, Fasting, Charity, etc.',
    icon: LayoutList,
    gradient: 'from-islamic-gold to-islamic-green',
    question: 'How should Muslims perform the five daily prayers?'
  }
];

const TopicsSection = () => {
  const handleTopicClick = (question: string) => {
    const heroSection = document.querySelector('section');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });

      // Find the search input and set its value
      const searchInput = document.querySelector('input.search-input') as HTMLInputElement;
      if (searchInput) {
        searchInput.value = question;
        searchInput.focus();
      }
    }
  };

  return (
    <section id="topics" className="py-24 bg-deep-slate relative overflow-hidden">
      {/* Background patterns and glows */}
      <div className="absolute top-0 left-0 w-full h-full bg-mesh-cyan opacity-5 pointer-events-none" />

      <div className="container relative z-10 px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Explore <span className="text-glow-cyan text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow to-blue-400">Divine Wisdom</span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
            Navigate through various dimensions of Islamic knowledge, powered by the convergence of faith and intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics.map((topic, index) => (
            <div
              key={index}
              className="glass-card-premium p-8 group cursor-pointer transition-all hover:scale-[1.02] border border-white/5"
              onClick={() => handleTopicClick(topic.question)}
            >
              <div className={`mb-6 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-glow group-hover:border-cyan-glow/50 group-hover:bg-cyan-glow/5 transition-all shadow-[0_0_20px_rgba(0,245,255,0.05)]`}>
                <topic.icon className="h-7 w-7 transition-transform group-hover:scale-110" />
              </div>

              <h3 className="text-xl font-black mb-3 text-white group-hover:text-cyan-glow transition-colors tracking-tight">
                {topic.title}
              </h3>

              <p className="text-white/40 text-sm leading-relaxed font-medium mb-6">
                {topic.description}
              </p>

              <div className="flex items-center text-xs font-black uppercase tracking-widest text-white/20 group-hover:text-cyan-glow transition-all">
                <span>Inquire Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopicsSection;
