import { TAB_BAR_HEIGHT } from "@/components/navigation/CustomTabBar";
import { useDSTheme, withOpacity } from "@/design-system";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WEEK = [
  { day: "M", minutes: 45 },
  { day: "T", minutes: 0  },
  { day: "W", minutes: 30 },
  { day: "T", minutes: 50 },
  { day: "F", minutes: 0  },
  { day: "S", minutes: 60 },
  { day: "S", minutes: 30 },
];
const MAX_MINUTES = 60;
const MAX_BAR_HEIGHT = 80;

const RECORDS = [
  { exercise: "Bench Press", value: "85 kg", icon: "🏋️" },
  { exercise: "Squat",       value: "100 kg", icon: "🦵" },
  { exercise: "Deadlift",    value: "120 kg", icon: "💪" },
];

const SESSIONS = [
  { name: "Upper Body Power", day: "Thu",  duration: "45 min", calories: 320 },
  { name: "HIIT Cardio Blast",day: "Wed",  duration: "30 min", calories: 410 },
  { name: "Core & Stability", day: "Mon",  duration: "25 min", calories: 180 },
];

export default function ProgressScreen() {
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
      <Text style={[styles.screenTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
        Progress
      </Text>

      {/* Weekly chart */}
      <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}>
        <Text style={[styles.cardTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
          This Week
        </Text>
        <Text style={[styles.cardSubtitle, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
          215 min total · 5 days active
        </Text>

        <View style={styles.chart}>
          {WEEK.map((d, i) => {
            const barH = d.minutes > 0 ? (d.minutes / MAX_MINUTES) * MAX_BAR_HEIGHT : 4;
            const isToday = i === 3; // Thursday
            return (
              <View key={i} style={styles.barCol}>
                <View style={[styles.barTrack, { height: MAX_BAR_HEIGHT }]}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barH,
                        backgroundColor: d.minutes > 0
                          ? isToday ? colors.primary : withOpacity(colors.primary, 0.5)
                          : colors.surfaceHighest,
                        borderRadius: d.minutes > 0 ? 6 : 3,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.dayLabel, { color: isToday ? colors.primary : colors.onSurfaceVariant }]}>
                  {d.day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Summary stats */}
      <View style={styles.statsRow}>
        {[
          { label: "Workouts",   value: "24",   icon: "💪" },
          { label: "Calories",   value: "8.4k", icon: "🔥" },
          { label: "Day streak", value: "14",   icon: "⚡" },
        ].map((s) => (
          <View
            key={s.label}
            style={[styles.statCard, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}
          >
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

      {/* Personal records */}
      <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}>
        <Text style={[styles.cardTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
          Personal Records
        </Text>
        {RECORDS.map((r, i) => (
          <View
            key={r.exercise}
            style={[
              styles.recordRow,
              i < RECORDS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
            ]}
          >
            <Text style={styles.recordIcon}>{r.icon}</Text>
            <Text style={[styles.recordName, { color: colors.onBackground, fontFamily: "WorkSans_500Medium" }]}>
              {r.exercise}
            </Text>
            <Text style={[styles.recordValue, { color: colors.primary, fontFamily: "SpaceGrotesk_700Bold" }]}>
              {r.value}
            </Text>
          </View>
        ))}
      </View>

      {/* Recent sessions */}
      <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}>
        <Text style={[styles.cardTitle, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
          Recent Sessions
        </Text>
        {SESSIONS.map((s, i) => (
          <View
            key={s.name}
            style={[
              styles.sessionRow,
              i < SESSIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
            ]}
          >
            <View style={[styles.sessionDot, { backgroundColor: colors.primary }]} />
            <View style={styles.sessionInfo}>
              <Text style={[styles.sessionName, { color: colors.onBackground, fontFamily: "WorkSans_700Bold" }]}>
                {s.name}
              </Text>
              <Text style={[styles.sessionMeta, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
                {s.day} · {s.duration} · {s.calories} kcal
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content:     { paddingHorizontal: 15, gap: 16 },
  screenTitle: { fontSize: 28 },

  card:        { borderRadius: 18, borderWidth: 1, padding: 16, gap: 12 },
  cardTitle:   { fontSize: 17 },
  cardSubtitle:{ fontSize: 13 },

  chart:   { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  barCol:  { alignItems: "center", gap: 6, flex: 1 },
  barTrack:{ justifyContent: "flex-end" },
  bar:     { width: 24 },
  dayLabel:{ fontSize: 11, fontWeight: "600" },

  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 14, alignItems: "center", gap: 4 },
  statIcon: { fontSize: 20 },
  statValue:{ fontSize: 20 },
  statLabel:{ fontSize: 11 },

  recordRow:   { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  recordIcon:  { fontSize: 22, width: 28, textAlign: "center" },
  recordName:  { flex: 1, fontSize: 14 },
  recordValue: { fontSize: 16 },

  sessionRow:  { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  sessionDot:  { width: 8, height: 8, borderRadius: 4 },
  sessionInfo: { flex: 1, gap: 2 },
  sessionName: { fontSize: 14 },
  sessionMeta: { fontSize: 12 },
});
