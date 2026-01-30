import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeCustomizer } from "@/components/settings/ThemeCustomizer";
import { Globe, Moon, Sun, Palette, Bell, CreditCard, Crown } from "lucide-react";
import { toast } from "sonner";

const Settings: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [userTier, setUserTier] = useState<'free' | 'core' | 'pro'>('free');
  const [showCustomizer, setShowCustomizer] = useState(false);

  useEffect(() => {
    const fetchUserTier = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/subscription/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUserTier(data.subscription?.tier || 'free');
        }
      } catch (error) {
        console.error('Failed to fetch user tier:', error);
      }
    };
    fetchUserTier();
  }, []);

  const canCustomizeTheme = userTier === 'core' || userTier === 'pro';

  return (
    <div className="flex-1 overflow-y-auto">
      <section className="container py-6 md:py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your platform experience</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Appearance
              </h2>
              <p className="text-sm text-muted-foreground">Customize how the platform looks</p>
            </div>
            <div className="space-y-4">
              <Label className="text-base font-medium">Theme Mode</Label>
              <div className="flex gap-3">
                <button onClick={() => setTheme('light')} className={`flex-1 p-4 rounded-lg border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                  <Sun className={`w-6 h-6 mx-auto mb-2 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className={`text-sm font-medium ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`}>Light</p>
                </button>
                <button onClick={() => setTheme('dark')} className={`flex-1 p-4 rounded-lg border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                  <Moon className={`w-6 h-6 mx-auto mb-2 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`}>Dark</p>
                </button>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Label className="text-base font-medium">Custom Theme Colors</Label>
                  <p className="text-xs text-muted-foreground mt-1">Personalize your color palette</p>
                </div>
                {!canCustomizeTheme && <Crown className="w-5 h-5 text-islamic-gold" />}
              </div>
              {canCustomizeTheme ? (
                <Button onClick={() => setShowCustomizer(!showCustomizer)} className="w-full btn-islamic">
                  {showCustomizer ? 'Hide' : 'Show'} Theme Customizer
                </Button>
              ) : (
                <div className="p-4 bg-gradient-to-r from-islamic-gold/10 to-islamic-green/10 rounded-lg border border-islamic-gold/20">
                  <p className="text-sm text-muted-foreground mb-2">Custom themes are available for Core and Pro users</p>
                  <Button size="sm" className="btn-islamic" onClick={() => window.location.href = '/pricing'}>Upgrade to Unlock</Button>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Language
              </h2>
              <p className="text-sm text-muted-foreground">Set your preferred language</p>
            </div>
            <div className="space-y-3">
              <Label className="text-base font-medium">Display Language</Label>
              {(['en', 'fr', 'wo'] as const).map((lang) => (
                <button key={lang} onClick={() => setLanguage(lang)} className={`w-full p-4 rounded-lg border-2 transition-all text-left ${language === lang ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                  <p className={`font-medium ${language === lang ? 'text-primary' : 'text-foreground'}`}>
                    {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'Wolof'}
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
                Notifications
              </h2>
              <p className="text-sm text-muted-foreground">Manage notification preferences</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="text-base font-medium">Push Notifications</Label>
                <p className="text-xs text-muted-foreground mt-1">Receive prayer reminders and updates</p>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Subscription
              </h2>
              <p className="text-sm text-muted-foreground">Manage your subscription plan</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Current Plan</span>
                {userTier !== 'free' && <Crown className="w-5 h-5 text-islamic-gold" />}
              </div>
              <p className="text-2xl font-bold text-foreground capitalize mb-3">{userTier} Tier</p>
              <p className="text-sm text-muted-foreground mb-3">
                {userTier === 'free' ? 'Upgrade to unlock premium features!' : 'Thank you for being a premium member!'}
              </p>
              <Button className="w-full btn-islamic" onClick={() => window.location.href = '/pricing'}>
                {userTier === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
              </Button>
            </div>
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