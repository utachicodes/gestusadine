import * as React from "react";
import { Droplets, Sunrise, Coins, Moon, MapPin, BookOpen, Layers, type LucideIcon } from "lucide-react";
import { useFiqhTopics } from "@/data/knowledge";
import { useTr } from "@/lib/i18n";

const TOPIC_ICONS: Record<string, LucideIcon> = {
  taharah: Droplets,
  salah: Sunrise,
  zakah: Coins,
  sawm: Moon,
  hajj: MapPin,
};

const Fiqh: React.FC = () => {
  const topics = useFiqhTopics();
  const tr = useTr();

  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
              {tr({ en: 'Fiqh essentials', fr: 'L’essentiel du fiqh' })}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark">
              {tr({ en: 'The five', fr: 'Les cinq' })} <span className="text-gradient">{tr({ en: 'pillars of worship', fr: 'piliers de l’adoration' })}</span>
            </h1>
            <p className="mt-2 text-islamic-dark/70 max-w-xl">
              {tr({
                en: 'The foundations of ʿibādāt that every Muslim shares: purification, prayer, zakāh, fasting, and Hajj. These basics are agreed upon across the four Sunni madhāhib.',
                fr: 'Les fondements des ʿibādāt que partage tout musulman : la purification, la prière, la zakāh, le jeûne et le Hajj. Ces bases font l’unanimité des quatre écoles sunnites.',
              })}
            </p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => {
            const Icon = TOPIC_ICONS[topic.id] ?? BookOpen;
            return (
              <div key={topic.id} className="islamic-card p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-islamic-green/10 flex items-center justify-center text-islamic-green">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-islamic-dark leading-tight">{topic.title}</p>
                    <p className="font-arabic text-sm text-islamic-gold" dir="rtl">{topic.arabicTitle}</p>
                  </div>
                </div>
                <p className="text-sm text-islamic-dark/75">{topic.summary}</p>
                <ul className="space-y-2 mt-1">
                  {topic.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-islamic-dark/70">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-islamic-gold flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="islamic-card p-6 flex items-center gap-4 bg-islamic-cream/70 mt-2">
          <div className="w-10 h-10 rounded-full bg-islamic-blue/10 flex items-center justify-center text-islamic-blue flex-shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-sm text-islamic-dark/80">
            {tr({
              en: 'Have a specific question? Use the Guided Fatwa page: ask your question and select your madhab to see the ruling (ḥukm), the evidence, and an explanation tailored to your school.',
              fr: 'Une question précise ? Utilisez la page Fatwa guidée : posez votre question et choisissez votre madhab pour voir l’avis (ḥukm), les preuves et une explication adaptée à votre école.',
            })}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Fiqh;
