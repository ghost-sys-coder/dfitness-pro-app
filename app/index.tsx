import ThemeSwitcher from "@/components/shared/ThemeSwitcher";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { Easing } from "react-native-reanimated";

export default function Index() {
  const { isSolar } = useTheme();

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.4)).current;

  console.log("current theme:", isSolar ? "solar" : "neon");

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideUp, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineFade, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.4,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [buttonFade, fadeIn, glowPulse, slideUp, taglineFade]);

  return (
    <View className="flex-1 bg-background justify-between items-center px-8 pt-16 pb-16">

      {/* Background accent circles */}
      <View className="absolute inset-0 overflow-hidden">
        <Animated.View
          style={{ opacity: glowPulse }}
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/10"
        />
        <Animated.View
          style={{ opacity: glowPulse }}
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-secondary/10"
        />
      </View>

      {/* Top bar — theme switcher */}
      <Animated.View
        style={{ opacity: buttonFade }}
        className="w-full flex-row justify-end"
      >
        <ThemeSwitcher />
      </Animated.View>

      {/* Logo + headline */}
      <Animated.View
        style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}
        className="items-center gap-6"
      >
        {/* Icon mark */}
        <View className="w-20 h-20 rounded-2xl bg-surface-container border border-primary/30 items-center justify-center">
          <Text className="text-4xl">⚡</Text>
        </View>

        {/* App name */}
        <View className="items-center gap-1">
          <Text
            className="text-on-background text-5xl tracking-tight"
            style={{ fontFamily: "SpaceGrotesk_700Bold" }}
          >
            Dean&apos;s
          </Text>
          <Text
            className="text-primary text-5xl tracking-tight"
            style={{ fontFamily: "SpaceGrotesk_700Bold" }}
          >
            Fitness
          </Text>
        </View>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={{ opacity: taglineFade }} className="items-center gap-3">
        <View className="h-px w-12 bg-primary/40" />
        <Text
          className="text-on-surface-variant text-center text-lg leading-relaxed"
          style={{ fontFamily: "Manrope_400Regular" }}
        >
          Train harder.{"\n"}Recover smarter.{"\n"}Perform better.
        </Text>
        <View className="h-px w-12 bg-primary/40" />
      </Animated.View>

      {/* CTA buttons */}
      <Animated.View style={{ opacity: buttonFade }} className="w-full gap-4">
        <Pressable
          onPress={() => router.push("/(auth)/sign-up")}
          className="w-full bg-primary rounded-2xl py-4 items-center active:opacity-80"
        >
          <Text
            className="text-on-primary text-base font-semibold tracking-wide"
            style={{ fontFamily: "Manrope_700Bold" }}
          >
            Get Started
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(auth)/sign-in")}
          className="w-full bg-surface-container border border-outline-variant rounded-2xl py-4 items-center active:opacity-70"
        >
          <Text
            className="text-on-surface-variant text-base"
            style={{ fontFamily: "Manrope_400Regular" }}
          >
            I already have an account
          </Text>
        </Pressable>
      </Animated.View>

    </View>
  );
}