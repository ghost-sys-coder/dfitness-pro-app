import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function SignIn() {
    return (
        <View className="flex-1 justify-center items-center bg-white">
            <Text className="text-2xl font-bold text-blue-700">Sign In</Text>
            <Link href="/(auth)/sign-up" asChild>
                <Pressable className="bg-blue-700 rounded-lg p-4 mt-4">
                    <Text className="text-white text-xl font-semibold">
                        Go to Sign Up
                    </Text>
                </Pressable>
            </Link>
        </View>
    );
}