import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Palette, Sparkles } from 'lucide-react';
import { useSubscription } from '@/data/subscription';
import { useTheme, type ThemeColors } from '@/contexts/ThemeContext';
import { useTr, type Loc } from '@/lib/i18n';

interface ThemeCustomizerProps {
    onThemeChange?: (colors: ThemeColors) => void;
}

// On-brand starting point: Heritage Emerald + Teal.
const BRAND_DEFAULTS: ThemeColors = {
    primary: '#064E3B',
    secondary: '#0D9488',
    accent: '#0F766E',
};

/**
 * Routes through ThemeContext's `personalized` mode, which converts hex → HSL
 * and derives the full surface palette — so custom colors apply correctly to
 * the `hsl(var(--token))` system (a raw hex would break it) and persist via the
 * single source of truth.
 */
export function ThemeCustomizer({ onThemeChange }: ThemeCustomizerProps) {
    const tr = useTr();
    const { canCustomizeTheme: hasAccess } = useSubscription();
    const { colors, setColors, setTheme } = useTheme();
    const [draft, setDraft] = useState<ThemeColors>(colors);

    const preview = (next: ThemeColors) => {
        setDraft(next);
        setColors(next);
        setTheme('personalized');
        onThemeChange?.(next);
    };

    const handleColorChange = (key: keyof ThemeColors, value: string) => {
        preview({ ...draft, [key]: value });
    };

    const saveTheme = () => {
        if (!hasAccess) {
            toast.error(tr({ en: 'Upgrade to a paid plan to customize your theme.', fr: 'Passez à une formule payante pour personnaliser votre thème.' }));
            return;
        }
        // ThemeContext persists colors + mode to localStorage automatically.
        preview(draft);
        toast.success(tr({ en: 'Theme saved.', fr: 'Thème enregistré.' }));
    };

    const resetTheme = () => {
        setColors(BRAND_DEFAULTS);
        setDraft(BRAND_DEFAULTS);
        setTheme('light');
        toast.success(tr({ en: 'Theme reset to the default light palette.', fr: 'Thème réinitialisé à la palette claire par défaut.' }));
    };

    const fields: { key: keyof ThemeColors; label: Loc; placeholder: string }[] = [
        { key: 'primary', label: { en: 'Primary Color', fr: 'Couleur principale' }, placeholder: '#064E3B' },
        { key: 'accent', label: { en: 'Accent Color', fr: 'Couleur d’accent' }, placeholder: '#0F766E' },
    ];

    return (
        <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
                <Palette className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">{tr({ en: 'Custom Theme Colors', fr: 'Couleurs de thème personnalisées' })}</h3>
                {!hasAccess && (
                    <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {tr({ en: 'Premium', fr: 'Premium' })}
                    </span>
                )}
            </div>

            {!hasAccess && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        🎨 {tr({ en: 'Upgrade to a paid plan to unlock custom theme colors and make the platform truly yours!', fr: 'Passez à une formule payante pour débloquer les couleurs personnalisées et faire de la plateforme la vôtre !' })}
                    </p>
                </div>
            )}

            <div className="space-y-4">
                {fields.map(({ key, label, placeholder }) => (
                    <div key={key}>
                        <Label htmlFor={`${key}-color`}>{tr(label)}</Label>
                        <div className="flex gap-2 mt-1">
                            <input
                                id={`${key}-color`}
                                type="color"
                                value={draft[key]}
                                onChange={(e) => handleColorChange(key, e.target.value)}
                                className="h-10 w-16 rounded border cursor-pointer disabled:opacity-50"
                                disabled={!hasAccess}
                            />
                            <input
                                type="text"
                                value={draft[key]}
                                onChange={(e) => handleColorChange(key, e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg border border-input bg-background disabled:opacity-50"
                                placeholder={placeholder}
                                disabled={!hasAccess}
                            />
                        </div>
                    </div>
                ))}

                <div className="pt-4 flex gap-2">
                    <Button onClick={saveTheme} disabled={!hasAccess} className="flex-1">
                        {tr({ en: 'Save Theme', fr: 'Enregistrer le thème' })}
                    </Button>
                    <Button onClick={resetTheme} variant="outline" disabled={!hasAccess}>
                        {tr({ en: 'Reset', fr: 'Réinitialiser' })}
                    </Button>
                </div>
            </div>

            {hasAccess && (
                <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                        💡 <strong>{tr({ en: 'Pro tip:', fr: 'Astuce :' })}</strong> {tr({ en: 'Changes preview live. Click "Save Theme" to persist your palette.', fr: 'Les changements s’affichent en direct. Cliquez sur « Enregistrer le thème » pour conserver votre palette.' })}
                    </p>
                </div>
            )}
        </Card>
    );
}
