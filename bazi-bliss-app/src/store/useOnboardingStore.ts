import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "@bazi_bliss_onboarded";

interface OnboardingState {
  hasOnboarded: boolean;
  loading: boolean;
  checkOnboarding: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasOnboarded: false,
  loading: true,

  checkOnboarding: async () => {
    try {
      const val = await AsyncStorage.getItem(ONBOARDING_KEY);
      set({ hasOnboarded: val === "true", loading: false });
    } catch {
      set({ hasOnboarded: false, loading: false });
    }
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    set({ hasOnboarded: true });
  },
}));
