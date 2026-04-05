import OAuthButton from "@/components/auth/OAuthButton";
import { useDSTheme } from "@/design-system";
import { useSignIn } from "@clerk/clerk-expo";
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

export default function SignInScreen() {
  const { colors } = useDSTheme();
  const insets = useSafeAreaInsets();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocused]      = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const borderFor = (field: string) =>
    focusedField === field ? colors.primary : colors.outlineVariant;

  const handleSignIn = async () => {
    if (!isLoaded) return;
    setError("");

    if (!email.trim()) { setError("Email is required"); return; }
    if (!password)     { setError("Password is required"); return; }

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // index.tsx handles role-based redirect once user state updates
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? "Sign in failed. Check your credentials.");
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
            Welcome back
          </Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            Sign in to continue your journey
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
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Password</Text>
            <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
              <Text style={[styles.forgotLink, { color: colors.primary, fontFamily: "WorkSans_500Medium" }]}>
                Forgot password?
              </Text>
            </Pressable>
          </View>
          <View style={[styles.inputRow, { backgroundColor: colors.surfaceContainer, borderColor: borderFor("password") }]}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              placeholder="Your password"
              placeholderTextColor={colors.outlineVariant}
              secureTextEntry={!showPassword}
              autoComplete="current-password"
              style={[styles.inputFlex, { color: colors.onBackground, fontFamily: "WorkSans_400Regular" }]}
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.onSurfaceVariant} />
            </Pressable>
          </View>
        </View>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: `${colors.error}18`, borderColor: `${colors.error}40` }]}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
            <Text style={[styles.errorText, { color: colors.error, fontFamily: "WorkSans_400Regular" }]}>{error}</Text>
          </View>
        ) : null}

        {/* Sign in */}
        <Pressable
          onPress={handleSignIn}
          disabled={loading}
          style={({ pressed }) => [styles.cta, { backgroundColor: colors.primary, opacity: pressed || loading ? 0.8 : 1 }]}
        >
          {loading
            ? <ActivityIndicator color={colors.onPrimary} />
            : <Text style={[styles.ctaText, { color: colors.onPrimary, fontFamily: "WorkSans_700Bold" }]}>Sign In</Text>
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

        {/* Sign up link */}
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            New here?
          </Text>
          <Pressable onPress={() => router.replace("/(auth)/sign-up")}>
            <Text style={[styles.footerLink, { color: colors.primary, fontFamily: "WorkSans_700Bold" }]}>Create an account</Text>
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
  labelRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label:      { fontSize: 13, fontWeight: "500" },
  forgotLink: { fontSize: 13 },
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
