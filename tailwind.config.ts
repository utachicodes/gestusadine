import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

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
				arabic: ["Amiri", "serif"],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				// Premium SaaS Palette (Trickly Inspired)
				'brand': {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6', // Primary Blue
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
					950: '#020617', // Deep Indigo Dark
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
						boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
					},
					'50%': {
						opacity: '0.7',
						transform: 'scale(1.02)',
						boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)'
					}
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
			},
			backgroundImage: {
				'mesh-gold': 'radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(37, 99, 235, 0.08) 0px, transparent 50%)',
				'geometric-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563EB' fill-opacity='0.1'%3E%3Cpath d='M30 0L60 30L30 60L0 30z'/%3E%3Cpath d='M30 10L50 30L30 50L10 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
