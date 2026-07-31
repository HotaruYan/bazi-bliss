import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, FontSize, Radius, Shadow, ELEMENT_COLORS } from "../../constants/theme";
import type { BaziChart } from "../../engine";
import { STEM_ELEMENT, BRANCH_ELEMENT, getTenGod } from "../../engine";
import { TermModal } from "../report/TermModal";

interface Props {
  chart: BaziChart;
}

const PILLARS = ["year", "month", "day", "hour"] as const;

// 十神英文名（Main Star 行用全称）
const TEN_GOD_FULL: Record<string, string> = {
  "正官": "Direct Officer", "七杀": "Seven Killings",
  "正财": "Direct Wealth", "偏财": "Indirect Wealth",
  "正印": "Direct Resource", "偏印": "Indirect Resource",
  "食神": "Eating God", "伤官": "Hurting Officer",
  "比肩": "Friend", "劫财": "Rob Wealth",
  "日主": "Day Master",
};

// 十神英文缩略（Sub Star 行用）
const TEN_GOD_SHORT: Record<string, string> = {
  "正官": "Authority", "七杀": "Challenger",
  "正财": "Dir.Wealth", "偏财": "Ind.Wealth",
  "正印": "Resource", "偏印": "Ind.Res.",
  "食神": "Talent", "伤官": "Maverick",
  "比肩": "Ally", "劫财": "Rival",
};

// 神煞英文
const SPIRIT_EN: Record<string, string> = {
  "天乙贵人": "Heavenly Noble", "文昌": "Literary Star",
  "桃花": "Peach Blossom", "驿马": "Traveling Horse",
  "羊刃": "Yang Blade", "华盖": "Canopy Star",
  "禄": "Prosperity",
};

function charColor(char: string): string {
  const elem = STEM_ELEMENT[char] || BRANCH_ELEMENT[char];
  return ELEMENT_COLORS[elem] || Colors.text;
}

function getSubStars(chart: BaziChart, pillar: "year" | "month" | "day" | "hour"): string[] {
  const p = chart[`${pillar}Pillar`] as BaziChart["yearPillar"];
  return p.hiddenStems.map((stem: string) => {
    const tg = getTenGod(chart.dayMaster, stem, "other");
    return TEN_GOD_SHORT[tg] || tg;
  });
}

export function PillarTable({ chart }: Props) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const colLabel = (p: typeof PILLARS[number]) =>
    p === "year" ? "Year" : p === "month" ? "Month" : p === "day" ? "Day" : "Hour";

  const getPillar = (p: typeof PILLARS[number]) =>
    chart[`${p}Pillar`] as BaziChart["yearPillar"];

  const isDayCol = (p: typeof PILLARS[number]) => p === "day";

  const renderTappableChar = (char: string) => (
    <TouchableOpacity key={char + Math.random()} onPress={() => setSelectedTerm(char)}>
      <Text style={[styles.tappableChar, { color: charColor(char) }, styles.stemBranchChar]}>
        {char}
      </Text>
    </TouchableOpacity>
  );

  const renderHiddenCell = (p: typeof PILLARS[number]) => {
    const hidden = getPillar(p).hiddenStems as readonly string[];
    return (
      <View style={styles.hiddenCellWrap}>
        {hidden.map((h: string, i: number) => (
          <TouchableOpacity key={i} onPress={() => setSelectedTerm(h)}>
            <Text style={[styles.hiddenChar, { color: charColor(h) }]}>{h}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Four Pillars</Text>
      <Text style={styles.tapHint}>Tap any Chinese character or term to learn its meaning</Text>

      {/* 表头 */}
      <View style={styles.headerRow}>
        <View style={styles.labelCol} />
        {PILLARS.map((p) => (
          <View key={p} style={[styles.col, isDayCol(p) && styles.dmCol]}>
            <Text style={styles.headerText}>{colLabel(p)}</Text>
            {isDayCol(p) && <Text style={styles.dmStar}>★</Text>}
          </View>
        ))}
      </View>

      {/* Main Star 行 */}
      <View style={styles.row}>
        <View style={styles.labelCol}>
          <Text style={styles.labelText}>Main Star</Text>
        </View>
        {PILLARS.map((p) => (
          <View key={p} style={[styles.col, isDayCol(p) && styles.dmCol]}>
            <TouchableOpacity onPress={() => setSelectedTerm(chart.tenGods[p])}>
              <Text style={styles.mainStarCell}>
                {p === "day" ? "Day Master" : TEN_GOD_FULL[chart.tenGods[p]] || chart.tenGods[p]}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Stem 行 */}
      <View style={[styles.row, styles.rowDivider]}>
        <View style={styles.labelCol}>
          <Text style={styles.labelText}>Stem</Text>
        </View>
        {PILLARS.map((p) => (
          <View key={p} style={[styles.col, isDayCol(p) && styles.dmCol]}>
            {renderTappableChar(getPillar(p).stem)}
          </View>
        ))}
      </View>

      {/* Branch 行 */}
      <View style={[styles.row, styles.rowDivider]}>
        <View style={styles.labelCol}>
          <Text style={styles.labelText}>Branch</Text>
        </View>
        {PILLARS.map((p) => (
          <View key={p} style={[styles.col, isDayCol(p) && styles.dmCol]}>
            {renderTappableChar(getPillar(p).branch)}
          </View>
        ))}
      </View>

      {/* Hidden 行 */}
      <View style={styles.row}>
        <View style={styles.labelCol}>
          <Text style={styles.labelText}>Hidden</Text>
        </View>
        {PILLARS.map((p) => (
          <View key={p} style={[styles.col, isDayCol(p) && styles.dmCol]}>
            {renderHiddenCell(p)}
          </View>
        ))}
      </View>

      {/* Sub Star 行 */}
      <View style={styles.row}>
        <View style={styles.labelCol}>
          <Text style={styles.labelText}>Sub Star</Text>
        </View>
        {PILLARS.map((p) => {
          const subs = getSubStars(chart, p);
          return (
            <View key={p} style={[styles.col, isDayCol(p) && styles.dmCol]}>
              <Text style={styles.subStarCell}>
                {subs.length > 0 ? subs.join("\n") : "-"}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Spirit 行 */}
      <View style={styles.row}>
        <View style={styles.labelCol}>
          <Text style={styles.labelText}>Spirit</Text>
        </View>
        {PILLARS.map((p) => {
          const spirits = chart.spirits[p].map((s: string) => SPIRIT_EN[s] || s);
          return (
            <View key={p} style={[styles.col, isDayCol(p) && styles.dmCol]}>
              <Text style={styles.shenshaCell}>
                {spirits.length > 0 ? spirits.join("\n") : "-"}
              </Text>
            </View>
          );
        })}
      </View>

      <TermModal
        visible={selectedTerm !== null}
        term={selectedTerm ?? ""}
        onClose={() => setSelectedTerm(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    ...Shadow.card,
    padding: 18,
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  tapHint: {
    fontSize: FontSize.tiny,
    color: "#C7C7CC",
    fontWeight: "400",
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowDivider: {
    borderBottomWidth: 0.5,
    borderColor: Colors.bg,
  },
  labelCol: {
    width: 58,
    paddingVertical: 6,
    paddingLeft: 0,
    justifyContent: "center",
  },
  col: {
    flex: 1,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  dmCol: {
    backgroundColor: "rgba(200,132,110,0.04)",
  },
  dmStar: {
    fontSize: 8,
    color: Colors.accent,
    fontWeight: "700",
    position: "absolute",
    top: 0,
    right: 6,
  },
  headerText: {
    fontSize: FontSize.tiny,
    fontWeight: "500",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  labelText: {
    fontSize: FontSize.tiny,
    color: Colors.textSecondary,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  stemBranchChar: {
    fontSize: 20,
    fontWeight: "600",
    paddingVertical: 4,
  },
  mainStarCell: {
    fontSize: FontSize.caption,
    fontWeight: "600",
    color: Colors.accent,
    paddingVertical: 4,
  },
  hiddenCellWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 4,
  },
  hiddenChar: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 1,
  },
  subStarCell: {
    fontSize: 9,
    fontWeight: "500",
    color: Colors.accent,
    textAlign: "center",
    lineHeight: 13,
    paddingVertical: 2,
  },
  shenshaCell: {
    fontSize: 9,
    fontWeight: "400",
    color: "#A0A0A8",
    textAlign: "center",
    lineHeight: 13,
    paddingVertical: 2,
  },
  tappableChar: {
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
    textDecorationColor: Colors.accent + "40",
  },
});
