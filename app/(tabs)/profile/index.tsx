import { TAB_BAR_HEIGHT } from "@/components/navigation/CustomTabBar";
import { useDSTheme, withOpacity } from "@/design-system";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const MENU_ITEMS: { label: string; icon: IoniconName; tint?: string }[] = [
  { label: "My Goals",        icon: "flag-outline" },
  { label: "Schedule",        icon: "calendar-outline" },
  { label: "Appearance",      icon: "color-palette-outline" },
  { label: "Notifications",   icon: "notifications-outline" },
  { label: "Privacy",         icon: "shield-checkmark-outline" },
  { label: "Help & Support",  icon: "help-circle-outline" },
  { label: "Sign Out",        icon: "log-out-outline", tint: "#ef4444" },
];

export default function ProfileScreen() {
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
      {/* User header */}
      <View style={[styles.profileCard, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: withOpacity(colors.primary, 0.15), borderColor: colors.primary }]}>
          <Text style={styles.avatarInitials}>DM</Text>
        </View>

        <Text style={[styles.userName, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
          Dean Mitchell
        </Text>
        <Text style={[styles.userHandle, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
          @deanfitness · Member since 2024
        </Text>

        {/* Plan badge */}
        <View style={[styles.proBadge, { backgroundColor: withOpacity(colors.primary, 0.14) }]}>
          <Ionicons name="star" size={12} color={colors.primary} />
          <Text style={[styles.proBadgeText, { color: colors.primary, fontFamily: "WorkSans_700Bold" }]}>
            PRO MEMBER
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={[styles.statsRow, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}>
        {[
          { label: "Workouts",   value: "24" },
          { label: "Lbs lost",   value: "8.5" },
          { label: "Day streak", value: "14" },
        ].map((s, i) => (
          <View
            key={s.label}
            style={[
              styles.statItem,
              i < 2 && { borderRightWidth: 1, borderRightColor: colors.outlineVariant },
            ]}
          >
            <Text style={[styles.statValue, { color: colors.onBackground, fontFamily: "SpaceGrotesk_700Bold" }]}>
              {s.value}
            </Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View style={[styles.menuCard, { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }]}>
        {MENU_ITEMS.map((item, i) => {
          const iconColor = item.tint ?? colors.onSurfaceVariant;
          const labelColor = item.tint ?? colors.onBackground;
          const isLast = i === MENU_ITEMS.length - 1;

          return (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.menuRow,
                !isLast && { borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
                pressed && { opacity: 0.6 },
              ]}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: withOpacity(iconColor, 0.1) }]}>
                <Ionicons name={item.icon} size={18} color={iconColor} />
              </View>
              <Text style={[styles.menuLabel, { color: labelColor, fontFamily: "WorkSans_500Medium" }]}>
                {item.label}
              </Text>
              {!isLast && (
                <Ionicons name="chevron-forward" size={16} color={colors.outlineVariant} />
              )}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 15, gap: 16 },

  profileCard: { borderRadius: 20, borderWidth: 1, padding: 20, alignItems: "center", gap: 8 },
  avatar:      { width: 80, height: 80, borderRadius: 40, borderWidth: 2, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  avatarInitials:{ fontSize: 28, fontWeight: "700", color: "#ff6b35" },
  userName:    { fontSize: 22 },
  userHandle:  { fontSize: 13 },
  proBadge:    { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginTop: 4 },
  proBadgeText:{ fontSize: 11, letterSpacing: 0.8 },

  statsRow: { flexDirection: "row", borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 16, gap: 3 },
  statValue:{ fontSize: 20 },
  statLabel:{ fontSize: 11 },

  menuCard:    { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  menuRow:     { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  menuIconWrap:{ width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel:   { flex: 1, fontSize: 15 },
});
