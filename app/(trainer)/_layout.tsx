import TrainerTabBar from "@/components/navigation/TrainerTabBar";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TrainerLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <Tabs
        tabBar={(props) => <TrainerTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="clients/index" />
        <Tabs.Screen name="workouts/index" />
        <Tabs.Screen name="analytics/index" />
        <Tabs.Screen name="profile/index" />
      </Tabs>
    </SafeAreaView>
  );
}
