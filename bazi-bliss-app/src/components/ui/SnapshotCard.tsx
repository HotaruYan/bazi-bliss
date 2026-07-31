import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, FontSize, Radius, Shadow } from "../../constants/theme";
import type { BaziChart } from "../../engine";
import { TermModal } from "../report/TermModal";

interface Props {
  chart: BaziChart;
}

export function SnapshotCard({ chart }: Props) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Free Preview</Text>
      </View>

      <View style={styles.pillars}>
        {(["year", "month", "day", "hour"] as const).map((pillar) => {
          const p = chart[`${pillar}Pillar` as keyof BaziChart] as any;
          return (
            <View key={pillar} style={styles.pillar}>
              <Text style={styles.pillarLabel}>
                {pillar === "year" ? "Year" : pillar === "month" ? "Month" : pillar === "day" ? "Day" : "Hour"}
              </Text>
              <TouchableOpacity onPress={() => setSelectedTerm(p.stem)}>
                <Text style={[styles.pillarStem, pillar === "day" && styles.dayMaster, styles.tappable]}>
                  {p.stem}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedTerm(p.branch)}>
                <Text style={[styles.pillarBranch, styles.tappable]}>{p.branch}</Text>
              </TouchableOpacity>
              <Text style={styles.pillarElement}>{p.branchElement}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.divider} />

      <View style={styles.quickFacts}>
        <View style={styles.fact}>
          <Text style={styles.factLabel}>Day Master</Text>
          <Text style={styles.factValue}>
            {chart.dayMaster} · {chart.dayMasterElement}
          </Text>
        </View>
        <View style={styles.fact}>
          <Text style={styles.factLabel}>Ten God · Day</Text>
          <Text style={styles.factValue}>{chart.tenGods.day}</Text>
        </View>
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
    padding: 16,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -1,
    right: 16,
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderBottomLeftRadius: Radius.sm,
    borderBottomRightRadius: Radius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.deep,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pillars: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  pillar: {
    alignItems: "center",
    flex: 1,
  },
  pillarLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  pillarStem: {
    fontSize: FontSize.h3,
    fontWeight: "700",
    color: Colors.text,
  },
  dayMaster: {
    color: Colors.accent,
  },
  pillarBranch: {
    fontSize: FontSize.body,
    fontWeight: "500",
    color: Colors.text,
  },
  pillarElement: {
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },
  quickFacts: {
    gap: 8,
  },
  fact: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  factLabel: {
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  factValue: {
    fontSize: FontSize.body,
    fontWeight: "600",
    color: Colors.text,
  },
  tappable: {
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
    textDecorationColor: Colors.accent + "60",
  },
});
