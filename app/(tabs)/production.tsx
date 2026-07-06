import { useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchLeaderboard,
  fetchDetailingServices,
} from "../../store/actions/production-actions";
import { productionActions } from "../../store/slices/production-slice";
import type { DetailingService } from "../../types";

export default function ProductionScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const token = useAppSelector((state) => state.user.token);
  const userRole = useAppSelector((state) => state.user.userRole);
  const leaderboard = useAppSelector((state) => state.production.leaderboard);
  const detailingServices = useAppSelector((state) => state.production.detailingServices);

  const canAdd = userRole === "MANAGER" || userRole === "AUTO DETAILER";

  useFocusEffect(
    useCallback(() => {
      dispatch(productionActions.resetDetailingServices());
      if (token) {
        dispatch(fetchLeaderboard(token));
        dispatch(fetchDetailingServices(token));
      }
    }, [token]),
  );

  const renderRecord = ({ item }: { item: DetailingService }) => (
    <View className="mx-4 mb-3 bg-gray-800 rounded-xl p-4">
      <View className="flex-row justify-between items-start mb-1">
        <Text className="text-white font-bold text-sm">
          {item.make} {item.model}
        </Text>
        <Text className="text-gray-500 text-xs">{item.createdAt}</Text>
      </View>
      <Text className="text-gray-400 text-xs mb-1">VIN: {item.vin}</Text>
      <Text className="text-indigo-400 text-xs font-medium">{item.detailerName}</Text>
    </View>
  );

  const ListHeader = () => (
    <View>
      <View className="mx-4 mb-4 bg-gray-800 rounded-xl p-4">
        <Text className="text-white font-bold text-base mb-3">
          Today's Leaderboard
        </Text>
        {leaderboard.length === 0 ? (
          <Text className="text-gray-500 text-sm">
            No detailing records for today yet.
          </Text>
        ) : (
          <>
            <View className="flex-row justify-between pb-2 mb-1 border-b border-gray-700">
              <Text className="text-gray-500 text-xs font-medium w-8">Rank</Text>
              <Text className="text-gray-500 text-xs font-medium flex-1">Detailer</Text>
              <Text className="text-gray-500 text-xs font-medium">Cars</Text>
            </View>
            {leaderboard.map((entry, index) => (
              <View
                key={entry.name}
                className="flex-row items-center py-2.5 border-b border-gray-700"
              >
                <Text className="text-gray-500 text-sm w-8">#{index + 1}</Text>
                <Text className="text-gray-200 text-sm flex-1">{entry.name}</Text>
                <Text className="text-indigo-400 font-semibold text-sm">
                  {entry.count}
                </Text>
              </View>
            ))}
          </>
        )}
      </View>

      {detailingServices.length > 0 && (
        <Text className="text-xs font-semibold text-gray-500 uppercase mx-4 mb-3 tracking-wide">
          Recent Records
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <Text className="text-2xl font-bold text-gray-900">Production</Text>
        {canAdd && (
          <TouchableOpacity
            onPress={() => router.push("/production-add")}
            className="bg-indigo-600 rounded-lg px-4 py-2 flex-row items-center gap-1"
          >
            <Ionicons name="add" size={16} color="white" />
            <Text className="text-white text-sm font-semibold">Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={detailingServices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecord}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className="text-gray-500 text-sm">No detailing records found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
