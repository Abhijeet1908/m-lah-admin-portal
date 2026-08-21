/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          900: "#061F26",
          800: "#0A2F3A",
          700: "#0F4C5C",
          600: "#16697A",
          500: "#1E879C",
          100: "#E3F3F7",
          50: "#F0F8FA",
        },
        mint: {
          600: "#1D9B8F",
          500: "#2EC4B6",
          400: "#50D2C6",
          100: "#D8F6F3",
          50: "#EDFCFA",
        },
        coral: {
          600: "#C9453B",
          500: "#E3655B",
          400: "#EA867E",
          100: "#FCE7E5",
          50: "#FEF4F3",
        },
        sand: {
          300: "#DED6CA",
          200: "#EDE7DE",
          100: "#F5F1EB",
          50: "#FAF8F5",
        },
        ink: {
          900: "#0F1A1F",
          800: "#1E2F37",
          700: "#324752",
          600: "#516975",
          400: "#839BA7",
          200: "#CFDCE2",
          100: "#E9F0F3",
        },
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px -2px rgba(15, 76, 92, 0.08), 0 1px 4px -1px rgba(15, 76, 92, 0.04)",
        "card-hover": "0 12px 32px -4px rgba(15, 76, 92, 0.14), 0 4px 12px -2px rgba(15, 76, 92, 0.06)",
        header: "0 2px 16px rgba(6, 31, 38, 0.12)",
      },
    },
  },
  plugins: [],
};

