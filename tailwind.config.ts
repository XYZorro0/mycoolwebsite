import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      colors: {
        crt: {
          bg: "#05070a",
          ink: "#c8e9ff",
          glow: "#7fd3ff",
          amber: "#f0c674",
        },
        vista: {
          panel: "rgba(28, 48, 80, 0.55)",
          edge: "rgba(180, 220, 255, 0.35)",
          chrome: "rgba(10, 22, 40, 0.75)",
        },
      },
      boxShadow: {
        window:
          "0 1px 0 rgba(255,255,255,0.25) inset, 0 0 0 1px rgba(120,180,255,0.25), 0 20px 60px rgba(0,0,0,0.55)",
        glow: "0 0 18px rgba(127,211,255,0.35)",
      },
      backdropBlur: { xs: "2px" },
      animation: {
        "caret-blink": "caret 1s steps(2) infinite",
        scanlines: "scan 8s linear infinite",
      },
      keyframes: {
        caret: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
        scan: { from: { backgroundPosition: "0 0" }, to: { backgroundPosition: "0 100%" } },
      },
    },
  },
  plugins: [],
};

export default config;
