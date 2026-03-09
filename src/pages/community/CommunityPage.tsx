import React from 'react';
import { Users, MessageSquare, BookOpen, Heart, Globe, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const circles = [
  {
    name: "Fiqh Discussion Circle",
    members: 234,
    topic: "Islamic Jurisprudence",
    lastActive: "2 min ago",
    color: "bg-deep-green/8",
    iconColor: "text-deep-green",
    icon: BookOpen,
  },
  {
    name: "Youth & Faith Forum",
    members: 412,
    topic: "Young Muslims Worldwide",
    lastActive: "5 min ago",
    color: "bg-warm-gold/8",
    iconColor: "text-warm-gold",
    icon: Star,
  },
  {
    name: "Quran Memorisation Group",
    members: 178,
    topic: "Hifz & Tajweed",
    lastActive: "12 min ago",
    color: "bg-sage-green/8",
    iconColor: "text-sage-green-dark",
    icon: Heart,
  },
  {
    name: "West Africa Muslims",
    members: 695,
    topic: "Regional Community",
    lastActive: "1 min ago",
    color: "bg-deep-green/8",
    iconColor: "text-deep-green-light",
    icon: Globe,
  },
  {
    name: "Women in Islam",
    members: 311,
    topic: "Sisters' Circle",
    lastActive: "8 min ago",
    color: "bg-warm-gold/8",
    iconColor: "text-warm-gold-dark",
    icon: Users,
  },
  {
    name: "Islamic Parenting",
    members: 263,
    topic: "Raising Muslim Families",
    lastActive: "20 min ago",
    color: "bg-sage-green/8",
    iconColor: "text-sage-green",
    icon: Heart,
  },
];

const CommunityPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-20 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-warm-base -z-10" />

        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-deep-green mb-4 leading-tight">
            Community
          </h1>

          <p className="text-lg text-deep-green/55 max-w-xl mx-auto mb-10">
            Join discussion circles on Fiqh, Quran, family, and more. Ask questions, share insights, learn together.
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              { value: "2,100+", label: "Members" },
              { value: "18", label: "Active Circles" },
              { value: "2", label: "Languages" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-serif font-bold text-deep-green">{stat.value}</p>
                <p className="text-sm text-deep-green/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's here */}
      <section className="py-14">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              {
                icon: MessageSquare,
                title: "Discussions",
                desc: "Moderated conversations on Islamic topics. Ask, answer, and learn from others.",
                color: "text-deep-green",
                bg: "bg-deep-green/8",
              },
              {
                icon: Users,
                title: "Circles",
                desc: "Focused groups on specific topics — Fiqh, Quran memorisation, parenting, and more.",
                color: "text-warm-gold",
                bg: "bg-warm-gold/8",
              },
              {
                icon: Globe,
                title: "English & French",
                desc: "Participate in the language you're most comfortable with.",
                color: "text-sage-green-dark",
                bg: "bg-sage-green/8",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="glass-card-warm p-6 rounded-2xl text-center transition-all duration-200 hover:shadow-md"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-deep-green mb-2">{feature.title}</h3>
                <p className="text-sm text-deep-green/50 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Circles */}
      <section className="py-14 bg-warm-sand/20 border-y border-warm-sand/60">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-deep-green mb-3">
              Active Circles
            </h2>
            <p className="text-deep-green/50 max-w-md mx-auto text-sm">
              Focused groups moderated by knowledgeable members.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {circles.map((circle) => (
              <div
                key={circle.name}
                className="glass-card-warm p-5 rounded-2xl transition-all duration-200 hover:shadow-md cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${circle.color} ${circle.iconColor} flex items-center justify-center`}>
                    <circle.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-deep-green/35">{circle.lastActive}</span>
                </div>

                <h3 className="text-sm font-bold text-deep-green mb-1">
                  {circle.name}
                </h3>
                <p className="text-xs text-deep-green/50 mb-3">{circle.topic}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-deep-green/45">
                    <Users className="w-3.5 h-3.5" />
                    <span>{circle.members.toLocaleString()} members</span>
                  </div>
                  <Link to="/login" className="text-xs font-bold text-warm-gold hover:text-warm-gold-light transition-colors flex items-center gap-1">
                    Join <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-deep-green -z-10" />

        <div className="container px-4 mx-auto text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-warm-cream mb-4">
              Join the community
            </h2>
            <p className="text-warm-cream/50 mb-8">
              Create an account and start participating in circles and discussions.
            </p>
            <Link to="/login" className="btn-gold inline-flex items-center gap-2">
              Sign up free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunityPage;
