import { useDSTheme } from "@/design-system";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOTAL_STEPS = 6;

interface Props {
  step: number;      // 1-based
  canGoBack?: boolean;
}

export default function StepHeader({ step, canGoBack = true }: Props) {
  const { colors } = useDSTheme();
  const insets = useSafeAreaInsets();
  const progress = step / TOTAL_STEPS;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        {canGoBack ? (
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}
          >
            <Ionicons name="chevron-back" size={20} color={colors.onBackground} />
          </Pressable>
        ) : (
          <View style={styles.backBtn} />
        )}

        <Text style={[styles.stepLabel, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
          Step {step} of {TOTAL_STEPS}
        </Text>
      </View>

      {/* Progress track */}
      <View style={[styles.track, { backgroundColor: colors.surfaceHighest }]}>
        <View
          style={[
            styles.fill,
            { backgroundColor: colors.primary, width: `${progress * 100}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 16, gap: 14 },
  row:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn:   { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  stepLabel: { fontSize: 13 },
  track:     { height: 4, borderRadius: 2, overflow: "hidden" },
  fill:      { height: "100%", borderRadius: 2 },
});
