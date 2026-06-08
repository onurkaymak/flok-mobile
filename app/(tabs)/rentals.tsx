import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RentalsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-white">Rentals</Text>
        <Text className="text-gray-500 mt-2 text-sm">Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
