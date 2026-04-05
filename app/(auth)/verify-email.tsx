import { useDSTheme, withOpacity } from "@/design-system";
import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds

export default function VerifyEmailScreen() {
  const { colors } = useDSTheme();
  const insets = useSafeAreaInsets();
  const { signUp, setActive, isLoaded } = useSignUp();

  const [code, setCode]             = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const inputRef = useRef<TextInput>(null);

  // Guard — if no pending sign-up, go back
  useEffect(() => {
    if (isLoaded && !signUp?.emailAddress) {
      router.replace("/(auth)/sign-up");
    }
  }, [isLoaded, signUp]);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleVerify = async () => {
    if (!isLoaded || code.length < CODE_LENGTH) return;
    setLoading(true);
    setError("");
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // index.tsx routes to onboarding since this is a new client
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? "Invalid code. Please try again.");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || resendTimer > 0) return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setResendTimer(RESEND_COOLDOWN);
      setError("");
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? "Failed to resend code.");
    }
  };

  // Auto-verify when all 6 digits entered
  useEffect(() => {
    if (code.length === CODE_LENGTH) handleVerify();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]}>

        {/* Back */}
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}
        >
          <Ionicons name="chevron-back" size={20} color={colors.onBackground} />
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: withOpacity(colors.primary, 0.12) }]}>
            <Ionicons name="mail-outline" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
            Check your email
          </Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            We sent a 6-digit code to{"\n"}
            <Text style={[styles.emailHighlight, { color: colors.onBackground, fontFamily: "WorkSans_700Bold" }]}>
              {signUp?.emailAddress ?? "your email"}
            </Text>
          </Text>
        </View>

        {/* OTP boxes */}
        <Pressable style={styles.otpRow} onPress={() => inputRef.current?.focus()}>
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

        {/* Hidden input */}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(v) => { setCode(v.replace(/\D/g, "").slice(0, CODE_LENGTH)); setError(""); }}
          keyboardType="number-pad"
          maxLength={CODE_LENGTH}
          autoFocus
          style={styles.hiddenInput}
          caretHidden
        />

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: `${colors.error}18`, borderColor: `${colors.error}40` }]}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
            <Text style={[styles.errorText, { color: colors.error, fontFamily: "WorkSans_400Regular" }]}>{error}</Text>
          </View>
        ) : null}

        {/* Verify button */}
        <Pressable
          onPress={handleVerify}
          disabled={loading || code.length < CODE_LENGTH}
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor: code.length === CODE_LENGTH ? colors.primary : colors.surfaceHighest,
              opacity: pressed || loading ? 0.8 : 1,
            },
          ]}
        >
          {loading
            ? <ActivityIndicator color={colors.onPrimary} />
            : <Text style={[styles.ctaText, { color: code.length === CODE_LENGTH ? colors.onPrimary : colors.onSurfaceVariant, fontFamily: "WorkSans_700Bold" }]}>
                Verify Email
              </Text>
          }
        </Pressable>

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={[styles.resendText, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            Didn&apos;t receive it?
          </Text>
          <Pressable onPress={handleResend} disabled={resendTimer > 0}>
            <Text style={[styles.resendLink, { color: resendTimer > 0 ? colors.onSurfaceVariant : colors.primary, fontFamily: "WorkSans_700Bold" }]}>
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
            </Text>
          </Pressable>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:       { flex: 1 },
  content:      { flex: 1, paddingHorizontal: 24, gap: 20 },
  backBtn:      { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: "center", justifyContent: "center", alignSelf: "flex-start" },
  header:       { alignItems: "center", gap: 12 },
  iconWrap:     { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  title:        { fontSize: 24, textAlign: "center" },
  subtitle:     { fontSize: 14, textAlign: "center", lineHeight: 22 },
  emailHighlight:{ fontSize: 14 },
  otpRow:       { flexDirection: "row", justifyContent: "center", gap: 10 },
  otpBox:       { width: 48, height: 56, borderRadius: 12, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  otpDigit:     { fontSize: 22 },
  hiddenInput:  { position: "absolute", opacity: 0, width: 1, height: 1 },
  errorBox:     { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 10, padding: 12 },
  errorText:    { flex: 1, fontSize: 13, lineHeight: 18 },
  cta:          { borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  ctaText:      { fontSize: 16 },
  resendRow:    { flexDirection: "row", justifyContent: "center", gap: 6 },
  resendText:   { fontSize: 14 },
  resendLink:   { fontSize: 14 },
});
