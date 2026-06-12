import { useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchRentalServiceList, deleteRentalService } from "../../store/actions/rental-actions";
import { rentalActions } from "../../store/slices/rental-slice";
import type { RentalService } from "../../types";

export default function RentalsScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const rentalServices = useAppSelector((state) => state.rental.rentalServices);
  const selectedById = useAppSelector((state) => state.rental.selectedRentalServiceById);
  const token = useAppSelector((state) => state.user.token);
  const userRole = useAppSelector((state) => state.user.userRole);

  const isManager = userRole === "MANAGER";
  const selectedRental = rentalServices.find((r) => r.id === selectedById?.[0]) ?? null;

  useFocusEffect(
    useCallback(() => {
      dispatch(rentalActions.resetRentalServices());
      if (token) dispatch(fetchRentalServiceList(token));
      return () => {
        dispatch(rentalActions.setSelectedRentalService([]));
      };
    }, [token]),
  );

  const handleSelect = (id: number) => {
    if (selectedById?.[0] === id) {
      dispatch(rentalActions.setSelectedRentalService([]));
    } else {
      dispatch(rentalActions.setSelectedRentalService([id]));
    }
  };

  const handleDelete = () => {
    if (!selectedRental || !token) return;
    Alert.alert(
      "Delete Reservation",
      `Remove reservation for ${selectedRental.contactName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteRentalService(selectedRental.id, token));
            dispatch(rentalActions.setSelectedRentalService([]));
          },
        },
      ],
    );
  };

  const renderRental = ({ item }: { item: RentalService }) => {
    const isSelected = selectedById?.[0] === item.id;
    return (
      <TouchableOpacity
        onPress={() => handleSelect(item.id)}
        className={`mx-4 mb-3 rounded-xl p-4 ${
          isSelected ? "bg-indigo-900 border-2 border-indigo-500" : "bg-gray-800"
        }`}
      >
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-white font-bold text-base">{item.contactName}</Text>
          <Text className="text-gray-400 text-xs">#{item.id}</Text>
        </View>
        <Text className="text-gray-400 text-xs mb-2">{item.contactEmail}</Text>
        <Text className="text-indigo-400 text-xs font-medium mb-2">
          {item.make} {item.model} · {item.color}
        </Text>
        <View className="flex-row justify-between">
          <View>
            <Text className="text-gray-500 text-xs">Pick up</Text>
            <Text className="text-gray-300 text-xs">{item.pickUpTime}</Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-500 text-xs">Return</Text>
            <Text className="text-gray-300 text-xs">{item.returnTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <Text className="text-2xl font-bold text-gray-900">Rentals</Text>
        {selectedRental ? (
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push("/rental-update")}
              className="bg-indigo-600 rounded-lg px-4 py-2"
            >
              <Text className="text-white text-sm font-semibold">Update</Text>
            </TouchableOpacity>
            {isManager && (
              <TouchableOpacity
                onPress={handleDelete}
                className="bg-red-600 rounded-lg px-4 py-2"
              >
                <Text className="text-white text-sm font-semibold">Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/rental-add")}
            className="bg-indigo-600 rounded-lg px-4 py-2 flex-row items-center gap-1"
          >
            <Ionicons name="add" size={16} color="white" />
            <Text className="text-white text-sm font-semibold">Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={rentalServices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRental}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500 text-sm">No reservations found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
