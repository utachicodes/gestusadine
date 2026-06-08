import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare, BookOpen, GraduationCap, Calendar, Sunrise, Clock, ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { useTr, type Loc } from '@/lib/i18n';

const ease = [0.22, 1, 0.36, 1] as const;

const FEATURES: { icon: LucideIcon; title: Loc; desc: Loc; to: string }[] = [
  {
    icon: MessageSquare,
    title: { en: 'The Council', fr: 'Le Conseil' },
    desc: { en: 'Ask anything and receive a consensus answer from specialized agents, grounded in authentic sources.', fr: 'Posez n’importe quelle question et recevez une réponse de consensus, ancrée dans des sources authentiques.' },
    to: '/chat',
  },
  {
    icon: BookOpen,
    title: { en: 'Living Library', fr: 'Bibliothèque vivante' },
    desc: { en: 'Read and download works across Qur’an, hadith, fiqh, and aqeedah.', fr: 'Lisez et téléchargez des ouvrages sur le Coran, le hadith, le fiqh et l’aqida.' },
    to: '/library',
  },
  {
    icon: GraduationCap,
    title: { en: 'Courses', fr: 'Cours' },
    desc: { en: 'Structured lessons from the fundamentals to deeper study, at your own pace.', fr: 'Des leçons structurées, des fondements à l’étude approfondie, à votre rythme.' },
    to: '/classes',
  },
  {
    icon: Calendar,
    title: { en: ‘Events’, fr: ‘Événements’ },
    desc: { en: ‘Lectures, circles, and community programs across Senegal and online.’, fr: ‘Conférences, cercles et programmes communautaires au Sénégal et en ligne.’ },
    to: ‘/events’,
  },
  {
    icon: Sunrise,
    title: { en: ‘Daily Guidance’, fr: ‘Guidance quotidienne’ },
    desc: { en: ‘A daily ayah, dua, and prayer times to anchor your day.’, fr: ‘Un verset, une invocation et les horaires de prière chaque jour.’ },
    to: ‘/dashboard’,
  },
  {
    icon: Clock,
    title: { en: ‘Prayer Times’, fr: ‘Horaires de prière’ },
    desc: { en: ‘Accurate prayer times for any city, with Hijri calendar and Qibla direction.’, fr: ‘Horaires de prière précis pour toute ville, avec calendrier hégirien et direction de la Qibla.’ },
    to: ‘/prayer-times’,
  },
];

const BENEFITS: { title: Loc; desc: Loc }[] = [
  {
    title: { en: 'Grounded in sources', fr: 'Ancré dans les sources' },
    desc: { en: 'Every answer is tied to authentic texts and scholarly consensus, with references you can verify.', fr: 'Chaque réponse s’appuie sur des textes authentiques et le consensus des savants, avec des références vérifiables.' },
  },
  {
    title: { en: 'Made for the region', fr: 'Pensé pour la région' },
    desc: { en: 'Français and English, priced for West Africa, ready for mobile-money payments.', fr: 'Français et anglais, des tarifs adaptés à l’Afrique de l’Ouest, prêt pour le mobile money.' },
  },
  {
    title: { en: 'Quietly rigorous', fr: 'Rigoureux, sans bruit' },
    desc: { en: 'The council reasons only over vetted, reviewed knowledge, never the open web.', fr: 'Le conseil ne raisonne que sur un savoir vérifié et relu, jamais sur le web ouvert.' },
  },
  {
    title: { en: 'Open to all', fr: 'Ouvert à tous' },
    desc: { en: 'Core knowledge stays free for everyone; you upgrade only when you want more.', fr: 'Le savoir essentiel reste gratuit ; vous évoluez seulement si vous le souhaitez.' },
  },
];

const FeatureGrid = () => {
  const navigate = useNavigate();
  const tr = useTr();

  return (
    <>
      {/* Features  editorial list with refined icons */}
      <section className="bg-[#FAF7F0] py-28">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease }}
            className="max-w-2xl"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-800/70 mb-4">
              {tr({ en: 'The ecosystem', fr: 'L’écosystème' })}
            </p>
            <h2 className="text-4xl sm:text-5xl leading-tight text-stone-900">
              {tr({ en: 'One place for the whole of your seeking.', fr: 'Un seul lieu pour toute votre quête.' })}
            </h2>
          </motion.header>

          <div className="mt-14 border-t border-stone-200">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.button
                  key={f.to}
                  onClick={() => navigate(f.to)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease, delay: i * 0.05 }}
                  className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-5 sm:gap-7 border-b border-stone-200 px-2 py-6 text-left rounded-xl transition-colors hover:bg-white/60"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-900/10 bg-emerald-900/[0.04] text-emerald-800 transition-colors group-hover:bg-emerald-900 group-hover:text-[#FAF7F0]">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-base text-emerald-800/40">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="text-2xl sm:text-3xl text-stone-900 transition-colors group-hover:text-emerald-800">
                        {tr(f.title)}
                      </h3>
                    </div>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-stone-500">{tr(f.desc)}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-stone-300 transition-all group-hover:text-emerald-800 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits  editorial */}
      <section className="bg-[#F3EDE1] border-y border-stone-200 py-28">
        <div className="container mx-auto px-6">
          <div className="grid gap-14 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease }}
              className="lg:col-span-5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-800/70 mb-4">
                {tr({ en: 'Why it’s different', fr: 'Ce qui change' })}
              </p>
              <h2 className="text-4xl sm:text-5xl leading-tight text-stone-900">
                {tr({ en: 'Considered answers, not confident guesses.', fr: 'Des réponses réfléchies, pas des suppositions.' })}
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-stone-500">
                {tr({
                  en: 'Not another chatbot scraping the internet. A council that reasons over authenticated Islamic knowledge and tells you when it isn’t certain.',
                  fr: 'Pas un énième robot qui aspire le web. Un conseil qui raisonne sur un savoir islamique authentifié et qui vous dit quand il n’est pas certain.',
                })}
              </p>
            </motion.div>

            <div className="lg:col-span-7 lg:pl-10">
              <div className="border-t border-stone-300/70">
                {BENEFITS.map((b, i) => (
                  <motion.div
                    key={b.title.en}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                    className="flex gap-5 border-b border-stone-300/70 py-7"
                  >
                    <span className="text-xl text-emerald-800/50 pt-1">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="text-2xl text-stone-900">{tr(b.title)}</h3>
                      <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-stone-500">{tr(b.desc)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeatureGrid;
