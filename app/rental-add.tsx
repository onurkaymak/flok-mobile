import { useState } from "react";
import {
  View,
  Text,
  TextInput,
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
import { addRentalService } from "../store/actions/rental-actions";

export default function RentalAddScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector((state) => state.user.token);
  const userId = useAppSelector((state) => state.user.userId);

  const [vin, setVin] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputClass = (field: string) =>
    `w-full bg-white border rounded-md px-3.5 py-3 text-gray-900 text-sm ${
      focusedField === field ? "border-indigo-500" : "border-gray-300"
    }`;

  const formSubmitHandler = async () => {
    if (!vin || !customerEmail || !token || !userId) return;

    setLoading(true);
    await dispatch(
      addRentalService(
        {
          vin,
          customerEmail,
          serviceAgentId: userId,
          reservationStart: startDate.toISOString(),
          reservationEnd: endDate.toISOString(),
        },
        token,
      ),
    );
    setLoading(false);
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
                textColor="#111827"
                style={{ height: 216 }}
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

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4 bg-indigo-600">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Add Reservation</Text>
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
          <Text className="text-sm font-medium text-gray-700 mb-2">Customer Email</Text>
          <TextInput
            value={customerEmail}
            onChangeText={setCustomerEmail}
            placeholder="e.g. customer@email.com"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            className={inputClass("email")}
          />
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
            <Text className="text-white font-semibold text-sm">Add Reservation</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
