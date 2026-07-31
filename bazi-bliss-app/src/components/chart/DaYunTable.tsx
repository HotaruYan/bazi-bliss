import { View, Text, StyleSheet } from "react-native";
import { Colors, FontSize, Radius, Shadow } from "../../constants/theme";
import type { DaYunResult } from "../../engine";

interface Props {
  daYun: DaYunResult;
}

const TEN_GOD_EN: Record<string, string> = {
  "正官": "Direct Officer", "七杀": "Seven Killings",
  "正财": "Direct Wealth", "偏财": "Indirect Wealth",
  "正印": "Direct Resource", "偏印": "Indirect Resource",
  "食神": "Eating God", "伤官": "Hurting Officer",
  "比肩": "Friend", "劫财": "Rob Wealth",
};

export function DaYunTable({ daYun }: Props) {
  const age = `${daYun.startAgeYears}y${daYun.startAgeMonths}m`;
  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Luck Cycles (大运)</Text>
      <Text style={styles.cardSub}>Start Age: {age} · {daYun.direction === "forward" ? "Forward" : "Backward"}</Text>

      {/* 表头 */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, styles.ageCol]}>Age</Text>
        <Text style={[styles.headerText, styles.pillarCol]}>Pillar</Text>
        <Text style={[styles.headerText, { flex: 1 }]}>Ten God</Text>
        <Text style={[styles.headerText, styles.yearsCol]}>Years</Text>
      </View>

      {/* 数据行 */}
      {daYun.cycles.slice(0, 8).map((cycle, i) => {
        const isCurrent = currentYear >= cycle.startYear && currentYear <= cycle.endYear;
        const tgEn = TEN_GOD_EN[cycle.tenGod] || cycle.tenGod;

        return (
          <View key={i} style={[styles.row, isCurrent && styles.currentRow]}>
            <Text style={[styles.ageText, styles.ageCol, isCurrent && styles.currentText]}>
              {cycle.startAge}–{cycle.endAge}
            </Text>
            <Text style={[styles.pillarText, styles.pillarCol, isCurrent && styles.currentText]}>
              {cycle.stem}{cycle.branch}
            </Text>
            <Text style={[styles.tenGodText, { flex: 1 }, isCurrent && styles.currentText]}>
              {tgEn}
            </Text>
            <Text style={[styles.yearsText, styles.yearsCol, isCurrent && styles.currentText]}>
              {cycle.startYear}–{cycle.endYear}
            </Text>
          </View>
        );
      })}

      {/* 当前大运说明 */}
      {(() => {
        const currentCycle = daYun.cycles.find(
          (c) => currentYear >= c.startYear && currentYear <= c.endYear
        );
        if (!currentCycle) return null;
        const tgEn = TEN_GOD_EN[currentCycle.tenGod] || currentCycle.tenGod;
        return (
          <Text style={styles.currentNote}>
            ● Current cycle: {currentCycle.stem}{currentCycle.branch} ({tgEn}) — a decade of learning, support, and inner growth.
          </Text>
        );
      })()}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 22,
    paddingHorizontal: 18,
    ...Shadow.card,
    marginHorizontal: 0,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#F5F2EC",
    paddingBottom: 8,
  },
  headerText: {
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "500",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "#F9F6F1",
    paddingVertical: 10,
  },
  currentRow: {
    backgroundColor: "#FDF2EE",
    borderRadius: 8,
    marginVertical: 0,
  },
  ageCol: {
    width: 44,
    textAlign: "center",
  },
  pillarCol: {
    width: 54,
    textAlign: "center",
  },
  yearsCol: {
    width: 80,
    textAlign: "center",
  },
  ageText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  pillarText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#636366",
    textAlign: "center",
  },
  tenGodText: {
    fontSize: 11,
    color: Colors.accent,
    fontWeight: "500",
    textAlign: "center",
  },
  yearsText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  currentText: {
    color: Colors.accent,
    fontWeight: "600",
  },
  currentNote: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 10,
    paddingHorizontal: 4,
    lineHeight: 18,
  },
});
