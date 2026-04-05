import StepHeader from "@/components/onboarding/StepHeader";
import { WorkoutLocation, WorkoutType, useOnboarding } from "@/context/OnboardingContext";
import { useDSTheme, withOpacity } from "@/design-system";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WORKOUT_TYPES: { value: WorkoutType; emoji: string; label: string }[] = [
  { value: "strength",  emoji: "🏋️", label: "Strength" },
  { value: "cardio",    emoji: "🏃", label: "Cardio" },
  { value: "hiit",      emoji: "⚡", label: "HIIT" },
  { value: "yoga",      emoji: "🧘", label: "Yoga" },
  { value: "pilates",   emoji: "🤸", label: "Pilates" },
  { value: "crossfit",  emoji: "🔗", label: "CrossFit" },
  { value: "running",   emoji: "👟", label: "Running" },
  { value: "swimming",  emoji: "🏊", label: "Swimming" },
];

const LOCATIONS: { value: WorkoutLocation; emoji: string; label: string; description: string }[] = [
  { value: "gym",  emoji: "🏋️", label: "Gym",      description: "Full equipment available" },
  { value: "home", emoji: "🏠", label: "Home",     description: "Minimal or no equipment" },
  { value: "both", emoji: "🔄", label: "Both",     description: "Mix of gym and home sessions" },
];

export default function PreferencesScreen() {
  const { colors } = useDSTheme();
  const insets = useSafeAreaInsets();
  const { data, update, toggleWorkoutType } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (data.workoutTypes.length === 0) e.types    = "Pick at least one workout type";
    if (!data.workoutLocation)          e.location = "Please choose a workout location";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onContinue = () => {
    if (validate()) router.push("/(onboarding)/schedule");
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StepHeader step={4} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Workout types */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
            Workout types
          </Text>
          <Text style={[styles.sectionSub, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            Pick everything you enjoy or want to try
          </Text>

          <View style={styles.typeGrid}>
            {WORKOUT_TYPES.map((t) => {
              const selected = data.workoutTypes.includes(t.value);
              return (
                <Pressable
                  key={t.value}
                  onPress={() => { toggleWorkoutType(t.value); setErrors((e) => ({ ...e, types: "" })); }}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor: selected ? withOpacity(colors.primary, 0.12) : colors.surfaceContainer,
                      borderColor: selected ? colors.primary : colors.outlineVariant,
                    },
                  ]}
                >
                  {selected && (
                    <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                      <Ionicons name="checkmark" size={10} color={colors.onPrimary} />
                    </View>
                  )}
                  <Text style={styles.typeEmoji}>{t.emoji}</Text>
                  <Text
                    style={[
                      styles.typeLabel,
                      {
                        color: selected ? colors.primary : colors.onBackground,
                        fontFamily: selected ? "WorkSans_700Bold" : "WorkSans_400Regular",
                      },
                    ]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {errors.types && <Text style={[styles.error, { color: colors.error }]}>{errors.types}</Text>}
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
            Where do you train?
          </Text>

          <View style={styles.locationList}>
            {LOCATIONS.map((l) => {
              const selected = data.workoutLocation === l.value;
              return (
                <Pressable
                  key={l.value}
                  onPress={() => { update({ workoutLocation: l.value }); setErrors((e) => ({ ...e, location: "" })); }}
                  style={[
                    styles.locationCard,
                    {
                      backgroundColor: selected ? withOpacity(colors.primary, 0.1) : colors.surfaceContainer,
                      borderColor: selected ? colors.primary : colors.outlineVariant,
                    },
                  ]}
                >
                  <Text style={styles.locationEmoji}>{l.emoji}</Text>
                  <View style={styles.locationText}>
                    <Text style={[styles.locationLabel, { color: colors.onBackground, fontFamily: "WorkSans_700Bold" }]}>
                      {l.label}
                    </Text>
                    <Text style={[styles.locationDesc, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
                      {l.description}
                    </Text>
                  </View>
                  <View style={[styles.radio, { borderColor: selected ? colors.primary : colors.outlineVariant }]}>
                    {selected && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
          {errors.location && <Text style={[styles.error, { color: colors.error }]}>{errors.location}</Text>}
        </View>

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
  screen:        { flex: 1 },
  content:       { paddingHorizontal: 20, gap: 24 },
  section:       { gap: 12 },
  sectionTitle:  { fontSize: 20 },
  sectionSub:    { fontSize: 13, lineHeight: 20, marginTop: -6 },

  typeGrid:  { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeChip:  { width: "22%", flexGrow: 1, borderWidth: 1.5, borderRadius: 14, padding: 12, alignItems: "center", gap: 6, minWidth: 72 },
  checkmark: { position: "absolute", top: 7, right: 7, width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  typeEmoji: { fontSize: 24 },
  typeLabel: { fontSize: 12, textAlign: "center" },

  locationList: { gap: 10 },
  locationCard: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1.5, borderRadius: 14, padding: 14 },
  locationEmoji:{ fontSize: 22, width: 30, textAlign: "center" },
  locationText: { flex: 1, gap: 2 },
  locationLabel:{ fontSize: 15 },
  locationDesc: { fontSize: 12 },
  radio:        { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot:     { width: 10, height: 10, borderRadius: 5 },

  error:   { fontSize: 11 },
  cta:     { borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  ctaText: { fontSize: 16 },
});
