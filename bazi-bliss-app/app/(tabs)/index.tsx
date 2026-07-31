import { ScrollView, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize } from "../../src/constants/theme";
import { useChartStore } from "../../src/store/useChartStore";
import { useAuthStore } from "../../src/store/useAuthStore";
import { CosmicWeather, FortuneShaker, DailyQuote } from "../../src/components/fortune";

function getTodayInfo(dayMaster?: string, dayMasterElement?: string) {
  const now = new Date();
  const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const elements = ["Wood", "Fire", "Earth", "Metal", "Water"];
  const tenGods = ["正官", "七杀", "正财", "偏财", "正印", "偏印", "食神", "伤官", "比肩", "劫财"];
  const moods = ["Focused", "Reflective", "Energetic", "Calm", "Playful", "Determined", "Curious", "Grounded"];

  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);

  return {
    dayPillar: `${stems[dayOfYear % 10]}${branches[dayOfYear % 12]}`,
    dayElement: elements[dayOfYear % 5],
    tenGod: tenGods[dayOfYear % 10],
    mood: moods[dayOfYear % moods.length],
    lunarDate: now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
  };
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function TodayScreen() {
  const { chart } = useChartStore();
  const { user } = useAuthStore();
  const today = getTodayInfo(chart?.dayMaster, chart?.dayMasterElement);

  const displayName = user?.name || "You";
  const avatarChar = displayName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* 问候头部 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.name}>{displayName}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarChar}</Text>
          </View>
        </View>

        {/* Cosmic Weather */}
        <CosmicWeather
          dayPillar={today.dayPillar}
          dayElement={today.dayElement}
          tenGod={today.tenGod}
          mood={today.mood}
          lunarDate={today.lunarDate}
          dayMaster={chart?.dayMaster}
          dayMasterElement={chart?.dayMasterElement}
        />

        {/* Daily Quote */}
        <View style={styles.gap} />
        <DailyQuote />

        {/* Fortune Shaker */}
        <View style={styles.gap} />
        <FortuneShaker />

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 0,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.3,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E8E4DC",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 17,
    color: Colors.text,
    fontWeight: "500",
  },
  gap: {
    height: 16,
  },
  bottom: {
    height: 100,
  },
});
