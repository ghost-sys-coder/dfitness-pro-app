import { vars } from "nativewind";

// Solar = light theme (:root defaults in global.css)
// Neon   = dark theme  (.neon-theme class in global.css)
// vars() overrides CSS custom properties for a React Native View subtree,
// which is required on iOS/Android where CSS classes don't cascade.

export const themes = {
  solar: vars({
    "--primary": "#ff6b35",
    "--primary-dim": "#e05a2b",
    "--primary-container": "#ffdbd0",
    "--on-primary": "#ffffff",
    "--on-primary-container": "#4c1300",

    "--secondary": "#2c3e50",
    "--secondary-dim": "#1a252f",
    "--secondary-container": "#d1e4fb",
    "--on-secondary": "#ffffff",

    "--tertiary": "#008080",
    "--tertiary-dim": "#006666",
    "--tertiary-container": "#93f2f2",
    "--on-tertiary": "#ffffff",

    "--background": "#f7f9fb",
    "--on-background": "#191c1e",

    "--surface-lowest": "#ffffff",
    "--surface-base": "#f7f9fb",
    "--surface-low": "#f2f4f6",
    "--surface-container": "#eceef0",
    "--surface-high": "#e6e8ea",
    "--surface-highest": "#e0e3e5",

    "--outline": "#74777d",
    "--outline-variant": "#c4c6cd",
    "--on-surface-variant": "#43474c",

    "--error": "#ba1a1a",
    "--on-error": "#ffffff",
  }),

  neon: vars({
    "--primary": "#8ff5ff",
    "--primary-dim": "#00deec",
    "--primary-container": "#00eefc",
    "--on-primary": "#005d63",
    "--on-primary-container": "#005359",

    "--secondary": "#bf81ff",
    "--secondary-dim": "#9c42f4",
    "--secondary-container": "#7701d0",
    "--on-secondary": "#32005c",

    "--tertiary": "#65afff",
    "--tertiary-dim": "#4aa2f9",
    "--tertiary-container": "#4aa2f9",
    "--on-tertiary": "#002e52",

    "--background": "#0e0e0e",
    "--on-background": "#ffffff",

    "--surface-lowest": "#000000",
    "--surface-base": "#0e0e0e",
    "--surface-low": "#131313",
    "--surface-container": "#1a1919",
    "--surface-high": "#201f1f",
    "--surface-highest": "#262626",

    "--outline": "#777575",
    "--outline-variant": "#494847",
    "--on-surface-variant": "#adaaaa",

    "--error": "#ff716c",
    "--on-error": "#490006",
  }),
};
