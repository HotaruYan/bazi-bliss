/**
 * RevenueCat IAP 服务
 *
 * 管理 Apple IAP 购买生命周期：
 * - 获取产品列表
 * - 发起购买
 * - 恢复购买
 * - 同步权益到后端
 */

import type {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
} from "react-native-purchases";
import { Platform } from "react-native";

const Purchases: any =
  Platform.OS === "ios" ? require("react-native-purchases") : null;
import Constants from "expo-constants";
import { api } from "./api";

// 权益 ID 映射
export const ENTITLEMENTS = {
  LIFE_BLUEPRINT: "life_blueprint",
  YEAR_AHEAD: "year_ahead",
  ANNUAL_PASS: "annual_pass",
} as const;

function getRevenueCatApiKey(): string {
  const extra = Constants.expoConfig?.extra as Record<string, string> | undefined;
  if (!extra) {
    console.error("No expo config extra found — IAP will not work");
    return "";
  }
  return extra.environment === "production"
    ? extra.revenuecatAppleApiKeyProduction
    : extra.revenuecatAppleApiKey;
}

// ── 初始化 ──

let _initialized = false;

export function initRevenueCat(): void {
  if (Platform.OS !== "ios" || _initialized) return;

  const apiKey = getRevenueCatApiKey();
  if (!apiKey) {
    console.error("RevenueCat API key not configured");
    return;
  }

  Purchases.configure({
    apiKey,
    // 调试时可开启详细日志
    ...(Constants.expoConfig?.extra as any)?.environment !== "production"
      ? { diagnosticsEnabled: true }
      : {},
  });

  _initialized = true;
}

// ── 产品 ──

export async function getOfferings(): Promise<PurchasesOffering | null> {
  if (!Purchases) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current || null;
  } catch (err) {
    console.error("Failed to get offerings:", err);
    return null;
  }
}

// ── 购买 ──

export async function purchasePackage(pkg: PurchasesPackage): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> {
  if (!Purchases) return { success: false, error: "IAP is only available on iOS" };
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    await syncEntitlements(customerInfo);
    return { success: true, customerInfo };
  } catch (err: any) {
    if (err.userCancelled) {
      return { success: false, error: "Purchase cancelled" };
    }
    console.error("Purchase failed:", err);
    return { success: false, error: err.message || "Purchase failed" };
  }
}

// ── 恢复 ──

export async function restorePurchases(): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> {
  if (!Purchases) return { success: false, error: "IAP is only available on iOS" };
  try {
    const customerInfo = await Purchases.restorePurchases();
    await syncEntitlements(customerInfo);
    return { success: true, customerInfo };
  } catch (err: any) {
    console.error("Restore failed:", err);
    return { success: false, error: err.message || "Restore failed" };
  }
}

// ── 权益同步 ──

async function syncEntitlements(customerInfo: CustomerInfo): Promise<void> {
  const activeEntitlements = Object.entries(customerInfo.entitlements.active)
    .filter(([, info]) => info.isActive)
    .map(([id]) => id);

  for (const entitlementId of activeEntitlements) {
    await api.post("/iap/verify", {
      entitlementId,
      active: true,
    });
  }
}

export function isEntitlementActive(
  customerInfo: CustomerInfo,
  entitlementId: string
): boolean {
  return customerInfo.entitlements.active[entitlementId]?.isActive ?? false;
}
