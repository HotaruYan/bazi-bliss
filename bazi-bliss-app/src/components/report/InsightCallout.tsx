import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Radius } from "../../constants/theme";

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title?: string;
  children: string;
  variant?: "insight" | "tip" | "warning";
}

const VARIANT_CONFIG = {
  insight: {
    bg: Colors.accent + "12",
    border: Colors.accent + "40",
    icon: "bulb" as const,
    iconColor: Colors.accent,
    label: "Key Insight",
  },
  tip: {
    bg: "#4CAF5012",
    border: "#4CAF5040",
    icon: "sparkles" as const,
    iconColor: "#4CAF50",
    label: "Life Connection",
  },
  warning: {
    bg: "#FF980012",
    border: "#FF980040",
    icon: "warning" as const,
    iconColor: "#FF9800",
    label: "Note",
  },
};

export function InsightCallout({ icon, title, children, variant = "insight" }: Props) {
  const config = VARIANT_CONFIG[variant];

  return (
    <View style={[styles.card, { backgroundColor: config.bg, borderColor: config.border }]}>
      <View style={styles.header}>
        <Ionicons name={icon || config.icon} size={16} color={config.iconColor} />
        <Text style={[styles.label, { color: config.iconColor }]}>
          {title || config.label}
        </Text>
      </View>
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: 14,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  body: {
    fontSize: FontSize.body,
    color: Colors.text,
    lineHeight: 22,
  },
});
