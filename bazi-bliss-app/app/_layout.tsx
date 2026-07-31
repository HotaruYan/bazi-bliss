import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Colors } from "../src/constants/theme";
import { useOnboardingStore } from "../src/store/useOnboardingStore";

const queryClient = new QueryClient();

export default function RootLayout() {
  const checkOnboarding = useOnboardingStore((s) => s.checkOnboarding);

  useEffect(() => {
    checkOnboarding();
  }, []);

  return (
    <View style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="privacy" />
          <Stack.Screen name="terms" />
          <Stack.Screen name="report" />
          <Stack.Screen
            name="(modals)"
            options={{ presentation: "modal" }}
          />
        </Stack>
      </QueryClientProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
});
