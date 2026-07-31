import { View, Text, StyleSheet } from "react-native";
import { Colors, FontSize, Radius, Shadow, ELEMENT_COLORS } from "../../constants/theme";
import type { BaziChart } from "../../engine";

interface Props {
  chart: BaziChart;
}

const ELEMENT_ORDER = ["Wood", "Fire", "Earth", "Metal", "Water"];

export function ElementBars({ chart }: Props) {
  const counts = chart.elementCount;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Element Balance</Text>
      <View style={styles.bars}>
        {ELEMENT_ORDER.map((el) => {
          const count = counts[el as keyof typeof counts] ?? 0;
          const pct = Math.round((count / 8) * 100); // 八个字总共
          const color = ELEMENT_COLORS[el] ?? Colors.text;

          return (
            <View key={el} style={styles.row}>
              <Text style={styles.label}>{el}</Text>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${pct}%`,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.count}>{pct}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    ...Shadow.card,
    padding: 16,
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 14,
  },
  bars: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  label: {
    width: 52,
    fontSize: FontSize.body,
    fontWeight: "600",
    color: Colors.text,
  },
  track: {
    flex: 1,
    height: 10,
    backgroundColor: Colors.bg,
    borderRadius: 5,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 5,
  },
  count: {
    width: 24,
    textAlign: "right",
    fontSize: FontSize.body,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
});
