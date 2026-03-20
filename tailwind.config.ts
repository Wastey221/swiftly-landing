/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: "#4F46E5",
        slate: "#0F172A",
        mint: "#10B981",
        "mint-green": "#10B981",
      },
    },
  },
};

