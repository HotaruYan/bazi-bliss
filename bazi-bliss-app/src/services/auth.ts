/**
 * Apple Sign In 服务
 *
 * 处理 Apple 登录 → 后端验证 → JWT 存储流程
 */

import { Platform } from "react-native";
import { api, setToken } from "./api";

const AppleAuthentication =
  Platform.OS === "ios" ? require("expo-apple-authentication") : null;

export interface AppleSignInResult {
  success: boolean;
  error?: string;
  user?: {
    appleId: string;
    email: string;
    name: string;
    entitlements: string[];
  };
}

export async function signInWithApple(): Promise<AppleSignInResult> {
  if (!AppleAuthentication) {
    return { success: false, error: "Apple Sign In is only available on iOS" };
  }
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      return { success: false, error: "No identity token from Apple" };
    }

    // 发送到后端验证并换取 App JWT
    const { data, error, status } = await api.post<{
      token: string;
      user: { appleId: string; email: string; name: string; entitlements: string[] };
    }>("/auth/apple", {
      identityToken: credential.identityToken,
      fullName: credential.fullName
        ? {
            givenName: credential.fullName.givenName,
            familyName: credential.fullName.familyName,
          }
        : null,
    });

    if (error || !data) {
      return { success: false, error: error || "Server auth failed" };
    }

    // 持久化 JWT
    await setToken(data.token);

    return { success: true, user: data.user };
  } catch (e: any) {
    if (e.code === "ERR_REQUEST_CANCELED") {
      return { success: false, error: "Sign-in cancelled" };
    }
    return { success: false, error: e.message || "Apple Sign In failed" };
  }
}

export async function restoreToken(): Promise<string | null> {
  return null; // token 恢复由 api.ts 的 AsyncStorage 处理
}

export async function signOut(): Promise<void> {
  await setToken(null);
}
