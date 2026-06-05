import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Mail, Phone, Sparkles, Compass, ChevronDown, ArrowRight } from 'lucide-react';
import { useTr, type Loc } from '@/lib/i18n';

const FAQS: { question: Loc; answer: Loc }[] = [
  {
    question: { en: 'How do I ask the Council a question?', fr: 'Comment poser une question au Conseil ?' },
    answer: {
      en: 'Open “The Council” from the sidebar, type your question in French or English, and send. Several specialized agents answer independently, then a synthesis layer returns one referenced answer with a confidence score.',
      fr: 'Ouvrez « Le Conseil » depuis la barre latérale, écrivez votre question en français ou en anglais, puis envoyez. Plusieurs agents spécialisés répondent indépendamment, puis une couche de synthèse renvoie une réponse référencée avec un score de confiance.',
    },
  },
  {
    question: { en: 'How do I know the answers are reliable?', fr: 'Comment savoir si les réponses sont fiables ?' },
    answer: {
      en: 'Every response is built from a curated library of authentic texts. The Aqeedah agent flags anything theologically problematic, and the Humility agent tells you when the AI is not confident enough to give a definitive answer.',
      fr: "Chaque réponse est construite à partir d'une bibliothèque de textes authentiques. L'agent Aqida signale tout ce qui pose problème sur le plan théologique, et l'agent d'humilité vous indique quand l'IA n'est pas assez sûre pour donner une réponse définitive.",
    },
  },
  {
    question: { en: 'How do credits work?', fr: 'Comment fonctionnent les crédits ?' },
    answer: {
      en: 'Each question to the Council uses one credit. Free accounts get a monthly allowance; paid plans get far more, up to unlimited fair use. Credits reset every month.',
      fr: "Chaque question au Conseil utilise un crédit. Les comptes gratuits disposent d'un quota mensuel ; les offres payantes en obtiennent bien plus, jusqu'à un usage illimité raisonnable. Les crédits sont réinitialisés chaque mois.",
    },
  },
  {
    question: { en: 'Can I customize the theme?', fr: 'Puis-je personnaliser le thème ?' },
    answer: {
      en: 'Paid plans can set custom brand colors from Settings → Appearance. The platform is light-mode only for a calm, consistent reading experience.',
      fr: 'Les offres payantes peuvent définir des couleurs personnalisées depuis Paramètres → Apparence. La plateforme est uniquement en mode clair, pour une lecture calme et cohérente.',
    },
  },
  {
    question: { en: 'Can I cancel anytime?', fr: 'Puis-je annuler à tout moment ?' },
    answer: {
      en: 'Yes. Cancel from Settings → Subscription. You keep access until the end of your billing cycle.',
      fr: "Oui. Annulez depuis Paramètres → Abonnement. Vous conservez l'accès jusqu'à la fin de votre cycle de facturation.",
    },
  },
];

const Help: React.FC = () => {
  const tr = useTr();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState<number | null>(0);

  const contacts: {
    icon: typeof Mail;
    title: Loc;
    desc: Loc;
    action: Loc;
    onClick: () => void;
  }[] = [
    {
      icon: MessageCircle,
      title: { en: 'Chat support', fr: 'Chat support' },
      desc: { en: 'Reply within 1 business hour', fr: 'Réponse en 1 heure ouvrée' },
      action: { en: 'Open', fr: 'Ouvrir' },
      onClick: () => navigate('/chat'),
    },
    {
      icon: Mail,
      title: { en: 'Email', fr: 'Email' },
      desc: { en: 'xamsadineai@gmail.com', fr: 'xamsadineai@gmail.com' },
      action: { en: 'Write', fr: 'Écrire' },
      onClick: () => { window.location.href = 'mailto:xamsadineai@gmail.com'; },
    },
    {
      icon: Phone,
      title: { en: 'Phone', fr: 'Téléphone' },
      desc: { en: '78 108 05 06', fr: '78 108 05 06' },
      action: { en: 'Call', fr: 'Appeler' },
      onClick: () => { window.location.href = 'tel:+221781080506'; },
    },
  ];

  return (
    <div>
      <section className="container py-8 md:py-10 space-y-8 max-w-5xl">
        {/* Header */}
        <header>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
            {tr({ en: 'Help', fr: 'Aide' })}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {tr({ en: 'Help center', fr: "Centre d'assistance" })}
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            {tr({ en: 'Answers to common questions and ways to reach support.', fr: 'Réponses aux questions fréquentes et contacts du support.' })}
          </p>
        </header>

        {/* Contact cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {contacts.map(({ icon: Icon, title, desc, action, onClick }) => (
            <div key={tr(title)} className="islamic-card p-5 flex flex-col">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2.5 rounded-xl bg-accent/50 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground">{tr(title)}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 truncate">{tr(desc)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClick}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
              >
                {tr(action)}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Getting started */}
        <div className="islamic-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/[0.08]" />
          <div className="relative flex flex-col sm:flex-row gap-5">
            <div className="flex-shrink-0 p-3 rounded-2xl bg-accent/50 text-primary h-fit">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                {tr({ en: 'Getting started with the Council', fr: 'Bien démarrer avec le Conseil' })}
              </h3>
              <p className="mt-2 text-muted-foreground leading-relaxed max-w-3xl">
                {tr({
                  en: 'The Council brings together specialized AI agents  Fiqh, Aqeedah, contemporary context, and humility  grounded in authentic sources. Ask naturally, in French or English, and you get one referenced answer with a confidence score.',
                  fr: "Le Conseil réunit des agents IA spécialisés  Fiqh, Aqida, contexte contemporain et humilité  ancrés dans des sources authentiques. Posez vos questions naturellement, en français ou en anglais, et obtenez une réponse référencée avec un score de confiance.",
                })}
              </p>
              <button
                type="button"
                onClick={() => navigate('/chat')}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                <Compass className="w-4 h-4" />
                {tr({ en: 'Ask the Council', fr: 'Consulter le Conseil' })}
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
            {tr({ en: 'FAQ', fr: 'FAQ' })}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {tr({ en: 'Frequently asked questions', fr: 'Questions fréquentes' })}
          </h2>

          <div className="mt-5 space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="islamic-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className={`font-medium ${isOpen ? 'text-primary' : 'text-foreground'}`}>
                      {tr(faq.question)}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-4">
                      {tr(faq.answer)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;
