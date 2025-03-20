import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  

  return (
    <QueryClientProvider client={queryClient}>
      <Toast />
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="addService"
              options={{ headerTitle: "Ajukan servis" }}
            />
            <Stack.Screen
              name="transportation"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="transportationDetail"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="addTransportation"
              options={{ headerTitle: "Tambah Transportasi" }}
            />
            <Stack.Screen
              name="histories"
              options={{ headerTitle: "Histori Perbaikan" }}
            />
            <Stack.Screen
              name="historyDetail"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="privacyTerms"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="login" options={{ headerShown: false }} />
          </Stack>
          {/* <Slot /> */}
          {/* <StatusBar style="auto" /> */}
        </ThemeProvider>
    </QueryClientProvider>
  );
}
