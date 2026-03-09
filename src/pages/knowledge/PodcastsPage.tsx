import React from 'react';
import { Mic, Play, Clock, Calendar, Headphones, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const episodes = [
  {
    id: 1,
    title: "Understanding Tawheed in Modern Times",
    guest: "Sheikh Abdulrahman Diallo",
    duration: "52 min",
    date: "Feb 15, 2026",
    category: "Aqeedah",
    description: "What divine oneness means today and how it shapes a Muslim's worldview.",
    color: "bg-deep-green/8",
    iconColor: "text-deep-green",
  },
  {
    id: 2,
    title: "Maqasid al-Sharia: Objectives of Islamic Law",
    guest: "Dr. Fatou Mbaye",
    duration: "1h 08 min",
    date: "Feb 8, 2026",
    category: "Fiqh",
    description: "The higher goals behind Islamic rulings and how they apply to everyday decisions.",
    color: "bg-warm-gold/8",
    iconColor: "text-warm-gold",
  },
  {
    id: 3,
    title: "West African Islamic Scholarship",
    guest: "Prof. Ibrahima Sall",
    duration: "45 min",
    date: "Feb 1, 2026",
    category: "History",
    description: "The tradition of Islamic learning in Senegal and the broader region.",
    color: "bg-sage-green/8",
    iconColor: "text-sage-green-dark",
  },
  {
    id: 4,
    title: "Spiritual Purification: The Inner Jihad",
    guest: "Sheikh Omar Ndoye",
    duration: "38 min",
    date: "Jan 25, 2026",
    category: "Spirituality",
    description: "Self-discipline, Tasawwuf, and working on your inner character.",
    color: "bg-deep-green/8",
    iconColor: "text-deep-green-light",
  },
  {
    id: 5,
    title: "The Quran and Scientific Inquiry",
    guest: "Dr. Aissatou Diop",
    duration: "1h 02 min",
    date: "Jan 18, 2026",
    category: "Quran",
    description: "How Quranic verses encourage reflection on the natural world.",
    color: "bg-warm-gold/8",
    iconColor: "text-warm-gold-dark",
  },
  {
    id: 6,
    title: "Raising Muslim Children in the Digital Age",
    guest: "Ustadha Mariam Sow",
    duration: "55 min",
    date: "Jan 11, 2026",
    category: "Family",
    description: "Practical advice for Muslim parents dealing with screens, social media, and faith.",
    color: "bg-sage-green/8",
    iconColor: "text-sage-green",
  },
];

const categories = ["All", "Aqeedah", "Fiqh", "History", "Spirituality", "Quran", "Family"];

const PodcastsPage = () => {
  const [activeCategory, setActiveCategory] = React.useState("All");

  const filtered = activeCategory === "All"
    ? episodes
    : episodes.filter(e => e.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-20 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-warm-base -z-10" />

        <div className="container px-4 mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-warm-gold/30 bg-warm-gold/8 px-4 py-1.5 text-sm font-semibold text-warm-gold mb-5">
            <Headphones className="w-4 h-4" />
            Podcasts
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-deep-green mb-4 leading-tight">
            Conversations with scholars
          </h1>

          <p className="text-lg text-deep-green/55 max-w-xl mx-auto mb-10">
            Long-form discussions on Fiqh, Aqeedah, history, and family — with scholars from Senegal and beyond.
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              { value: "50+", label: "Episodes" },
              { value: "12", label: "Scholars" },
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

      {/* Filter + Episodes */}
      <section className="py-14">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-deep-green text-warm-cream'
                    : 'bg-warm-sand/40 text-deep-green/70 hover:bg-warm-sand/70 border border-warm-sand'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((ep) => (
              <div
                key={ep.id}
                className="glass-card-warm p-5 rounded-2xl transition-all duration-200 hover:shadow-md flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${ep.color} ${ep.iconColor}`}>
                    {ep.category}
                  </span>
                  <div className={`w-9 h-9 rounded-lg ${ep.color} flex items-center justify-center ${ep.iconColor}`}>
                    <Mic className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-deep-green mb-1.5 leading-snug">
                  {ep.title}
                </h3>
                <p className="text-sm text-deep-green/50 mb-3 leading-relaxed flex-1">
                  {ep.description}
                </p>

                <div className="text-xs font-semibold text-deep-green/50 mb-4">
                  with {ep.guest}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-deep-green/40">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {ep.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {ep.date}
                    </span>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-deep-green flex items-center justify-center text-warm-cream hover:bg-deep-green-light transition-colors">
                    <Play className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-warm-sand/25 -z-10" />

        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-deep-green mb-3">
            Get notified about new episodes
          </h2>
          <p className="text-deep-green/55 mb-6 max-w-md mx-auto text-sm">
            Sign up and we'll let you know when new conversations are published.
          </p>
          <Link to="/login" className="btn-spiritual inline-flex items-center gap-2 text-sm">
            Subscribe
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PodcastsPage;
