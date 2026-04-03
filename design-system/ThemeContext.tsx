import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ColorScheme, ThemeName, themeMap } from "./themes";

interface DSThemeContextType {
  themeName: ThemeName;
  colors: ColorScheme;
  setTheme: (name: ThemeName) => void;
}

// Separate AsyncStorage key — does not collide with the NativeWind system's "theme" key
const STORAGE_KEY = "ds_theme";

const DSThemeContext = createContext<DSThemeContextType>({
  themeName: "solar",
  colors: themeMap.solar,
  setTheme: () => {},
});

export function DSThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>("solar");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved && saved in themeMap) {
        setThemeName(saved as ThemeName);
      }
    });
  }, []);

  const setTheme = async (name: ThemeName) => {
    setThemeName(name);
    await AsyncStorage.setItem(STORAGE_KEY, name);
  };

  return (
    <DSThemeContext.Provider value={{ themeName, colors: themeMap[themeName], setTheme }}>
      {children}
    </DSThemeContext.Provider>
  );
}

export const useDSTheme = () => {
  const ctx = useContext(DSThemeContext);
  if (!ctx) throw new Error("useDSTheme must be used within DSThemeProvider");
  return ctx;
};
