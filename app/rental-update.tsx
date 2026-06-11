import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateRentalService } from "../store/actions/rental-actions";
import { rentalActions } from "../store/slices/rental-slice";

export default function RentalUpdateScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector((state) => state.user.token);

  const rentalServices = useAppSelector((state) => state.rental.rentalServices);
  const selectedById = useAppSelector((state) => state.rental.selectedRentalServiceById);
  const rental = rentalServices.find((r) => r.id === selectedById?.[0]);

  const [startDate, setStartDate] = useState(
    rental ? new Date(rental.reservationStart) : new Date(),
  );
  const [endDate, setEndDate] = useState(
    rental ? new Date(rental.reservationEnd) : new Date(),
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const formSubmitHandler = async () => {
    if (!rental || !token) return;
    setLoading(true);
    await dispatch(
      updateRentalService(
        rental.id,
        startDate.toISOString(),
        endDate.toISOString(),
        token,
      ),
    );
    setLoading(false);
    dispatch(rentalActions.setSelectedRentalService([]));
    router.back();
  };

  const DatePickerField = ({
    label,
    date,
    showPicker,
    onOpen,
    onClose,
    onChange,
  }: {
    label: string;
    date: Date;
    showPicker: boolean;
    onOpen: () => void;
    onClose: () => void;
    onChange: (date: Date) => void;
  }) => (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <TouchableOpacity
        onPress={onOpen}
        className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-3 flex-row justify-between items-center"
      >
        <Text className="text-gray-900 text-sm">{format(date, "PPP")}</Text>
        <Ionicons name="calendar-outline" size={16} color="#9ca3af" />
      </TouchableOpacity>

      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, selected) => {
            onClose();
            if (selected) onChange(selected);
          }}
        />
      )}

      {Platform.OS === "ios" && (
        <Modal visible={showPicker} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View className="bg-white rounded-t-2xl">
              <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
                <Text className="text-base font-bold text-gray-900">{label}</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text className="text-indigo-600 font-semibold text-sm">Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={(_, selected) => {
                  if (selected) onChange(selected);
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );

  if (!rental) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <Text className="text-gray-500 text-sm">No reservation selected.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4 bg-indigo-600">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Update Reservation</Text>
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
        <View className="mb-6 bg-white border border-gray-200 rounded-xl p-4">
          <Text className="text-base font-bold text-gray-900 mb-1">{rental.contactName}</Text>
          <Text className="text-gray-500 text-sm mb-1">{rental.contactEmail}</Text>
          <Text className="text-indigo-600 text-sm font-medium">
            {rental.make} {rental.model} · {rental.color}
          </Text>
        </View>

        <DatePickerField
          label="Pick Up Date"
          date={startDate}
          showPicker={showStartPicker}
          onOpen={() => setShowStartPicker(true)}
          onClose={() => setShowStartPicker(false)}
          onChange={setStartDate}
        />

        <DatePickerField
          label="Return Date"
          date={endDate}
          showPicker={showEndPicker}
          onOpen={() => setShowEndPicker(true)}
          onClose={() => setShowEndPicker(false)}
          onChange={setEndDate}
        />

        <TouchableOpacity
          onPress={formSubmitHandler}
          className="bg-indigo-600 rounded-md py-3 items-center mt-2"
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-sm">Update Reservation</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
