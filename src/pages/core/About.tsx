import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  Compass,
  Sprout,
  Heart,
  Languages,
  Smile,
  Brain,
  FileCheck,
  VolumeX,
  Quote,
  Check,
  X,
  BookOpenText,
  AlertTriangle,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { useTr, type Loc } from '@/lib/i18n';

const AGENTS: { icon: LucideIcon; name: Loc; role: Loc }[] = [
  {
    icon: Scale,
    name: { en: 'Fiqh', fr: 'Fiqh' },
    role: { en: 'Weighs the rulings across the four Sunni schools, and the evidence behind them.', fr: 'Pèse les avis des quatre écoles sunnites et les preuves qui les fondent.' },
  },
  {
    icon: ShieldCheck,
    name: { en: 'ʿAqīdah', fr: 'ʿAqīda' },
    role: { en: 'Guards the boundaries of sound belief so nothing strays from the creed.', fr: 'Veille sur les limites de la croyance afin que rien ne s’écarte du dogme.' },
  },
  {
    icon: Compass,
    name: { en: 'Context', fr: 'Contexte' },
    role: { en: 'Grounds the answer in contemporary life and the realities of the region.', fr: 'Ancre la réponse dans la vie contemporaine et les réalités de la région.' },
  },
  {
    icon: Sprout,
    name: { en: 'Humility', fr: 'Humilité' },
    role: { en: 'Flags uncertainty and says plainly when a question needs a human scholar.', fr: 'Signale l’incertitude et dit clairement quand une question requiert un savant.' },
  },
];

const PROBLEMS: Loc[] = [
  { en: 'Conflicting fatwas with no source verification', fr: 'Des fatwas contradictoires sans vérification des sources' },
  { en: 'Robotic answers devoid of empathy or context', fr: 'Des réponses robotiques, sans empathie ni contexte' },
  { en: 'Weak or fabricated hadith cited as authentic', fr: 'Des hadiths faibles ou fabriqués cités comme authentiques' },
  { en: 'No acknowledgment of scholarly diversity', fr: 'Aucune reconnaissance de la diversité savante' },
  { en: 'Language barriers limiting access to knowledge', fr: 'Des barrières linguistiques qui limitent l’accès au savoir' },
];

const SOLUTIONS: Loc[] = [
  { en: 'Every answer cites Quran verses & authentic Hadith', fr: 'Chaque réponse cite des versets du Coran et des hadiths authentiques' },
  { en: 'Empathy first — we acknowledge before we advise', fr: 'L’empathie d’abord — on reconnaît avant de conseiller' },
  { en: 'Hadith graded: Sahih, Hasan, Daʿif clearly marked', fr: 'Hadiths gradés : Sahih, Hasan, Daʿif clairement indiqués' },
  { en: 'Respect for all four Madhhabs presented fairly', fr: 'Respect des quatre Madhhabs, présentés équitablement' },
  { en: 'French & English with culturally appropriate responses', fr: 'Français et anglais, avec des réponses culturellement adaptées' },
];

const EVIDENCE: { step: string; icon: LucideIcon; title: Loc; arabic: string; body: Loc }[] = [
  {
    step: '1',
    icon: BookOpenText,
    title: { en: 'The Holy Quran', fr: 'Le Saint Coran' },
    arabic: 'القرآن الكريم',
    body: {
      en: 'The absolute truth and final authority. Every claim is anchored in the words of Allah ﷻ. Verses are cited with Surah name and Ayah number, in Arabic with translation.',
      fr: 'La vérité absolue et l’autorité finale. Chaque affirmation s’ancre dans la parole d’Allah ﷻ. Les versets sont cités avec le nom de la sourate et le numéro de l’ayah, en arabe avec traduction.',
    },
  },
  {
    step: '2',
    icon: ShieldCheck,
    title: { en: 'Sahih & Hasan Hadith', fr: 'Hadith Sahih & Hasan' },
    arabic: 'الحديث الصحيح',
    body: {
      en: 'Verified prophetic traditions from authenticated collections. Every hadith is graded — Sahih (authentic), Hasan (good), or Daʿif (weak). Fabricated (Mawduʿ) narrations are rejected entirely.',
      fr: 'Des traditions prophétiques vérifiées issues de recueils authentifiés. Chaque hadith est gradé — Sahih (authentique), Hasan (bon) ou Daʿif (faible). Les récits fabriqués (Mawduʿ) sont entièrement rejetés.',
    },
  },
  {
    step: '3',
    icon: Scale,
    title: { en: 'Scholarly Consensus', fr: 'Consensus des savants' },
    arabic: 'إجماع العلماء',
    body: {
      en: 'Respecting the wisdom of the four Madhhabs (Hanafi, Maliki, Shafiʿi, Hanbali). Where scholars differ, we present every valid position with its evidence — never imposing a single view.',
      fr: 'Dans le respect de la sagesse des quatre Madhhabs (Hanafite, Malikite, Shafiʿite, Hanbalite). Là où les savants divergent, nous présentons chaque position valide avec ses preuves — sans jamais imposer un seul avis.',
    },
  },
];

const ADAB: { icon: LucideIcon; title: Loc; body: Loc }[] = [
  {
    icon: Heart,
    title: { en: 'Empathy Before Evidence', fr: 'L’empathie avant la preuve' },
    body: {
      en: 'When you share a struggle, we acknowledge your feelings first. “I understand this is difficult…” comes before any ruling. Sometimes you need to feel heard before you can hear.',
      fr: 'Quand vous partagez une épreuve, nous reconnaissons d’abord votre ressenti. « Je comprends que ce soit difficile… » précède tout avis. Parfois, il faut se sentir entendu avant de pouvoir entendre.',
    },
  },
  {
    icon: Languages,
    title: { en: 'Speaks Your Language', fr: 'Parle votre langue' },
    body: {
      en: 'Ask in French or English and we answer in kind, using culturally appropriate terms — “Akhi”, “Ukhti” — so guidance feels close, not foreign.',
      fr: 'Posez votre question en français ou en anglais : nous répondons de même, avec des termes culturellement adaptés — « Akhi », « Ukhti » — pour que le conseil reste proche, jamais étranger.',
    },
  },
  {
    icon: Smile,
    title: { en: 'Non-Judgmental Tone', fr: 'Un ton sans jugement' },
    body: {
      en: 'Questions about past mistakes? Struggles with faith? We never shame. Islam is a religion of mercy, and our responses reflect that: “Allah is Ar-Rahman, the Most Merciful…”',
      fr: 'Des questions sur des erreurs passées ? Des doutes dans la foi ? Nous ne faisons jamais honte. L’islam est une religion de miséricorde, et nos réponses le reflètent : « Allah est Ar-Rahman, le Très Miséricordieux… »',
    },
  },
  {
    icon: Brain,
    title: { en: 'Context-Aware Wisdom', fr: 'Une sagesse attentive au contexte' },
    body: {
      en: 'We know if you’re asking about prayer times or the philosophy of prayer. Quick facts get quick answers; deep questions get scholarly depth. The right response for the right moment.',
      fr: 'Nous distinguons une question sur les horaires de prière d’une question sur le sens de la prière. Les faits simples reçoivent des réponses brèves ; les questions profondes, une profondeur savante. La bonne réponse au bon moment.',
    },
  },
];

const PROTOCOL: { icon: LucideIcon; title: Loc; body: Loc }[] = [
  {
    icon: FileCheck,
    title: { en: 'Strict Citation Protocols', fr: 'Protocoles de citation stricts' },
    body: {
      en: 'The AI is built to provide only answers it can cite with a Quran verse or Hadith. No source, no claim — this is enforced at the prompt level.',
      fr: 'L’IA est conçue pour ne fournir que des réponses qu’elle peut citer avec un verset coranique ou un hadith. Pas de source, pas d’affirmation — c’est imposé au niveau de l’invite.',
    },
  },
  {
    icon: VolumeX,
    title: { en: 'The ‘Silence’ Rule', fr: 'La règle du « silence »' },
    body: {
      en: 'When unsure, the AI says “I don’t know” or “Please consult a scholar.” It is built to stay silent rather than guess or hallucinate.',
      fr: 'En cas de doute, l’IA dit « Je ne sais pas » ou « Veuillez consulter un savant ». Elle est conçue pour se taire plutôt que deviner ou inventer.',
    },
  },
  {
    icon: Quote,
    title: { en: 'Citation-First Architecture', fr: 'Une architecture centrée sur la citation' },
    body: {
      en: 'Evidence comes before interpretation. The AI prioritizes the actual text — Quran or Hadith — over its own paraphrasing.',
      fr: 'La preuve précède l’interprétation. L’IA privilégie le texte lui-même — Coran ou hadith — plutôt que sa propre paraphrase.',
    },
  },
];

export default function About() {
  const tr = useTr();

  return (
    <div className="flex-1 bg-warm-base">
      {/* Hero */}
      <section className="relative pt-28 pb-16">
        <div className="container px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-800/70 mb-5">
              {tr({ en: 'Our Methodology & Values', fr: 'Notre méthodologie & nos valeurs' })}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight text-stone-900">
              {tr({ en: 'Preserving the sanctity of knowledge in the age of AI', fr: 'Préserver la sacralité du savoir à l’ère de l’IA' })}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-stone-500">
              {tr({
                en: 'Where authentic Islamic scholarship meets modern technology. GëstuSaDine bridges 1400 years of sacred tradition with the digital age — treating every question as an opportunity to illuminate hearts with truth.',
                fr: 'Là où la science islamique authentique rencontre la technologie moderne. GëstuSaDine relie 1400 ans de tradition sacrée à l’ère numérique — en faisant de chaque question une occasion d’éclairer les cœurs par la vérité.',
              })}
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-900"
              >
                {tr({ en: 'Begin your journey', fr: 'Commencez votre parcours' })}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#methodology"
                className="text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
              >
                {tr({ en: 'Our methodology', fr: 'Notre méthodologie' })}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why we built this */}
      <section id="methodology" className="py-16 border-t border-stone-200/70 scroll-mt-24">
        <div className="container px-6">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              {tr({ en: 'Why we built this', fr: 'Pourquoi nous l’avons bâti' })}
            </h2>
            <p className="mt-4 text-stone-500 leading-relaxed">
              {tr({
                en: 'The internet is full of noise — conflicting opinions, unverified sources, and robotic answers that lack the warmth of human understanding.',
                fr: 'Internet est saturé de bruit — opinions contradictoires, sources non vérifiées et réponses robotiques dénuées de la chaleur d’une compréhension humaine.',
              })}
            </p>
          </div>
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white/50 p-8">
              <h3 className="text-xl font-bold text-stone-900 mb-5">{tr({ en: 'The problem', fr: 'Le problème' })}</h3>
              <ul className="space-y-3">
                {PROBLEMS.map((p) => (
                  <li key={p.en} className="flex items-start gap-3 text-sm leading-relaxed text-stone-600">
                    <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-500" strokeWidth={2.4} />
                    <span>{tr(p)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-900/15 bg-emerald-900/[0.03] p-8">
              <h3 className="text-xl font-bold text-stone-900 mb-5">{tr({ en: 'Our solution', fr: 'Notre solution' })}</h3>
              <ul className="space-y-3">
                {SOLUTIONS.map((s) => (
                  <li key={s.en} className="flex items-start gap-3 text-sm leading-relaxed text-stone-600">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700" strokeWidth={2.4} />
                    <span>{tr(s)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <blockquote className="mx-auto mt-10 max-w-2xl text-center">
            <p className="text-lg italic leading-relaxed text-stone-700">
              {tr({
                en: '“We built GëstuSaDine to be a companion, not just a search engine — a tool that speaks with Adab (manners) and Hikmah (wisdom), prioritizing the Quran and Sunnah above all.”',
                fr: '« Nous avons conçu GëstuSaDine comme un compagnon, et non un simple moteur de recherche — un outil qui parle avec Adab (les bonnes manières) et Hikmah (la sagesse), en plaçant le Coran et la Sunna au-dessus de tout. »',
              })}
            </p>
            <footer className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800/70">
              {tr({ en: '— The GëstuSaDine Team', fr: '— L’équipe GëstuSaDine' })}
            </footer>
          </blockquote>
        </div>
      </section>

      {/* The Council */}
      <section className="py-20 bg-[#F3EDE1] border-t border-stone-200/70">
        <div className="container px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
              {tr({ en: 'The four voices of the Council', fr: 'Les quatre voix du Conseil' })}
            </h2>
            <p className="text-stone-500 mb-10 max-w-xl">
              {tr({
                en: 'Each agent reasons independently. Together they reach a considered consensus.',
                fr: 'Chaque agent raisonne indépendamment. Ensemble, ils parviennent à un consensus réfléchi.',
              })}
            </p>
            <div className="border-t border-stone-300/70">
              {AGENTS.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.name.en} className="flex items-center gap-5 border-b border-stone-300/70 py-6">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-emerald-900/10 bg-emerald-900/[0.04] text-emerald-800">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-stone-900">{tr(a.name)}</h3>
                      <p className="mt-0.5 max-w-xl text-sm leading-relaxed text-stone-500">{tr(a.role)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Hierarchy of evidence */}
      <section className="py-20 border-t border-stone-200/70">
        <div className="container px-6">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-800/70 mb-4">
              {tr({ en: 'The Truth Engine', fr: 'Le moteur de vérité' })}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              {tr({ en: 'Our hierarchy of evidence', fr: 'Notre hiérarchie des preuves' })}
            </h2>
            <p className="mt-4 text-stone-500 leading-relaxed">
              {tr({
                en: 'Every response follows a strict hierarchy — so authenticity is never compromised.',
                fr: 'Chaque réponse suit une hiérarchie stricte — afin que l’authenticité ne soit jamais compromise.',
              })}
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {EVIDENCE.map((e) => {
              const Icon = e.icon;
              return (
                <div key={e.step} className="relative rounded-2xl border border-stone-200 bg-white/50 p-8">
                  <span className="absolute right-6 top-6 text-4xl font-bold text-stone-200">{e.step}</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-900/10 bg-emerald-900/[0.04] text-emerald-800 mb-5">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="text-lg font-bold text-stone-900">{tr(e.title)}</h3>
                  <p dir="rtl" className="mt-1 text-lg text-emerald-800/80">{e.arabic}</p>
                  <p className="mt-3 text-sm leading-relaxed text-stone-500">{tr(e.body)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Adab Algorithm */}
      <section className="py-20 bg-[#F3EDE1] border-t border-stone-200/70">
        <div className="container px-6">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-800/70 mb-4">
              {tr({ en: 'The Adab Algorithm', fr: 'L’algorithme de l’Adab' })}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              {tr({ en: 'Emotional intelligence by design', fr: 'L’intelligence émotionnelle par conception' })}
            </h2>
            <p className="mt-4 text-stone-500 leading-relaxed">
              {tr({
                en: 'Our AI doesn’t just list rules — it understands the human heart, responding with the gentleness and wisdom of a caring elder.',
                fr: 'Notre IA ne se contente pas d’énumérer des règles — elle comprend le cœur humain et répond avec la douceur et la sagesse d’un aîné bienveillant.',
              })}
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {ADAB.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.title.en} className="rounded-2xl border border-stone-200 bg-white/60 p-8">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-900/10 bg-emerald-900/[0.04] text-emerald-800 mb-5">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="text-lg font-bold text-stone-900">{tr(a.title)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-500">{tr(a.body)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Verification Protocol */}
      <section className="py-20 border-t border-stone-200/70">
        <div className="container px-6">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-800/70 mb-4">
              {tr({ en: 'Radical Transparency', fr: 'Transparence radicale' })}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              {tr({ en: 'The verification protocol', fr: 'Le protocole de vérification' })}
            </h2>
            <p className="mt-4 text-stone-500 leading-relaxed">
              {tr({
                en: 'AI is not infallible — and we don’t pretend otherwise. Here’s exactly how we keep answers accurate.',
                fr: 'L’IA n’est pas infaillible — et nous ne prétendons pas le contraire. Voici précisément comment nous préservons l’exactitude des réponses.',
              })}
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {PROTOCOL.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title.en} className="rounded-2xl border border-stone-200 bg-white/50 p-8">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-900/10 bg-emerald-900/[0.04] text-emerald-800 mb-5">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="text-lg font-bold text-stone-900">{tr(p.title)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-500">{tr(p.body)}</p>
                </div>
              );
            })}
          </div>

          {/* Honest disclaimer */}
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-amber-300/60 bg-amber-50/70 p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-amber-600" strokeWidth={1.8} />
              <div>
                <h3 className="text-lg font-bold text-stone-900">{tr({ en: 'The honest disclaimer', fr: 'L’avertissement en toute honnêteté' })}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {tr({
                    en: 'GëstuSaDine is a tool for learning and exploration — not a replacement for qualified human scholars or imams. For formal legal rulings (marriage, divorce, inheritance, and the like), always consult a local scholar who understands your context.',
                    fr: 'GëstuSaDine est un outil d’apprentissage et d’exploration — non un substitut aux savants ou imams qualifiés. Pour les avis juridiques formels (mariage, divorce, héritage, etc.), consultez toujours un savant local qui comprend votre contexte.',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
