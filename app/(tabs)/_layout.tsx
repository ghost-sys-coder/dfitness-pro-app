import CustomTabBar from "@/components/navigation/CustomTabBar";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
  return (
    // top/left/right edges handled here; bottom edge handled by CustomTabBar
    // via useSafeAreaInsets so the home indicator is respected on iOS
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="home/index" />
        <Tabs.Screen name="workouts/index" />
        <Tabs.Screen name="progress/index" />
        <Tabs.Screen name="profile/index" />
      </Tabs>
    </SafeAreaView>
  );
}
