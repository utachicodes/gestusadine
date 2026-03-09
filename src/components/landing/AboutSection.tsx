import React from 'react';
import { BookOpen, Shield, Users, Zap } from 'lucide-react';

const cards = [
  {
    icon: BookOpen,
    title: 'Four Madhhabs, One Answer',
    color: 'text-deep-green',
    bg: 'bg-deep-green/8',
    body: "Every question is analyzed through the Hanafi, Maliki, Shafi'i, and Hanbali schools. You see where they agree and where they differ — no cherry-picking."
  },
  {
    icon: Shield,
    title: 'Built-in Safety Checks',
    color: 'text-warm-gold',
    bg: 'bg-warm-gold/8',
    body: "An Aqeedah agent flags theological red lines. A Humility agent tells you when the AI isn't confident enough to answer. No hallucinated fatwas."
  },
  {
    icon: Zap,
    title: 'Senegal First',
    color: 'text-sage-green-dark',
    bg: 'bg-sage-green/8',
    body: "Built for West African Muslims. The AI understands local customs, the Maliki tradition common in Senegal, and answers in French or English."
  },
  {
    icon: Users,
    title: 'More Than Fatwas',
    color: 'text-deep-green-light',
    bg: 'bg-deep-green/8',
    body: "Daily hadith and ayah reminders, a digital Islamic library, podcasts with scholars, community discussion circles, and events — all in one place."
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="container relative z-10 px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-deep-green mb-4 tracking-tight">
            How it actually works
          </h2>
          <p className="text-base text-deep-green/55 max-w-xl mx-auto leading-relaxed">
            Not another chatbot. GëstuSaDine runs every question through multiple AI scholars, then synthesizes a consensus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="glass-card-warm p-7 rounded-2xl transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="ml-3 text-lg font-bold text-deep-green">
                  {card.title}
                </h3>
              </div>
              <p className="text-deep-green/55 leading-relaxed text-sm">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
