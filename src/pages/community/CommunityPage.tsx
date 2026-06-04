import React from 'react';
import { Users, MessageSquare, Globe, ArrowRight, Check, type LucideIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCircles, useJoinedCircles } from '@/data/community';
import { useAuth } from '@/auth/AuthContext';
import { useSubscription } from '@/data/subscription';
import { CIRCLE_ICONS, CIRCLE_ACCENTS } from './circleVisuals';
import { useTr, type Loc } from '@/lib/i18n';

const HIGHLIGHTS: { icon: LucideIcon; title: Loc; desc: Loc; color: string; bg: string }[] = [
  {
    icon: MessageSquare,
    title: { en: 'Discussions', fr: 'Discussions' },
    desc: { en: 'Moderated conversations on Islamic topics. Ask, answer, and learn from others.', fr: 'Des conversations modérées sur des sujets islamiques. Posez, répondez, apprenez des autres.' },
    color: 'text-deep-green',
    bg: 'bg-deep-green/8',
  },
  {
    icon: Users,
    title: { en: 'Circles', fr: 'Cercles' },
    desc: { en: 'Focused groups on specific topics: fiqh, Quran memorisation, parenting, and more.', fr: 'Des groupes ciblés sur des thèmes précis : fiqh, mémorisation du Coran, parentalité, et plus.' },
    color: 'text-warm-gold',
    bg: 'bg-warm-gold/8',
  },
  {
    icon: Globe,
    title: { en: 'English & French', fr: 'Anglais & Français' },
    desc: { en: "Participate in the language you're most comfortable with.", fr: 'Participez dans la langue qui vous convient le mieux.' },
    color: 'text-sage-green-dark',
    bg: 'bg-sage-green/8',
  },
];

const CommunityPage = () => {
  const circles = useCircles();
  const { joined, toggleJoin } = useJoinedCircles();
  const { user } = useAuth();
  const { can } = useSubscription();
  const navigate = useNavigate();
  const tr = useTr();
  const canParticipate = can('community.participate');

  const totalMembers = circles.reduce((sum, c) => sum + c.memberCount, 0);
  const stats: { value: string; label: Loc }[] = [
    { value: totalMembers.toLocaleString(), label: { en: 'Members', fr: 'Membres' } },
    { value: String(circles.length), label: { en: 'Active Circles', fr: 'Cercles actifs' } },
    { value: '2', label: { en: 'Languages', fr: 'Langues' } },
  ];

  const handleJoin = (id: string, name: string) => {
    const wasJoined = joined.has(id);
    // Leaving is always allowed; joining requires a participating tier.
    if (!wasJoined) {
      if (!user) {
        toast(tr({ en: 'Sign in to join circles.', fr: 'Connectez-vous pour rejoindre les cercles.' }));
        navigate('/login');
        return;
      }
      if (!canParticipate) {
        toast(tr({ en: 'Joining circles is a Student feature.', fr: 'Rejoindre des cercles est une fonctionnalité Étudiant.' }), {
          description: tr({ en: 'Upgrade your plan to participate.', fr: 'Passez à une offre supérieure pour participer.' }),
        });
        navigate('/pricing');
        return;
      }
    }
    toggleJoin(id);
    toast(wasJoined
      ? tr({ en: `You left ${name}.`, fr: `Vous avez quitté ${name}.` })
      : tr({ en: `You joined ${name}.`, fr: `Vous avez rejoint ${name}.` }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-20 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-warm-base -z-10" />

        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-deep-green mb-4 leading-tight">
            {tr({ en: 'Community', fr: 'Communauté' })}
          </h1>

          <p className="text-lg text-deep-green/55 max-w-xl mx-auto mb-10">
            {tr({
              en: 'Join discussion circles on Fiqh, Quran, family, and more. Ask questions, share insights, learn together.',
              fr: 'Rejoignez des cercles de discussion sur le fiqh, le Coran, la famille et plus encore. Posez vos questions, partagez, apprenez ensemble.',
            })}
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            {stats.map((stat) => (
              <div key={stat.label.en} className="text-center">
                <p className="text-3xl font-bold text-deep-green">{stat.value}</p>
                <p className="text-sm text-deep-green/50">{tr(stat.label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's here */}
      <section className="py-14">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {HIGHLIGHTS.map((feature) => (
              <div
                key={feature.title.en}
                className="glass-card-warm p-6 rounded-2xl text-center transition-all duration-200 hover:shadow-md"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-deep-green mb-2">{tr(feature.title)}</h3>
                <p className="text-sm text-deep-green/50 leading-relaxed">{tr(feature.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Circles */}
      <section className="py-14 bg-warm-sand/20 border-y border-warm-sand/60">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-deep-green mb-3">
              {tr({ en: 'Active Circles', fr: 'Cercles actifs' })}
            </h2>
            <p className="text-deep-green/50 max-w-md mx-auto text-sm">
              {tr({ en: 'Focused groups moderated by knowledgeable members.', fr: 'Des groupes ciblés, modérés par des membres compétents.' })}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {circles.map((circle) => {
              const Icon = CIRCLE_ICONS[circle.iconKey];
              const accent = CIRCLE_ACCENTS[circle.accent];
              const isJoined = joined.has(circle.id);
              return (
                <div
                  key={circle.id}
                  className="glass-card-warm p-5 rounded-2xl transition-all duration-200 hover:shadow-md flex flex-col"
                >
                  <Link to={`/community/${circle.id}`} className="block group">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.fg} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-deep-green/35">{circle.lastActive}</span>
                    </div>

                    <h3 className="text-sm font-bold text-deep-green mb-1 group-hover:text-warm-gold transition-colors">
                      {circle.name}
                    </h3>
                    <p className="text-xs text-deep-green/50 mb-3">{circle.topic}</p>
                  </Link>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-xs text-deep-green/45">
                      <Users className="w-3.5 h-3.5" />
                      <span>{(circle.memberCount + (isJoined ? 1 : 0)).toLocaleString()} {tr({ en: 'members', fr: 'membres' })}</span>
                    </div>
                    <button
                      onClick={() => handleJoin(circle.id, circle.name)}
                      className={`text-xs font-bold transition-colors flex items-center gap-1 ${
                        isJoined ? 'text-deep-green' : 'text-warm-gold hover:text-warm-gold-light'
                      }`}
                    >
                      {isJoined ? (
                        <>
                          {tr({ en: 'Joined', fr: 'Rejoint' })} <Check className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          {tr({ en: 'Join', fr: 'Rejoindre' })} <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-deep-green -z-10" />

        <div className="container px-4 mx-auto text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold text-warm-cream mb-4">
              {tr({ en: 'Join the community', fr: 'Rejoignez la communauté' })}
            </h2>
            <p className="text-warm-cream/50 mb-8">
              {tr({ en: 'Create an account and start participating in circles and discussions.', fr: 'Créez un compte et commencez à participer aux cercles et aux discussions.' })}
            </p>
            <Link to="/login" className="btn-gold inline-flex items-center gap-2">
              {tr({ en: 'Sign up free', fr: 'Inscription gratuite' })}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunityPage;
