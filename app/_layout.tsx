import { Stack } from "expo-router";

import { Lexend_400Regular, Lexend_700Bold } from "@expo-google-fonts/lexend";
import { Manrope_400Regular, Manrope_700Bold } from "@expo-google-fonts/manrope";
import { SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk";
import { WorkSans_400Regular, WorkSans_500Medium, WorkSans_700Bold } from "@expo-google-fonts/work-sans";
import { useFonts } from "expo-font";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import "@/global.css";
import { themes } from "@/utils/colorThemes";
import { View } from "react-native";


function RootLayoutInner() {
  const { theme } = useTheme();

  const [fontsLoaded] = useFonts({
    SpaceGrotesk_700Bold,
    SpaceGrotesk_500Medium,
    Manrope_400Regular,
    Manrope_700Bold,
    Lexend_400Regular,
    Lexend_700Bold,
    WorkSans_400Regular,
    WorkSans_700Bold,
    WorkSans_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={[{ flex: 1 }, themes[theme]]}
      className={`will-change-variable ${theme === "neon" ? "neon-theme" : ""}`}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  )
}


export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutInner />
    </ThemeProvider>
  )
}
