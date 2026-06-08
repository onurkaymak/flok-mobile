import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter, Redirect } from "expo-router";
import { useAppSelector } from "../store/hooks";

export default function SplashScreen() {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Image
        source={{ uri: "https://i.ibb.co/rcpT5Xb/flok1.png" }}
        style={{ height: 96, width: 192 }}
        resizeMode="contain"
      />
      <Text className="mt-8 text-base text-gray-600 text-center leading-6 mb-10">
        Experience efficiency like never before with our cutting-edge fleet
        management solution. Streamline operations, maximize vehicle
        utilization, and elevate customer satisfaction.
      </Text>
      <TouchableOpacity
        className="bg-indigo-600 rounded-md px-8 py-3 w-full items-center"
        onPress={() => router.push("/auth")}
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-sm">Login / Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
