import { useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchVehicles,
  deleteVehicle,
  resetVehiclesList,
  setSelectedVehicles,
} from "../../store/actions/fleet-actions";
import type { Vehicle } from "../../types";

export default function FleetScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const vehicles = useAppSelector((state) => state.fleet.vehicles);
  const selectedVehicles = useAppSelector((state) => state.fleet.selectedVehicles);
  const token = useAppSelector((state) => state.user.token);

  const selectedVehicle = vehicles.find((v) => v.vehicleId === selectedVehicles[0]) ?? null;

  useFocusEffect(
    useCallback(() => {
      dispatch(resetVehiclesList());
      if (token) dispatch(fetchVehicles(token));
      return () => {
        dispatch(setSelectedVehicles([]));
      };
    }, [token]),
  );

  const handleSelect = (vehicleId: number) => {
    if (selectedVehicles[0] === vehicleId) {
      dispatch(setSelectedVehicles([]));
    } else {
      dispatch(setSelectedVehicles([vehicleId]));
    }
  };

  const handleDelete = () => {
    if (!selectedVehicle || !token) return;
    Alert.alert(
      "Delete Vehicle",
      `Remove ${selectedVehicle.make} ${selectedVehicle.model} from the fleet?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteVehicle(selectedVehicle.vehicleId, token));
            dispatch(setSelectedVehicles([]));
          },
        },
      ],
    );
  };

  const renderVehicle = ({ item }: { item: Vehicle }) => {
    const isSelected = selectedVehicles[0] === item.vehicleId;
    return (
      <TouchableOpacity
        onPress={() => handleSelect(item.vehicleId)}
        className={`mx-4 mb-3 rounded-xl p-4 ${
          isSelected ? "bg-indigo-900 border-2 border-indigo-500" : "bg-gray-800"
        }`}
      >
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-white font-bold text-base">
            {item.make} {item.model}
          </Text>
          {item.isRented && (
            <View className="bg-amber-500 rounded-full px-2 py-0.5">
              <Text className="text-white text-xs font-semibold">Rented</Text>
            </View>
          )}
        </View>
        <Text className="text-gray-400 text-xs mb-2">VIN: {item.vin}</Text>
        <View className="flex-row gap-4">
          <Text className="text-gray-400 text-xs">{item.color}</Text>
          <Text className="text-gray-400 text-xs">
            {item.mileage.toLocaleString()} mi
          </Text>
          <Text className="text-gray-400 text-xs">{item.licensePlate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <Text className="text-2xl font-bold text-gray-900">Fleet</Text>
        {selectedVehicle ? (
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push("/fleet-update")}
              className="bg-indigo-600 rounded-lg px-4 py-2"
            >
              <Text className="text-white text-sm font-semibold">Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="bg-red-600 rounded-lg px-4 py-2"
            >
              <Text className="text-white text-sm font-semibold">Delete</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/fleet-add")}
            className="bg-indigo-600 rounded-lg px-4 py-2 flex-row items-center gap-1"
          >
            <Ionicons name="add" size={16} color="white" />
            <Text className="text-white text-sm font-semibold">Add Vehicle</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.vehicleId.toString()}
        renderItem={renderVehicle}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500 text-sm">No vehicles in fleet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
