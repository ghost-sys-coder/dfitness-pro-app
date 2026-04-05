import { useDSTheme, withOpacity } from "@/design-system";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_CONFIG: Record<string, { label: string; active: IoniconName; inactive: IoniconName }> = {
  index:            { label: "Dashboard", active: "grid",        inactive: "grid-outline" },
  "clients/index":  { label: "Clients",   active: "people",      inactive: "people-outline" },
  "workouts/index": { label: "Workouts",  active: "barbell",     inactive: "barbell-outline" },
  "analytics/index":{ label: "Analytics", active: "stats-chart", inactive: "stats-chart-outline" },
  "profile/index":  { label: "Profile",   active: "person",      inactive: "person-outline" },
};

export default function TrainerTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useDSTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.surfaceContainer,
          borderTopColor: colors.outlineVariant,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const config = TAB_CONFIG[route.name];
        if (!config) return null;

        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            android_ripple={{ borderless: true, radius: 40 }}
            style={styles.tab}
          >
            {/* top active line */}
            <View
              style={[
                styles.activeIndicator,
                { backgroundColor: focused ? colors.primary : "transparent" },
              ]}
            />

            <Ionicons
              name={focused ? config.active : config.inactive}
              size={22}
              color={focused ? colors.primary : colors.onSurfaceVariant}
            />

            <Text
              style={[
                styles.label,
                {
                  color: focused ? colors.primary : colors.onSurfaceVariant,
                  fontFamily: focused ? "WorkSans_700Bold" : "WorkSans_400Regular",
                },
              ]}
            >
              {config.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 10,
    gap: 4,
  },
  activeIndicator: {
    width: 28,
    height: 3,
    borderRadius: 0,
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
});
