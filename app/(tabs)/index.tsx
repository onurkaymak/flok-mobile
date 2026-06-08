import { useEffect, useCallback, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchVehicles } from "../../store/actions/fleet-actions";
import { fetchRentalServiceList } from "../../store/actions/rental-actions";
import { fetchLeaderboard } from "../../store/actions/production-actions";
import { fleetActions } from "../../store/slices/fleet-slice";
import { rentalActions } from "../../store/slices/rental-slice";
import { productionActions } from "../../store/slices/production-slice";

interface WeatherData {
  city: string;
  temp: number;
  description: string;
  icon: string;
}

const getWeatherDescription = (code: number): string => {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 9) return "Foggy";
  if (code <= 29) return "Rain";
  if (code <= 49) return "Freezing rain";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 84) return "Rain showers";
  if (code <= 94) return "Thunderstorm";
  return "Stormy";
};

const getWeatherIcon = (code: number): string => {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 9) return "🌫️";
  if (code <= 39) return "🌧️";
  if (code <= 79) return "❄️";
  if (code <= 84) return "🌦️";
  return "⛈️";
};

interface StatCardProps {
  title: string;
  value: number | string;
  sub?: string;
  iconName: string;
  accent: string;
}

const StatCard = ({ title, value, sub, iconName, accent }: StatCardProps) => (
  <View className="bg-gray-800 rounded-xl p-4 flex-1 border border-gray-700">
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-xs font-medium text-gray-400" numberOfLines={1}>
        {title}
      </Text>
      <View className={`p-1.5 rounded-lg ${accent}`}>
        <Ionicons name={iconName as any} size={16} color="white" />
      </View>
    </View>
    <Text className="text-3xl font-bold text-white">{value}</Text>
    {sub && <Text className="text-xs text-gray-500 mt-1">{sub}</Text>}
  </View>
);

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const { token, userName } = useAppSelector((state) => state.user);
  const vehicles = useAppSelector((state) => state.fleet.vehicles);
  const rentalServices = useAppSelector((state) => state.rental.rentalServices);
  const leaderboard = useAppSelector((state) => state.production.leaderboard);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState(false);

  const totalVehicles = vehicles.length;
  const rentedVehicles = vehicles.filter((v) => v.isRented).length;
  const activeReservations = rentalServices.length;
  const cleanedToday = leaderboard.reduce((sum, e) => sum + e.count, 0);

  const fetchData = useCallback(() => {
    dispatch(fleetActions.resetVehicles());
    dispatch(rentalActions.resetRentalServices());
    dispatch(productionActions.resetDetailingServices());
    dispatch(fetchVehicles(token!));
    dispatch(fetchRentalServiceList(token!));
    dispatch(fetchLeaderboard(token!));
  }, [dispatch, token]);

  useEffect(() => {
    fetchData();

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setWeatherError(true);
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode&temperature_unit=fahrenheit`,
        );
        const weatherData = await weatherRes.json();
        const temp = Math.round(weatherData.current.temperature_2m);
        const code = weatherData.current.weathercode;

        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        );
        const geoData = await geoRes.json();
        const city =
          geoData.address.city ||
          geoData.address.town ||
          geoData.address.village ||
          "Your location";

        setWeather({ city, temp, description: getWeatherDescription(code), icon: getWeatherIcon(code) });
      } catch {
        setWeatherError(true);
      }
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView contentContainerStyle={{ padding: 20 }}>

        {/* Header */}
        <View className="mb-6">
          <Text className="text-4xl font-bold text-white">Dashboard</Text>
          <Text className="text-gray-500 mt-1">
            Welcome back,{" "}
            <Text className="font-medium text-gray-300">{userName}</Text>
          </Text>
        </View>

        {/* Stat cards — 2x2 grid */}
        <View className="flex-row gap-3 mb-3">
          <StatCard
            title="Total Vehicles"
            value={totalVehicles}
            sub="In inventory"
            iconName="car-outline"
            accent="bg-indigo-600"
          />
          <StatCard
            title="Currently Rented"
            value={rentedVehicles}
            sub={`of ${totalVehicles} vehicles`}
            iconName="key-outline"
            accent="bg-emerald-600"
          />
        </View>
        <View className="flex-row gap-3 mb-6">
          <StatCard
            title="Active Reservations"
            value={activeReservations}
            sub="Ongoing bookings"
            iconName="calendar-outline"
            accent="bg-amber-600"
          />
          <StatCard
            title="Cleaned Today"
            value={cleanedToday}
            sub="By all detailers"
            iconName="sparkles-outline"
            accent="bg-sky-600"
          />
        </View>

        {/* Weather */}
        <View className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-4">
          <Text className="text-base font-semibold text-white mb-4">Weather</Text>
          {weatherError ? (
            <Text className="text-sm text-gray-500">Could not fetch weather data.</Text>
          ) : weather ? (
            <View>
              <Text className="text-sm text-gray-400 mb-3">{weather.city}</Text>
              <View className="flex-row items-center gap-4">
                <Text style={{ fontSize: 48 }}>{weather.icon}</Text>
                <View>
                  <Text className="text-4xl font-bold text-white">{weather.temp}°F</Text>
                  <Text className="text-sm text-gray-400 mt-1">{weather.description}</Text>
                </View>
              </View>
              <Text className="text-xs text-gray-600 mt-4 pt-4 border-t border-gray-700">
                Based on your current location
              </Text>
            </View>
          ) : (
            <Text className="text-sm text-gray-500">Fetching weather...</Text>
          )}
        </View>

        {/* Leaderboard */}
        <View className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <Text className="text-base font-semibold text-white mb-4">
            Detailer Leaderboard — Today
          </Text>
          {leaderboard.length === 0 ? (
            <Text className="text-sm text-gray-500">No detailing records for today yet.</Text>
          ) : (
            <View>
              <View className="flex-row pb-2 mb-1 border-b border-gray-700">
                <Text className="text-xs font-medium text-gray-500 w-10">Rank</Text>
                <Text className="text-xs font-medium text-gray-500 flex-1">Detailer</Text>
                <Text className="text-xs font-medium text-gray-500">Cleaned</Text>
              </View>
              {leaderboard.map((entry, index) => (
                <View
                  key={entry.name}
                  className="flex-row py-2.5 border-b border-gray-700"
                >
                  <Text className="text-sm text-gray-500 w-10">#{index + 1}</Text>
                  <Text className="text-sm font-medium text-gray-200 flex-1">{entry.name}</Text>
                  <Text className="text-sm font-semibold text-indigo-400">{entry.count}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
