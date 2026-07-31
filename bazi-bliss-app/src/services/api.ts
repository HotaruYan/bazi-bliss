/**
 * API Client
 *
 * 统一 HTTP 请求封装，自动附带 JWT 认证头
 * 环境变量通过 app.json extra 配置
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const TOKEN_KEY = "@bazi_bliss_token";

function getApiBaseUrl(): string {
  const extra = Constants.expoConfig?.extra as Record<string, string> | undefined;
  if (extra?.apiBaseUrl) return extra.apiBaseUrl;
  // fallback
  return __DEV__
    ? "http://localhost:3000/api/mobile"
    : "https://bazibliss.com/api/mobile";
}

const API_BASE = getApiBaseUrl();

let cachedToken: string | null = null;

export async function setToken(token: string | null): Promise<void> {
  cachedToken = token;
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}

async function getToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;
  cachedToken = await AsyncStorage.getItem(TOKEN_KEY);
  return cachedToken;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const { method = "GET", body } = options;
  const token = await getToken();

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      return { data: null, error: json?.error || `HTTP ${res.status}`, status: res.status };
    }

    return { data: json as T, error: null, status: res.status };
  } catch (err: any) {
    return { data: null, error: err.message || "Network error", status: 0 };
  }
}

export const api = {
  get: <T = unknown>(path: string) => apiRequest<T>(path),
  post: <T = unknown>(path: string, body?: unknown) => apiRequest<T>(path, { method: "POST", body }),
  patch: <T = unknown>(path: string, body?: unknown) => apiRequest<T>(path, { method: "PATCH", body }),
  delete: <T = unknown>(path: string) => apiRequest<T>(path, { method: "DELETE" }),
};
