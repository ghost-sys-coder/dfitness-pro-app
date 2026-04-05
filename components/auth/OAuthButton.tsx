import { useSSO } from "@clerk/clerk-expo";
import { useDSTheme } from "@/design-system";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

// Required for OAuth redirect to resolve on iOS
WebBrowser.maybeCompleteAuthSession();

type Strategy = "oauth_google" | "oauth_apple";

interface Props {
  strategy: Strategy;
  label: string;
}

const ICON: Record<Strategy, React.ComponentProps<typeof Ionicons>["name"]> = {
  oauth_google: "logo-google",
  oauth_apple:  "logo-apple",
};

export default function OAuthButton({ strategy, label }: Props) {
  const { colors } = useDSTheme();
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState(false);

  // Warm up the browser on mount so OAuth opens instantly
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => { void WebBrowser.coolDownAsync(); };
  }, []);

  const handlePress = async () => {
    setLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: Linking.createURL("/", { scheme: "deansfitnessapp" }),
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        // index.tsx handles role-based redirect once user state updates
      }
    } catch (err) {
      console.error(`${strategy} sign-in failed:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={loading}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: colors.surfaceContainer,
          borderColor: colors.outlineVariant,
          opacity: pressed || loading ? 0.7 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.onSurfaceVariant} />
      ) : (
        <Ionicons name={ICON[strategy]} size={18} color={colors.onBackground} />
      )}
      <Text style={[styles.label, { color: colors.onBackground, fontFamily: "WorkSans_500Medium" }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn:   { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderWidth: 1, borderRadius: 14, paddingVertical: 14 },
  label: { fontSize: 15 },
});
