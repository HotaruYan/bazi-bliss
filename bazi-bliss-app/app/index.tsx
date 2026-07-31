import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Colors } from "../src/constants/theme";
import { useOnboardingStore } from "../src/store/useOnboardingStore";

export default function IndexScreen() {
  const { hasOnboarded, loading } = useOnboardingStore();

  useEffect(() => {
    if (!loading) {
      if (hasOnboarded) {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [loading, hasOnboarded]);

  return (
    <View style={styles.loading}>
      <ActivityIndicator color={Colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.bg,
  },
});
