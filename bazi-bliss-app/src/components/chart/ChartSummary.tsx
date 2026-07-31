import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Radius, Shadow } from "../../constants/theme";
import type { BaziChart, StrengthResult } from "../../engine";

const DAY_MASTER_PERSONALITY: Record<string, string> = {
  "甲": "Yang Wood — a towering tree. Natural leader, direct, and pioneering.",
  "乙": "Yin Wood — a graceful vine. Adaptable, artistic, and diplomatic.",
  "丙": "Yang Fire — the midday sun. Radiant, passionate, and impossible to ignore.",
  "丁": "Yin Fire — a candle flame. Focused, refined, and quietly intense.",
  "戊": "Yang Earth — a mountain. Stable, honest, and immovable when committed.",
  "己": "Yin Earth — garden soil. Nurturing, careful, and endlessly supportive.",
  "庚": "Yang Metal — an axe blade. Determined, bold, and transformative.",
  "辛": "Yin Metal — fine jewelry. Elegant, precise, and values quality over quantity.",
  "壬": "Yang Water — the ocean. Wise, persuasive, and deep beyond measure.",
  "癸": "Yin Water — morning dew. Intuitive, mysterious, and quietly powerful.",
};

function getFavorableHint(strength: StrengthResult): string {
  const fav = strength.allFavorable ?? [];
  if (fav.length === 0) return "";
  const joined = fav.join(" and ");
  if (strength.isStrong) {
    return `Balance through ${joined}`;
  }
  return `Thrives with ${joined}`;
}

interface Props {
  chart: BaziChart;
  strength: StrengthResult;
  onUnlock?: () => void;
}

export function ChartSummary({ chart, strength, onUnlock }: Props) {
  const personality = DAY_MASTER_PERSONALITY[chart.dayMaster] ?? "";
  const hint = getFavorableHint(strength);

  return (
    <View style={styles.card}>
      {/* Hero 行：日主 + 身强身弱标签 */}
      <View style={styles.hero}>
        <View style={styles.dayMasterBadge}>
          <Text style={styles.dmChar}>{chart.dayMaster}</Text>
        </View>
        <View style={styles.heroText}>
          <Text style={styles.dmLabel}>
            {chart.dayMaster} · {chart.dayMasterYinYang} {chart.dayMasterElement}
          </Text>
          <Text style={styles.personality}>{personality}</Text>
        </View>
      </View>

      {/* 身强身弱 */}
      <View style={styles.strengthRow}>
        <View
          style={[
            styles.strengthBadge,
            strength.isStrong ? styles.strong : styles.weak,
          ]}
        >
          <Text
            style={[
              styles.strengthText,
              { color: strength.isStrong ? "#E8F5E9" : "#FFF3E0" },
            ]}
          >
            {strength.level}
          </Text>
          <Text style={[styles.strengthLabel, { color: strength.isStrong ? "#A5D6A7" : "#FFCC80" }]}>
            {strength.isStrong
              ? "Resilient · Independent · Action-Oriented"
              : "Adaptable · Receptive · Collaborative"}
          </Text>
        </View>
      </View>

      {/* 喜用神 */}
      {hint ? (
        <View style={styles.favorableRow}>
          <Ionicons name="star" size={16} color={Colors.accent} />
          <Text style={styles.favorableText}>
            {hint} —{" "}
            <Text style={styles.favorableHighlight}>
              {strength.allFavorable.map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join(" + ")}
            </Text>
          </Text>
        </View>
      ) : null}

      {/* 付费 CTA */}
      {onUnlock && (
        <TouchableOpacity style={styles.cta} onPress={onUnlock} activeOpacity={0.85}>
          <View style={styles.ctaContent}>
            <Ionicons name="sparkles" size={18} color="#FFF" />
            <View style={styles.ctaTextWrap}>
              <Text style={styles.ctaTitle}>Unlock Your Life Blueprint</Text>
              <Text style={styles.ctaSub}>
                Full Bazi analysis · Life path · AI-powered guidance
              </Text>
            </View>
          </View>
          <Text style={styles.ctaPrice}>$39.99</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    ...Shadow.card,
    padding: 18,
    gap: 14,
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  dayMasterBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent + "15",
    borderWidth: 2,
    borderColor: Colors.accent + "40",
    justifyContent: "center",
    alignItems: "center",
  },
  dmChar: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.accent,
  },
  heroText: {
    flex: 1,
  },
  dmLabel: {
    fontSize: FontSize.body,
    fontWeight: "700",
    color: Colors.text,
  },
  personality: {
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 3,
  },
  strengthRow: {
    borderRadius: Radius.md,
    overflow: "hidden",
  },
  strengthBadge: {
    borderRadius: Radius.md,
    padding: 12,
  },
  strong: {
    backgroundColor: "#2E7D32",
  },
  weak: {
    backgroundColor: "#E65100",
  },
  strengthText: {
    fontSize: FontSize.body,
    fontWeight: "700",
  },
  strengthLabel: {
    fontSize: FontSize.caption,
    marginTop: 2,
  },
  favorableRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: Colors.bg,
    borderRadius: Radius.md,
    padding: 12,
  },
  favorableText: {
    flex: 1,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  favorableHighlight: {
    color: Colors.accent,
    fontWeight: "700",
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.deep,
    borderRadius: Radius.md,
    padding: 14,
  },
  ctaContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  ctaTextWrap: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: FontSize.body,
    fontWeight: "700",
    color: "#FFF",
  },
  ctaSub: {
    fontSize: FontSize.caption,
    color: "rgba(255,255,255,0.6)",
    marginTop: 1,
  },
  ctaPrice: {
    fontSize: FontSize.body,
    fontWeight: "700",
    color: Colors.accent,
    paddingLeft: 8,
  },
});
