import StepHeader from "@/components/onboarding/StepHeader";
import { useOnboarding } from "@/context/OnboardingContext";
import { useDSTheme } from "@/design-system";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Human-readable display helpers
const GOAL_LABELS: Record<string, string> = {
  lose_weight: "Lose Weight", build_muscle: "Build Muscle",
  improve_endurance: "Improve Endurance", increase_flexibility: "Increase Flexibility",
  general_fitness: "General Fitness", sport_performance: "Sport Performance",
};
const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced",
};
const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: "Sedentary", lightly_active: "Lightly Active",
  moderately_active: "Moderately Active", very_active: "Very Active",
};
const LOCATION_LABELS: Record<string, string> = {
  gym: "Gym", home: "Home", both: "Gym & Home",
};
const TIME_LABELS: Record<string, string> = {
  morning: "Morning", afternoon: "Afternoon", evening: "Evening", flexible: "Flexible",
};
const TYPE_LABELS: Record<string, string> = {
  strength: "Strength", cardio: "Cardio", hiit: "HIIT",
  yoga: "Yoga", pilates: "Pilates", crossfit: "CrossFit",
  running: "Running", swimming: "Swimming",
};

interface SummaryRowProps {
  icon: string;
  label: string;
  value: string;
}

function SummaryRow({ icon, label, value }: SummaryRowProps) {
  const { colors } = useDSTheme();
  return (
    <View style={[summaryRowStyles.row, { borderBottomColor: colors.outlineVariant }]}>
      <Text style={summaryRowStyles.icon}>{icon}</Text>
      <Text style={[summaryRowStyles.label, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
        {label}
      </Text>
      <Text style={[summaryRowStyles.value, { color: colors.onBackground, fontFamily: "WorkSans_700Bold" }]}>
        {value}
      </Text>
    </View>
  );
}

const summaryRowStyles = StyleSheet.create({
  row:   { flexDirection: "row", alignItems: "flex-start", paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, gap: 10 },
  icon:  { fontSize: 16, width: 22, textAlign: "center", marginTop: 1 },
  label: { flex: 1, fontSize: 13 },
  value: { fontSize: 13, flexShrink: 1, textAlign: "right", maxWidth: "55%" },
});

export default function SummaryScreen() {
  const { colors } = useDSTheme();
  const insets = useSafeAreaInsets();
  const { data, submitOnboarding, isSubmitting } = useOnboarding();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StepHeader step={6} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.heading}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={[styles.title, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
            You&apos;re all set{data.firstName ? `, ${data.firstName}` : ""}!
          </Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            Here&apso;s a summary of your profile. You can always update this in settings.
          </Text>
        </View>

        {/* Personal */}
        <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-outline" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
              Personal
            </Text>
          </View>
          <SummaryRow icon="👤" label="Name"     value={`${data.firstName} ${data.lastName}`} />
          <SummaryRow icon="🎂" label="DOB"      value={data.dateOfBirth || "—"} />
          <SummaryRow icon="⚤"  label="Gender"   value={data.gender?.replace(/_/g, " ") ?? "—"} />
          <SummaryRow icon="📏" label="Height"   value={data.heightCm ? `${data.heightCm} cm` : "—"} />
          <SummaryRow icon="⚖️" label="Weight"   value={data.weightKg ? `${data.weightKg} kg` : "—"} />
        </View>

        {/* Goals & Fitness */}
        <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="flag-outline" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
              Goals & Fitness
            </Text>
          </View>
          <SummaryRow icon="🎯" label="Goals"          value={data.goals.map((g) => GOAL_LABELS[g]).join(", ") || "—"} />
          <SummaryRow icon="🔥" label="Fitness level"  value={data.fitnessLevel ? LEVEL_LABELS[data.fitnessLevel] : "—"} />
          <SummaryRow icon="🚶" label="Activity level" value={data.activityLevel ? ACTIVITY_LABELS[data.activityLevel] : "—"} />
        </View>

        {/* Preferences */}
        <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="options-outline" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
              Preferences
            </Text>
          </View>
          <SummaryRow icon="💪" label="Workout types" value={data.workoutTypes.map((t) => TYPE_LABELS[t]).join(", ") || "—"} />
          <SummaryRow icon="📍" label="Location"      value={data.workoutLocation ? LOCATION_LABELS[data.workoutLocation] : "—"} />
        </View>

        {/* Schedule */}
        <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar-outline" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
              Schedule
            </Text>
          </View>
          <SummaryRow icon="📅" label="Days per week"     value={`${data.daysPerWeek} days`} />
          <SummaryRow icon="⏰" label="Preferred time"    value={data.preferredTime ? TIME_LABELS[data.preferredTime] : "—"} />
          <SummaryRow icon="⏱️" label="Session duration"  value={`${data.sessionDurationMinutes} min`} />
        </View>

        {/* Submit */}
        <Pressable
          onPress={submitOnboarding}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: colors.primary, opacity: pressed || isSubmitting ? 0.8 : 1 },
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.onPrimary} />
              <Text style={[styles.ctaText, { color: colors.onPrimary, fontFamily: "WorkSans_700Bold" }]}>
                Complete Setup
              </Text>
            </>
          )}
        </Pressable>

        <Text style={[styles.footerNote, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
          Your data is only used to personalise your training experience.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1 },
  content:    { paddingHorizontal: 20, gap: 16 },
  heading:    { alignItems: "center", gap: 8, paddingVertical: 4 },
  emoji:      { fontSize: 44 },
  title:      { fontSize: 24, textAlign: "center" },
  subtitle:   { fontSize: 13, textAlign: "center", lineHeight: 20 },
  card:       { borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 2 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  cardTitle:  { fontSize: 15 },
  cta:        { borderRadius: 14, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 },
  ctaText:    { fontSize: 16 },
  footerNote: { fontSize: 12, textAlign: "center", lineHeight: 18 },
});
