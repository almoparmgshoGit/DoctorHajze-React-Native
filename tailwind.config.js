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
        primary: "#5B8FB9",       // Calm Blue
        "primary-dark": "#301B3F",// Dark accent
        secondary: "#94A3B8",     // Soft Slate
        accent: "#7EC8E3",        // Light Sky
        background: "#F5F5F5",    // Warm Light Gray
        surface: "#FFFFFF",       // White cards
        "text-main": "#2D3748",   // Soft Dark
        "text-muted": "#718096",  // Muted Gray
        border: "#E2E8F0",        // Light Border
        "calm-green": "#68D391",  // Soft Green
        "calm-red": "#FC8181",    // Soft Red
        "calm-yellow": "#F6E05E", // Soft Yellow
      },
    },
  },
  plugins: [],
};