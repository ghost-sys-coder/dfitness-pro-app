import { useDSTheme, withOpacity } from "@/design-system";
import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
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

const CODE_LENGTH = 6;

type Step = "email" | "reset";

export default function ForgotPasswordScreen() {
  const { colors } = useDSTheme();
  const insets = useSafeAreaInsets();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [step, setStep]                 = useState<Step>("email");
  const [email, setEmail]               = useState("");
  const [code, setCode]                 = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirm]   = useState("");
  const [showPassword, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [focusedField, setFocused]      = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [successMsg, setSuccessMsg]     = useState("");
  const codeInputRef = useRef<TextInput>(null);

  const borderFor = (field: string) =>
    focusedField === field ? colors.primary : colors.outlineVariant;

  // Step 1 — send reset code to email
  const handleSendCode = async () => {
    if (!isLoaded) return;
    if (!email.trim()) { setError("Email is required"); return; }
    setError("");
    setLoading(true);
    try {
      await signIn!.create({
        strategy: "reset_password_email_code",
        identifier: email.trim(),
      });
      setSuccessMsg(`Code sent to ${email.trim()}`);
      setStep("reset");
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? "Could not find an account with that email.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify code + set new password
  const handleReset = async () => {
    if (!isLoaded) return;
    if (code.length < CODE_LENGTH) { setError("Enter the 6-digit code"); return; }
    if (!password)                 { setError("New password is required"); return; }
    if (password !== confirmPassword) { setError("Passwords don't match"); return; }
    setError("");
    setLoading(true);
    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // index.tsx handles role-based redirect
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? "Invalid code or password. Please try again.");
      setCode("");
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
          onPress={() => step === "reset" ? setStep("email") : router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}
        >
          <Ionicons name="chevron-back" size={20} color={colors.onBackground} />
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: withOpacity(colors.primary, 0.12) }]}>
            <Ionicons
              name={step === "email" ? "lock-open-outline" : "key-outline"}
              size={32}
              color={colors.primary}
            />
          </View>
          <Text style={[styles.title, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
            {step === "email" ? "Forgot password?" : "Reset password"}
          </Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            {step === "email"
              ? "Enter your email and we'll send you a reset code"
              : `Enter the code sent to\n`}
            {step === "reset" && (
              <Text style={[styles.emailHighlight, { color: colors.onBackground, fontFamily: "WorkSans_700Bold" }]}>
                {email}
              </Text>
            )}
          </Text>
        </View>

        {/* ── Step 1: Email ── */}
        {step === "email" && (
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
        )}

        {/* ── Step 2: Code + New Password ── */}
        {step === "reset" && (
          <>
            {/* Success banner */}
            {successMsg ? (
              <View style={[styles.successBox, { backgroundColor: withOpacity(colors.primary, 0.1), borderColor: withOpacity(colors.primary, 0.3) }]}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />
                <Text style={[styles.successText, { color: colors.primary, fontFamily: "WorkSans_400Regular" }]}>{successMsg}</Text>
              </View>
            ) : null}

            {/* OTP boxes */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Verification code</Text>
              <Pressable style={styles.otpRow} onPress={() => codeInputRef.current?.focus()}>
                {Array.from({ length: CODE_LENGTH }).map((_, i) => {
                  const filled = i < code.length;
                  const active = i === code.length;
                  return (
                    <View
                      key={i}
                      style={[
                        styles.otpBox,
                        {
                          backgroundColor: colors.surfaceContainer,
                          borderColor: active
                            ? colors.primary
                            : filled
                            ? withOpacity(colors.primary, 0.4)
                            : colors.outlineVariant,
                        },
                      ]}
                    >
                      <Text style={[styles.otpDigit, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
                        {code[i] ?? ""}
                      </Text>
                    </View>
                  );
                })}
              </Pressable>
              {/* Hidden input behind OTP boxes */}
              <TextInput
                ref={codeInputRef}
                value={code}
                onChangeText={(v) => { setCode(v.replace(/\D/g, "").slice(0, CODE_LENGTH)); setError(""); }}
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                autoFocus
                style={styles.hiddenInput}
                caretHidden
              />
            </View>

            {/* New password */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>New password</Text>
              <View style={[styles.inputRow, { backgroundColor: colors.surfaceContainer, borderColor: borderFor("password") }]}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="Create a new password"
                  placeholderTextColor={colors.outlineVariant}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  style={[styles.inputFlex, { color: colors.onBackground, fontFamily: "WorkSans_400Regular" }]}
                />
                <Pressable onPress={() => setShowPass((v) => !v)} hitSlop={8}>
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
                  placeholder="Repeat your new password"
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
          </>
        )}

        {/* Error */}
        {error ? (
          <View style={[styles.errorBox, { backgroundColor: `${colors.error}18`, borderColor: `${colors.error}40` }]}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
            <Text style={[styles.errorText, { color: colors.error, fontFamily: "WorkSans_400Regular" }]}>{error}</Text>
          </View>
        ) : null}

        {/* CTA */}
        <Pressable
          onPress={step === "email" ? handleSendCode : handleReset}
          disabled={loading}
          style={({ pressed }) => [styles.cta, { backgroundColor: colors.primary, opacity: pressed || loading ? 0.8 : 1 }]}
        >
          {loading
            ? <ActivityIndicator color={colors.onPrimary} />
            : <Text style={[styles.ctaText, { color: colors.onPrimary, fontFamily: "WorkSans_700Bold" }]}>
                {step === "email" ? "Send Reset Code" : "Reset Password"}
              </Text>
          }
        </Pressable>

        {/* Back to sign in */}
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            Remember your password?
          </Text>
          <Pressable onPress={() => router.replace("/(auth)/sign-in")}>
            <Text style={[styles.footerLink, { color: colors.primary, fontFamily: "WorkSans_700Bold" }]}>Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content:        { paddingHorizontal: 24, gap: 16 },
  backBtn:        { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: "center", justifyContent: "center", alignSelf: "flex-start" },
  header:         { alignItems: "center", gap: 12, paddingVertical: 8 },
  iconWrap:       { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  title:          { fontSize: 26, textAlign: "center" },
  subtitle:       { fontSize: 14, textAlign: "center", lineHeight: 22 },
  emailHighlight: { fontSize: 14 },
  field:          { gap: 6 },
  label:          { fontSize: 13, fontWeight: "500" },
  input:          { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15 },
  inputRow:       { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 14 },
  inputFlex:      { flex: 1, fontSize: 15, paddingVertical: 13 },
  otpRow:         { flexDirection: "row", justifyContent: "center", gap: 10 },
  otpBox:         { width: 48, height: 56, borderRadius: 12, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  otpDigit:       { fontSize: 22 },
  hiddenInput:    { position: "absolute", opacity: 0, width: 1, height: 1 },
  successBox:     { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 10, padding: 12 },
  successText:    { flex: 1, fontSize: 13, lineHeight: 18 },
  errorBox:       { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 10, padding: 12 },
  errorText:      { flex: 1, fontSize: 13, lineHeight: 18 },
  cta:            { borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  ctaText:        { fontSize: 16 },
  footerRow:      { flexDirection: "row", justifyContent: "center", gap: 6 },
  footerText:     { fontSize: 14 },
  footerLink:     { fontSize: 14 },
});
