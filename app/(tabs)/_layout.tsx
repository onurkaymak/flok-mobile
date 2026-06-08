import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../../store/hooks";

export default function TabsLayout() {
  const { isLoggedIn, userRole } = useAppSelector((state) => state.user);

  if (!isLoggedIn) {
    return <Redirect href="/" />;
  }

  const isManager = userRole === "MANAGER";
  const isCSA = userRole === "CUSTOMER SERVICE AGENT";
  const isDetailer = userRole === "AUTO DETAILER";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4f46e5",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: { backgroundColor: "#ffffff", borderTopColor: "#e5e7eb" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          href: isManager ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fleet"
        options={{
          title: "Fleet",
          href: isManager ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rentals"
        options={{
          title: "Rentals",
          href: isManager || isCSA ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="production"
        options={{
          title: "Production",
          href: isManager || isDetailer ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="brush-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
