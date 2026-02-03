
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
				'cyan-glow': {
					DEFAULT: '#00F5FF',
					light: '#E0FFFF',
					dark: '#00CED1',
				},
				'deep-slate': {
					DEFAULT: '#020617',
					light: '#0F172A',
					dark: '#010409',
				},
				islamic: {
					// Deep specialized colors for the dark theme overhaul
					green: {
						DEFAULT: '#10B981',
						glow: '#34D399',
						dark: '#064E3B',
					},
					gold: {
						DEFAULT: '#D4AF37',
						glow: '#F4D03F',
						dark: '#2B230B',
					},
					blue: {
						DEFAULT: '#2563eb',
						glow: '#60a5fa',
						dark: '#1e3a8a',
					},
					cream: {
						DEFAULT: '#F8F5F2',
						dark: '#1E293B',
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
				'pulse-glow': {
					'0%, 100%': {
						opacity: '0.4',
						transform: 'scale(1)',
						boxShadow: '0 0 20px rgba(0, 245, 255, 0.2)'
					},
					'50%': {
						opacity: '0.7',
						transform: 'scale(1.02)',
						boxShadow: '0 0 40px rgba(0, 245, 255, 0.4)'
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
				'spotlight': {
					"0%": {
						opacity: '0',
						transform: "translate(-72%, -62%) scale(0.5)",
					},
					"100%": {
						opacity: '1',
						transform: "translate(-50%,-40%) scale(1)",
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'float-slow': 'float-slow 8s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
				'rotate-slow': 'rotate-slow 20s linear infinite',
				'shimmer': 'shimmer 3s infinite linear',
				'gradient-shift': 'gradient-shift 8s ease infinite',
				'beam': 'beam 5s linear infinite',
				'drift': 'drift 20s ease-in-out infinite',
				'spotlight': "spotlight 2s ease .75s 1 forwards",
			},
			backgroundImage: {
				'premium-dark': 'radial-gradient(ellipse at center, #0F172A 0%, #020617 100%)',
				'mesh-cyan': 'radial-gradient(at 0% 0%, rgba(0, 245, 255, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(0, 245, 255, 0.1) 0px, transparent 50%)',
				'card-glow': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
				'cyan-line': 'linear-gradient(to right, transparent, #00F5FF, transparent)',
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
