import { DSThemeSwitcher, useDSTheme, withOpacity } from "@/design-system";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Easing } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { colors } = useDSTheme();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  // Redirect signed-in users — don't show landing screen to them
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    // Backend (Node.js + NeonDB) sets these in publicMetadata via webhooks.
    // Until backend is live, we fall back to unsafeMetadata set client-side.
    const role = (
      user.publicMetadata?.role ??
      user.unsafeMetadata?.role ??
      "client"
    ) as string;

    const onboardingComplete = (
      user.publicMetadata?.onboardingComplete ??
      user.unsafeMetadata?.onboardingComplete ??
      false
    ) as boolean;

    if (role === "trainer") { router.replace("/(trainer)"); return; }
    if (role === "admin")   { router.replace("/(admin)");   return; }

    // client
    router.replace(onboardingComplete ? "/(tabs)/home" : "/(onboarding)/welcome");
  }, [isLoaded, isSignedIn, user]);

  const fadeIn      = useRef(new Animated.Value(0)).current;
  const slideUp     = useRef(new Animated.Value(40)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const buttonFade  = useRef(new Animated.Value(0)).current;
  const glowPulse   = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeIn,  { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(slideUp, { toValue: 0, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.timing(taglineFade, { toValue: 1, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(buttonFade,  { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1,   duration: 2000, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.4, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, [buttonFade, fadeIn, glowPulse, slideUp, taglineFade]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={StyleSheet.absoluteFillObject}>
        <Animated.View style={[styles.glowTopRight,   { backgroundColor: withOpacity(colors.primary,   0.1), opacity: glowPulse }]} />
        <Animated.View style={[styles.glowBottomLeft, { backgroundColor: withOpacity(colors.secondary, 0.1), opacity: glowPulse }]} />
      </View>

      <Animated.View style={[styles.topBar, { opacity: buttonFade }]}>
        <DSThemeSwitcher />
      </Animated.View>

      <Animated.View style={[styles.logoSection, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
        <View style={[styles.iconMark, { backgroundColor: colors.surfaceContainer, borderColor: withOpacity(colors.primary, 0.3) }]}>
          <Text style={styles.iconEmoji}>⚡</Text>
        </View>
        <View style={styles.appNameContainer}>
          <Text style={[styles.appName, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>Dean&apos;s</Text>
          <Text style={[styles.appName, { color: colors.primary,      fontFamily: "SpaceGrotesk_700Bold" }]}>Fitness</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.taglineSection, { opacity: taglineFade }]}>
        <View style={[styles.divider, { backgroundColor: withOpacity(colors.primary, 0.4) }]} />
        <Text style={[styles.tagline, { color: colors.onSurfaceVariant, fontFamily: "Manrope_400Regular" }]}>
          Train harder.{"\n"}Recover smarter.{"\n"}Perform better.
        </Text>
        <View style={[styles.divider, { backgroundColor: withOpacity(colors.primary, 0.4) }]} />
      </Animated.View>

      <Animated.View style={[styles.buttonSection, { opacity: buttonFade }]}>
        <Pressable
          onPress={() => router.push("/(auth)/sign-up")}
          style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }]}
        >
          <Text style={[styles.primaryButtonText, { color: colors.onPrimary, fontFamily: "Manrope_700Bold" }]}>
            Get Started
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(auth)/sign-in")}
          style={({ pressed }) => [styles.secondaryButton, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant, opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.onSurfaceVariant, fontFamily: "Manrope_400Regular" }]}>
            I already have an account
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, justifyContent: "space-between", alignItems: "center", paddingHorizontal: 32, paddingTop: 16, paddingBottom: 40 },
  glowTopRight:   { position: "absolute", top: -128, right: -128, width: 320, height: 320, borderRadius: 160 },
  glowBottomLeft: { position: "absolute", bottom: -80, left: -80, width: 256, height: 256, borderRadius: 128 },
  topBar:         { width: "100%", flexDirection: "row", justifyContent: "flex-end" },
  logoSection:    { alignItems: "center", gap: 24 },
  iconMark:       { width: 80, height: 80, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  iconEmoji:      { fontSize: 36 },
  appNameContainer:{ alignItems: "center", gap: 4 },
  appName:        { fontSize: 48, letterSpacing: -1 },
  taglineSection: { alignItems: "center", gap: 12 },
  divider:        { height: 1, width: 48 },
  tagline:        { textAlign: "center", fontSize: 18, lineHeight: 28 },
  buttonSection:  { width: "100%", gap: 16 },
  primaryButton:  { width: "100%", borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  primaryButtonText:  { fontSize: 16, fontWeight: "600", letterSpacing: 0.5 },
  secondaryButton:    { width: "100%", borderRadius: 16, borderWidth: 1, paddingVertical: 16, alignItems: "center" },
  secondaryButtonText:{ fontSize: 16 },
});
