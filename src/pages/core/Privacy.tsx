import * as React from 'react';
import { useState } from 'react';
import { ShieldCheck, HeartHandshake, ChevronDown } from 'lucide-react';
import { useTr } from '@/lib/i18n';

function Section({
  title,
  subtitle,
  defaultOpen,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="glass-card-warm rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span>
          <span className="block text-base font-bold text-deep-green">{title}</span>
          {subtitle && <span className="block text-xs text-deep-green/45 mt-0.5">{subtitle}</span>}
        </span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 text-deep-green/50 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-6 text-sm text-deep-green/65 leading-relaxed border-t border-warm-sand/60 pt-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Privacy() {
  const tr = useTr();

  return (
    <div className="flex-1 relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-warm-base -z-10" />

      <div className="container relative z-10 py-20 px-4 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-warm-gold mb-4">
            <ShieldCheck className="w-4 h-4" /> {tr({ en: 'Privacy', fr: 'Confidentialité' })}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-deep-green mb-3 tracking-tight">
            {tr({ en: 'The Amanah (Trust) Covenant', fr: "Le Pacte de l'Amâna (la Confiance)" })}
          </h1>
          <p className="text-base text-deep-green/55 max-w-lg mx-auto">
            {tr({
              en: 'Your data is an Amanah — a sacred trust placed in our care. We honor this responsibility with the highest standards of protection and transparency.',
              fr: 'Vos données sont une Amâna — un dépôt sacré confié à notre garde. Nous honorons cette responsabilité avec les plus hauts standards de protection et de transparence.',
            })}
          </p>
          <p className="text-deep-green/40 text-xs mt-4">{tr({ en: 'Last updated: January 2026', fr: 'Dernière mise à jour : janvier 2026' })}</p>
        </div>

        {/* Sacred commitment */}
        <div className="glass-card-warm rounded-2xl p-7 mb-8 text-center border border-warm-gold/20">
          <HeartHandshake className="w-7 h-7 text-warm-gold mx-auto mb-3" />
          <p className="text-lg italic text-deep-green mb-2">
            {tr({ en: '“We do not sell your personal data. It is a trust.”', fr: "« Nous ne vendons pas vos données personnelles. C'est un dépôt sacré. »" })}
          </p>
          <p className="text-sm text-deep-green/55">
            {tr({
              en: 'Your information will never be sold, traded, or monetized to third parties.',
              fr: 'Vos informations ne seront jamais vendues, échangées ou monétisées auprès de tiers.',
            })}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          <Section
            title={tr({ en: 'Data We Collect', fr: 'Données que nous collectons' })}
            subtitle={tr({ en: 'What information we gather and why', fr: 'Quelles informations et pourquoi' })}
            defaultOpen
          >
            <p>
              {tr({
                en: 'When you create an account we collect your name, email, and optional profile details. As you use the platform we store your questions to the Council, saved content, subscription status, and basic usage analytics (pages visited, features used).',
                fr: "Lorsque vous créez un compte, nous collectons votre nom, votre e-mail et des informations de profil facultatives. À l'usage, nous conservons vos questions au Conseil, le contenu enregistré, votre statut d'abonnement et des données d'usage de base (pages visitées, fonctionnalités utilisées).",
              })}
            </p>
            <p>
              {tr({
                en: 'We collect only what is needed to provide and improve the service — nothing more.',
                fr: 'Nous ne collectons que ce qui est nécessaire pour fournir et améliorer le service — rien de plus.',
              })}
            </p>
          </Section>

          <Section
            title={tr({ en: 'Third-Party Services', fr: 'Services tiers' })}
            subtitle={tr({ en: 'Partners who help us serve you', fr: 'Les partenaires qui nous aident' })}
          >
            <p>
              {tr({
                en: 'We rely on trusted providers to operate: authentication & account management, secure hosting and database, AI model processing for the Council, payment processing for subscriptions, and Islamic data APIs (prayer times, the Hijri calendar, and the Qur’an text). Each receives only the minimum data required to perform its function.',
                fr: "Nous nous appuyons sur des prestataires de confiance : authentification et gestion des comptes, hébergement et base de données sécurisés, traitement par modèles d'IA pour le Conseil, traitement des paiements pour les abonnements, et API de données islamiques (horaires de prière, calendrier hégirien, texte du Coran). Chacun ne reçoit que le minimum de données nécessaire à sa fonction.",
              })}
            </p>
          </Section>

          <Section
            title={tr({ en: 'How We Use Your Data', fr: 'Comment nous utilisons vos données' })}
            subtitle={tr({ en: 'The purpose behind our collection', fr: 'La finalité de la collecte' })}
          >
            <ul className="space-y-2 list-disc list-inside">
              <li>{tr({ en: 'Generating Council answers to your questions', fr: 'Générer les réponses du Conseil à vos questions' })}</li>
              <li>{tr({ en: 'Personalizing your daily content and recommendations', fr: 'Personnaliser votre contenu quotidien et vos recommandations' })}</li>
              <li>{tr({ en: 'Processing subscriptions and payments', fr: 'Traiter les abonnements et les paiements' })}</li>
              <li>{tr({ en: 'Sending important updates (you can opt out)', fr: 'Envoyer des mises à jour importantes (désinscription possible)' })}</li>
              <li>{tr({ en: 'Securing the platform and improving the service', fr: 'Sécuriser la plateforme et améliorer le service' })}</li>
            </ul>
            <p>
              {tr({
                en: 'Your data is encrypted in transit and at rest, and access is restricted so you only ever reach your own data.',
                fr: "Vos données sont chiffrées en transit et au repos, et l'accès est restreint afin que vous n'atteigniez que vos propres données.",
              })}
            </p>
          </Section>

          <Section
            title={tr({ en: 'Data Deletion', fr: 'Suppression des données' })}
            subtitle={tr({ en: 'Your right to be forgotten', fr: "Votre droit à l'oubli" })}
          >
            <p>
              {tr({
                en: 'You may request deletion of your account and associated data at any time from Settings, or by emailing us. Once confirmed, we permanently remove your personal data from our active systems, except where retention is required by law.',
                fr: "Vous pouvez demander la suppression de votre compte et des données associées à tout moment depuis les Paramètres, ou par e-mail. Une fois confirmée, nous supprimons définitivement vos données personnelles de nos systèmes actifs, sauf obligation légale de conservation.",
              })}
            </p>
          </Section>

          <Section
            title={tr({ en: 'Contact Us', fr: 'Nous contacter' })}
            subtitle={tr({ en: 'Questions or concerns', fr: 'Questions ou préoccupations' })}
          >
            <p>
              {tr({
                en: 'For any question, concern, or request regarding this Privacy Policy or your data, contact us at',
                fr: 'Pour toute question, préoccupation ou demande concernant cette politique ou vos données, contactez-nous à',
              })}{' '}
              <a href="mailto:support@gestusadine.com" className="text-warm-gold hover:underline font-medium">
                support@gestusadine.com
              </a>
              .
            </p>
          </Section>
        </div>

        {/* Disclaimer */}
        <p className="mt-10 text-center text-xs text-deep-green/45 leading-relaxed">
          {tr({
            en: 'GëstuSaDine is an AI educational tool, not a certified Mufti or scholar. For personal legal rulings (Fatwa), consult a qualified local scholar.',
            fr: "GëstuSaDine est un outil éducatif fondé sur l'IA, et non un Mufti ou savant certifié. Pour des avis juridiques personnels (Fatwa), consultez un savant local qualifié.",
          })}
        </p>
      </div>
    </div>
  );
}
