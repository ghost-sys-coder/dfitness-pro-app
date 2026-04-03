export type ThemeName = "solar" | "neon" | "ember";

export interface ColorScheme {
  // Primary brand color
  primary: string;
  primaryDim: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;

  // Secondary
  secondary: string;
  secondaryDim: string;
  secondaryContainer: string;
  onSecondary: string;

  // Tertiary / accent
  tertiary: string;
  tertiaryDim: string;
  tertiaryContainer: string;
  onTertiary: string;

  // Backgrounds
  background: string;
  onBackground: string;

  // Surface scale (low → high = more elevated)
  surfaceLowest: string;
  surfaceBase: string;
  surfaceLow: string;
  surfaceContainer: string;
  surfaceHigh: string;
  surfaceHighest: string;

  // Borders & secondary text
  outline: string;
  outlineVariant: string;
  onSurfaceVariant: string;

  // Error
  error: string;
  onError: string;
}

// Solar ─ light, energetic, orange-accented
// Colors mirrored from :root in global.css
const solar: ColorScheme = {
  primary: "#ff6b35",
  primaryDim: "#e05a2b",
  primaryContainer: "#ffdbd0",
  onPrimary: "#ffffff",
  onPrimaryContainer: "#4c1300",

  secondary: "#2c3e50",
  secondaryDim: "#1a252f",
  secondaryContainer: "#d1e4fb",
  onSecondary: "#ffffff",

  tertiary: "#008080",
  tertiaryDim: "#006666",
  tertiaryContainer: "#93f2f2",
  onTertiary: "#ffffff",

  background: "#f7f9fb",
  onBackground: "#191c1e",

  surfaceLowest: "#ffffff",
  surfaceBase: "#f7f9fb",
  surfaceLow: "#f2f4f6",
  surfaceContainer: "#eceef0",
  surfaceHigh: "#e6e8ea",
  surfaceHighest: "#e0e3e5",

  outline: "#74777d",
  outlineVariant: "#c4c6cd",
  onSurfaceVariant: "#43474c",

  error: "#ba1a1a",
  onError: "#ffffff",
};

// Neon ─ dark, high-contrast, cyan/purple
// Colors mirrored from .neon-theme in global.css
const neon: ColorScheme = {
  primary: "#8ff5ff",
  primaryDim: "#00deec",
  primaryContainer: "#00eefc",
  onPrimary: "#005d63",
  onPrimaryContainer: "#005359",

  secondary: "#bf81ff",
  secondaryDim: "#9c42f4",
  secondaryContainer: "#7701d0",
  onSecondary: "#32005c",

  tertiary: "#65afff",
  tertiaryDim: "#4aa2f9",
  tertiaryContainer: "#4aa2f9",
  onTertiary: "#002e52",

  background: "#0e0e0e",
  onBackground: "#ffffff",

  surfaceLowest: "#000000",
  surfaceBase: "#0e0e0e",
  surfaceLow: "#131313",
  surfaceContainer: "#1a1919",
  surfaceHigh: "#201f1f",
  surfaceHighest: "#262626",

  outline: "#777575",
  outlineVariant: "#494847",
  onSurfaceVariant: "#adaaaa",

  error: "#ff716c",
  onError: "#490006",
};

// Ember ─ dark, warm coal, amber-accented
// New theme: deep charcoal backgrounds with glowing amber/ember tones
const ember: ColorScheme = {
  primary: "#ffb347",
  primaryDim: "#e8962e",
  primaryContainer: "#4d2800",
  onPrimary: "#1a0a00",
  onPrimaryContainer: "#ffddb3",

  secondary: "#ff6b6b",
  secondaryDim: "#e05050",
  secondaryContainer: "#5c1a1a",
  onSecondary: "#1a0000",

  tertiary: "#c8a96e",
  tertiaryDim: "#a8864a",
  tertiaryContainer: "#3d2a10",
  onTertiary: "#1a0e00",

  background: "#110b07",
  onBackground: "#f5e6d3",

  surfaceLowest: "#0a0603",
  surfaceBase: "#110b07",
  surfaceLow: "#1c130d",
  surfaceContainer: "#261a12",
  surfaceHigh: "#302116",
  surfaceHighest: "#3d2a1b",

  outline: "#7a5c40",
  outlineVariant: "#4a3525",
  onSurfaceVariant: "#c4a882",

  error: "#ff8a65",
  onError: "#4d0a00",
};

export const themeMap: Record<ThemeName, ColorScheme> = { solar, neon, ember };

export const themeMetadata: Record<ThemeName, { label: string; icon: string }> =
  {
    solar: { label: "Solar", icon: "☀️" },
    neon: { label: "Neon", icon: "⚡" },
    ember: { label: "Ember", icon: "🔥" },
  };
