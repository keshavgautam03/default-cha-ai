import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'gradient-xy': 'gradient 15s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["night","valentine", "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", 
    "synthwave", "retro", "cyberpunk", "halloween", "garden", "forest", "aqua", "lofi", 
    "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", 
    "business", "acid", "lemonade", "coffee", "winter", "dim", "nord", "sunset"],
  },
};
