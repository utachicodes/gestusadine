import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Palette, Sparkles, Download, Upload, RotateCcw, Check, Sun, Moon, Wand2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import type { ThemeColors, HarmonyMode, FontChoice, Density, Frosted, ThemeMode } from '@/types/theme';
import { FONT_LABELS } from '@/types/theme';
import { useTr } from '@/lib/i18n';

type ColorKey = keyof ThemeColors;

const COLOR_LABELS: Record<ColorKey, { en: string; fr: string }> = {
  background: { en: 'Background', fr: 'Arrière-plan' },
  text: { en: 'Text', fr: 'Texte' },
  panel: { en: 'Panel', fr: 'Panneau' },
  sidebar: { en: 'Sidebar', fr: 'Barre latérale' },
  border: { en: 'Border', fr: 'Bordure' },
  accent: { en: 'Accent', fr: 'Accent' },
};

const COLOR_PLACEHOLDERS: Record<ColorKey, string> = {
  background: '#FAF7F0',
  text: '#1C1917',
  panel: '#FCFAF5',
  sidebar: '#F8F5EE',
  border: '#E6DDD0',
  accent: '#064E3B',
};

const DENSITY_LABELS: Record<Density, { en: string; fr: string }> = {
  comfortable: { en: 'Comfortable', fr: 'Confortable' },
  compact: { en: 'Compact', fr: 'Compact' },
  spacious: { en: 'Spacious', fr: ' spacieux' },
};

const FROSTED_LABELS: Record<Frosted, { en: string; fr: string }> = {
  solid: { en: 'Solid', fr: 'Solide' },
  frosted: { en: 'Frosted', fr: 'Givré' },
  glass: { en: 'Glass', fr: 'Verre' },
};

const HARMONY_LABELS: Record<HarmonyMode, { en: string; fr: string }> = {
  complementary: { en: 'Complementary', fr: 'Complémentaire' },
  analogous: { en: 'Analogous', fr: 'Analogue' },
  triadic: { en: 'Triadic', fr: 'Triadique' },
  monochromatic: { en: 'Monochromatic', fr: 'Monochromatique' },
};

const FIELD_ORDER: ColorKey[] = ['background', 'text', 'panel', 'sidebar', 'border', 'accent'];

export default function ThemeDesigner() {
  const tr = useTr();
  const { theme, updateColors, updateTheme, reset, exportTheme, importTheme, generateFromAccent } = useTheme();

  const [harmonyAccent, setHarmonyAccent] = useState(theme.colors.accent);
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>('complementary');
  const [harmonyThemeMode, setHarmonyThemeMode] = useState<ThemeMode>('light');

  const handleColorChange = useCallback((key: ColorKey, value: string) => {
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
      updateColors({ [key]: value });
    }
  }, [updateColors]);

  const handleGenerate = useCallback(() => {
    const generated = generateFromAccent(harmonyAccent, harmonyMode, harmonyThemeMode);
    updateColors(generated);
    toast.success(tr({ en: 'Colors generated!', fr: 'Couleurs générées !' }));
  }, [harmonyAccent, harmonyMode, harmonyThemeMode, generateFromAccent, updateColors, tr]);

  const handleExport = useCallback(() => {
    const json = exportTheme();
    navigator.clipboard.writeText(json);
    toast.success(tr({ en: 'Theme JSON copied to clipboard!', fr: 'JSON du thème copié !' }));
  }, [exportTheme, tr]);

  const handleImport = useCallback(() => {
    const json = prompt(tr({ en: 'Paste theme JSON:', fr: 'Collez le JSON du thème :' }));
    if (!json) return;
    if (importTheme(json)) {
      toast.success(tr({ en: 'Theme imported!', fr: 'Thème importé !' }));
    } else {
      toast.error(tr({ en: 'Invalid theme JSON.', fr: 'JSON de thème invalide.' }));
    }
  }, [importTheme, tr]);

  const handleReset = useCallback(() => {
    reset();
    toast.success(tr({ en: 'Theme reset to defaults.', fr: 'Thème réinitialisé.' }));
  }, [reset, tr]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <Palette className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{tr({ en: 'Theme Designer', fr: 'Designer de thème' })}</h1>
          <p className="text-sm text-muted-foreground">{tr({ en: 'Customize every aspect of the platform look & feel.', fr: 'Personnalisez chaque aspect de l\'apparence de la plateforme.' })}</p>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-base font-semibold mb-4">{tr({ en: 'Color Controls', fr: 'Contrôles des couleurs' })}</h2>
        <div className="space-y-3">
          {FIELD_ORDER.map((key) => (
            <div key={key} className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors[key]}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="h-10 w-12 rounded-lg border border-input cursor-pointer shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Label className="text-xs text-muted-foreground">{tr(COLOR_LABELS[key])}</Label>
                <input
                  type="text"
                  value={theme.colors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-input bg-background font-mono"
                  placeholder={COLOR_PLACEHOLDERS[key]}
                  maxLength={7}
                />
              </div>
              <div
                className="h-10 w-10 rounded-lg border border-border shrink-0"
                style={{ backgroundColor: theme.colors[key] }}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold">{tr({ en: 'Color Harmony', fr: 'Harmonie des couleurs' })}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">{tr({ en: 'Accent Color', fr: 'Couleur d\'accent' })}</Label>
            <input
              type="color"
              value={harmonyAccent}
              onChange={(e) => setHarmonyAccent(e.target.value)}
              className="h-10 w-full rounded-lg border border-input cursor-pointer mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{tr({ en: 'Harmony', fr: 'Harmonie' })}</Label>
            <Select value={harmonyMode} onValueChange={(v) => setHarmonyMode(v as HarmonyMode)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(['complementary', 'analogous', 'triadic', 'monochromatic'] as HarmonyMode[]).map((m) => (
                  <SelectItem key={m} value={m}>{tr(HARMONY_LABELS[m])}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{tr({ en: 'Mode', fr: 'Mode' })}</Label>
            <div className="flex gap-2 mt-1">
              <Button
                variant={harmonyThemeMode === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHarmonyThemeMode('light')}
                className="flex-1"
              >
                <Sun className="w-4 h-4 mr-1" /> {tr({ en: 'Light', fr: 'Clair' })}
              </Button>
              <Button
                variant={harmonyThemeMode === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHarmonyThemeMode('dark')}
                className="flex-1"
              >
                <Moon className="w-4 h-4 mr-1" /> {tr({ en: 'Dark', fr: 'Sombre' })}
              </Button>
            </div>
          </div>
          <div className="flex items-end">
            <Button onClick={handleGenerate} className="w-full">
              <Wand2 className="w-4 h-4 mr-1.5" /> {tr({ en: 'Generate Colors', fr: 'Générer les couleurs' })}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-base font-semibold mb-4">{tr({ en: 'Font & Layout', fr: 'Police & Disposition' })}</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">{tr({ en: 'Font', fr: 'Police' })}</Label>
            <Select value={theme.font} onValueChange={(v) => updateTheme({ font: v as FontChoice })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(FONT_LABELS) as [FontChoice, string][]).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{tr({ en: 'Density', fr: 'Densité' })}</Label>
            <Select value={theme.density} onValueChange={(v) => updateTheme({ density: v as Density })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(DENSITY_LABELS) as [Density, { en: string; fr: string }][]).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{tr(label)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{tr({ en: 'Frosted', fr: 'Givré' })}</Label>
            <Select value={theme.frosted} onValueChange={(v) => updateTheme({ frosted: v as Frosted })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(FROSTED_LABELS) as [Frosted, { en: string; fr: string }][]).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{tr(label)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-base font-semibold mb-4">{tr({ en: 'Save & Share', fr: 'Sauvegarder & Partager' })}</h2>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">{tr({ en: 'Theme Name', fr: 'Nom du thème' })}</Label>
            <input
              type="text"
              value={theme.name}
              onChange={(e) => updateTheme({ name: e.target.value })}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-input bg-background mt-1"
              placeholder="My Theme"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => toast.success(tr({ en: 'Theme saved!', fr: 'Thème sauvegardé !' }))}>
              <Check className="w-4 h-4 mr-1.5" /> {tr({ en: 'Save', fr: 'Sauvegarder' })}
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1.5" /> {tr({ en: 'Export', fr: 'Exporter' })}
            </Button>
            <Button variant="outline" onClick={handleImport}>
              <Upload className="w-4 h-4 mr-1.5" /> {tr({ en: 'Import', fr: 'Importer' })}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1.5" /> {tr({ en: 'Reset', fr: 'Réinitialiser' })}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
