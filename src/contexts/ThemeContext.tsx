import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/auth/AuthContext';
import type { CustomTheme, ThemeColors, ThemeMode, HarmonyMode } from '@/types/theme';
import { DEFAULT_LIGHT, DEFAULT_DARK, FONT_MAP, DENSITY_RADIUS } from '@/types/theme';

const STORAGE_KEY = 'gestus-theme';

const DEFAULT_THEME: CustomTheme = {
  name: 'Default Light',
  colors: { ...DEFAULT_LIGHT },
  font: 'sans',
  density: 'comfortable',
  frosted: 'solid',
};

function loadSaved(): CustomTheme {
  if (typeof window === 'undefined') return { ...DEFAULT_THEME, colors: { ...DEFAULT_LIGHT } };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CustomTheme;
      return parsed;
    }
  } catch { /* ignore */ }
  const oldTheme = localStorage.getItem('theme-v2');
  const oldColors = localStorage.getItem('theme-colors-v2');
  if (oldTheme === 'personalized' && oldColors) {
    try {
      const oc = JSON.parse(oldColors);
      const primary = oc.primary || '#064E3B';
      return {
        name: 'My Theme',
        colors: { background: DEFAULT_LIGHT.background, text: DEFAULT_LIGHT.text, panel: DEFAULT_LIGHT.panel, sidebar: DEFAULT_LIGHT.sidebar, border: DEFAULT_LIGHT.border, accent: primary },
        font: 'sans',
        density: 'comfortable',
        frosted: 'solid',
      };
    } catch { /* ignore */ }
  }
  return { ...DEFAULT_THEME, colors: { ...DEFAULT_LIGHT } };
}

interface ThemeContextType {
  theme: CustomTheme;
  updateColors: (colors: Partial<ThemeColors>) => void;
  updateTheme: (partial: Partial<CustomTheme>) => void;
  reset: () => void;
  exportTheme: () => string;
  importTheme: (json: string) => boolean;
  generateFromAccent: (accentHex: string, harmony: HarmonyMode, mode: ThemeMode) => ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState<CustomTheme>(() => {
    const t = loadSaved();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('theme-v2');
      localStorage.removeItem('theme-colors-v2');
    }
    return t;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const { colors, font, density, frosted } = theme;

    root.classList.remove('theme-light', 'theme-dark', 'frosted-solid', 'frosted-frosted', 'frosted-glass', 'density-comfortable', 'density-compact', 'density-spacious');

    root.classList.add(`frosted-${frosted}`, `density-${density}`);

    const setHSL = (name: string, hex: string) => {
      const { h, s, l } = hexToHSL(hex);
      root.style.setProperty(name, `${h} ${s}% ${l}%`);
    };

    const contrast = (hex: string) => {
      const { r, g, b } = hexToRGB(hex);
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.55 ? '#0f172a' : '#f8fafc';
    };

    const lighten = (hex: string, amount: number) => {
      const hsl = hexToHSL(hex);
      return hslToHex(hsl.h, Math.max(0, hsl.s - 8), Math.min(100, hsl.l + amount));
    };

    setHSL('--background', colors.background);
    setHSL('--foreground', colors.text);
    setHSL('--card', colors.panel);
    setHSL('--card-foreground', colors.text);
    setHSL('--popover', colors.panel);
    setHSL('--popover-foreground', colors.text);
    setHSL('--primary', colors.accent);
    setHSL('--primary-foreground', contrast(colors.accent));
    setHSL('--secondary', lighten(colors.panel, 3));
    setHSL('--secondary-foreground', colors.text);
    setHSL('--muted', lighten(colors.panel, 1));
    setHSL('--muted-foreground', lighten(colors.text, 35));
    setHSL('--accent', lighten(colors.accent, 45));
    setHSL('--accent-foreground', colors.accent);
    setHSL('--destructive', '#E5484D');
    setHSL('--destructive-foreground', '#FAFAF9');
    setHSL('--border', colors.border);
    setHSL('--input', colors.border);
    setHSL('--ring', colors.accent);

    setHSL('--sidebar-background', colors.sidebar);
    setHSL('--sidebar-foreground', colors.text);
    setHSL('--sidebar-primary', colors.accent);
    setHSL('--sidebar-primary-foreground', contrast(colors.accent));
    setHSL('--sidebar-accent', lighten(colors.accent, 45));
    setHSL('--sidebar-accent-foreground', colors.accent);
    setHSL('--sidebar-border', colors.border);
    setHSL('--sidebar-ring', colors.accent);

    root.style.setProperty('--radius', DENSITY_RADIUS[density]);
    root.style.setProperty('--font-family', FONT_MAP[font]);
    (document.body.style as any).fontFamily = FONT_MAP[font];
  }, [theme, user]);

  const updateColors = useCallback((colors: Partial<ThemeColors>) => {
    setTheme(prev => ({ ...prev, colors: { ...prev.colors, ...colors } }));
  }, []);

  const updateTheme = useCallback((partial: Partial<CustomTheme>) => {
    setTheme(prev => ({ ...prev, ...partial, colors: partial.colors ? { ...prev.colors, ...partial.colors } : prev.colors }));
  }, []);

  const reset = useCallback(() => {
    setTheme({ ...DEFAULT_THEME, colors: { ...DEFAULT_LIGHT } });
  }, []);

  const exportTheme = useCallback(() => {
    return JSON.stringify(theme, null, 2);
  }, [theme]);

  const importTheme = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as CustomTheme;
      if (!parsed.colors || !parsed.font) return false;
      setTheme(parsed);
      return true;
    } catch { return false; }
  }, []);

  const generateFromAccent = useCallback((accentHex: string, harmony: HarmonyMode, mode: ThemeMode): ThemeColors => {
    const hsl = hexToHSL(accentHex);
    const { h, s } = hsl;

    const gen = (hue: number, sOffset: number, light: number) =>
      hslToHex(hue, Math.max(0, Math.min(100, s + sOffset)), light);

    const bgLight = mode === 'light' ? 96 : 4;
    const txtLight = mode === 'light' ? 10 : 93;
    const pnlLight = mode === 'light' ? 98 : 8;
    const sdLight = mode === 'light' ? 97 : 5;
    const bdLight = mode === 'light' ? 84 : 16;

    switch (harmony) {
      case 'monochromatic':
        return {
          background: gen(h, -20, bgLight),
          text: gen(h, -10, txtLight),
          panel: gen(h, -15, pnlLight),
          sidebar: gen(h, -18, sdLight),
          border: gen(h, -25, bdLight),
          accent: accentHex,
        };
      case 'complementary': {
        const ch = (h + 180) % 360;
        return {
          background: gen(ch, -25, bgLight),
          text: gen(h, -10, txtLight),
          panel: gen(ch, -20, pnlLight),
          sidebar: gen(ch, -22, sdLight),
          border: gen(ch, -28, bdLight),
          accent: accentHex,
        };
      }
      case 'analogous': {
        const bgH = (h - 30 + 360) % 360;
        const pnlH = (h + 30) % 360;
        return {
          background: gen(bgH, -25, bgLight),
          text: gen(h, -10, txtLight),
          panel: gen(pnlH, -20, pnlLight),
          sidebar: gen(bgH, -22, sdLight),
          border: gen(h, -30, bdLight),
          accent: accentHex,
        };
      }
      case 'triadic': {
        const bgH = (h + 120) % 360;
        const pnlH = (h + 240) % 360;
        return {
          background: gen(bgH, -25, bgLight),
          text: gen(h, -10, txtLight),
          panel: gen(pnlH, -20, pnlLight),
          sidebar: gen(bgH, -22, sdLight),
          border: gen(bgH, -28, bdLight),
          accent: accentHex,
        };
      }
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateColors, updateTheme, reset, exportTheme, importTheme, generateFromAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

function hexToHSL(H: string) {
  let r = 0, g = 0, b = 0;
  if (H.length === 4) {
    r = parseInt("0x" + H[1] + H[1]);
    g = parseInt("0x" + H[2] + H[2]);
    b = parseInt("0x" + H[3] + H[3]);
  } else if (H.length === 7) {
    r = parseInt("0x" + H[1] + H[2]);
    g = parseInt("0x" + H[3] + H[4]);
    b = parseInt("0x" + H[5] + H[6]);
  }
  r /= 255; g /= 255; b /= 255;
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0, s = 0, l = 0;
  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return { h, s, l };
}

function hexToRGB(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) { r = parseInt(hex[1] + hex[1], 16); g = parseInt(hex[2] + hex[2], 16); b = parseInt(hex[3] + hex[3], 16); }
  else if (hex.length === 7) { r = parseInt(hex[1] + hex[2], 16); g = parseInt(hex[3] + hex[4], 16); b = parseInt(hex[5] + hex[6], 16); }
  return { r, g, b };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  const toHex = (x: number) => x.toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}
