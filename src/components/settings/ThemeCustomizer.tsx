import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Palette, Sparkles, RotateCcw, Lightbulb } from 'lucide-react';
import { useSubscription } from '@/data/subscription';
import { useTheme } from '@/contexts/ThemeContext';
import type { ThemeColors } from '@/types/theme';
import { DEFAULT_LIGHT } from '@/types/theme';
import { useTr, type Loc } from '@/lib/i18n';

interface ThemeCustomizerProps {
    onThemeChange?: (colors: ThemeColors) => void;
}

type ColorKey = keyof ThemeColors;

const COLOR_LABELS: Record<ColorKey, Loc> = {
  background: { en: 'Background', fr: 'Fond' },
  text: { en: 'Text', fr: 'Texte' },
  panel: { en: 'Panel', fr: 'Panneau' },
  sidebar: { en: 'Sidebar', fr: 'Barre lat.' },
  border: { en: 'Border', fr: 'Bordure' },
  accent: { en: 'Accent', fr: 'Accent' },
};

const COLOR_ORDER: ColorKey[] = ['background', 'text', 'panel', 'sidebar', 'border', 'accent'];

export function ThemeCustomizer({ onThemeChange }: ThemeCustomizerProps) {
    const tr = useTr();
    const { canCustomizeTheme: hasAccess } = useSubscription();
    const { theme, updateColors, reset } = useTheme();
    const [draft, setDraft] = useState<ThemeColors>(theme.colors);

    const preview = (next: ThemeColors) => {
        setDraft(next);
        updateColors(next);
        onThemeChange?.(next);
    };

    const handleColorChange = (key: ColorKey, value: string) => {
        if (/^#[0-9a-fA-F]{6}$/.test(value)) {
            preview({ ...draft, [key]: value });
        }
    };

    const saveTheme = () => {
        if (!hasAccess) {
            toast.error(tr({ en: 'Upgrade to a paid plan to customize your theme.', fr: 'Passez à une formule payante pour personnaliser votre thème.' }));
            return;
        }
        preview(draft);
        toast.success(tr({ en: 'Theme saved.', fr: 'Thème enregistré.' }));
    };

    const resetTheme = () => {
        const defaults = { ...DEFAULT_LIGHT };
        setDraft(defaults);
        reset();
        toast.success(tr({ en: 'Theme reset to default.', fr: 'Thème réinitialisé.' }));
    };

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">{tr({ en: 'Custom Theme Colors', fr: 'Couleurs personnalisées' })}</h3>
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

            <div className="space-y-3">
                {COLOR_ORDER.map((key) => (
                    <div key={key} className="flex items-center gap-2">
                        <Label className="w-20 text-xs shrink-0">{tr(COLOR_LABELS[key])}</Label>
                        <input
                            type="color"
                            value={draft[key]}
                            onChange={(e) => handleColorChange(key, e.target.value)}
                            className="h-8 w-10 rounded border cursor-pointer disabled:opacity-50 shrink-0"
                            disabled={!hasAccess}
                        />
                        <input
                            type="text"
                            value={draft[key]}
                            onChange={(e) => handleColorChange(key, e.target.value)}
                            className="flex-1 px-2 py-1 text-sm rounded-lg border border-input bg-background font-mono disabled:opacity-50"
                            maxLength={7}
                            disabled={!hasAccess}
                        />
                    </div>
                ))}

                <div className="pt-4 flex gap-2">
                    <Button onClick={saveTheme} disabled={!hasAccess} className="flex-1">
                        {tr({ en: 'Save Theme', fr: 'Enregistrer' })}
                    </Button>
                    <Button onClick={resetTheme} variant="outline" disabled={!hasAccess}>
                        <RotateCcw className="w-4 h-4 mr-1" /> {tr({ en: 'Reset', fr: 'Réinitialiser' })}
                    </Button>
                </div>
            </div>

            {hasAccess && (
                <div className="mt-4 p-3 bg-primary/5 rounded-lg flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        <strong>{tr({ en: 'Pro tip:', fr: 'Astuce :' })}</strong> {tr({ en: 'Changes preview live. Click "Save Theme" to persist.', fr: 'Les changements s\'affichent en direct. Cliquez sur « Enregistrer » pour conserver.' })}
                    </p>
                </div>
            )}
        </div>
    );
}
