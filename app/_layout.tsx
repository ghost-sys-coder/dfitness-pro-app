import { SplashScreen, Stack } from "expo-router";

import { Lexend_400Regular, Lexend_700Bold } from "@expo-google-fonts/lexend";
import { Manrope_400Regular, Manrope_700Bold } from "@expo-google-fonts/manrope";
import { SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk";
import { WorkSans_400Regular, WorkSans_500Medium, WorkSans_700Bold } from "@expo-google-fonts/work-sans";
import { useFonts } from "expo-font";

import { DSThemeProvider } from "@/design-system";
import { useCallback } from "react";
import { View } from "react-native";


SplashScreen.preventAutoHideAsync(); // keep splash screen visible until fonts are loaded


function RootLayoutInner() {
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

  // hide splash screen once fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // ❗ DO NOT render anything until fonts are ready
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}


export default function RootLayout() {
  return (
    <DSThemeProvider>
      <RootLayoutInner />
    </DSThemeProvider>
  );
}
