import CustomTabBar from "@/components/navigation/CustomTabBar";
import { Tabs } from "expo-router";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);


export default function TabsLayout() {
  return (
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
