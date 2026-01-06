import * as React from "react";
import { BookMarked, Sun, Moon, Palette, Globe, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme, ThemeMode } from "@/contexts/ThemeContext";

type Madhab = "hanafi" | "maliki" | "shafii" | "hanbali";

const Language: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, colors, setColors } = useTheme();
  const [madhab, setMadhab] = React.useState<Madhab>("maliki");

  const madhabs: { value: Madhab; label: string; region: string }[] = [
    { value: "hanafi", label: "Hanafi", region: "Türkiye, Pakistan, India, Central Asia" },
    { value: "maliki", label: "Maliki", region: "West & North Africa (Senegal, Morocco, etc.)" },
    { value: "shafii", label: "Shafi'i", region: "East Africa, Southeast Asia, Yemen" },
    { value: "hanbali", label: "Hanbali", region: "Gulf region, Saudi Arabia" },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'wo', label: 'Wolof' },
  ];

  const themes: { value: ThemeMode; label: string; icon: React.ReactNode; description: string }[] = [
    { value: "light", label: "Light", icon: <Sun className="w-5 h-5" />, description: "Bright and clear interface" },
    { value: "dark", label: "Dark", icon: <Moon className="w-5 h-5" />, description: "Easy on the eyes" },
    { value: "personalized", label: "Personalized", icon: <Palette className="w-5 h-5" />, description: "Customize your colors" },
  ];

  React.useEffect(() => {
    // Load saved madhab preference
    const savedMadhab = localStorage.getItem('xamsadine-madhab') as Madhab;
    if (savedMadhab && ['hanafi', 'maliki', 'shafii', 'hanbali'].includes(savedMadhab)) {
      setMadhab(savedMadhab);
    }
  }, []);

  const handleMadhabChange = (newMadhab: Madhab) => {
    setMadhab(newMadhab);
    localStorage.setItem('xamsadine-madhab', newMadhab);
  };

  return (
    <div className="flex-1 bg-background text-foreground transition-colors duration-300">
      <section className="container py-10 md:py-16 space-y-10">
        <header>
          <div>
            <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
              Settings
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              <span className="text-gradient">Preferences</span>
            </h1>
            <p className="mt-2 text-muted-foreground max-w-xl">
              Customize your experience, language, and theme. XamSaDine will tailor everything to your choices.
            </p>
          </div>
        </header>

        {/* Language Section */}
        <div>
             <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Language</h2>
             </div>
             <div className="grid gap-4 md:grid-cols-3">
                {languages.map((l) => (
                    <button
                        key={l.code}
                        onClick={() => setLanguage(l.code as any)}
                        className={`islamic-card p-5 text-left transition-all border rounded-xl ${
                            language === l.code
                            ? "ring-2 ring-primary bg-primary/5 border-primary"
                            : "hover:bg-muted/50 border-border"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                             <p className="text-base font-semibold text-foreground">{l.label}</p>
                             {language === l.code && <Check className="w-5 h-5 text-primary" />}
                        </div>
                    </button>
                ))}
             </div>
        </div>

        {/* Theme section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Theme</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`islamic-card p-5 text-left transition-all border rounded-xl ${
                  theme === t.value
                    ? "ring-2 ring-primary bg-primary/5 border-primary"
                    : "hover:bg-muted/50 border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${theme === t.value ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'}`}>
                      {t.icon}
                    </div>
                    <p className="text-base font-semibold text-foreground">{t.label}</p>
                  </div>
                  {theme === t.value && (
                     <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </button>
            ))}
          </div>

          {theme === 'personalized' && (
             <div className="grid gap-6 md:grid-cols-3 p-6 border rounded-xl bg-card animate-in fade-in zoom-in-95 duration-300">
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Primary Color</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="color" 
                            value={colors.primary} 
                            onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                            className="w-10 h-10 rounded cursor-pointer border-none p-0"
                        />
                        <span className="text-sm text-muted-foreground">{colors.primary}</span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Secondary Color</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="color" 
                            value={colors.secondary} 
                            onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                            className="w-10 h-10 rounded cursor-pointer border-none p-0"
                        />
                        <span className="text-sm text-muted-foreground">{colors.secondary}</span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Accent Color</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="color" 
                            value={colors.accent} 
                            onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                            className="w-10 h-10 rounded cursor-pointer border-none p-0"
                        />
                        <span className="text-sm text-muted-foreground">{colors.accent}</span>
                    </div>
                </div>
             </div>
          )}
        </div>

        {/* Madhab section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookMarked className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Madhab (School of Fiqh)</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {madhabs.map((m) => (
              <button
                key={m.value}
                onClick={() => handleMadhabChange(m.value)}
                className={`islamic-card p-5 text-left transition-all border rounded-xl ${
                  madhab === m.value
                    ? "ring-2 ring-primary bg-primary/5 border-primary"
                    : "hover:bg-muted/50 border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-base font-semibold text-foreground">{m.label}</p>
                  {madhab === m.value && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Common in: {m.region}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="islamic-card p-6 flex items-start gap-4 bg-muted/30 border rounded-xl">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <BookMarked className="w-5 h-5" />
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Your choices shape every answer</p>
            <p>
              When you ask a question in Guided Fatwa or explore Daily Islam, XamSaDine will prioritize references, rulings, and explanations from your selected madhab and present them in your chosen language.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Language;
