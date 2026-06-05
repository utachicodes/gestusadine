import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ["Inter", "sans-serif"],
				display: ["Outfit", "Inter", "sans-serif"],
				serif: ['"Cormorant Garamond"', "ui-serif", "Georgia", "serif"],
				arabic: ["Amiri", "serif"],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				// Brand accent — Teal (the bright counterpart to Heritage Emerald).
				// Remapped from the old blue "Trickly" palette so every `brand-*`
				// usage across the app renders emerald/teal with no file changes.
				'brand': {
					50: '#f0fdfa',
					100: '#ccfbf1',
					200: '#99f6e4',
					300: '#5eead4',
					400: '#2dd4bf',
					500: '#14b8a6',
					600: '#0d9488', // primary teal action
					700: '#0f766e',
					800: '#115e59',
					900: '#134e4a',
					950: '#042f2e',
				},
				'saas-bg': {
					DEFAULT: '#ffffff',
					alt: '#f8fafc',
					dark: '#0f172a',
				},
				'saas-glass': {
					DEFAULT: 'rgba(255, 255, 255, 0.8)',
					dark: 'rgba(15, 23, 42, 0.8)',
				},
				// Islamic palette — emerald/teal/slate. Full shade ramps so every
				// `islamic-*` name + numeric variant referenced across the app
				// resolves on-brand. `gold` is the teal accent; `emerald`/`green`
				// the greens; `blue` a cyan/teal; `primary` a nested green/teal/gold.
				'islamic': {
					gold: { DEFAULT: '#0f766e', light: '#5eead4', dark: '#115e59', 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a' },
					emerald: { DEFAULT: '#059669', 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b' },
					green: { DEFAULT: '#16a34a', 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d' },
					blue: { DEFAULT: '#0891b2', 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63' },
					primary: { DEFAULT: '#065f46', green: '#059669', teal: '#0d9488', gold: '#0f766e' },
					midnight: { DEFAULT: '#0b1220', dark: '#050608' },
					dark: '#0f172a',
					cream: '#f8fafc',
				},
				'cyan-glow': '#2dd4bf',
				// "Warm / sacred" palette used by the core, community & knowledge
				// pages — remapped to the soft-white / deep-emerald / teal identity
				// so those surfaces match the rest of the app.
				'deep-green': { DEFAULT: '#0b3d2e', light: '#0f766e' },
				'deep-slate': '#0f172a',
				'warm-gold': { DEFAULT: '#0d9488', light: '#5eead4', dark: '#0f766e' },
				'sage-green': { DEFAULT: '#059669', dark: '#047857' },
				'warm-base': '#f6faf8',
				'warm-sand': '#e7efeb',
				'warm-cream': '#f2f7f4',
				'sand': '#dbe7e1',
				'ink-soft': '#5b6b66',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'float-slow': {
					'0%, 100%': { transform: 'translateY(0) translateX(0)' },
					'50%': { transform: 'translateY(-15px) translateX(10px)' }
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(24px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'beam': {
					'0%': { transform: 'translateX(-100%) translateY(-100%) rotate(-45deg)', opacity: '0' },
					'50%': { opacity: '0.5' },
					'100%': { transform: 'translateX(200%) translateY(200%) rotate(-45deg)', opacity: '0' }
				},
				'drift': {
					'0%, 100%': { transform: 'translate(0, 0)' },
					'25%': { transform: 'translate(10%, 10%)' },
					'50%': { transform: 'translate(-5%, 15%)' },
					'75%': { transform: 'translate(15%, -5%)' }
				},
				'pulse-gold': {
					'0%, 100%': {
						opacity: '0.4',
						transform: 'scale(1)',
						boxShadow: '0 0 20px rgba(13, 148, 136, 0.2)'
					},
					'50%': {
						opacity: '0.7',
						transform: 'scale(1.02)',
						boxShadow: '0 0 40px rgba(13, 148, 136, 0.4)'
					}
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
					'50%': { opacity: '0.75', transform: 'scale(1.03)' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '0.5' },
					'50%': { opacity: '1' }
				},
				'pattern-rotate': {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' }
				},
				'rotate-slow': {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' }
				},
				'gradient-shift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				'spotlight': {
					"0%": { opacity: '0', transform: "translate(-72%, -62%) scale(0.5)" },
					"100%": { opacity: '1', transform: "translate(-50%,-40%) scale(1)" },
				},
				'geometric-spin': {
					'0%': { transform: 'rotate(0deg) scale(1)' },
					'50%': { transform: 'rotate(180deg) scale(1.05)' },
					'100%': { transform: 'rotate(360deg) scale(1)' }
				},
				'text-reveal': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'scale-up': {
					'0%': { transform: 'scale(1)', opacity: '0.8' },
					'50%': { transform: 'scale(1.05)', opacity: '1' },
					'100%': { transform: 'scale(1)', opacity: '0.8' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'float-slow': 'float-slow 8s ease-in-out infinite',
				'fade-up': 'fade-up 0.6s ease-out forwards',
				'pulse-gold': 'pulse-gold 4s ease-in-out infinite',
				'rotate-slow': 'rotate-slow 20s linear infinite',
				'gradient-shift': 'gradient-shift 8s ease infinite',
				'beam': 'beam 5s linear infinite',
				'drift': 'drift 20s ease-in-out infinite',
				'spotlight': "spotlight 2s ease .75s 1 forwards",
				'geometric-spin': 'geometric-spin 30s linear infinite',
				'text-reveal': 'text-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'scale-up': 'scale-up 8s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
				'pattern-rotate': 'pattern-rotate 120s linear infinite',
			},
			boxShadow: {
				'glow-cyan': '0 0 24px rgba(45, 212, 191, 0.45)',
			},
			backgroundImage: {
				'mesh-gold': 'radial-gradient(at 0% 0%, rgba(6, 95, 70, 0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(13, 148, 136, 0.08) 0px, transparent 50%)',
				'geometric-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23065F46' fill-opacity='0.08'%3E%3Cpath d='M30 0L60 30L30 60L0 30z'/%3E%3Cpath d='M30 10L50 30L30 50L10 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
				'islamic-pattern': "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230d9488' stroke-opacity='0.06' stroke-width='1'%3E%3Cpath d='M40 0L80 40L40 80L0 40z'/%3E%3Cpath d='M40 16L64 40L40 64L16 40z'/%3E%3Ccircle cx='40' cy='40' r='10'/%3E%3C/g%3E%3C/svg%3E\")",
				'mesh-cyan': 'radial-gradient(at 20% 20%, rgba(13, 148, 136, 0.10) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(45, 212, 191, 0.08) 0px, transparent 50%)',
				'hero-gradient': 'linear-gradient(135deg, #064e3b 0%, #0d9488 100%)',
			}
		}
	},
	plugins: [tailwindcssAnimate, typography],
} satisfies Config;
