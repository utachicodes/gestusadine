
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
				serif: ["Playfair Display", "serif"],
				arabic: ["Amiri", "serif"],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				islamic: {
					// Light blue color scheme
					green: {
						DEFAULT: '#e0e8f3', // light blue base
						light: '#c5d4e8', // slightly darker
						dark: '#8fa3c4', // darker for contrast
						50: '#f0f4f9',
						100: '#e0e8f3',
						200: '#c5d4e8',
						300: '#a8bdd9',
						400: '#8fa3c4',
						500: '#7689af',
						600: '#5d6f9a',
						700: '#4a5a7d',
						800: '#3a4660',
						900: '#2a3343',
					},
					// Vibrant teal accents
					teal: {
						DEFAULT: '#0d9488', // teal-600
						light: '#14b8a6', // teal-500
						dark: '#115e59', // teal-800
						50: '#f0fdfa',
						100: '#ccfbf1',
						200: '#99f6e4',
						300: '#5eead4',
						400: '#2dd4bf',
						500: '#14b8a6',
						600: '#0d9488',
						700: '#0f766e',
						800: '#115e59',
						900: '#134e4a',
					},
					// Deep, elegant blue
					blue: {
						DEFAULT: '#1e40af', // blue-800
						light: '#3b82f6', // blue-500
						dark: '#1e3a8a', // blue-900
						50: '#eff6ff',
						100: '#dbeafe',
						200: '#bfdbfe',
						300: '#93c5fd',
						400: '#60a5fa',
						500: '#3b82f6',
						600: '#2563eb',
						700: '#1d4ed8',
						800: '#1e40af',
						900: '#1e3a8a',
					},
					// Rich Gold (True Gold)
					gold: {
						DEFAULT: '#D4AF37', // metallic gold
						light: '#F4D03F', // bright gold
						dark: '#B7950B', // deep gold
						50: '#FCF9E8',
						100: '#F9F2D1',
						200: '#F4E5A3',
						300: '#EFD875',
						400: '#EACC47',
						500: '#D4AF37',
						600: '#AA8C2C',
						700: '#806921',
						800: '#554616',
						900: '#2B230B',
					},
					// Deep Emerald (Islamic Green)
					emerald: {
						DEFAULT: '#10B981',
						light: '#34D399',
						dark: '#059669',
						50: '#ECFDF5',
						100: '#D1FAE5',
						200: '#A7F3D0',
						300: '#6EE7B7',
						400: '#34D399',
						500: '#10B981',
						600: '#059669',
						700: '#047857',
						800: '#065F46',
						900: '#064E3B',
					},
					// Midnight Blue (Deep Backgrounds)
					midnight: {
						DEFAULT: '#1E293B',
						light: '#334155',
						dark: '#0F172A',
						50: '#F8FAFC',
						100: '#F1F5F9',
						200: '#E2E8F0',
						300: '#CBD5E1',
						400: '#94A3B8',
						500: '#64748B',
						600: '#475569',
						700: '#334155',
						800: '#1E293B',
						900: '#0F172A',
					},
					// Soft neutral cream
					cream: {
						DEFAULT: '#F8F5F2',
						light: '#FCFBF9',
						dark: '#E8E4DE',
					},
					// Primary gold (Replacing black with Gold)
					'primary-gold': {
						DEFAULT: '#D4AF37',
						light: '#F4D03F',
						dark: '#B7950B',
					}
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
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-20px)'
					}
				},
				'float-slow': {
					'0%, 100%': {
						transform: 'translateY(0) translateX(0)'
					},
					'50%': {
						transform: 'translateY(-15px) translateX(10px)'
					}
				},
				'pulse-slow': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						opacity: '0.5',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '0.8',
						transform: 'scale(1.05)'
					}
				},
				'rotate-slow': {
					from: {
						transform: 'rotate(0deg)'
					},
					to: {
						transform: 'rotate(360deg)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-500px 0'
					},
					'100%': {
						backgroundPosition: '500px 0'
					}
				},
				'gradient-shift': {
					'0%, 100%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'pattern-rotate': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'float-slow': 'float-slow 8s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'rotate-slow': 'rotate-slow 20s linear infinite',
				'shimmer': 'shimmer 3s infinite linear',
				'gradient-shift': 'gradient-shift 8s ease infinite',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'pattern-rotate': 'pattern-rotate 40s linear infinite',
				'blob': 'blob 7s infinite',
				'wave': 'wave 2s ease-in-out infinite'
			},
			backgroundImage: {
				'islamic-pattern': "url('/pattern.svg')",
				'hero-gradient': 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
				'hero-gradient-alt': 'linear-gradient(to bottom right, #334155, #1E293B, #0F172A)',
				'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
				'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 40%, #B7950B 100%)',
				'gold-shine': 'linear-gradient(45deg, transparent 25%, rgba(255,215,0,0.3) 50%, transparent 75%)',
				'mesh-gradient': 'radial-gradient(at 40% 20%, rgba(224, 232, 243, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(143, 163, 196, 0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(30, 64, 175, 0.3) 0px, transparent 50%), radial-gradient(at 80% 50%, rgba(200, 162, 74, 0.22) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(224, 232, 243, 0.2) 0px, transparent 50%)',
				'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
