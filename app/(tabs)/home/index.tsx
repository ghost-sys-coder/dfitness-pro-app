import { TAB_BAR_HEIGHT } from "@/components/navigation/CustomTabBar";
import { DSThemeSwitcher, useDSTheme, withOpacity } from "@/design-system";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const QUICK_WORKOUTS = [
  { label: "HIIT",      icon: "⚡", duration: "20 min" },
  { label: "Core",      icon: "🔥", duration: "15 min" },
  { label: "Mobility",  icon: "🧘", duration: "25 min" },
  { label: "Strength",  icon: "💪", duration: "40 min" },
];

export default function HomeScreen() {
  const { colors } = useDSTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
            {greeting()},
          </Text>
          <Text style={[styles.name, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
            Dean 👋
          </Text>
        </View>
        <View style={styles.headerRight}>
          <DSThemeSwitcher />
          <Pressable
            style={[styles.iconBtn, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.onSurfaceVariant} />
          </Pressable>
        </View>
      </View>

      {/* Stats strip */}
      <View style={[styles.statsRow, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}>
        {[
          { value: "14", unit: "day", label: "Streak", icon: "🔥" },
          { value: "3",  unit: "done", label: "This week", icon: "💪" },
          { value: "2h 40m", unit: "", label: "Active time", icon: "⏱️" },
        ].map((s, i) => (
          <View key={i} style={[styles.statItem, i < 2 && { borderRightWidth: 1, borderRightColor: colors.outlineVariant }]}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={[styles.statValue, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
              {s.value}
            </Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Today's focus */}
      <Text style={[styles.sectionTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
        Today&apos;s Focus
      </Text>
      <View
        style={[
          styles.featuredCard,
          { backgroundColor: colors.surfaceHigh, borderColor: withOpacity(colors.primary, 0.3) },
        ]}
      >
        {/* accent bar */}
        <View style={[styles.accentBar, { backgroundColor: colors.primary }]} />

        <View style={styles.featuredContent}>
          <View>
            <Text style={[styles.featuredTag, { color: colors.primary, fontFamily: "WorkSans_500Medium" }]}>
              INTERMEDIATE · 45 MIN
            </Text>
            <Text style={[styles.featuredTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
              Upper Body{"\n"}Power
            </Text>
            <View style={styles.featuredMeta}>
              {["Chest", "Shoulders", "Triceps"].map((m) => (
                <View
                  key={m}
                  style={[styles.metaChip, { backgroundColor: withOpacity(colors.primary, 0.12) }]}
                >
                  <Text style={[styles.metaChipText, { color: colors.primary }]}>{m}</Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.featuredEmoji}>💪</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.startBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Ionicons name="play" size={16} color={colors.onPrimary} />
          <Text style={[styles.startBtnText, { color: colors.onPrimary, fontFamily: "WorkSans_700Bold" }]}>
            Start Workout
          </Text>
        </Pressable>
      </View>

      {/* Quick start */}
      <Text style={[styles.sectionTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
        Quick Start
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRow}>
        {QUICK_WORKOUTS.map((w) => (
          <Pressable
            key={w.label}
            style={({ pressed }) => [
              styles.quickCard,
              {
                backgroundColor: colors.surfaceContainer,
                borderColor: colors.outlineVariant,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text style={styles.quickIcon}>{w.icon}</Text>
            <Text style={[styles.quickLabel, { color: colors.onBackground, fontFamily: "WorkSans_700Bold" }]}>
              {w.label}
            </Text>
            <Text style={[styles.quickDuration, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
              {w.duration}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content:       { paddingHorizontal: 18, gap: 20 },
  header:        { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerRight:   { flexDirection: "row", alignItems: "center", gap: 10 },
  greeting:      { fontSize: 14 },
  name:          { fontSize: 26, marginTop: 2 },
  iconBtn:       { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },

  statsRow:  { flexDirection: "row", borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  statItem:  { flex: 1, alignItems: "center", paddingVertical: 16, gap: 2 },
  statIcon:  { fontSize: 18 },
  statValue: { fontSize: 18 },
  statLabel: { fontSize: 11 },

  sectionTitle: { fontSize: 18 },

  featuredCard:    { borderRadius: 20, borderWidth: 1, overflow: "hidden", gap: 16, paddingBottom: 16 },
  accentBar:       { height: 4 },
  featuredContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 16, paddingTop: 4 },
  featuredTag:     { fontSize: 11, letterSpacing: 0.8, marginBottom: 6 },
  featuredTitle:   { fontSize: 28, lineHeight: 32 },
  featuredEmoji:   { fontSize: 56 },
  featuredMeta:    { flexDirection: "row", gap: 6, marginTop: 10 },
  metaChip:        { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  metaChipText:    { fontSize: 11, fontWeight: "600" },
  startBtn:        { marginHorizontal: 16, borderRadius: 14, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  startBtnText:    { fontSize: 15, fontWeight: "700" },

  quickRow: { marginHorizontal: -20, paddingHorizontal: 20 },
  quickCard: { width: 110, marginRight: 12, borderRadius: 16, borderWidth: 1, padding: 14, alignItems: "center", gap: 6 },
  quickIcon: { fontSize: 28 },
  quickLabel: { fontSize: 13 },
  quickDuration: { fontSize: 11 },
});
