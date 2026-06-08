import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Check, Send, Heart, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useCircleById, useCirclePosts, useJoinedCircles } from '@/data/community';
import { useAuth } from '@/auth/AuthContext';
import { useSubscription } from '@/data/subscription';
import { CIRCLE_ICONS, CIRCLE_ACCENTS } from './circleVisuals';
import { useTr } from '@/lib/i18n';

type Tr = ReturnType<typeof useTr>;

const timeAgo = (iso: string | number, tr: Tr) => {
  const diff = Date.now() - Date.parse(iso);
  const mins = Math.round(diff / 60000);
  if (mins < 1) return tr({ en: 'just now', fr: 'à l’instant' });
  if (mins < 60) return tr({ en: `${mins}m ago`, fr: `il y a ${mins} min` });
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return tr({ en: `${hrs}h ago`, fr: `il y a ${hrs} h` });
  const days = Math.round(hrs / 24);
  return tr({ en: `${days}d ago`, fr: `il y a ${days} j` });
};

const CircleDetail = () => {
  const { circleId } = useParams<{ circleId: string }>();
  const circle = useCircleById(circleId);
  const seedPosts = useCirclePosts(circleId);
  const { joined, toggleJoin } = useJoinedCircles();
  const { user } = useAuth();
  const { can } = useSubscription();
  const navigate = useNavigate();
  const tr = useTr();
  const canParticipate = can('community.participate');
  const createPost = useMutation(api.community.createPost);
  const [posting, setPosting] = useState(false);
  const [draft, setDraft] = useState('');

  if (!circle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-4">
        <p className="text-deep-green/60">{tr({ en: 'This circle could not be found.', fr: 'Ce cercle est introuvable.' })}</p>
        <Link to="/community" className="btn-gold inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> {tr({ en: 'Back to Community', fr: 'Retour à la communauté' })}
        </Link>
      </div>
    );
  }

  const Icon = CIRCLE_ICONS[circle.iconKey];
  const accent = CIRCLE_ACCENTS[circle.accent];
  const isJoined = joined.has(circle.id);
  const posts = seedPosts;

  const handleJoin = () => {
    if (!isJoined) {
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
    toggleJoin(circle.id);
    toast(isJoined
      ? tr({ en: `You left ${circle.name}.`, fr: `Vous avez quitté ${circle.name}.` })
      : tr({ en: `You joined ${circle.name}.`, fr: `Vous avez rejoint ${circle.name}.` }));
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canParticipate) {
      navigate('/pricing');
      return;
    }
    const body = draft.trim();
    if (!body || posting) return;
    setPosting(true);
    setDraft('');
    try {
      await createPost({ circleId: circle.id as any, content: body });
      toast(tr({ en: 'Posted to the circle.', fr: 'Publié dans le cercle.' }));
    } catch {
      setDraft(body);
      toast.error(tr({ en: 'Failed to post. Please try again.', fr: 'Échec de la publication. Réessayez.' }));
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-base">
      <div className="container px-4 mx-auto max-w-3xl pt-24 pb-20">
        <Link
          to="/community"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-deep-green/50 hover:text-deep-green transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> {tr({ en: 'Community', fr: 'Communauté' })}
        </Link>

        {/* Circle header */}
        <div className="glass-card-warm p-6 rounded-2xl mb-8">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl ${accent.bg} ${accent.fg} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-deep-green">{circle.name}</h1>
              <p className="text-sm text-warm-gold font-semibold">{circle.topic}</p>
              <p className="text-sm text-deep-green/55 mt-3 leading-relaxed">{circle.description}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-deep-green/45">
                  <Users className="w-4 h-4" />
                  <span>{(circle.memberCount + (isJoined ? 1 : 0)).toLocaleString()} {tr({ en: 'members', fr: 'membres' })}</span>
                </div>
                <button
                  onClick={handleJoin}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                    isJoined ? 'bg-deep-green/10 text-deep-green' : 'bg-warm-gold text-warm-cream hover:bg-warm-gold-light'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> {tr({ en: 'Joined', fr: 'Rejoint' })}
                    </>
                  ) : (
                    tr({ en: 'Join circle', fr: 'Rejoindre' })
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Composer  posting is a participating-tier feature; others see a notice */}
        {canParticipate ? (
          <form onSubmit={handlePost} className="glass-card-warm p-5 rounded-2xl mb-8">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={tr({ en: `Share a question or insight with ${circle.name}…`, fr: `Partagez une question ou une réflexion avec ${circle.name}…` })}
              className="w-full min-h-[90px] p-3 rounded-xl border border-warm-sand bg-warm-sand/20 text-deep-green placeholder:text-deep-green/30 resize-none focus:outline-none focus:ring-2 focus:ring-warm-gold/20 focus:border-warm-gold/50 transition-all text-base"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={!draft.trim() || posting}
                className="btn-gold inline-flex items-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" /> {posting ? tr({ en: 'Posting…', fr: 'Publication…' }) : tr({ en: 'Post', fr: 'Publier' })}
              </button>
            </div>
          </form>
        ) : (
          <div className="glass-card-warm p-6 rounded-2xl mb-8 text-center">
            <div className="w-11 h-11 rounded-xl bg-deep-green/8 text-deep-green flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-deep-green mb-1">
              {tr({ en: 'You’re reading as a guest', fr: 'Vous lisez en tant qu’invité' })}
            </p>
            <p className="text-sm text-deep-green/55 mb-4">
              {user
                ? tr({ en: 'Posting in circles is part of the Student plan.', fr: 'Publier dans les cercles fait partie de l’offre Étudiant.' })
                : tr({ en: 'Sign in and upgrade to post in circles.', fr: 'Connectez-vous et passez à une offre supérieure pour publier.' })}
            </p>
            <button
              onClick={() => navigate(user ? '/pricing' : '/login')}
              className="btn-gold inline-flex items-center gap-2 text-sm"
            >
              {user ? tr({ en: 'See plans', fr: 'Voir les offres' }) : tr({ en: 'Sign in', fr: 'Se connecter' })}
            </button>
          </div>
        )}

        {/* Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="glass-card-warm p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-full ${accent.bg} ${accent.fg} flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-deep-green leading-tight">{post.author}</p>
                  <p className="text-xs text-deep-green/40">{timeAgo(post.createdAt, tr)}</p>
                </div>
              </div>
              <p className="text-sm text-deep-green/70 leading-relaxed mb-3 whitespace-pre-wrap">{post.body}</p>
              <div className="flex items-center gap-1.5 text-xs text-deep-green/40">
                <Heart className="w-3.5 h-3.5" />
                <span>{post.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CircleDetail;
