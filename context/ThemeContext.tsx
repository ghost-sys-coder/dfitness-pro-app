import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "neon" | "solar";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isSolar: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "solar",
    toggleTheme: () => { },
    isSolar: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("solar");

    // Load saved theme on app start
    useEffect(() => {
        const loadTheme = async () => {

            try {
                const saved = await AsyncStorage.getItem("theme");
                if (saved === "neon" || saved === "solar") {
                    setTheme(saved);
                } else {
                    setTheme("solar"); // default theme
                    await AsyncStorage.setItem("theme", "solar");
                }
            } catch {
                setTheme("solar"); //
            }

        };
        loadTheme();
    }, []);

    // Save theme whenever it changes
    const toggleTheme = async () => {
        const newTheme = theme === "neon" ? "solar" : "neon";
        setTheme(newTheme);
        await AsyncStorage.setItem("theme", newTheme);
    };

    return (
        <ThemeContext.Provider
            value={{ theme, toggleTheme, isSolar: theme === "solar" }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};