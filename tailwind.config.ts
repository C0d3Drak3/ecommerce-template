import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'neon-blue': '#3B82F6',
        'neon-purple': '#8B5CF6',
      },
      boxShadow: {
        'neon': '0 0 15px rgba(139, 92, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)',
        'neon-lg': '0 0 25px rgba(139, 92, 246, 0.6), 0 0 50px rgba(59, 130, 246, 0.4)',
        'neon-xl': '0 0 35px rgba(139, 92, 246, 0.7), 0 0 70px rgba(59, 130, 246, 0.5)',
      },
      dropShadow: {
        'neon': [
          '0 0 10px rgba(139, 92, 246, 0.5)',
          '0 0 20px rgba(59, 130, 246, 0.3)'
        ],
        'neon-lg': [
          '0 0 15px rgba(139, 92, 246, 0.6)',
          '0 0 30px rgba(59, 130, 246, 0.4)'
        ]
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(to right, #3B82F6, #8B5CF6)',
        'neon-gradient-hover': 'linear-gradient(to right, #2563EB, #7C3AED)',
      },
      animation: {
        'neon-pulse': 'neonPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        neonPulse: {
          '0%, 100%': { 
            'box-shadow': '0 0 15px rgba(139, 92, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)',
            'text-shadow': '0 0 5px rgba(139, 92, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3)'
          },
          '50%': { 
            'box-shadow': '0 0 20px rgba(139, 92, 246, 0.7), 0 0 40px rgba(59, 130, 246, 0.5)',
            'text-shadow': '0 0 10px rgba(139, 92, 246, 0.7), 0 0 20px rgba(59, 130, 246, 0.5)'
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
