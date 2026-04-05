import StepHeader from "@/components/onboarding/StepHeader";
import { PreferredTime, useOnboarding } from "@/context/OnboardingContext";
import { useDSTheme, withOpacity } from "@/design-system";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DAYS = [1, 2, 3, 4, 5, 6, 7];

const TIMES: { value: PreferredTime; emoji: string; label: string; hint: string }[] = [
  { value: "morning",   emoji: "🌅", label: "Morning",   hint: "5 am – 11 am" },
  { value: "afternoon", emoji: "☀️",  label: "Afternoon", hint: "12 pm – 5 pm" },
  { value: "evening",   emoji: "🌆", label: "Evening",   hint: "6 pm – 10 pm" },
  { value: "flexible",  emoji: "🔄", label: "Flexible",  hint: "Whenever works" },
];

const DURATIONS = [
  { value: 30,  label: "30 min" },
  { value: 45,  label: "45 min" },
  { value: 60,  label: "1 hour" },
  { value: 90,  label: "90 min" },
];

export default function ScheduleScreen() {
  const { colors } = useDSTheme();
  const insets = useSafeAreaInsets();
  const { data, update } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.preferredTime) e.time = "Please choose a preferred time";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onContinue = () => {
    if (validate()) router.push("/(onboarding)/summary");
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StepHeader step={5} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Days per week */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
            How many days per week?
          </Text>
          <Text style={[styles.sectionSub, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            Be realistic — consistency beats intensity
          </Text>

          <View style={styles.daysRow}>
            {DAYS.map((d) => {
              const selected = data.daysPerWeek === d;
              return (
                <Pressable
                  key={d}
                  onPress={() => update({ daysPerWeek: d })}
                  style={[
                    styles.dayBtn,
                    {
                      backgroundColor: selected ? colors.primary : colors.surfaceContainer,
                      borderColor: selected ? colors.primary : colors.outlineVariant,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      {
                        color: selected ? colors.onPrimary : colors.onSurfaceVariant,
                        fontFamily: selected ? "WorkSans_700Bold" : "WorkSans_400Regular",
                      },
                    ]}
                  >
                    {d}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.daysNote, { color: colors.primary, fontFamily: "WorkSans_700Bold" }]}>
            {data.daysPerWeek} {data.daysPerWeek === 1 ? "day" : "days"} per week selected
          </Text>
        </View>

        {/* Preferred time */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
            Best time to train?
          </Text>

          <View style={styles.timeGrid}>
            {TIMES.map((t) => {
              const selected = data.preferredTime === t.value;
              return (
                <Pressable
                  key={t.value}
                  onPress={() => { update({ preferredTime: t.value }); setErrors({}); }}
                  style={[
                    styles.timeCard,
                    {
                      backgroundColor: selected ? withOpacity(colors.primary, 0.12) : colors.surfaceContainer,
                      borderColor: selected ? colors.primary : colors.outlineVariant,
                    },
                  ]}
                >
                  <Text style={styles.timeEmoji}>{t.emoji}</Text>
                  <Text style={[styles.timeLabel, { color: colors.onBackground, fontFamily: "WorkSans_700Bold" }]}>
                    {t.label}
                  </Text>
                  <Text style={[styles.timeHint, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
                    {t.hint}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {errors.time && <Text style={[styles.error, { color: colors.error }]}>{errors.time}</Text>}
        </View>

        {/* Session duration */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
            Session length
          </Text>

          <View style={styles.durationRow}>
            {DURATIONS.map((d) => {
              const selected = data.sessionDurationMinutes === d.value;
              return (
                <Pressable
                  key={d.value}
                  onPress={() => update({ sessionDurationMinutes: d.value })}
                  style={[
                    styles.durationBtn,
                    {
                      backgroundColor: selected ? colors.primary : colors.surfaceContainer,
                      borderColor: selected ? colors.primary : colors.outlineVariant,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.durationText,
                      {
                        color: selected ? colors.onPrimary : colors.onSurfaceVariant,
                        fontFamily: selected ? "WorkSans_700Bold" : "WorkSans_400Regular",
                      },
                    ]}
                  >
                    {d.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          onPress={onContinue}
          style={({ pressed }) => [styles.cta, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={[styles.ctaText, { color: colors.onPrimary, fontFamily: "WorkSans_700Bold" }]}>
            Review Summary
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1 },
  content:     { paddingHorizontal: 20, gap: 28 },
  section:     { gap: 12 },
  sectionTitle:{ fontSize: 20 },
  sectionSub:  { fontSize: 13, lineHeight: 20, marginTop: -6 },

  daysRow:  { flexDirection: "row", justifyContent: "space-between" },
  dayBtn:   { width: 42, height: 42, borderRadius: 21, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  dayText:  { fontSize: 16 },
  daysNote: { fontSize: 13, textAlign: "center" },

  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  timeCard: { width: "47%", borderWidth: 1.5, borderRadius: 14, padding: 14, alignItems: "center", gap: 4 },
  timeEmoji:{ fontSize: 26 },
  timeLabel:{ fontSize: 14 },
  timeHint: { fontSize: 11 },

  durationRow: { flexDirection: "row", gap: 10 },
  durationBtn: { flex: 1, borderWidth: 1.5, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  durationText:{ fontSize: 13 },

  error:   { fontSize: 11 },
  cta:     { borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  ctaText: { fontSize: 16 },
});
