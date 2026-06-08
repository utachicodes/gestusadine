import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useTr, type Loc } from "@/lib/i18n";

const NAV: { label: Loc; path: string }[] = [
  { label: { en: 'Home', fr: 'Accueil' }, path: '/' },
  { label: { en: 'Methodology', fr: 'Méthodologie' }, path: '/about' },
  { label: { en: 'Help Center', fr: 'Aide' }, path: '/faq' },
  { label: { en: 'Contact', fr: 'Contact' }, path: '/contact' },
];

const ECOSYSTEM: { label: Loc; path: string }[] = [
  { label: { en: 'Library', fr: 'Bibliothèque' }, path: '/library' },
  { label: { en: 'Events', fr: 'Événements' }, path: '/events' },
  { label: { en: 'Prayer Times', fr: 'Horaires de prière' }, path: '/prayer-times' },
  { label: { en: 'Council', fr: 'Conseil' }, path: '/chat' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const tr = useTr();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success(tr({ en: "You're on the list.", fr: 'Vous êtes inscrit.' }));
    setEmail('');
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 mb-14">
          {/* Brand */}
          <div>
            <img src="/logofinal.png" alt="GëstuSaDine" className="h-6 w-auto brightness-0 opacity-80 mb-5" />
            <p className="text-lg leading-snug text-muted-foreground max-w-xs">
              {tr({
                en: 'Authentic knowledge, considered guidance, and a community of seekers.',
                fr: 'Un savoir authentique, une guidance réfléchie et une communauté de chercheurs.',
              })}
            </p>

          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 mb-5">
              {tr({ en: 'Company', fr: 'Société' })}
            </h4>
            <div className="flex flex-col gap-3">
              {NAV.map((item) => (
                <Link key={item.path} to={item.path} className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
                  {tr(item.label)}
                </Link>
              ))}
            </div>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 mb-5">
              {tr({ en: 'Ecosystem', fr: 'Écosystème' })}
            </h4>
            <div className="flex flex-col gap-3">
              {ECOSYSTEM.map((item) => (
                <Link key={item.path} to={item.path} className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
                  {tr(item.label)}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 mb-5">
              {tr({ en: 'Newsletter', fr: 'Infolettre' })}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              {tr({ en: 'New lessons and reflections, now and then.', fr: 'De nouvelles leçons et réflexions, de temps à autre.' })}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {tr({ en: 'Subscribe', fr: "S'abonner" })} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground/60">
            © {currentYear} GëstuSaDine. {tr({ en: 'All rights reserved.', fr: 'Tous droits réservés.' })}
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">{tr({ en: 'Privacy', fr: 'Confidentialité' })}</Link>
            <Link to="/terms" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">{tr({ en: 'Terms', fr: 'Conditions' })}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
