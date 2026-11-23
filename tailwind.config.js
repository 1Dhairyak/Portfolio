// Colors resolve to CSS variables (see index.css) so dark/light is one attribute flip.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: v("fg"),
        black: v("fg-inverse"),
        accent: v("accent"),
        "accent-fill": v("accent-fill"), // filled buttons / active markers
        "on-accent": v("on-accent"), // text on accent-fill
        // cards carry their own alpha: faint white wash in dark, solid BK cloud cards in light
        card: "rgb(var(--card))",
        "card-strong": "rgb(var(--card-strong))",
        surface: {
          DEFAULT: v("surface"),
          1: v("surface-1"),
          2: v("surface-2"),
          3: v("surface-3"),
          4: v("surface-4"),
          5: v("surface-5"),
          6: v("surface-6"),
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
