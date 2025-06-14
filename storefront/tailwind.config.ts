import type {Config} from "tailwindcss";

import plugin from "tailwindcss/plugin";

const config: Config = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
    },
  },
  theme: {
    extend: {
      fontFamily: {
        serif: "var(--font-ibmPlex)",
        sans: "var(--font-rubik)",
      },

      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontSize: {
        // body
        "body-8xl": "calc(var(--base-font-size) + 32px)",
        "body-6xl": "calc(var(--base-font-size) + 24px)",
        "body-5xl": "calc(var(--base-font-size) + 20px)",
        "body-4xl": "calc(var(--base-font-size) + 16px)",
        "body-3xl": "calc(var(--base-font-size) + 12px)",
        "body-2xl": "calc(var(--base-font-size) + 8px)",
        "body-xl": "calc(var(--base-font-size) + 4px)",
        "body-lg": "calc(var(--base-font-size) + 2px)",
        "body-base": "var(--base-font-size)",
        "body-sm": "calc(var(--base-font-size) - 2px)",
        "body-xs": "calc(var(--base-font-size) - 4px)",

        // heading
        "heading-9xl": "calc(var(--base-font-size) + 112px)",
        "heading-8xl": "calc(var(--base-font-size) + 96px)",
        "heading-7xl": "calc(var(--base-font-size) + 80px)",
        "heading-6xl": "calc(var(--base-font-size) + 72px)",
        "heading-5xl": "calc(var(--base-font-size) + 64px)",
        "heading-4xl": "calc(var(--base-font-size) + 56px)",
        "heading-3xl": "calc(var(--base-font-size) + 48px)",
        "heading-2xl": "calc(var(--base-font-size) + 40px)",
        "heading-xl": "calc(var(--base-font-size) + 32px)",
        "heading-lg": "calc(var(--base-font-size) + 24px)",
        "heading-base": "calc(var(--base-font-size) + 16px)",
        "heading-sm": "calc(var(--base-font-size) + 12px)",
        "heading-xs": "calc(var(--base-font-size) + 8px)",
        "heading-2xs": "calc(var(--base-font-size) + 4px)",

        // label
        "label-9xl": "calc(var(--base-font-size) + 36px)",
        "label-8xl": "calc(var(--base-font-size) + 32px)",
        "label-7xl": "calc(var(--base-font-size) + 28px)",
        "label-6xl": "calc(var(--base-font-size) + 24px)",
        "label-5xl": "calc(var(--base-font-size) + 20px)",
        "label-4xl": "calc(var(--base-font-size) + 16px)",
        "label-3xl": "calc(var(--base-font-size) + 12px)",
        "label-2xl": "calc(var(--base-font-size) + 8px)",
        "label-xl": "calc(var(--base-font-size) + 4px)",
        "label-lg": "calc(var(--base-font-size) + 2px)",
        "label-base": "var(--base-font-size)",
        "label-sm": "calc(var(--base-font-size) - 2px)",
        "label-xs": "calc(var(--base-font-size) - 4px)",
        "label-2xs": "calc(var(--base-font-size) - 6px)",
      },

      animation: {
        "spin-loading": "spin 1.5s linear infinite",
        marquee: "marquee var(--duration) linear infinite",
        "select-open": "selectOpen 0.2s ease-out forwards",
        "select-close": "selectClose 0.2s ease-in forwards",
        fadeInUp: "fadeInUp 450ms ease",
        fadeOutLeft: "fadeOutLeft var(--duration) ease-in-out",
      },
      keyframes: {
        marquee: {
          from: {transform: "translateX(0)"},
          to: {transform: "translateX(calc(-100% - var(--gap)))"},
        },

        fadeInUp: {
          from: {opacity: "0", transform: "translateY(40px)"},
          to: {opacity: "1", transform: "translateY(0)"},
        },
        fadeOutLeft: {
          from: {opacity: "1", transform: "translateX(0)"},
          to: {opacity: "0", transform: "translateX(-40px)"},
        },
      },
    },
  },
  plugins: [
    plugin(({addVariant}) => {
      // Target touch and non-touch devices
      addVariant("touch", "@media (pointer: coarse)");
      addVariant("notouch", "@media (hover: hover)");
    }),
  ],
};

export default config;
