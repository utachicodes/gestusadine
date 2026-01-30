import * as React from "react";
import { BookOpen, Layers } from "lucide-react";

const Fiqh: React.FC = () => {
  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
              Fiqh map
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark">
              Explore{" "}
              <span className="text-gradient">fiqh themes</span>
            </h1>
            <p className="mt-2 text-islamic-dark/70 max-w-xl">
              A calm overview of core topics: worship, family, finance,
              contracts, and more – across all four Sunni madhabs.
            </p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "ʿIbādāt (Worship)",
              desc: "Prayer, fasting, zakat, hajj – the pillars that shape your day and year.",
            },
            {
              title: "Muʿāmalāt (Transactions)",
              desc: "Finance, trade, contracts, and modern questions around work and money.",
            },
            {
              title: "Family & personal status",
              desc: "Marriage, divorce, rights, and responsibilities in a Maliki lens.",
            },
            {
              title: "Character & ethics",
              desc: "Adab, akhlaq, purification of the heart, and everyday conduct.",
            },
            {
              title: "Regional contexts",
              desc: "How fiqh meets local customs and law in different regions (Senegal, Gulf, Southeast Asia, etc.).",
            },
            {
              title: "Advanced topics",
              desc: "For students of knowledge exploring deeper texts and commentaries.",
            },
          ].map((item) => (
            <div key={item.title} className="islamic-card p-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-full bg-islamic-green/10 flex items-center justify-center text-islamic-green">
                  <BookOpen className="w-5 h-5" />
                </div>
                <p className="font-semibold text-islamic-dark">{item.title}</p>
              </div>
              <p className="text-sm text-islamic-dark/75">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="islamic-card p-6 flex items-center gap-4 bg-islamic-cream/70 mt-2">
          <div className="w-10 h-10 rounded-full bg-islamic-blue/10 flex items-center justify-center text-islamic-blue">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-sm text-islamic-dark/80">
            Use this map with the Guided Fatwa page: ask your question, select your madhab, then
            see which fiqh areas are involved in the hukm, evidence, and explanation—tailored to your school.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Fiqh;


