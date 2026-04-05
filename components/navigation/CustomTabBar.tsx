import { useDSTheme, withOpacity } from "@/design-system";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_CONFIG: Record<string, { label: string; active: IoniconName; inactive: IoniconName }> = {
  home:     { label: "Home",     active: "home",        inactive: "home-outline" },
  workouts: { label: "Workouts", active: "barbell",     inactive: "barbell-outline" },
  progress: { label: "Progress", active: "stats-chart", inactive: "stats-chart-outline" },
  profile:  { label: "Profile",  active: "person",      inactive: "person-outline" },
};

// strip "/index" so "home/index" → "home" matches the config above
const routeKey = (name: string) => name.replace("/index", "");

export const TAB_BAR_HEIGHT = 80;

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useDSTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 10 }]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.surfaceContainer,
            borderColor: colors.outlineVariant,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const config = TAB_CONFIG[routeKey(route.name)];
          if (!config) return null;

          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tab}
              android_ripple={{ borderless: true, radius: 40 }}
            >
              {focused && (
                <View
                  style={[
                    styles.activePill,
                    { backgroundColor: withOpacity(colors.primary, 0.13) },
                  ]}
                />
              )}

              <Ionicons
                name={focused ? config.active : config.inactive}
                size={24}
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  bar: {
    flexDirection: "row",
    borderRadius: 30,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    gap: 4,
  },
  activePill: {
    position: "absolute",
    top: 0,
    left: 8,
    right: 8,
    bottom: 0,
    borderRadius: 16,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
});
