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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addVehicle } from "../store/actions/fleet-actions";
import { US_STATES } from "../constants/usStates";
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
  const [loading, setLoading] = useState(false);

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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 pt-2 pb-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Add Vehicle</Text>
      </View>

      {/*
        KeyboardAvoidingView pushes the form up when the keyboard opens.
        behavior="padding" works best on iOS; "height" works better on Android.
        Platform.OS lets us check which OS we're on at runtime.
      */}
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
              placeholder="e.g. 1HGBH41JXMN109186"
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
              placeholder="e.g. Honda"
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
              placeholder="e.g. Civic"
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
              placeholder="e.g. White"
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
              placeholder="e.g. 25000"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-gray-900 text-sm"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-900 mb-2">Vehicle Class</Text>
            <TextInput
              value={vehicleClass}
              onChangeText={setVehicleClass}
              placeholder="e.g. Economy"
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
              placeholder="e.g. A"
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
              <Text
                className={
                  selectedState ? "text-gray-900 text-sm" : "text-gray-400 text-sm"
                }
              >
                {selectedState
                  ? US_STATES.find((s) => s.value === selectedState)?.label
                  : "Select a state"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-900 mb-2">License Plate</Text>
            <TextInput
              value={licensePlate}
              onChangeText={setLicensePlate}
              placeholder="e.g. ABC-1234"
              placeholderTextColor="#9ca3af"
              autoCapitalize="characters"
              autoCorrect={false}
              className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-gray-900 text-sm"
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
      </KeyboardAvoidingView>

      {/*
        Modal is a React Native component that renders content on top of everything else.
        transparent + animationType="slide" gives us the bottom-sheet look.
        The dark overlay is the outer View's backgroundColor (rgba with opacity).
      */}
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
