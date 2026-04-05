import DatePicker from "@/components/onboarding/DatePicker";
import StepHeader from "@/components/onboarding/StepHeader";
import type { Gender } from "@/context/OnboardingContext";
import { useOnboarding } from "@/context/OnboardingContext";
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

const GENDERS: { value: Gender; label: string }[] = [
  { value: "male",              label: "Male" },
  { value: "female",            label: "Female" },
  { value: "non_binary",        label: "Non-binary" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export default function WelcomeScreen() {
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
    if (!data.firstName.trim()) e.firstName = "First name is required";
    if (!data.lastName.trim())  e.lastName  = "Last name is required";
    if (!data.gender)           e.gender    = "Please select your gender";
    if (!data.dateOfBirth)      e.dob       = "Date of birth is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onContinue = () => {
    if (validate()) router.push("/(onboarding)/goals");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StepHeader step={1} canGoBack={false} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Heading */}
        <View style={styles.heading}>
          <Text style={styles.emoji}>👋</Text>
          <Text style={[styles.title, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
            Let&apos;s get to know you
          </Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            We&apos;ll use this to personalise your fitness experience
          </Text>
        </View>

        {/* Name row */}
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>First name</Text>
            <TextInput
              value={data.firstName}
              onChangeText={(v) => update({ firstName: v })}
              onFocus={() => setFocusedField("firstName")}
              onBlur={() => setFocusedField(null)}
              placeholder="e.g. Dean"
              placeholderTextColor={colors.outlineVariant}
              autoCapitalize="words"
              style={[styles.input, { backgroundColor: colors.surfaceContainer, borderColor: borderFor("firstName"), color: colors.onBackground, fontFamily: "WorkSans_400Regular" }]}
            />
            {errors.firstName && <Text style={[styles.error, { color: colors.error }]}>{errors.firstName}</Text>}
          </View>

          <View style={styles.halfField}>
            <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Last name</Text>
            <TextInput
              value={data.lastName}
              onChangeText={(v) => update({ lastName: v })}
              onFocus={() => setFocusedField("lastName")}
              onBlur={() => setFocusedField(null)}
              placeholder="e.g. Mitchell"
              placeholderTextColor={colors.outlineVariant}
              autoCapitalize="words"
              style={[styles.input, { backgroundColor: colors.surfaceContainer, borderColor: borderFor("lastName"), color: colors.onBackground, fontFamily: "WorkSans_400Regular" }]}
            />
            {errors.lastName && <Text style={[styles.error, { color: colors.error }]}>{errors.lastName}</Text>}
          </View>
        </View>

        {/* Date of birth */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Date of birth</Text>
          <DatePicker
            value={data.dateOfBirth}
            onChange={(iso) => { update({ dateOfBirth: iso }); setErrors((e) => ({ ...e, dob: "" })); }}
            placeholder="Select your date of birth"
            hasError={!!errors.dob}
          />
          {errors.dob && <Text style={[styles.error, { color: colors.error }]}>{errors.dob}</Text>}
        </View>

        {/* Gender */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Gender</Text>
          <View style={styles.genderGrid}>
            {GENDERS.map((g) => {
              const selected = data.gender === g.value;
              return (
                <Pressable
                  key={g.value}
                  onPress={() => update({ gender: g.value })}
                  style={[
                    styles.genderChip,
                    {
                      backgroundColor: selected ? withOpacity(colors.primary, 0.12) : colors.surfaceContainer,
                      borderColor: selected ? colors.primary : colors.outlineVariant,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.genderText,
                      {
                        color: selected ? colors.primary : colors.onSurfaceVariant,
                        fontFamily: selected ? "WorkSans_700Bold" : "WorkSans_400Regular",
                      },
                    ]}
                  >
                    {g.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {errors.gender && <Text style={[styles.error, { color: colors.error }]}>{errors.gender}</Text>}
        </View>

        {/* Continue */}
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
  content:    { paddingHorizontal: 20, gap: 20 },
  heading:    { alignItems: "center", gap: 8, paddingVertical: 8 },
  emoji:      { fontSize: 48 },
  title:      { fontSize: 26, textAlign: "center" },
  subtitle:   { fontSize: 14, textAlign: "center", lineHeight: 22 },
  row:        { flexDirection: "row", gap: 12 },
  halfField:  { flex: 1, gap: 6 },
  field:      { gap: 6 },
  label:      { fontSize: 13, fontWeight: "500" },
  input:      { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15 },
  error:      { fontSize: 11 },
  genderGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  genderChip: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  genderText: { fontSize: 14 },
  cta:        { borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  ctaText:    { fontSize: 16 },
});
