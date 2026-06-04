import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/auth/AuthContext';

// Dark mode has been removed from the product. The only modes are the default
// light palette and the premium `personalized` (custom-color) palette, which is
// still a light-based surface.
export type ThemeMode = 'light' | 'personalized';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  colors: ThemeColors;
  setColors: (colors: ThemeColors) => void;
}

const defaultColors: ThemeColors = {
  primary: '#064E3B', // Heritage Emerald
  secondary: '#0D9488', // Teal
  accent: '#0F766E', // Teal-700
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      // Dark mode has been removed: only `personalized` is honored from storage;
      // anything else (including a previously-saved 'dark') falls back to light.
      const savedTheme = localStorage.getItem('theme-v2');
      if (savedTheme === 'personalized') return 'personalized';
    }
    return 'light';
  });

  const [colors, setColors] = useState<ThemeColors>(() => {
    if (typeof window !== 'undefined') {
      const savedColors = localStorage.getItem('theme-colors-v2');
      return savedColors ? JSON.parse(savedColors) : defaultColors;
    }
    return defaultColors;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('theme-v2', theme);
    localStorage.setItem('theme-colors-v2', JSON.stringify(colors));

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'personalized');

    const applyHSL = (name: string, hex: string) => {
      const { h, s, l } = hexToHSL(hex);
      root.style.setProperty(name, `${h} ${s}% ${l}%`);
    };

    const contrastHex = (hex: string) => {
      const { r, g, b } = hexToRGB(hex);
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      return luminance > 0.55 ? '#0f172a' : '#f8fafc';
    };

    const surface = (hex: string, lightness: number) => {
      const hsl = hexToHSL(hex);
      const l = Math.min(100, Math.max(0, lightness));
      return { h: hsl.h, s: hsl.s, l };
    };

    if (theme !== 'personalized') {
      root.classList.add('light');
      ['--primary', '--primary-foreground', '--secondary', '--accent', '--background', '--foreground', '--card', '--card-foreground', '--muted', '--muted-foreground', '--border', '--input', '--ring', '--popover', '--popover-foreground', '--secondary-foreground', '--accent-foreground', '--destructive', '--destructive-foreground']
        .forEach((name) => root.style.removeProperty(name));
    } else {
      root.classList.add('personalized');
      // Primary tokens
      applyHSL('--primary', colors.primary);
      applyHSL('--secondary', colors.secondary);
      applyHSL('--accent', colors.accent);
      applyHSL('--primary-foreground', contrastHex(colors.primary));
      applyHSL('--secondary-foreground', contrastHex(colors.secondary));
      applyHSL('--accent-foreground', contrastHex(colors.accent));

      // Derived surfaces
      const bg = surface(colors.primary, 96);
      const card = surface(colors.primary, 98.5);
      const border = surface(colors.primary, 82);
      const muted = surface(colors.primary, 90);

      const bgHex = hslToHex(bg.h, bg.s, bg.l);
      const cardHex = hslToHex(card.h, card.s, card.l);
      const borderHex = hslToHex(border.h, border.s, border.l);
      const mutedHex = hslToHex(muted.h, muted.s, muted.l);

      const foregroundHex = contrastHex(bgHex);
      const mutedFgHex = contrastHex(mutedHex);

      root.style.setProperty('--background', `${bg.h} ${bg.s}% ${bg.l}%`);
      root.style.setProperty('--foreground', `${hexToHSL(foregroundHex).h} ${hexToHSL(foregroundHex).s}% ${hexToHSL(foregroundHex).l}%`);
      root.style.setProperty('--card', `${card.h} ${card.s}% ${card.l}%`);
      root.style.setProperty('--card-foreground', `${hexToHSL(foregroundHex).h} ${hexToHSL(foregroundHex).s}% ${hexToHSL(foregroundHex).l}%`);
      root.style.setProperty('--muted', `${muted.h} ${muted.s}% ${muted.l}%`);
      root.style.setProperty('--muted-foreground', `${hexToHSL(mutedFgHex).h} ${hexToHSL(mutedFgHex).s}% ${hexToHSL(mutedFgHex).l}%`);
      root.style.setProperty('--border', `${border.h} ${border.s}% ${border.l}%`);
      root.style.setProperty('--input', `${border.h} ${border.s}% ${border.l}%`);
      root.style.setProperty('--ring', `${hexToHSL(colors.accent).h} ${hexToHSL(colors.accent).s}% ${hexToHSL(colors.accent).l}%`);
      root.style.setProperty('--popover', `${card.h} ${card.s}% ${card.l}%`);
      root.style.setProperty('--popover-foreground', `${hexToHSL(foregroundHex).h} ${hexToHSL(foregroundHex).s}% ${hexToHSL(foregroundHex).l}%`);
    }
  }, [theme, colors, user]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: setThemeState,
        colors,
        setColors,
      }}
    >
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

// Helper function to convert Hex to HSL
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
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0,
    s = 0,
    l = 0;

  if (delta === 0)
    h = 0;
  else if (cmax === r)
    h = ((g - b) / delta) % 6;
  else if (cmax === g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

function hexToRGB(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return { r, g, b };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color);
  };
  const toHex = (x: number) => x.toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}
