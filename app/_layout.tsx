import { tokenCache } from "@clerk/clerk-expo/secure-store";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { DSThemeProvider } from "@/design-system";
import { Lexend_400Regular, Lexend_700Bold } from "@expo-google-fonts/lexend";
import { Manrope_400Regular, Manrope_700Bold } from "@expo-google-fonts/manrope";
import { SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk";
import { WorkSans_400Regular, WorkSans_500Medium, WorkSans_700Bold } from "@expo-google-fonts/work-sans";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";

const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

SplashScreen.preventAutoHideAsync();

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

  const onLayout = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <ClerkLoaded>
        <Stack screenOptions={{ headerShown: false }} />
      </ClerkLoaded>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_KEY} tokenCache={tokenCache}>
      <DSThemeProvider>
        <RootLayoutInner />
      </DSThemeProvider>
    </ClerkProvider>
  );
}
