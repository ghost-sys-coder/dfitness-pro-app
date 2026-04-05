import OAuthButton from "@/components/auth/OAuthButton";
import { useDSTheme } from "@/design-system";
import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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

export default function SignUpScreen() {
  const { colors } = useDSTheme();
  const insets = useSafeAreaInsets();
  const { signUp, isLoaded } = useSignUp();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirm]   = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [focusedField, setFocused]      = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const borderFor = (field: string) =>
    focusedField === field ? colors.primary : colors.outlineVariant;

  const handleSignUp = async () => {
    if (!isLoaded) return;
    setError("");

    if (!email.trim())       { setError("Email is required"); return; }
    if (!password)           { setError("Password is required"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }

    setLoading(true);
    try {
      await signUp.create({ emailAddress: email.trim(), password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      router.push("/(auth)/verify-email");
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}
        >
          <Ionicons name="chevron-back" size={20} color={colors.onBackground} />
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoEmoji}>⚡</Text>
          <Text style={[styles.title, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
            Create your account
          </Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            Start your fitness journey today
          </Text>
        </View>

        {/* Email */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Email address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            placeholder="you@example.com"
            placeholderTextColor={colors.outlineVariant}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            style={[styles.input, { backgroundColor: colors.surfaceContainer, borderColor: borderFor("email"), color: colors.onBackground, fontFamily: "WorkSans_400Regular" }]}
          />
        </View>

        {/* Password */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Password</Text>
          <View style={[styles.inputRow, { backgroundColor: colors.surfaceContainer, borderColor: borderFor("password") }]}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              placeholder="Min. 8 characters"
              placeholderTextColor={colors.outlineVariant}
              secureTextEntry={!showPassword}
              autoComplete="new-password"
              style={[styles.inputFlex, { color: colors.onBackground, fontFamily: "WorkSans_400Regular" }]}
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.onSurfaceVariant} />
            </Pressable>
          </View>
        </View>

        {/* Confirm password */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Confirm password</Text>
          <View style={[styles.inputRow, { backgroundColor: colors.surfaceContainer, borderColor: borderFor("confirm") }]}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirm}
              onFocus={() => setFocused("confirm")}
              onBlur={() => setFocused(null)}
              placeholder="Repeat your password"
              placeholderTextColor={colors.outlineVariant}
              secureTextEntry={!showConfirm}
              autoComplete="new-password"
              style={[styles.inputFlex, { color: colors.onBackground, fontFamily: "WorkSans_400Regular" }]}
            />
            <Pressable onPress={() => setShowConfirm((v) => !v)} hitSlop={8}>
              <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={20} color={colors.onSurfaceVariant} />
            </Pressable>
          </View>
        </View>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: `${colors.error}18`, borderColor: `${colors.error}40` }]}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
            <Text style={[styles.errorText, { color: colors.error, fontFamily: "WorkSans_400Regular" }]}>{error}</Text>
          </View>
        ) : null}

        {/* Sign up */}
        <Pressable
          onPress={handleSignUp}
          disabled={loading}
          style={({ pressed }) => [styles.cta, { backgroundColor: colors.primary, opacity: pressed || loading ? 0.8 : 1 }]}
        >
          {loading
            ? <ActivityIndicator color={colors.onPrimary} />
            : <Text style={[styles.ctaText, { color: colors.onPrimary, fontFamily: "WorkSans_700Bold" }]}>Create Account</Text>
          }
        </Pressable>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.outlineVariant }]} />
          <Text style={[styles.dividerText, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>or continue with</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.outlineVariant }]} />
        </View>

        {/* OAuth */}
        <OAuthButton strategy="oauth_google" label="Continue with Google" />
        {Platform.OS === "ios" && (
          <OAuthButton strategy="oauth_apple" label="Continue with Apple" />
        )}

        {/* Sign in link */}
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            Already have an account?
          </Text>
          <Pressable onPress={() => router.replace("/(auth)/sign-in")}>
            <Text style={[styles.footerLink, { color: colors.primary, fontFamily: "WorkSans_700Bold" }]}>Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content:    { paddingHorizontal: 24, gap: 16 },
  backBtn:    { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: "center", justifyContent: "center", alignSelf: "flex-start" },
  header:     { alignItems: "center", gap: 8, paddingVertical: 8 },
  logoEmoji:  { fontSize: 36 },
  title:      { fontSize: 26, textAlign: "center" },
  subtitle:   { fontSize: 14, textAlign: "center" },
  field:      { gap: 6 },
  label:      { fontSize: 13, fontWeight: "500" },
  input:      { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15 },
  inputRow:   { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 14 },
  inputFlex:  { flex: 1, fontSize: 15, paddingVertical: 13 },
  errorBox:   { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 10, padding: 12 },
  errorText:  { flex: 1, fontSize: 13, lineHeight: 18 },
  cta:        { borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  ctaText:    { fontSize: 16 },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  dividerLine:{ flex: 1, height: 1 },
  dividerText:{ fontSize: 13 },
  footerRow:  { flexDirection: "row", justifyContent: "center", gap: 6 },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14 },
});
