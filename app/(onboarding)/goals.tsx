import StepHeader from "@/components/onboarding/StepHeader";
import { Goal, useOnboarding } from "@/context/OnboardingContext";
import { useDSTheme, withOpacity } from "@/design-system";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GOALS: { value: Goal; emoji: string; label: string; description: string }[] = [
  { value: "lose_weight",         emoji: "🔥", label: "Lose Weight",          description: "Burn fat and get leaner" },
  { value: "build_muscle",        emoji: "💪", label: "Build Muscle",          description: "Gain strength and size" },
  { value: "improve_endurance",   emoji: "🏃", label: "Improve Endurance",     description: "Go further for longer" },
  { value: "increase_flexibility",emoji: "🧘", label: "Increase Flexibility",  description: "Move better, feel better" },
  { value: "general_fitness",     emoji: "⚡", label: "General Fitness",        description: "Stay active and healthy" },
  { value: "sport_performance",   emoji: "🏆", label: "Sport Performance",     description: "Train for your sport" },
];

export default function GoalsScreen() {
  const { colors } = useDSTheme();
  const insets = useSafeAreaInsets();
  const { data, toggleGoal } = useOnboarding();
  const [error, setError] = useState("");

  const onContinue = () => {
    if (data.goals.length === 0) {
      setError("Pick at least one goal to continue");
      return;
    }
    setError("");
    router.push("/(onboarding)/fitness-level");
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StepHeader step={2} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heading}>
          <Text style={[styles.title, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
            What are your goals?
          </Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            Select everything that applies — we&apos;ll build around them
          </Text>
        </View>

        <View style={styles.grid}>
          {GOALS.map((g) => {
            const selected = data.goals.includes(g.value);
            return (
              <Pressable
                key={g.value}
                onPress={() => { toggleGoal(g.value); setError(""); }}
                style={[
                  styles.card,
                  {
                    backgroundColor: selected ? withOpacity(colors.primary, 0.1) : colors.surfaceContainer,
                    borderColor: selected ? colors.primary : colors.outlineVariant,
                  },
                ]}
              >
                {selected && (
                  <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                    <Ionicons name="checkmark" size={11} color={colors.onPrimary} />
                  </View>
                )}
                <Text style={styles.goalEmoji}>{g.emoji}</Text>
                <Text style={[styles.goalLabel, { color: colors.onBackground, fontFamily: "WorkSans_700Bold" }]}>
                  {g.label}
                </Text>
                <Text style={[styles.goalDesc, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
                  {g.description}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {error ? (
          <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
        ) : null}

        <Pressable
          onPress={onContinue}
          style={({ pressed }) => [styles.cta, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={[styles.ctaText, { color: colors.onPrimary, fontFamily: "WorkSans_700Bold" }]}>
            Continue
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1 },
  content:   { paddingHorizontal: 20, gap: 20 },
  heading:   { gap: 6 },
  title:     { fontSize: 26 },
  subtitle:  { fontSize: 14, lineHeight: 22 },
  grid:      { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card:      { width: "47%", borderWidth: 1.5, borderRadius: 16, padding: 14, gap: 6 },
  checkmark: { position: "absolute", top: 10, right: 10, width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  goalEmoji: { fontSize: 28 },
  goalLabel: { fontSize: 14 },
  goalDesc:  { fontSize: 11, lineHeight: 16 },
  error:     { fontSize: 13, textAlign: "center" },
  cta:       { borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  ctaText:   { fontSize: 16 },
});
