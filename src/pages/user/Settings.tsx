import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSubscription } from "@/data/subscription";
import { useAuth, type SubscriptionTier } from "@/auth/AuthContext";
import { useTr, type Loc } from "@/lib/i18n";
import { ThemeCustomizer } from "@/components/settings/ThemeCustomizer";
import { CreditUsageWidget } from "@/components/subscription/CreditUsageWidget";
import { Globe, Palette, Bell, CreditCard, Crown, FlaskConical } from "lucide-react";

const DEV_TIERS: { value: SubscriptionTier; label: Loc }[] = [
  { value: 'free', label: { en: 'Seeker (Free)', fr: 'Chercheur (Gratuit)' } },
  { value: 'student', label: { en: 'Student', fr: 'Étudiant' } },
  { value: 'pro', label: { en: 'Pro', fr: 'Pro' } },
];

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { tier: userTier, canCustomizeTheme } = useSubscription();
  const { setSubscriptionTier } = useAuth();
  const tr = useTr();
  const [notifications, setNotifications] = useState(true);
  const [showCustomizer, setShowCustomizer] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto">
      <section className="container py-6 md:py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-foreground mb-2">{tr({ en: 'Settings', fr: 'Paramètres' })}</h1>
          <p className="text-muted-foreground">{tr({ en: 'Customize your platform experience', fr: 'Personnalisez votre expérience' })}</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                {tr({ en: 'Appearance', fr: 'Apparence' })}
              </h2>
              <p className="text-sm text-muted-foreground">{tr({ en: 'Customize how the platform looks', fr: 'Personnalisez l’apparence de la plateforme' })}</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Label className="text-base font-medium">{tr({ en: 'Custom Theme Colors', fr: 'Couleurs personnalisées' })}</Label>
                  <p className="text-xs text-muted-foreground mt-1">{tr({ en: 'Personalize your color palette', fr: 'Personnalisez votre palette de couleurs' })}</p>
                </div>
                {!canCustomizeTheme && <Crown className="w-5 h-5 text-islamic-gold" />}
              </div>
              {canCustomizeTheme ? (
                <Button onClick={() => setShowCustomizer(!showCustomizer)} className="w-full btn-islamic">
                  {showCustomizer
                    ? tr({ en: 'Hide Theme Customizer', fr: 'Masquer le personnalisateur' })
                    : tr({ en: 'Show Theme Customizer', fr: 'Afficher le personnalisateur' })}
                </Button>
              ) : (
                <div className="p-4 bg-gradient-to-r from-islamic-gold/10 to-islamic-green/10 rounded-lg border border-islamic-gold/20">
                  <p className="text-sm text-muted-foreground mb-2">{tr({ en: 'Custom themes are available on a paid plan.', fr: 'Les couleurs personnalisées sont disponibles avec une offre payante.' })}</p>
                  <Button size="sm" className="btn-islamic" onClick={() => navigate('/pricing')}>{tr({ en: 'Upgrade to unlock', fr: 'Débloquer' })}</Button>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                {tr({ en: 'Language', fr: 'Langue' })}
              </h2>
              <p className="text-sm text-muted-foreground">{tr({ en: 'Set your preferred language', fr: 'Choisissez votre langue' })}</p>
            </div>
            <div className="space-y-3">
              <Label className="text-base font-medium">{tr({ en: 'Display Language', fr: 'Langue d’affichage' })}</Label>
              {(['en', 'fr'] as const).map((lang) => (
                <button key={lang} onClick={() => setLanguage(lang)} className={`w-full p-4 rounded-lg border-2 transition-all text-left ${language === lang ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                  <p className={`font-medium ${language === lang ? 'text-primary' : 'text-foreground'}`}>
                    {lang === 'en' ? 'English' : 'Français'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{lang.toUpperCase()}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                {tr({ en: 'Notifications', fr: 'Notifications' })}
              </h2>
              <p className="text-sm text-muted-foreground">{tr({ en: 'Manage notification preferences', fr: 'Gérez vos préférences de notification' })}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="text-base font-medium">{tr({ en: 'Push Notifications', fr: 'Notifications push' })}</Label>
                <p className="text-xs text-muted-foreground mt-1">{tr({ en: 'Receive prayer reminders and updates', fr: 'Recevez des rappels de prière et des mises à jour' })}</p>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                {tr({ en: 'Subscription', fr: 'Abonnement' })}
              </h2>
              <p className="text-sm text-muted-foreground">{tr({ en: 'Manage your subscription plan', fr: 'Gérez votre abonnement' })}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{tr({ en: 'Current Plan', fr: 'Offre actuelle' })}</span>
                {userTier !== 'free' && <Crown className="w-5 h-5 text-islamic-gold" />}
              </div>
              <p className="text-2xl font-bold text-foreground capitalize mb-3">
                {userTier} {tr({ en: 'Tier', fr: 'Offre' })}
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                {userTier === 'free'
                  ? tr({ en: 'Upgrade to unlock premium features!', fr: 'Passez à une offre supérieure pour débloquer plus !' })
                  : tr({ en: 'Thank you for being a premium member!', fr: 'Merci d’être membre premium !' })}
              </p>
              <Button className="w-full btn-islamic" onClick={() => navigate('/pricing')}>
                {userTier === 'free'
                  ? tr({ en: 'Upgrade Plan', fr: 'Améliorer l’offre' })
                  : tr({ en: 'Manage Subscription', fr: 'Gérer l’abonnement' })}
              </Button>
            </div>

            {/* Live Council usage for the current tier */}
            <CreditUsageWidget />

            {/* DEV-ONLY: flip tiers to test paywalls. Removed when real billing lands. */}
            {import.meta.env.DEV && (
              <div className="p-4 rounded-lg border border-dashed border-amber-400/60 bg-amber-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <FlaskConical className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                    {tr({ en: 'Dev · Switch tier', fr: 'Dev · Changer d’offre' })}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {DEV_TIERS.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setSubscriptionTier(t.value)}
                      className={`px-2 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${
                        userTier === t.value
                          ? 'border-emerald-700 bg-emerald-700/10 text-emerald-800'
                          : 'border-border text-muted-foreground hover:border-emerald-700/50'
                      }`}
                    >
                      {tr(t.label)}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-amber-700/70 mt-2">
                  {tr({ en: 'Changes apply instantly  watch the paywalls engage.', fr: 'Les changements s’appliquent immédiatement  observez les paywalls.' })}
                </p>
              </div>
            )}
          </Card>
        </div>

        {showCustomizer && canCustomizeTheme && (
          <Card className="p-6"><ThemeCustomizer /></Card>
        )}
      </section>
    </div>
  );
};

export default Settings;
