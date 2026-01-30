
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
    <section id="topics" className="py-24 bg-islamic-light pattern-bg">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
            Explore <span className="text-gradient">Topics</span>
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-islamic-gold rounded-full"></span>
          </h2>
          <p className="text-lg text-islamic-dark/70 max-w-2xl mx-auto">
            Discover various aspects of Islamic knowledge through our curated collection of topics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics.map((topic, index) => (
            <div
              key={index}
              className="topic-card group"
              onClick={() => handleTopicClick(topic.question)}
            >
              <div className={`mb-4 w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white ${topic.gradient}`}>
                <topic.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-islamic-green transition-colors">
                {topic.title}
              </h3>
              <p className="text-islamic-dark/70">
                {topic.description}
              </p>
              <div className="mt-4 text-sm text-islamic-green font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                <span>Ask about this</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section >
  );
};

export default TopicsSection;
