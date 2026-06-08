import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Switch,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateVehicle, setSelectedVehicles } from "../store/actions/fleet-actions";
import { US_STATES } from "../constants/usStates";
import type { Vehicle } from "../types";

export default function FleetUpdateScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector((state) => state.user.token);

  const vehicles = useAppSelector((state) => state.fleet.vehicles);
  const selectedVehicles = useAppSelector((state) => state.fleet.selectedVehicles);
  const vehicle = vehicles.find((v) => v.vehicleId === selectedVehicles[0]);

  const [vin, setVin] = useState(vehicle?.vin ?? "");
  const [make, setMake] = useState(vehicle?.make ?? "");
  const [model, setModel] = useState(vehicle?.model ?? "");
  const [color, setColor] = useState(vehicle?.color ?? "");
  const [mileage, setMileage] = useState(vehicle?.mileage?.toString() ?? "");
  const [vehicleClass, setVehicleClass] = useState(vehicle?.class ?? "");
  const [classCode, setClassCode] = useState(vehicle?.classCode ?? "");
  const [selectedState, setSelectedState] = useState(vehicle?.state ?? "");
  const [licensePlate, setLicensePlate] = useState(vehicle?.licensePlate ?? "");
  const [isRented, setIsRented] = useState(vehicle?.isRented ?? false);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const formSubmitHandler = async () => {
    if (
      !vin || !make || !model || !color || !mileage ||
      !vehicleClass || !classCode || !selectedState || !licensePlate
    ) return;
    if (!token || !vehicle) return;

    const updatedVehicle: Vehicle = {
      vehicleId: vehicle.vehicleId,
      vin,
      make,
      model,
      color,
      mileage: parseInt(mileage, 10),
      class: vehicleClass,
      classCode,
      state: selectedState,
      licensePlate,
      isRented,
    };

    setLoading(true);
    await dispatch(updateVehicle(updatedVehicle, token));
    setLoading(false);
    dispatch(setSelectedVehicles([]));
    router.back();
  };

  if (!vehicle) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500 text-sm">No vehicle selected.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 pt-2 pb-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Update Vehicle</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-900 mb-2">VIN</Text>
            <TextInput
              value={vin}
              onChangeText={setVin}
              placeholderTextColor="#9ca3af"
              autoCapitalize="characters"
              autoCorrect={false}
              className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-gray-900 text-sm"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-900 mb-2">Make</Text>
            <TextInput
              value={make}
              onChangeText={setMake}
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
              className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-gray-900 text-sm"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-900 mb-2">Model</Text>
            <TextInput
              value={model}
              onChangeText={setModel}
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
              className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-gray-900 text-sm"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-900 mb-2">Color</Text>
            <TextInput
              value={color}
              onChangeText={setColor}
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
              className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-gray-900 text-sm"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-900 mb-2">Mileage</Text>
            <TextInput
              value={mileage}
              onChangeText={setMileage}
              keyboardType="numeric"
              className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-gray-900 text-sm"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-900 mb-2">Vehicle Class</Text>
            <TextInput
              value={vehicleClass}
              onChangeText={setVehicleClass}
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
              className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-gray-900 text-sm"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-900 mb-2">Class Code</Text>
            <TextInput
              value={classCode}
              onChangeText={setClassCode}
              placeholderTextColor="#9ca3af"
              autoCapitalize="characters"
              autoCorrect={false}
              className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-gray-900 text-sm"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-900 mb-2">State</Text>
            <TouchableOpacity
              onPress={() => setShowStatePicker(true)}
              className="w-full border border-gray-300 rounded-md px-3.5 py-3 flex-row justify-between items-center"
            >
              <Text className="text-gray-900 text-sm">
                {US_STATES.find((s) => s.value === selectedState)?.label ?? selectedState}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-900 mb-2">License Plate</Text>
            <TextInput
              value={licensePlate}
              onChangeText={setLicensePlate}
              placeholderTextColor="#9ca3af"
              autoCapitalize="characters"
              autoCorrect={false}
              className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-gray-900 text-sm"
            />
          </View>

          <View className="flex-row items-center justify-between mb-6 border border-gray-300 rounded-md px-3.5 py-3">
            <Text className="text-sm font-medium text-gray-900">Currently Rented</Text>
            <Switch
              value={isRented}
              onValueChange={setIsRented}
              trackColor={{ false: "#d1d5db", true: "#6366f1" }}
              thumbColor="white"
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
              <Text className="text-white font-semibold text-sm">Update Vehicle</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showStatePicker} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            className="bg-white rounded-t-2xl"
            style={{ maxHeight: "70%" }}
          >
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
              <Text className="text-base font-bold text-gray-900">
                Select State
              </Text>
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
