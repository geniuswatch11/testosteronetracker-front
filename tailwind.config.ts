import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        black: '#000000',
        white: '#FFFFFF',
        neutral: {
          600: '#414141',
          500: '#8E8E8E',
          400: '#CACACA',
          300: '#E1E1E1',
          200: '#EBEBEB',
          100: '#F5F5F5',
          50: '#FAFAFA',
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          600: '#DED854',
          500: '#E7E68F',
          400: '#FFFCA1',
          300: '#FFFCCC',
          200: '#FFFCCC',
          100: '#FFFCCC',
        },
        'primary-cyan': {
          600: '#22D3EE',
          500: '#67E8F9',
        },
        'primary-lime': {
          600: '#A3E635',
          500: '#BEF264',
        },
        'primary-green': {
          600: '#22C55E',
          500: '#4ADE80',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        danger: {
          600: '#D94C4C',
          500: '#E7C1D8',
          400: '#F49898',
          300: '#F7C1C1',
          200: '#FBD9D9',
          100: '#FDF2F2',
          50: '#FFFBFB',
        },
        info: {
          600: '#3B82F6',
          500: '#60A5FA',
          400: '#93C5FD',
          300: '#BFDBFE',
          200: '#DBEAFE',
          100: '#EFF6FF',
          50: '#F9FAFF',
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [],
}
export default config
