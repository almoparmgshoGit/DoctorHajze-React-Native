/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",     // Deep Blue (Trust)
        secondary: "#64748b",   // Slate Gray
        accent: "#38bdf8",      // Sky Blue (Freshness)
        background: "#ffffff",  // White
        surface: "#f8fafc",     // Near-white for cards
        "text-main": "#0f172a", // Dark Blue-Black
        "text-muted": "#64748b",// Muted Gray
        border: "#e2e8f0",      // Light Gray border
      },
    },
  },
  plugins: [],
};