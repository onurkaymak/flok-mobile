import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { US_STATES } from "../constants/usStates";
import { addVehicle } from "../store/actions/fleet-actions";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { Vehicle } from "../types";

export default function FleetAddScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector((state) => state.user.token);

  const [vin, setVin] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [mileage, setMileage] = useState("");
  const [vehicleClass, setVehicleClass] = useState("");
  const [classCode, setClassCode] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputClass = (field: string) =>
    `w-full bg-white border rounded-md px-3.5 py-3 text-gray-900 text-sm ${
      focusedField === field ? "border-indigo-500" : "border-gray-300"
    }`;

  const formSubmitHandler = async () => {
    if (
      !vin || !make || !model || !color || !mileage ||
      !vehicleClass || !classCode || !selectedState || !licensePlate
    ) return;
    if (!token) return;

    const vehicleInfo: Vehicle = {
      vehicleId: 0,
      vin,
      make,
      model,
      color,
      mileage: parseInt(mileage, 10),
      class: vehicleClass,
      classCode,
      state: selectedState,
      licensePlate,
      isRented: false,
    };

    setLoading(true);
    await dispatch(addVehicle(vehicleInfo, token));
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
          <Text className="text-xl font-bold text-white">Add Vehicle</Text>
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
        <View className="mb-4">
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

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Make</Text>
          <TextInput
            value={make}
            onChangeText={setMake}
            placeholder="e.g. Honda"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
            onFocus={() => setFocusedField("make")}
            onBlur={() => setFocusedField(null)}
            className={inputClass("make")}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Model</Text>
          <TextInput
            value={model}
            onChangeText={setModel}
            placeholder="e.g. Civic"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
            onFocus={() => setFocusedField("model")}
            onBlur={() => setFocusedField(null)}
            className={inputClass("model")}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Color</Text>
          <TextInput
            value={color}
            onChangeText={setColor}
            placeholder="e.g. White"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
            onFocus={() => setFocusedField("color")}
            onBlur={() => setFocusedField(null)}
            className={inputClass("color")}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Mileage</Text>
          <TextInput
            value={mileage}
            onChangeText={setMileage}
            placeholder="e.g. 25000"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
            onFocus={() => setFocusedField("mileage")}
            onBlur={() => setFocusedField(null)}
            className={inputClass("mileage")}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Vehicle Class</Text>
          <TextInput
            value={vehicleClass}
            onChangeText={setVehicleClass}
            placeholder="e.g. Economy"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
            onFocus={() => setFocusedField("vehicleClass")}
            onBlur={() => setFocusedField(null)}
            className={inputClass("vehicleClass")}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Class Code</Text>
          <TextInput
            value={classCode}
            onChangeText={setClassCode}
            placeholder="e.g. A"
            placeholderTextColor="#9ca3af"
            autoCapitalize="characters"
            autoCorrect={false}
            onFocus={() => setFocusedField("classCode")}
            onBlur={() => setFocusedField(null)}
            className={inputClass("classCode")}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">State</Text>
          <TouchableOpacity
            onPress={() => setShowStatePicker(true)}
            className={`w-full bg-white border rounded-md px-3.5 py-3 flex-row justify-between items-center ${
              showStatePicker ? "border-indigo-500" : "border-gray-300"
            }`}
          >
            <Text className={selectedState ? "text-gray-900 text-sm" : "text-gray-400 text-sm"}>
              {selectedState
                ? US_STATES.find((s) => s.value === selectedState)?.label
                : "Select a state"}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">License Plate</Text>
          <TextInput
            value={licensePlate}
            onChangeText={setLicensePlate}
            placeholder="e.g. ABC-1234"
            placeholderTextColor="#9ca3af"
            autoCapitalize="characters"
            autoCorrect={false}
            onFocus={() => setFocusedField("licensePlate")}
            onBlur={() => setFocusedField(null)}
            className={inputClass("licensePlate")}
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
            <Text className="text-white font-semibold text-sm">Add Vehicle</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showStatePicker} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View className="bg-white rounded-t-2xl" style={{ maxHeight: "70%" }}>
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
              <Text className="text-base font-bold text-gray-900">Select State</Text>
              <TouchableOpacity onPress={() => setShowStatePicker(false)}>
                <Ionicons name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={US_STATES}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedState(item.value);
                    setShowStatePicker(false);
                  }}
                  className={`px-5 py-3.5 border-b border-gray-100 ${
                    selectedState === item.value ? "bg-indigo-50" : ""
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selectedState === item.value
                        ? "text-indigo-600 font-semibold"
                        : "text-gray-900"
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
