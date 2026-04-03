# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start dev server (choose platform)
npx expo start
npx expo start --android
npx expo start --ios
npx expo start --web

# Lint
npm run lint
```

There are no tests configured yet.

## Architecture

This is an **Expo Router** app (file-based routing) using **NativeWind v5** (Tailwind CSS for React Native) and **TypeScript**.

### Routing structure

```
app/
  _layout.tsx          # Root layout — wraps everything in ThemeProvider, loads fonts
  index.tsx            # Landing/splash screen with CTA to sign-in or sign-up
  (auth)/
    _layout.tsx        # Auth stack
    sign-in.tsx
    sign-up.tsx
  (onboarding)/        # Multi-step onboarding flow (stubs, not yet wired)
    welcome.tsx → goals.tsx → fitness-level.tsx → preferences.tsx → schedule.tsx → summary.tsx
```

### Theming system

Two named themes: **"solar"** (light, orange-accented) and **"neon"** (dark, cyan/purple). Theme is toggled via `ThemeSwitcher` and persisted to `AsyncStorage`.

- **`context/ThemeContext.tsx`** — provides `{ theme, toggleTheme, isSolar }` via `useTheme()` hook
- **`global.css`** — defines all CSS custom properties. `:root` holds the Solar (light) theme variables; `.solar-theme` class holds the Neon (dark) theme variables (note: the class name is inverted from its name — `.solar-theme` is actually the dark/neon palette)
- **`@theme` block in `global.css`** — maps CSS vars to Tailwind color tokens (e.g. `--color-primary`, `--color-background`, `--color-surface-container`, etc.)
- **`utils/colorThemes.ts`** — currently a stub using NativeWind `vars()`; the real theme values live in `global.css`

When styling components, use semantic Tailwind tokens like `bg-background`, `text-on-background`, `bg-primary`, `text-on-primary`, `bg-surface-container`, `text-on-surface-variant`, `bg-outline-variant`, etc. — these automatically reflect the active theme.

### Fonts

Four font families are loaded in `app/_layout.tsx`:

| Token | Family | Weights loaded |
|---|---|---|
| `font-display` | Space Grotesk | 500, 700 |
| `font-body` / `font-body-bold` | Manrope | 400, 700 |
| `font-label` / `font-label-bold` | Lexend | 400, 700 |
| `font-body` / `font-label` (Solar) | Work Sans | 400, 500, 700 |

Use `style={{ fontFamily: "FontName_Weight" }}` directly, or the `font-*` Tailwind utilities once they're wired through NativeWind.

### Key conventions

- The `@/` alias maps to the project root.
- All screens use `headerShown: false` — navigation chrome is fully custom.
- `components/shared/` holds reusable UI components.
- The onboarding screens under `(onboarding)/` are stubs — none are wired to real data or navigation yet.
