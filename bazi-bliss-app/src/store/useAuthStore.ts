import { create } from "zustand";
import { signInWithApple, signOut, type AppleSignInResult } from "../services/auth";
import { setToken } from "../services/api";

interface AuthState {
  isSignedIn: boolean;
  isLoading: boolean;
  user: {
    appleId: string;
    email: string;
    name: string;
    entitlements: string[];
  } | null;
  error: string | null;

  signIn: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isSignedIn: false,
  isLoading: false,
  user: null,
  error: null,

  signIn: async () => {
    set({ isLoading: true, error: null });
    const result: AppleSignInResult = await signInWithApple();

    if (result.success && result.user) {
      set({ isSignedIn: true, isLoading: false, user: result.user });
      return true;
    } else {
      set({ isLoading: false, error: result.error || "Sign in failed" });
      return false;
    }
  },

  logout: async () => {
    await signOut();
    set({ isSignedIn: false, user: null });
  },

  clearError: () => set({ error: null }),
}));
