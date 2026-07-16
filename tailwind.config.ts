/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        matcha: {
          50:  "#f2f7f2",
          100: "#e0ede0",
          200: "#c3dbc4",
          300: "#97c09a",
          400: "#65a06a",
          500: "#4a7c59",  // primary accent
          600: "#3a6347",
          700: "#2f5039",
          800: "#27402f",
          900: "#213628",
          950: "#111e16",
        },
        dark: {
          base:    "#0d1117",
          surface: "#161b22",
          card:    "#21262d",
          border:  "#30363d",
          muted:   "#8b949e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      // Safe area utilities
      padding: {
        safe: "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};
