import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize } from "../../src/constants/theme";
import { useChartStore } from "../../src/store/useChartStore";
import {
  BirthInput,
  PillarTable,
  StrengthBadge,
  DaYunTable,
  ElementBars,
} from "../../src/components/chart";
import { SnapshotCard, LockedSection } from "../../src/components/ui";

export default function ChartScreen() {
  const { chart, daYun, strength } = useChartStore();
  const hasUnlocked = false;

  const handleUnlock = () => {};

  const chartInfo = chart
    ? `${chart.dayMaster} Water · ${chart.dayMasterYinYang} Day Master`
    : "";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Nav bar */}
        <View style={styles.navBar}>
          <Text style={styles.navBack}>Back</Text>
          <Text style={styles.navTitle}>Your Chart</Text>
          <Text style={styles.navAction}>Share</Text>
        </View>

        {/* Chart header info */}
        {chart && (
          <Text style={styles.chartHeader}>
            {chart.dayMaster} Water · {chart.dayMasterYinYang} Day Master
          </Text>
        )}

        <BirthInput />

        {chart && (
          <>
            {/* Four Pillars - 已按效果图重建 */}
            <PillarTable chart={chart} />
            <View style={styles.gap} />

            {/* Luck Cycles */}
            {daYun && (
              <>
                <DaYunTable daYun={daYun} />
                <View style={styles.gap} />
              </>
            )}

            {/* Element Balance */}
            <ElementBars chart={chart} />
            <View style={styles.gap} />

            {/* Day Master Analysis */}
            {strength && (
              <>
                <StrengthBadge chart={chart} strength={strength} />
                <View style={styles.gap} />
              </>
            )}

            {/* Personality Snapshot */}
            <View style={styles.snapshotCard}>
              <Text style={styles.snapshotLabel}>Your Chart in One Sentence</Text>
              <Text style={styles.snapshotHeadline}>
                "You are a deep ocean — calm on the surface, endlessly complex beneath. Few people truly know you."
              </Text>
              <View style={styles.snapshotTraits}>
                <View style={styles.snapshotTrait}><Text style={styles.snapshotTraitText}>Deep thinker</Text></View>
                <View style={styles.snapshotTrait}><Text style={styles.snapshotTraitText}>Fiercely independent</Text></View>
                <View style={[styles.snapshotTrait, styles.snapshotTraitHighlight]}>
                  <Text style={[styles.snapshotTraitText, { color: Colors.accent }]}>Natural leader</Text>
                </View>
                <View style={styles.snapshotTrait}><Text style={styles.snapshotTraitText}>Selective with trust</Text></View>
              </View>
              <View style={styles.snapshotDivider} />
              <Text style={styles.snapshotChallenge}>
                <Text style={{ fontWeight: "600", color: "#636366" }}>Your hidden challenge: </Text>
                You hold everything inside until the weight becomes too much. Learning when to let others in is not weakness — it's the thing that will set you free.
              </Text>
              <TouchableOpacity onPress={handleUnlock}>
                <Text style={styles.snapshotCta}>
                  Unlock your full reading to understand why — and what to do about it →
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.gap} />

            {/* YOUR READING 分割线 */}
            <View style={styles.sectionDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>YOUR READING</Text>
              <View style={styles.dividerLine} />
            </View>

            {hasUnlocked ? (
              <>
                {/* Mini Reading - unlocked */}
                <View style={styles.unlockedCard}>
                  <View style={styles.unlockedHeader}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <Text style={styles.unlockedTitle}>Mini Reading</Text>
                    </View>
                    <Text style={styles.unlockedPrice}>$6.99</Text>
                  </View>
                  <View style={styles.rule} />
                  <Text style={styles.paragraph}>
                    Born under the sign of Ren (壬) — the Yang Water of the great ocean. You feel everything deeply, but most people will never know it. Your strength is quiet. Your power is patience.
                  </Text>
                  <Text style={styles.paragraph}>
                    Your Day Master is Yang Water, which makes you naturally intuitive. You read people well, sometimes without realizing it. Your chart shows strong Adversity Star energy — you actually work better under pressure than most.
                  </Text>
                </View>
              </>
            ) : (
              <>
                {/* Mini Reading - locked */}
                <LockedSection
                  name="Mini Reading"
                  price="$6.99"
                  preview="Born under the sign of Ren (壬) — the Yang Water of the great ocean. You feel everything deeply, but most people will never know it. Your strength is quiet. Your power is patience..."
                  onPress={handleUnlock}
                />

                {/* Life Blueprint - locked */}
                <LockedSection
                  name="Life Blueprint"
                  price="$39.99"
                  badge="Deep Reading"
                  preview="This is the full picture. Includes everything in Mini Reading plus your Day Master deep dive, career direction, love patterns, wealth blueprint, health guidance, and a complete luck cycle breakdown..."
                  sections={["Career & Direction", "Relationships & Love", "Wealth Blueprint", "Health & Energy"]}
                  onPress={handleUnlock}
                />

                {/* Year Ahead - locked */}
                <LockedSection
                  name="Year Ahead"
                  price="$19.99"
                  preview="August 2026 – July 2027 · 12 months, broken down month by month. Which months to push forward, which months to hold back. A practical weather forecast for your year..."
                  onPress={handleUnlock}
                />
              </>
            )}

            {/* Annual Pass */}
            <View style={styles.annualPass}>
              <Text style={styles.annualIcon}>☽</Text>
              <View style={styles.annualInfo}>
                <Text style={styles.annualTitle}>Annual Pass</Text>
                <Text style={styles.annualDesc}>
                  Unlock everything + 5-year monthly forecast via push notification on the 1st of each month.
                </Text>
              </View>
              <Text style={styles.annualPrice}>$99.99</Text>
            </View>

            {/* 底部提示 */}
            <Text style={styles.bottomHint}>
              Tap any lock to see all 4 options. One-time purchase. Read forever.
            </Text>
          </>
        )}

        <View style={styles.bottom} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    paddingHorizontal: 16,
  },
  // Nav
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  navBack: {
    fontSize: 16,
    color: Colors.accent,
    fontWeight: "400",
  },
  navTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.text,
  },
  navAction: {
    fontSize: 16,
    color: Colors.accent,
    fontWeight: "500",
  },
  chartHeader: {
    fontSize: 13,
    color: Colors.textSecondary,
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
  gap: {
    height: 14,
  },
  // Personality Snapshot
  snapshotCard: {
    marginHorizontal: 0,
    padding: 20,
    paddingHorizontal: 18,
    backgroundColor: "#FDF9F7",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F5E8E0",
    position: "relative",
    overflow: "hidden",
  },
  snapshotLabel: {
    fontSize: 10,
    color: Colors.accent,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  snapshotHeadline: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
    lineHeight: 18,
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  snapshotTraits: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  snapshotTrait: {
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#F0E8E0",
  },
  snapshotTraitHighlight: {
    borderColor: "#F5E0D5",
  },
  snapshotTraitText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#636366",
  },
  snapshotDivider: {
    height: 0.5,
    backgroundColor: "#F0E8E0",
    marginTop: 8,
    marginBottom: 8,
  },
  snapshotChallenge: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  snapshotCta: {
    fontSize: 11,
    color: Colors.accent,
    fontWeight: "500",
    marginTop: 10,
    letterSpacing: 0.2,
  },
  // Section Divider
  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 18,
    paddingTop: 8,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: "#EBE7E0",
  },
  dividerText: {
    fontSize: 11,
    color: Colors.accent,
    fontWeight: "600",
    letterSpacing: 1,
  },
  // Unlocked content
  unlockedCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 22,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  unlockedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  unlockedTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.2,
  },
  unlockedPrice: {
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
  paragraph: {
    fontSize: 15,
    color: "#3C3C43",
    lineHeight: 26,
    marginBottom: 10,
  },
  // Annual Pass
  annualPass: {
    marginTop: 0,
    marginBottom: 14,
    padding: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.deep,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  annualIcon: {
    fontSize: 22,
  },
  annualInfo: {
    flex: 1,
  },
  annualTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textOnDark,
  },
  annualDesc: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    lineHeight: 21,
    marginTop: 2,
  },
  annualPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.accent,
  },
  bottomHint: {
    textAlign: "center",
    fontSize: 11,
    color: Colors.textSecondary,
    paddingBottom: 20,
  },
  bottom: {
    height: 100,
  },
});
