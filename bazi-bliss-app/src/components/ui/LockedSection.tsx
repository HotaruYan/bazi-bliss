import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, FontSize, Radius, Shadow } from "../../constants/theme";

interface Props {
  /** 报告名称，如 "Mini Reading" */
  name: string;
  /** 价格标签，如 "$6.99" */
  price: string;
  /** 预览文字（显示在未模糊区） */
  preview: string;
  /** 模糊区额外展示的标题列表 */
  sections?: string[];
  /** 点击解锁回调 */
  onPress: () => void;
  /** 报告类型标签，如 "Deep Reading" */
  badge?: string;
}

export function LockedSection({ name, price, preview, sections, onPress, badge }: Props) {
  return (
    <View style={styles.wrapper}>
      {/* 预览区（清晰可见） */}
      <View style={styles.preview}>
        <View style={styles.previewHeader}>
          <View style={styles.previewTitleRow}>
            <Text style={styles.previewTitle}>{name}</Text>
            {badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
          </View>
          <Text style={styles.price}>{price}</Text>
        </View>
        <View style={styles.rule} />
        <Text style={styles.previewText} numberOfLines={4}>{preview}</Text>
      </View>

      {/* 模糊内容区 */}
      <View style={styles.lockedContent}>
        <View style={styles.blurWrap}>
          {sections ? (
            sections.map((s, i) => (
              <View key={i}>
                <Text style={styles.blurSection}>{s}</Text>
                <Text style={styles.blurText}>
                  Your chart reveals patterns that shape your natural tendencies, strengths, and the timing of key life events. Understanding these patterns brings clarity to decisions about career, relationships, and personal growth. The full reading explores each dimension in detail with specific, actionable insights tailored to your unique birth chart configuration and current life cycle.
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.blurText}>{preview}</Text>
          )}
        </View>

        {/* 渐变底部 */}
        <View style={styles.fade} />
      </View>

      {/* 锁定覆盖层 */}
      <View style={styles.lockOverlay}>
        <View style={styles.lockIcon}>
          <Text style={styles.lockEmoji}>🔒</Text>
        </View>
        <View style={styles.lockLabel}>
          <Text style={styles.lockLabelText}>Tap to unlock</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
    backgroundColor: Colors.card,
    ...Shadow.card,
  },
  // 预览区
  preview: {
    padding: 22,
    paddingHorizontal: 18,
    paddingBottom: 0,
    position: "relative",
    zIndex: 2,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  previewTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  previewTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.2,
  },
  badge: {
    backgroundColor: "#FDF2EE",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "500",
    color: Colors.accent,
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.accent,
  },
  rule: {
    width: 28,
    height: 3,
    backgroundColor: Colors.accent,
    borderRadius: 2,
    marginBottom: 14,
  },
  previewText: {
    fontSize: 15,
    color: "#3C3C43",
    lineHeight: 26,
  },
  // 模糊内容区
  lockedContent: {
    position: "relative",
  },
  blurWrap: {
    padding: 22,
    paddingHorizontal: 18,
    paddingTop: 10,
    opacity: 0.25,
  },
  blurSection: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
    marginTop: 10,
  },
  blurText: {
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 26,
    marginBottom: 10,
  },
  fade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "transparent",
  },
  // 锁定覆盖层
  lockOverlay: {
    position: "absolute",
    top: "55%",
    left: 20,
    right: 20,
    alignItems: "center",
    gap: 14,
    zIndex: 5,
  },
  lockIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.deep,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 8,
  },
  lockEmoji: {
    fontSize: 18,
  },
  lockLabel: {
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  lockLabelText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
  },
});
