/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        routine: {
          bg: "#FFFFFF",
          surface: "#F8F9FA",
          surfaceDark: "#111118",
          card: "#FFFFFF",
          cardBorder: "#F0F0F2",
          cardMuted: "#F3F4F6",
          dark: "#111118",
          darkSecondary: "#1F222E",
          subtext: "#6B7280",
          subtextLight: "#9CA3AF",
          coral: "#FF5A36",
          coralDark: "#E04826",
          coralLight: "#FFF0ED",
          coralBorder: "#FFD5CC",
          teal: "#00B8D9",
          tealLight: "#E6F9FC",
          green: "#22C55E",
          amber: "#F59E0B",
          purple: "#7C3AED",
          purpleLight: "#F5F3FF",
        },
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
        '5xl': '34px',
      },
    },
  },
  plugins: [],
};
