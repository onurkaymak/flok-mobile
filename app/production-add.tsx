import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addDetailingService } from "../store/actions/production-actions";

export default function ProductionAddScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector((state) => state.user.token);
  const userId = useAppSelector((state) => state.user.userId);

  const [vin, setVin] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputClass = (field: string) =>
    `w-full bg-white border rounded-md px-3.5 py-3 text-gray-900 text-sm ${
      focusedField === field ? "border-indigo-500" : "border-gray-300"
    }`;

  const formSubmitHandler = async () => {
    if (!vin || !token || !userId) return;
    setLoading(true);
    await dispatch(addDetailingService(vin, userId, token));
    setLoading(false);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4 bg-indigo-600">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Add Detailing Record</Text>
        </View>
        <Image
          source={{ uri: "https://i.ibb.co/rcpT5Xb/flok1.png" }}
          style={{ height: 24, width: 56 }}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">VIN</Text>
          <TextInput
            value={vin}
            onChangeText={setVin}
            placeholder="e.g. 1HGBH41JXMN109186"
            placeholderTextColor="#9ca3af"
            autoCapitalize="characters"
            autoCorrect={false}
            onFocus={() => setFocusedField("vin")}
            onBlur={() => setFocusedField(null)}
            className={inputClass("vin")}
          />
        </View>

        <TouchableOpacity
          onPress={formSubmitHandler}
          className="bg-indigo-600 rounded-md py-3 items-center"
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-sm">Submit Record</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
