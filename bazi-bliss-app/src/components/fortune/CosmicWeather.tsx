import { View, Text, StyleSheet } from "react-native";
import { Colors, FontSize } from "../../constants/theme";

interface Props {
  dayPillar: string;
  dayElement: string;
  tenGod: string;
  mood: string;
  lunarDate: string;
  /** 用户日主，有则启用完整模式 */
  dayMaster?: string;
  dayMasterElement?: string;
}

const TEN_GOD_EN: Record<string, string> = {
  "正官": "Direct Officer", "七杀": "Seven Killings",
  "正财": "Direct Wealth", "偏财": "Indirect Wealth",
  "正印": "Direct Resource", "偏印": "Indirect Resource",
  "食神": "Eating God", "伤官": "Hurting Officer",
  "比肩": "Friend", "劫财": "Rob Wealth",
};

function getWeatherTitle(tenGod: string): string {
  switch (tenGod) {
    case "正官": return "A Day of Discipline";
    case "七杀": return "A Day of Challenge";
    case "正财": return "A Day of Steady Gains";
    case "偏财": return "A Day of Surprises";
    case "正印": return "A Day of Learning";
    case "偏印": return "A Day of Intuition";
    case "食神": return "A Day of Flow";
    case "伤官": return "A Day of Bold Ideas";
    case "比肩": return "A Day of Connection";
    case "劫财": return "A Day of Rivalry";
    default: return "A Day of Clarity";
  }
}

function getWeatherDescription(tenGod: string, element: string): string {
  const descs: Record<string, string> = {
    "正官": `Your ${element} energy is sharp today — a good day for decisions you've been putting off.`,
    "七杀": `Your ${element} energy brings intensity — channel it into focused action, not conflict.`,
    "正财": `Your ${element} energy is grounded — good for practical matters and financial clarity.`,
    "偏财": `Your ${element} energy is unpredictable — stay open to unexpected opportunities.`,
    "正印": `Your ${element} energy supports learning — absorb knowledge that nourishes your growth.`,
    "偏印": `Your ${element} energy sparks intuition — trust the ideas that come out of nowhere.`,
    "食神": `Your ${element} energy flows freely — a perfect day for creative expression.`,
    "伤官": `Your ${element} energy is bold — speak your truth, but deliver it with grace.`,
    "比肩": `Your ${element} energy seeks connection — reach out to peers who share your vision.`,
    "劫财": `Your ${element} energy is competitive — stay centered and protect your resources.`,
  };
  return descs[tenGod] || `Your ${element} energy is active today — stay present and observe.`;
}

export function CosmicWeather({ dayPillar, dayElement, tenGod, mood, lunarDate, dayMaster, dayMasterElement }: Props) {
  const weatherTitle = getWeatherTitle(tenGod);
  const weatherDesc = getWeatherDescription(tenGod, dayElement);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Your Cosmic Weather</Text>
      <Text style={styles.title}>{weatherTitle}</Text>
      <Text style={styles.subtitle}>{weatherDesc}</Text>

      <View style={styles.statRow}>
        <View style={styles.stat}>
          <Text style={styles.statVal}>
            {dayMaster ? `${dayMasterElement || dayElement}` : dayElement}
          </Text>
          <Text style={styles.statLabel}>Day Master</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statVal}>{mood}</Text>
          <Text style={styles.statLabel}>Today's Vibe</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statVal}>
            {dayMaster ? getFavorableElement(tenGod) : dayElement}
          </Text>
          <Text style={styles.statLabel}>Your Guide</Text>
        </View>
      </View>
    </View>
  );
}

function getFavorableElement(tenGod: string): string {
  // 简化版：根据十神推荐五行
  switch (tenGod) {
    case "正官": case "七杀": return "Fire";
    case "正财": case "偏财": return "Wood";
    case "正印": case "偏印": return "Metal";
    case "食神": case "伤官": return "Water";
    default: return "Earth";
  }
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 0,
    marginTop: 22,
    padding: 24,
    backgroundColor: Colors.deep,
    borderRadius: 22,
  },
  label: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textOnDark,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 18,
    lineHeight: 18,
  },
  statRow: {
    flexDirection: "row",
    gap: 16,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statVal: {
    fontSize: 19,
    fontWeight: "700",
    color: Colors.accent,
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    marginTop: 3,
  },
});
