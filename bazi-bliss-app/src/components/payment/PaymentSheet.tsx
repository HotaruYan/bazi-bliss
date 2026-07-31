import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Radius, Shadow, Spacing } from "../../constants/theme";
import { getOfferings, purchasePackage, restorePurchases, ENTITLEMENTS } from "../../services/iap";
import type { PurchasesPackage } from "react-native-purchases";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// 静态定价（作为 fallback，优先使用 RevenueCat 动态价格）
const PRICING: Record<string, { price: string; label: string; description: string }> = {
  [ENTITLEMENTS.LIFE_BLUEPRINT]: {
    price: "$39.99",
    label: "Life Blueprint",
    description: "Complete natal chart analysis — your cosmic DNA, decoded by AI",
  },
  [ENTITLEMENTS.YEAR_AHEAD]: {
    price: "$19.99",
    label: "Year Ahead",
    description: "12-month forecast with key dates, themes, and guidance",
  },
  [ENTITLEMENTS.ANNUAL_PASS]: {
    price: "$99.99",
    label: "Annual Pass",
    description: "Life Blueprint + Year Ahead + monthly reports. Best value.",
  },
};

export function PaymentSheet({ visible, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadProducts();
    }
  }, [visible]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    const offering = await getOfferings();
    if (offering?.availablePackages?.length) {
      setPackages(offering.availablePackages);
    }
    setLoading(false);
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setPurchasing(pkg.identifier);
    setError(null);
    const result = await purchasePackage(pkg);
    setPurchasing(null);

    if (result.success) {
      onSuccess();
    } else if (result.error) {
      setError(result.error);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    setError(null);
    const result = await restorePurchases();
    setRestoring(false);

    if (result.success) {
      onSuccess();
    } else if (result.error) {
      setError(result.error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="pageSheet">
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        {/* 手柄 */}
        <View style={styles.handle} />

        {/* 头部 */}
        <View style={styles.header}>
          <Text style={styles.title}>Unlock Your Chart</Text>
          <Text style={styles.subtitle}>
            Choose a plan to access AI-powered Bazi insights
          </Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* 产品列表 */}
        <ScrollView style={styles.productList} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={Colors.accent} />
            </View>
          ) : packages.length > 0 ? (
            packages.map((pkg) => {
              const info = PRICING[pkg.identifier] || PRICING[ENTITLEMENTS.LIFE_BLUEPRINT];
              const isAnnual = pkg.identifier === ENTITLEMENTS.ANNUAL_PASS;
              const isP = purchasing === pkg.identifier;

              return (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[styles.productCard, isAnnual && styles.productCardHighlight]}
                  onPress={() => handlePurchase(pkg)}
                  disabled={!!purchasing}
                  activeOpacity={0.8}
                >
                  {isAnnual && (
                    <View style={styles.bestValue}>
                      <Text style={styles.bestValueText}>Best Value</Text>
                    </View>
                  )}
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{info.label}</Text>
                    <Text style={styles.productDesc}>{info.description}</Text>
                  </View>
                  <View style={styles.productPrice}>
                    {isP ? (
                      <ActivityIndicator color={Colors.accent} />
                    ) : (
                      <Text style={[styles.priceText, isAnnual && styles.priceTextGold]}>
                        {pkg.product.priceString ?? info.price}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            // Fallback：静态产品卡片
            <View>
              {Object.entries(PRICING).map(([id, info]) => (
                <TouchableOpacity
                  key={id}
                  style={[
                    styles.productCard,
                    id === ENTITLEMENTS.ANNUAL_PASS && styles.productCardHighlight,
                  ]}
                  onPress={() => setError("Store unavailable — please try again later")}
                  activeOpacity={0.8}
                >
                  {id === ENTITLEMENTS.ANNUAL_PASS && (
                    <View style={styles.bestValue}>
                      <Text style={styles.bestValueText}>Best Value</Text>
                    </View>
                  )}
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{info.label}</Text>
                    <Text style={styles.productDesc}>{info.description}</Text>
                  </View>
                  <View style={styles.productPrice}>
                    <Text
                      style={[
                        styles.priceText,
                        id === ENTITLEMENTS.ANNUAL_PASS && styles.priceTextGold,
                      ]}
                    >
                      {info.price}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* 错误提示 */}
          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color="#F44336" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* 恢复购买 */}
          <TouchableOpacity
            style={styles.restoreBtn}
            onPress={handleRestore}
            disabled={restoring}
          >
            {restoring ? (
              <ActivityIndicator size="small" color={Colors.textSecondary} />
            ) : (
              <Text style={styles.restoreText}>Restore Purchases</Text>
            )}
          </TouchableOpacity>

          {/* 底部说明 */}
          <Text style={styles.footer}>
            Payment will be charged to your Apple ID account. Subscriptions automatically
            renew unless cancelled at least 24 hours before the end of the current period.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 0.3,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    flex: 0.7,
    backgroundColor: Colors.card,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    ...Shadow.elevated,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginTop: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    position: "relative",
  },
  title: {
    fontSize: FontSize.h2,
    fontWeight: "700",
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 4,
  },
  productList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  productCardHighlight: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent + "08",
  },
  bestValue: {
    position: "absolute",
    top: -1,
    right: 12,
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderBottomLeftRadius: Radius.sm,
    borderBottomRightRadius: Radius.sm,
  },
  bestValueText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.deep,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: FontSize.body,
    fontWeight: "700",
    color: Colors.text,
  },
  productDesc: {
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  productPrice: {
    minWidth: 64,
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: FontSize.bodyLarge,
    fontWeight: "700",
    color: Colors.text,
  },
  priceTextGold: {
    color: Colors.accent,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F4433610",
    padding: 12,
    borderRadius: Radius.md,
    marginTop: 8,
  },
  errorText: {
    fontSize: FontSize.caption,
    color: "#F44336",
    flex: 1,
  },
  restoreBtn: {
    alignSelf: "center",
    paddingVertical: 14,
  },
  restoreText: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  footer: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
    paddingBottom: 30,
  },
});
