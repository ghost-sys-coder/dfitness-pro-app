import StepHeader from "@/components/onboarding/StepHeader";
import { ActivityLevel, FitnessLevel, useOnboarding } from "@/context/OnboardingContext";
import { useDSTheme, withOpacity } from "@/design-system";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FITNESS_LEVELS: { value: FitnessLevel; emoji: string; label: string; description: string }[] = [
  { value: "beginner",     emoji: "🌱", label: "Beginner",     description: "New to training or returning after a long break" },
  { value: "intermediate", emoji: "🔥", label: "Intermediate", description: "Train regularly and comfortable with most movements" },
  { value: "advanced",     emoji: "⚡", label: "Advanced",     description: "Intensive training with complex exercises" },
];

const ACTIVITY_LEVELS: { value: ActivityLevel; emoji: string; label: string; description: string }[] = [
  { value: "sedentary",          emoji: "🪑", label: "Sedentary",         description: "Mostly sitting, little to no exercise" },
  { value: "lightly_active",     emoji: "🚶", label: "Lightly Active",    description: "Light exercise 1–3 days per week" },
  { value: "moderately_active",  emoji: "🏃", label: "Moderately Active", description: "Moderate exercise 3–5 days per week" },
  { value: "very_active",        emoji: "💨", label: "Very Active",       description: "Hard training 6–7 days per week" },
];

export default function FitnessLevelScreen() {
  const { colors } = useDSTheme();
  const insets = useSafeAreaInsets();
  const { data, update } = useOnboarding();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const borderFor = (field: string) =>
    errors[field]
      ? colors.error
      : focusedField === field
      ? colors.primary
      : colors.outlineVariant;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.fitnessLevel)  e.fitnessLevel  = "Please select your fitness level";
    if (!data.activityLevel) e.activityLevel = "Please select your activity level";
    if (!data.heightCm.trim()) e.height      = "Height is required";
    if (!data.weightKg.trim()) e.weight      = "Weight is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onContinue = () => {
    if (validate()) router.push("/(onboarding)/preferences");
  };

  const renderOptions = <T extends string>(
    options: { value: T; emoji: string; label: string; description: string }[],
    selected: T | null,
    onSelect: (v: T) => void,
    errorKey: string
  ) => (
    <View style={styles.optionList}>
      {options.map((o) => {
        const active = selected === o.value;
        return (
          <Pressable
            key={o.value}
            onPress={() => { onSelect(o.value); setErrors((e) => ({ ...e, [errorKey]: "" })); }}
            style={[
              styles.optionCard,
              {
                backgroundColor: active ? withOpacity(colors.primary, 0.1) : colors.surfaceContainer,
                borderColor: active ? colors.primary : colors.outlineVariant,
              },
            ]}
          >
            <Text style={styles.optionEmoji}>{o.emoji}</Text>
            <View style={styles.optionText}>
              <Text style={[styles.optionLabel, { color: colors.onBackground, fontFamily: "WorkSans_700Bold" }]}>
                {o.label}
              </Text>
              <Text style={[styles.optionDesc, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
                {o.description}
              </Text>
            </View>
            <View
              style={[
                styles.radio,
                { borderColor: active ? colors.primary : colors.outlineVariant },
              ]}
            >
              {active && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StepHeader step={3} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Fitness level */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
            Your fitness level
          </Text>
          <Text style={[styles.sectionSub, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            Be honest — this helps us set the right intensity
          </Text>
          {renderOptions(
            FITNESS_LEVELS,
            data.fitnessLevel,
            (v) => update({ fitnessLevel: v }),
            "fitnessLevel"
          )}
          {errors.fitnessLevel && <Text style={[styles.error, { color: colors.error }]}>{errors.fitnessLevel}</Text>}
        </View>

        {/* Activity level */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
            Day-to-day activity
          </Text>
          <Text style={[styles.sectionSub, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            Outside of planned workouts
          </Text>
          {renderOptions(
            ACTIVITY_LEVELS,
            data.activityLevel,
            (v) => update({ activityLevel: v }),
            "activityLevel"
          )}
          {errors.activityLevel && <Text style={[styles.error, { color: colors.error }]}>{errors.activityLevel}</Text>}
        </View>

        {/* Body metrics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
            Body metrics
          </Text>
          <Text style={[styles.sectionSub, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            Used to calculate calorie targets and progress
          </Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricField}>
              <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Height</Text>
              <View style={[styles.metricInput, { backgroundColor: colors.surfaceContainer, borderColor: borderFor("height") }]}>
                <TextInput
                  value={data.heightCm}
                  onChangeText={(v) => update({ heightCm: v })}
                  onFocus={() => setFocusedField("height")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="175"
                  placeholderTextColor={colors.outlineVariant}
                  keyboardType="numeric"
                  style={[styles.metricText, { color: colors.onBackground, fontFamily: "WorkSans_400Regular" }]}
                />
                <Text style={[styles.unit, { color: colors.onSurfaceVariant }]}>cm</Text>
              </View>
              {errors.height && <Text style={[styles.error, { color: colors.error }]}>{errors.height}</Text>}
            </View>

            <View style={styles.metricField}>
              <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Weight</Text>
              <View style={[styles.metricInput, { backgroundColor: colors.surfaceContainer, borderColor: borderFor("weight") }]}>
                <TextInput
                  value={data.weightKg}
                  onChangeText={(v) => update({ weightKg: v })}
                  onFocus={() => setFocusedField("weight")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="80"
                  placeholderTextColor={colors.outlineVariant}
                  keyboardType="numeric"
                  style={[styles.metricText, { color: colors.onBackground, fontFamily: "WorkSans_400Regular" }]}
                />
                <Text style={[styles.unit, { color: colors.onSurfaceVariant }]}>kg</Text>
              </View>
              {errors.weight && <Text style={[styles.error, { color: colors.error }]}>{errors.weight}</Text>}
            </View>
          </View>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content:     { paddingHorizontal: 20, gap: 24 },
  section:     { gap: 12 },
  sectionTitle:{ fontSize: 20 },
  sectionSub:  { fontSize: 13, lineHeight: 20, marginTop: -6 },
  optionList:  { gap: 10 },
  optionCard:  { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1.5, borderRadius: 14, padding: 14 },
  optionEmoji: { fontSize: 24, width: 32, textAlign: "center" },
  optionText:  { flex: 1, gap: 2 },
  optionLabel: { fontSize: 15 },
  optionDesc:  { fontSize: 12, lineHeight: 18 },
  radio:       { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot:    { width: 10, height: 10, borderRadius: 5 },
  metricsRow:  { flexDirection: "row", gap: 12 },
  metricField: { flex: 1, gap: 6 },
  label:       { fontSize: 13, fontWeight: "500" },
  metricInput: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4 },
  metricText:  { flex: 1, fontSize: 15, paddingVertical: 9 },
  unit:        { fontSize: 13, fontWeight: "600" },
  error:       { fontSize: 11 },
  cta:         { borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  ctaText:     { fontSize: 16 },
});
