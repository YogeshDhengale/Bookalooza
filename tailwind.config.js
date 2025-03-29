/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/index.html"],
  safelist: ["animate-scroll"],
  theme: {
  	extend: {
  		colors: {
  			app: {
  				DEFAULT: '#6c12ab',
  				primary: '#4c2664',
  				dark: '#1c105c',
  				static: 'var(--static)'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			header: {
  				DEFAULT: 'var(--header)'
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
		aspectRatio: {
			theme: '152 / 176'
		},
  		gridTemplateColumns: {
  			autoFill2: 'repeat(auto-fill, 146px)'
  		},
  		backgroundImage: {
  			'editor-choice': 'linear-gradient(67deg, rgb(52, 28, 176), rgb(42, 22, 141), rgb(111, 47, 135))',
  			'how-are-we': 'linear-gradient(93deg,#622a7a,#6f2f87,#5a2996,#4823a3,#4622a4,#341cb0,#1c105c)',
  			'theme-selection': 'linear-gradient(180deg, #4d22c4, #231375)',
			'theme-selection-2': 'linear-gradient(rgb(122, 25, 196), rgb(70, 14, 112), rgb(67, 14, 107))',
			'theme-selection-3': 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  			'testimonial-card': 'linear-gradient(151deg, #7148b5, #8160db 48%, #715dd3)',
  			'about-btn': 'linear-gradient(90deg, #650ff7, #9426eb)',
  			'team-card': 'linear-gradient(180deg, #7a19c4, #460e70, #430e6b)',
  			'contact-us': 'linear-gradient(146deg, #6a3089, #231375)',
  			'sign-up': 'linear-gradient(97deg, #622a7a, #6f2f87, #5a2996, #4823a3, #4622a4, #1c105c)',
  			'static-list-item': 'linear-gradient(90deg, #5d1de1 0%, #8f41ff 100%)',
			"canvas-header": "linear-gradient(90deg, #00c4cc, #7d2ae8)"
  		},
  		backgroundColor: {
  			app: {
  				primary: '#f0f1f5',
  				skelton: 'rgba(43, 59, 74, .3)'
  			}
  		},
  		flexBasis: {
  			'1/34': '40%'
  		},
  		boxShadow: {
  			handle: 'rgba(57, 76, 96, 0.15) 0px 0px 4px 1px, rgba(43, 59, 74, 0.3) 0px 0px 0px 1px',
  			'how-are-we': '21px 25px 0px 5px rgba(255, 255, 255, 1)'
  		},
  		fontFamily: {
  			sans: [
  				'Poppins',
  				'sans-serif'
  			],
  			serif: [
  				'Big Shoulders Text',
  				' serif'
  			]
  		},
  		rotate: {
  			y: 'rotateY(180deg)'
  		},
  		transform: {
  			rotateY: 'rotateY(180deg)'
  		},
  		keyframes: {
  			scroll: {
  				'0%': {
  					transform: 'translateX(0%)'
  				},
  				'100%': {
  					transform: 'translateX(-50%)'
  				}
  			},
  			'scroll-reverse': {
  				'0%': {
  					transform: 'translateX(-50%)'
  				},
  				'100%': {
  					transform: 'translateX(0%)'
  				}
  			},
  			scrollY: {
  				'0%': {
  					transform: 'translateY(0)'
  				},
  				'100%': {
  					transform: 'translateY(-100%)'
  				}
  			},
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
  			}
  		},
  		animation: {
  			scroll: 'scroll var(--duration) linear var(--delay) var(--iteration-count)',
  			'scroll-reverse': 'scroll-reverse var(--duration) linear var(--delay) var(--iteration-count)',
  			scrollY: 'scrollY 50s linear infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-animated")],
};
