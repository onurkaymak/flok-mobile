import "@/global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../store";
import { login } from "../store/user-slice";
import { User } from "../types";

function RootLayoutNav() {
  useEffect(() => {
    AsyncStorage.getItem("userData").then((raw) => {
      if (!raw) return;
      try {
        const userData: User = JSON.parse(raw);
        const isExpired = new Date(userData.tokenExpTime) <= new Date();
        if (!isExpired) {
          store.dispatch(login(userData));
        } else {
          AsyncStorage.removeItem("userData");
        }
      } catch {
        AsyncStorage.removeItem("userData");
      }
    });
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
