import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth, type Gender } from "@/auth/AuthContext";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useTr } from "@/lib/i18n";
import { ThemeCustomizer } from "@/components/settings/ThemeCustomizer";
import { CreditUsageWidget } from "@/components/subscription/CreditUsageWidget";
import { resetOnboardingTutorial } from "@/components/onboarding/OnboardingTutorial";
import { Globe, Palette, PlayCircle, User, Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationSettings from "./NotificationSettings";
import { toast } from "sonner";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { profile } = useAuth();
  const updateGender = useMutation(api.users.updateGender);
  const tr = useTr();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const canCustomizeTheme = profile?.role === 'admin' || profile?.role === 'system';

  const handleGenderChange = async (g: Gender) => {
    try {
      await updateGender({ gender: g });
      toast.success(tr({ en: 'Profile updated.', fr: 'Profil mis à jour.' }));
    } catch {
      toast.error(tr({ en: 'Failed to update profile.', fr: 'Erreur lors de la mise à jour.' }));
    }
  };

  const handleRestartTutorial = () => {
    resetOnboardingTutorial();
    window.location.href = '/dashboard';
  };

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
                <>
                  <Button onClick={() => setShowCustomizer(!showCustomizer)} className="w-full btn-islamic">
                    {showCustomizer
                      ? tr({ en: 'Hide Theme Customizer', fr: 'Masquer le personnalisateur' })
                      : tr({ en: 'Show Theme Customizer', fr: 'Afficher le personnalisateur' })}
                  </Button>
                  {showCustomizer && (
                    <div className="mt-4">
                      <ThemeCustomizer />
                    </div>
                  )}
                </>
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

          {/* Gender / Profile section */}
          {profile && profile.id !== 'hardcoded-admin' && (
            <Card className="p-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  {tr({ en: 'Profile', fr: 'Profil' })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {tr({ en: 'Your gender setting determines which features are available to you.', fr: 'Votre genre détermine les fonctionnalités disponibles.' })}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-base font-medium">{tr({ en: 'I identify as…', fr: 'Je suis…' })}</Label>
                <div className="flex gap-3">
                  {(['male', 'female'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleGenderChange(g)}
                      className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                        profile.gender === g
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {g === 'male' ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                      {g === 'male'
                        ? tr({ en: 'Male', fr: 'Homme' })
                        : tr({ en: 'Female', fr: 'Femme' })}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {tr({ en: 'Female users get access to the Cycle Tracker.', fr: 'Les utilisatrices ont accès au Suivi du cycle.' })}
                </p>
              </div>
            </Card>
          )}

          {/* Tutorial restart */}
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-primary" />
                {tr({ en: 'Guided Tour', fr: 'Visite guidée' })}
              </h2>
              <p className="text-sm text-muted-foreground">
                {tr({ en: 'Revisit the introduction tutorial at any time.', fr: 'Revoyez le tutoriel d\'introduction à tout moment.' })}
              </p>
            </div>
            <Button
              onClick={handleRestartTutorial}
              className="w-full"
              variant="outline"
            >
              {tr({ en: 'Restart Tutorial', fr: 'Relancer le tutoriel' })}
            </Button>
          </Card>
        </div>

        {/* Push notification settings */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            {tr({ en: 'Notifications', fr: 'Notifications' })}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {tr({ en: 'Prayer reminders, Quran alerts, and daily content on your device', fr: 'Rappels de prière, alertes Coran et contenu quotidien sur votre appareil' })}
          </p>
          <NotificationSettings />
        </div>
      </section>
    </div>
  );
};

export default Settings;
