import * as React from 'react';
import { useState } from 'react';
import { ShieldCheck, Globe, Lock, Database, Clock, UserCheck, ChevronDown } from 'lucide-react';
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

export default function DataCompliance() {
  const tr = useTr();

  return (
    <div className="flex-1 relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-warm-base -z-10" />

      <div className="container relative z-10 py-20 px-4 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-warm-gold mb-4">
            <ShieldCheck className="w-4 h-4" /> {tr({ en: 'Data & Compliance', fr: 'Données & Conformité' })}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-deep-green mb-3 tracking-tight">
            {tr({ en: 'How We Protect & Govern Your Data', fr: 'Comment nous protégeons et gouvernons vos données' })}
          </h1>
          <p className="text-base text-deep-green/55 max-w-lg mx-auto">
            {tr({
              en: 'Full transparency on data storage, retention, user rights, IP enforcement, and our compliance posture.',
              fr: 'Transparence totale sur le stockage, la rétention, les droits des utilisateurs, l'application IP et notre posture de conformité.',
            })}
          </p>
          <p className="text-deep-green/40 text-xs mt-4">{tr({ en: 'Last updated: June 2026', fr: 'Dernière mise à jour : juin 2026' })}</p>
        </div>

        {/* Highlight tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {[
            { icon: Lock,     label: tr({ en: 'Encrypted at rest & in transit', fr: 'Chiffré au repos et en transit' }) },
            { icon: Globe,    label: tr({ en: 'GDPR-aligned practices',         fr: 'Pratiques alignées RGPD' }) },
            { icon: Database, label: tr({ en: 'No data sold — ever',            fr: 'Données jamais vendues' }) },
            { icon: Clock,    label: tr({ en: '90-day inactivity purge',        fr: 'Purge après 90 jours d'inactivité' }) },
            { icon: UserCheck,label: tr({ en: 'Right to erasure',               fr: 'Droit à l'effacement' }) },
            { icon: ShieldCheck, label: tr({ en: 'Rate-limited & IP-hardened', fr: 'Limité & durci côté IP' }) },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="glass-card-warm rounded-xl p-4 flex flex-col items-center text-center gap-2">
              <Icon className="w-5 h-5 text-warm-gold" />
              <span className="text-xs font-medium text-deep-green/70">{label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Section
            title={tr({ en: 'Data Storage & Infrastructure', fr: 'Stockage & Infrastructure' })}
            subtitle={tr({ en: 'Where and how your data lives', fr: 'Où et comment vos données sont stockées' })}
            defaultOpen
          >
            <p>
              {tr({
                en: 'All platform data is stored on Convex — a real-time database with end-to-end encryption in transit (TLS 1.2+) and encryption at rest (AES-256). Convex operates on AWS infrastructure in the US-East-1 region with automatic geo-redundant backups.',
                fr: 'Toutes les données sont stockées sur Convex — une base de données en temps réel avec chiffrement de bout en bout en transit (TLS 1.2+) et au repos (AES-256). Convex fonctionne sur l'infrastructure AWS (US-East-1) avec des sauvegardes géo-redondantes automatiques.',
              })}
            </p>
            <p>
              {tr({
                en: 'Static assets and the web application are served via Vercel's global edge network (CDN) with automatic HTTPS enforcement.',
                fr: "Les ressources statiques et l'application web sont distribuées via le réseau CDN mondial de Vercel avec application automatique de HTTPS.",
              })}
            </p>
          </Section>

          <Section
            title={tr({ en: 'Data Retention & Deletion', fr: 'Rétention & Suppression des données' })}
            subtitle={tr({ en: 'How long we keep data and your deletion rights', fr: 'Durée de conservation et droits à l'effacement' })}
          >
            <ul className="space-y-2 list-disc list-inside">
              <li>
                {tr({
                  en: 'Account data (name, email, profile): retained while your account is active, deleted within 30 days of a verified deletion request.',
                  fr: 'Données de compte (nom, e-mail, profil) : conservées tant que le compte est actif, supprimées sous 30 jours après une demande vérifiée.',
                })}
              </li>
              <li>
                {tr({
                  en: 'Journal entries & period logs: stored only for you, never shared. Deleted immediately upon account deletion.',
                  fr: 'Entrées de journal et journaux de cycle : stockés uniquement pour vous, jamais partagés. Supprimés immédiatement lors de la suppression du compte.',
                })}
              </li>
              <li>
                {tr({
                  en: 'AI chat history: messages are stored to provide continuity. Cleared per your request at any time from Settings.',
                  fr: 'Historique de chat IA : les messages sont stockés pour assurer la continuité. Effacés sur demande depuis les Paramètres.',
                })}
              </li>
              <li>
                {tr({
                  en: 'Payment records: retained for 7 years to meet legal/financial compliance requirements. Personal payment details are never stored — they are handled by NabooPay.',
                  fr: 'Registres de paiement : conservés 7 ans pour répondre aux obligations légales/financières. Les détails de paiement personnels ne sont jamais stockés — ils sont gérés par NabooPay.',
                })}
              </li>
              <li>
                {tr({
                  en: 'Anonymized usage analytics: retained for up to 24 months to improve the service.',
                  fr: "Analyses d'utilisation anonymisées : conservées jusqu'à 24 mois pour améliorer le service.",
                })}
              </li>
            </ul>
          </Section>

          <Section
            title={tr({ en: 'Your Rights (GDPR-Aligned)', fr: 'Vos droits (alignés RGPD)' })}
            subtitle={tr({ en: 'Access, portability, erasure, and objection', fr: 'Accès, portabilité, effacement et opposition' })}
          >
            <p>
              {tr({
                en: 'Regardless of your location, we honor the following rights:',
                fr: 'Quel que soit votre pays, nous respectons les droits suivants :',
              })}
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>{tr({ en: 'Right of access — request a copy of your data', fr: "Droit d'accès — demandez une copie de vos données" })}</li>
              <li>{tr({ en: 'Right to rectification — correct inaccurate data', fr: 'Droit de rectification — corriger les données inexactes' })}</li>
              <li>{tr({ en: 'Right to erasure — delete your account and data', fr: "Droit à l'effacement — supprimer votre compte et vos données" })}</li>
              <li>{tr({ en: 'Right to data portability — export your content', fr: 'Droit à la portabilité — exporter votre contenu' })}</li>
              <li>{tr({ en: 'Right to object — opt out of analytics', fr: "Droit d'opposition — se désinscrire des analyses" })}</li>
            </ul>
            <p>
              {tr({
                en: 'To exercise any of these rights, email',
                fr: 'Pour exercer l'un de ces droits, envoyez un e-mail à',
              })}{' '}
              <a href="mailto:privacy@gestusadine.com" className="text-warm-gold hover:underline font-medium">
                privacy@gestusadine.com
              </a>
              {'. '}
              {tr({
                en: 'We respond within 30 days.',
                fr: 'Nous répondons sous 30 jours.',
              })}
            </p>
          </Section>

          <Section
            title={tr({ en: 'IP Enforcement & Rate Limiting', fr: 'Application IP & Limitation de débit' })}
            subtitle={tr({ en: 'How we protect the platform from abuse', fr: 'Comment nous protégeons la plateforme contre les abus' })}
          >
            <p>
              {tr({
                en: 'To ensure a fair and secure experience for all users, we enforce the following controls:',
                fr: 'Pour garantir une expérience équitable et sécurisée pour tous les utilisateurs, nous appliquons les contrôles suivants :',
              })}
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                {tr({
                  en: 'Rate limiting on all authenticated actions (AI queries, journal writes, quiz submissions, payment actions). Repeated violations result in temporary blocks.',
                  fr: 'Limitation de débit sur toutes les actions authentifiées (requêtes IA, écritures de journal, soumissions de quiz, actions de paiement). Les violations répétées entraînent des blocages temporaires.',
                })}
              </li>
              <li>
                {tr({
                  en: 'Webhook replay protection: payment webhooks are verified by HMAC signature and must arrive within a 5-minute freshness window.',
                  fr: 'Protection anti-rejeu des webhooks : les webhooks de paiement sont vérifiés par signature HMAC et doivent arriver dans une fenêtre de 5 minutes.',
                })}
              </li>
              <li>
                {tr({
                  en: 'Authentication protections: failed login attempts are rate-limited (10/hour per IP). Stale JWT tokens trigger automatic sign-out.',
                  fr: 'Protections d'authentification : les tentatives de connexion échouées sont limitées (10/heure par IP). Les jetons JWT obsolètes déclenchent une déconnexion automatique.',
                })}
              </li>
              <li>
                {tr({
                  en: 'Input validation: all text fields are capped in size. Whitelisted enums (language, school of thought) block prompt-injection attempts.',
                  fr: 'Validation des entrées : tous les champs texte sont limités en taille. Des énumérations whitelistées (langue, école juridique) bloquent les tentatives d'injection.',
                })}
              </li>
              <li>
                {tr({
                  en: 'Security headers: HSTS, X-Frame-Options, Content-Security-Policy, and other headers are enforced on every response.',
                  fr: 'En-têtes de sécurité : HSTS, X-Frame-Options, Content-Security-Policy et autres en-têtes sont appliqués à chaque réponse.',
                })}
              </li>
            </ul>
            <p>
              {tr({
                en: 'Automated scraping, bot activity, or systematic harvesting of platform content is prohibited under our Terms of Use and may result in permanent IP-level bans.',
                fr: "Le scraping automatisé, l'activité de bots ou la collecte systématique du contenu de la plateforme est interdite par nos Conditions d'utilisation et peut entraîner des bannissements permanents au niveau IP.",
              })}
            </p>
          </Section>

          <Section
            title={tr({ en: 'Sensitive Data (Wellness Features)', fr: 'Données sensibles (fonctionnalités bien-être)' })}
            subtitle={tr({ en: 'Period tracking and journal data', fr: 'Données du suivi de cycle et du journal' })}
          >
            <p>
              {tr({
                en: 'Period cycle logs, Sawm Qadaa records, and private journal entries are classified as sensitive personal data. They are:',
                fr: 'Les journaux de cycle menstruel, les registres de Qadaa du jeûne (Sawm) et les entrées de journal privées sont classés comme données personnelles sensibles. Ils sont :',
              })}
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>{tr({ en: 'Accessible only to the account owner', fr: 'Accessibles uniquement au propriétaire du compte' })}</li>
              <li>{tr({ en: 'Never exposed in public API endpoints or leaderboards', fr: 'Jamais exposés dans des points d'API publics ou des classements' })}</li>
              <li>{tr({ en: 'Never used for advertising or profiling', fr: 'Jamais utilisés pour la publicité ou le profilage' })}</li>
              <li>{tr({ en: 'Deleted immediately and completely upon account removal', fra: 'Supprimés immédiatement et complètement lors de la suppression du compte' })}</li>
            </ul>
          </Section>

          <Section
            title={tr({ en: 'Cookies & Tracking', fr: 'Cookies & Suivi' })}
            subtitle={tr({ en: 'What we use and why', fr: 'Ce que nous utilisons et pourquoi' })}
          >
            <p>
              {tr({
                en: 'We use a minimal set of cookies strictly necessary for the service to function:',
                fr: 'Nous utilisons un ensemble minimal de cookies strictement nécessaires au fonctionnement du service :',
              })}
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                {tr({
                  en: 'Session token (HttpOnly, Secure) — maintains your authenticated session.',
                  fr: 'Jeton de session (HttpOnly, Secure) — maintient votre session authentifiée.',
                })}
              </li>
              <li>
                {tr({
                  en: 'Language preference (localStorage) — remembers your chosen language.',
                  fr: 'Préférence de langue (localStorage) — mémorise la langue choisie.',
                })}
              </li>
              <li>
                {tr({
                  en: 'Theme preference (localStorage) — remembers your display settings.',
                  fr: "Préférence de thème (localStorage) — mémorise vos paramètres d'affichage.",
                })}
              </li>
            </ul>
            <p>
              {tr({
                en: 'We do not use advertising cookies, third-party trackers, or cross-site tracking pixels.',
                fr: 'Nous n'utilisons pas de cookies publicitaires, de traceurs tiers ni de pixels de suivi inter-sites.',
              })}
            </p>
          </Section>

          <Section
            title={tr({ en: 'Contact & Reporting', fr: 'Contact & Signalement' })}
            subtitle={tr({ en: 'Security disclosures and privacy requests', fr: 'Divulgations de sécurité et demandes de confidentialité' })}
          >
            <p>
              {tr({
                en: 'For privacy requests:',
                fr: 'Pour les demandes liées à la confidentialité :',
              })}{' '}
              <a href="mailto:privacy@gestusadine.com" className="text-warm-gold hover:underline font-medium">privacy@gestusadine.com</a>
            </p>
            <p>
              {tr({
                en: 'To report a security vulnerability:',
                fr: 'Pour signaler une vulnérabilité de sécurité :',
              })}{' '}
              <a href="mailto:security@gestusadine.com" className="text-warm-gold hover:underline font-medium">security@gestusadine.com</a>
            </p>
            <p>
              {tr({
                en: 'We follow responsible disclosure and commit to acknowledging reports within 72 hours.',
                fr: 'Nous suivons une divulgation responsable et nous nous engageons à accuser réception des rapports sous 72 heures.',
              })}
            </p>
          </Section>
        </div>

        <p className="mt-10 text-center text-xs text-deep-green/45 leading-relaxed">
          {tr({
            en: 'GëstuSaDine is an AI educational tool, not a certified Mufti or legal adviser. For personal rulings or legal advice, consult a qualified local scholar or attorney.',
            fr: "GëstuSaDine est un outil éducatif fondé sur l'IA, et non un Mufti ou un conseiller juridique certifié. Pour des avis personnels ou des conseils juridiques, consultez un savant local qualifié ou un avocat.",
          })}
        </p>
      </div>
    </div>
  );
}
