
import React from 'react';
import { Book, GraduationCap, Heart, Map } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-deep-slate relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-cyan-glow/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Academic <span className="text-glow-cyan text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow to-blue-400">Legacy</span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
            A life dedicated to the pursuit of authentic knowledge and the bridge between traditional scholarship and modern intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Card 1 */}
          <div className="glass-card-premium p-10 group relative border border-white/5 transition-all hover:border-cyan-glow/20">
            <div className="flex items-center mb-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-cyan-glow group-hover:bg-cyan-glow/5 group-hover:border-cyan-glow/30 transition-all">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="ml-6 text-2xl font-black text-white group-hover:text-cyan-glow transition-colors tracking-tight">Early Life & Roots</h3>
            </div>
            <p className="text-white/40 leading-relaxed font-medium mb-4">
              Dr. Ahmed Lo was born in 1955 in Tawfekh near Touba. He memorized the Holy Quran in Ndame, Senegal, before mastering traditional sciences in Touba and Saint-Louis.
            </p>
            <p className="text-white/40 leading-relaxed font-medium">
              His exceptional mastery of Arabic and early poetic works signaled the emergence of a brilliant mind dedicated to Islamic scholarship.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card-premium p-10 group relative border border-white/5 transition-all hover:border-cyan-glow/20">
            <div className="flex items-center mb-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-cyan-glow group-hover:bg-cyan-glow/5 group-hover:border-cyan-glow/30 transition-all">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="ml-6 text-2xl font-black text-white group-hover:text-cyan-glow transition-colors tracking-tight">The Quest for Truth</h3>
            </div>
            <p className="text-white/40 leading-relaxed font-medium mb-4">
              An explorer of knowledge, his journey spanned West Africa and Egypt, eventually leading to the holy city of Medina in 1980 through unwavering perseverance.
            </p>
            <p className="text-white/40 leading-relaxed font-medium">
              Faced with academic barriers, his poetic plea for knowledge moved the rector of Medina University, opening the gates to higher scholarship.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card-premium p-10 group relative border border-white/5 transition-all hover:border-cyan-glow/20">
            <div className="flex items-center mb-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-cyan-glow group-hover:bg-cyan-glow/5 group-hover:border-cyan-glow/30 transition-all">
                <Book className="w-8 h-8" />
              </div>
              <h3 className="ml-6 text-2xl font-black text-white group-hover:text-cyan-glow transition-colors tracking-tight">Academic Brilliance</h3>
            </div>
            <p className="text-white/40 leading-relaxed font-medium mb-4">
              Dr. Lo's trajectory was meteoric, completing his secondary studies in months and securing a doctorate on complex theological dimensions within Sufi doctrine.
            </p>
            <p className="text-white/40 leading-relaxed font-medium">
              His work stands as a cornerstone of rigorous academic analysis, merging traditional depth with modern critical inquiry.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card-premium p-10 group relative border border-white/5 transition-all hover:border-cyan-glow/20">
            <div className="flex items-center mb-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-cyan-glow group-hover:bg-cyan-glow/5 group-hover:border-cyan-glow/30 transition-all">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="ml-6 text-2xl font-black text-white group-hover:text-cyan-glow transition-colors tracking-tight">Faith in Action</h3>
            </div>
            <p className="text-white/40 leading-relaxed font-medium mb-4">
              Beyond the classroom, Dr. Lo has been a pillar of community guidance and a diplomat of faith, resolving sensitive regional issues with quiet wisdom.
            </p>
            <p className="text-white/40 leading-relaxed font-medium">
              His life honors the Prophetic tradition of selfless service, providing a blueprint for the modern Muslim intellectual.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
