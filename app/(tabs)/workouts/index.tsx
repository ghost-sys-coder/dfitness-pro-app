import { TAB_BAR_HEIGHT } from "@/components/navigation/CustomTabBar";
import { useDSTheme, withOpacity } from "@/design-system";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CATEGORIES = ["All", "Strength", "Cardio", "HIIT", "Mobility", "Recovery"];

const WORKOUTS = [
  { name: "Upper Body Power",    emoji: "💪", duration: "45 min", level: "Intermediate", calories: 320, category: "Strength" },
  { name: "HIIT Cardio Blast",   emoji: "⚡", duration: "30 min", level: "Advanced",     calories: 410, category: "HIIT" },
  { name: "Core & Stability",    emoji: "🔥", duration: "25 min", level: "Beginner",     calories: 180, category: "Strength" },
  { name: "Leg Day Protocol",    emoji: "🦵", duration: "55 min", level: "Intermediate", calories: 380, category: "Strength" },
  { name: "Full Body Mobility",  emoji: "🧘", duration: "30 min", level: "Beginner",     calories: 140, category: "Mobility" },
  { name: "Sprint Intervals",    emoji: "🏃", duration: "20 min", level: "Advanced",     calories: 290, category: "Cardio" },
  { name: "Active Recovery",     emoji: "🌿", duration: "20 min", level: "Beginner",     calories: 90,  category: "Recovery" },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     "#22c55e",
  Intermediate: "#f59e0b",
  Advanced:     "#ef4444",
};

export default function WorkoutsScreen() {
  const { colors } = useDSTheme();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? WORKOUTS
    : WORKOUTS.filter((w) => w.category === activeCategory);

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
      <Text style={[styles.screenTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
        Workouts
      </Text>

      {/* Search bar (visual) */}
      <View style={[styles.searchBar, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}>
        <Ionicons name="search-outline" size={18} color={colors.onSurfaceVariant} />
        <Text style={[styles.searchPlaceholder, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
          Search workouts...
        </Text>
      </View>

      {/* Category chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
        {CATEGORIES.map((cat) => {
          const active = cat === activeCategory;
          return (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.primary : colors.surfaceContainer,
                  borderColor: active ? colors.primary : colors.outlineVariant,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: active ? colors.onPrimary : colors.onSurfaceVariant,
                    fontFamily: "WorkSans_500Medium",
                  },
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Workout list */}
      <View style={styles.list}>
        {filtered.map((w) => (
          <Pressable
            key={w.name}
            style={({ pressed }) => [
              styles.workoutCard,
              {
                backgroundColor: colors.surfaceContainer,
                borderColor: colors.outlineVariant,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            {/* Left: emoji badge */}
            <View style={[styles.emojiBadge, { backgroundColor: withOpacity(colors.primary, 0.12) }]}>
              <Text style={styles.workoutEmoji}>{w.emoji}</Text>
            </View>

            {/* Middle: info */}
            <View style={styles.workoutInfo}>
              <Text style={[styles.workoutName, { color: colors.onBackground, fontFamily: "WorkSans_700Bold" }]}>
                {w.name}
              </Text>
              <View style={styles.workoutMeta}>
                <Text style={[styles.metaText, { color: colors.onSurfaceVariant }]}>⏱ {w.duration}</Text>
                <Text style={[styles.metaText, { color: colors.onSurfaceVariant }]}>🔥 {w.calories} kcal</Text>
              </View>
              <View style={[styles.levelBadge, { backgroundColor: withOpacity(LEVEL_COLORS[w.level], 0.15) }]}>
                <Text style={[styles.levelText, { color: LEVEL_COLORS[w.level] }]}>{w.level}</Text>
              </View>
            </View>

            {/* Right: play button */}
            <View style={[styles.playBtn, { backgroundColor: colors.primary }]}>
              <Ionicons name="play" size={14} color={colors.onPrimary} />
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content:      { paddingHorizontal: 15, gap: 16 },
  screenTitle:  { fontSize: 28 },

  searchBar:         { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 13 },
  searchPlaceholder: { fontSize: 14, flex: 1 },

  categoryRow: { marginHorizontal: -20, paddingHorizontal: 20 },
  chip:        { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  chipText:    { fontSize: 13 },

  list:         { gap: 12 },
  workoutCard:  { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 16, borderWidth: 1, padding: 14 },
  emojiBadge:   { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  workoutEmoji: { fontSize: 26 },
  workoutInfo:  { flex: 1, gap: 5 },
  workoutName:  { fontSize: 15 },
  workoutMeta:  { flexDirection: "row", gap: 12 },
  metaText:     { fontSize: 12 },
  levelBadge:   { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  levelText:    { fontSize: 11, fontWeight: "600" },
  playBtn:      { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
});
