import React from 'react';
import { BookOpen, Compass, Globe, Heart, LayoutList, Scale, ArrowRight } from 'lucide-react';

const topics = [
  {
    title: 'Aqeedah',
    description: 'Tawheed, the six pillars of faith, and what Muslims believe and why.',
    icon: BookOpen,
    color: 'text-deep-green',
    bg: 'bg-deep-green/8',
    question: 'What are the six articles of faith in Islam?'
  },
  {
    title: 'Fiqh',
    description: 'Rulings on halal, haram, and daily life across all four madhhabs.',
    icon: Scale,
    color: 'text-warm-gold',
    bg: 'bg-warm-gold/8',
    question: 'What is the concept of Halal in Islamic law?'
  },
  {
    title: 'Seerah',
    description: 'The life of the Prophet (PBUH), his character, and his teachings.',
    icon: Heart,
    color: 'text-sage-green-dark',
    bg: 'bg-sage-green/8',
    question: 'What are some important teachings of Prophet Muhammad?'
  },
  {
    title: 'Islamic History',
    description: 'The Rashidun, major scholars, and how Islam shaped civilizations.',
    icon: Globe,
    color: 'text-deep-green-light',
    bg: 'bg-deep-green/6',
    question: 'Can you explain the early history of Islam?'
  },
  {
    title: 'Akhlaq',
    description: 'Character, honesty, patience, and how Islam shapes behavior.',
    icon: Compass,
    color: 'text-warm-gold-dark',
    bg: 'bg-warm-gold/8',
    question: 'What are the core ethical values in Islam?'
  },
  {
    title: 'Ibadah',
    description: 'Salah, fasting, zakat, hajj — the acts of worship and how to perform them.',
    icon: LayoutList,
    color: 'text-sage-green',
    bg: 'bg-sage-green/8',
    question: 'How should Muslims perform the five daily prayers?'
  }
];

const TopicsSection = () => {
  const handleTopicClick = (question: string) => {
    const heroSection = document.querySelector('section');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
      const searchInput = document.querySelector('input.search-input') as HTMLInputElement;
      if (searchInput) {
        searchInput.value = question;
        searchInput.focus();
      }
    }
  };

  return (
    <section id="topics" className="py-20 relative overflow-hidden">
      <div className="container relative z-10 px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-deep-green mb-4 tracking-tight">
            What you can ask about
          </h2>
          <p className="text-base text-deep-green/55 max-w-xl mx-auto leading-relaxed">
            Every question goes through our multi-scholar AI council. Pick a topic or ask anything.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map((topic, index) => (
            <div
              key={index}
              className="glass-card-warm p-6 group cursor-pointer transition-all duration-200 hover:shadow-md rounded-2xl"
              onClick={() => handleTopicClick(topic.question)}
            >
              <div className={`mb-4 w-11 h-11 rounded-xl ${topic.bg} flex items-center justify-center ${topic.color}`}>
                <topic.icon className="h-5 w-5" />
              </div>

              <h3 className="text-base font-bold mb-1.5 text-deep-green group-hover:text-warm-gold transition-colors">
                {topic.title}
              </h3>

              <p className="text-deep-green/50 text-sm leading-relaxed mb-4">
                {topic.description}
              </p>

              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-deep-green/25 group-hover:text-warm-gold transition-all">
                <span>Ask now</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopicsSection;
