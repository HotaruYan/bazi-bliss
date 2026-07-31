import { View, Text, StyleSheet } from "react-native";
import { Colors, FontSize, Radius, Shadow } from "../../constants/theme";
import type { BaziChart, StrengthResult } from "../../engine";

interface Props {
  chart: BaziChart;
  strength: StrengthResult;
}

const LEVEL_EN: Record<string, string> = {
  "极强": "Very Strong", "身强": "Strong",
  "中和偏强": "Balanced+", "中和": "Balanced",
  "中和偏弱": "Balanced-", "身弱": "Weak",
  "极弱": "Very Weak",
};

export function StrengthBadge({ chart, strength }: Props) {
  const levelEn = LEVEL_EN[strength.level] ?? strength.level;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Day Master Analysis</Text>
      <View style={styles.row}>
        <View style={styles.tag}>
          <Text style={styles.tagLabel}>Strength</Text>
          <Text style={styles.tagVal}>{levelEn}</Text>
        </View>
        <View style={[styles.tag, styles.tagAccent]}>
          <Text style={styles.tagLabel}>Guide</Text>
          <Text style={[styles.tagVal, { color: Colors.accent }]}>{strength.guide}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagLabel}>Helper</Text>
          <Text style={styles.tagVal}>{strength.helper}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    ...Shadow.card,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#F9F6F1",
    alignItems: "center",
  },
  tagAccent: {
    backgroundColor: "#FDF2EE",
  },
  tagLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  tagVal: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
});
