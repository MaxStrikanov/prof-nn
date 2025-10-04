/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx,vue,scss}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // важный момент: тут ожидаются HSL-переменные (числа), поэтому добавляем / <alpha-value>
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: "hsl(var(--primary)",
        secondary: "hsl(var(--secondary)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)"
      },
      boxShadow: {
        card: "0 1px 4px rgba(0,0,0,.06)",
        elevated: "0 10px 30px rgba(0,0,0,.12)"
      },
      container: { center: true, padding: "1rem" }
    }
  },
  safelist: [
    "bg-gradient-to-b","bg-gradient-to-br",
    "from-primary","via-secondary","to-primary","to-secondary", "bg-secondary/10", "text-secondary"
  ],
  plugins: []
}
