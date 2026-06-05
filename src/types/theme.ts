export type HarmonyMode = 'complementary' | 'analogous' | 'triadic' | 'monochromatic';
export type ThemeMode = 'light' | 'dark';
export type FontChoice = 'sans' | 'serif' | 'mono' | 'display';
export type Density = 'comfortable' | 'compact' | 'spacious';
export type Frosted = 'solid' | 'frosted' | 'glass';

export interface ThemeColors {
  background: string;
  text: string;
  panel: string;
  sidebar: string;
  border: string;
  accent: string;
}

export interface CustomTheme {
  name: string;
  colors: ThemeColors;
  mode: ThemeMode;
  font: FontChoice;
  density: Density;
  frosted: Frosted;
}

export const DEFAULT_LIGHT: ThemeColors = {
  background: '#FAF7F0',
  text: '#1C1917',
  panel: '#FCFAF5',
  sidebar: '#F8F5EE',
  border: '#E6DDD0',
  accent: '#064E3B',
};

export const DEFAULT_DARK: ThemeColors = {
  background: '#0C0A09',
  text: '#F5F5F0',
  panel: '#1C1917',
  sidebar: '#141210',
  border: '#292524',
  accent: '#34D399',
};

export const FONT_MAP: Record<FontChoice, string> = {
  sans: "'Inter', sans-serif",
  serif: "'Cormorant Garamond', serif",
  mono: "'JetBrains Mono', monospace",
  display: "'Outfit', sans-serif",
};

export const FONT_LABELS: Record<FontChoice, string> = {
  sans: 'Sans (Inter)',
  serif: 'Serif (Cormorant)',
  mono: 'Monospace',
  display: 'Display (Outfit)',
};

export const DENSITY_RADIUS: Record<Density, string> = {
  comfortable: '0.9rem',
  compact: '0.5rem',
  spacious: '1.2rem',
};
