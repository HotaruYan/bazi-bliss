import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../src/constants/theme";
import { useOnboardingStore } from "../src/store/useOnboardingStore";

const POINTS = [
  {
    title: "Your Cosmic Blueprint",
    desc: "A personalized map of your energy, strengths, and timing — all from your birth moment",
  },
  {
    title: "Clarity, Not Mystery",
    desc: "Ancient wisdom translated into clear, practical guidance for modern life",
  },
  {
    title: "Your Rhythm, Revealed",
    desc: "Understand your cycles so you can work with them, not against them",
  },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useOnboardingStore();

  const handleBegin = async () => {
    await completeOnboarding();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        {/* 图标 */}
        <View style={styles.iconRing}>
          <Text style={styles.iconText}>✦</Text>
        </View>

        {/* 标题 */}
        <Text style={styles.title}>
          Know Yourself{"\n"}Beyond the Surface
        </Text>
        <Text style={styles.subtitle}>
          Your birth chart reveals patterns you've always{"\n"}felt but never had words for.
        </Text>

        {/* 要点列表 */}
        <View style={styles.points}>
          {POINTS.map((p, i) => (
            <View key={i} style={styles.point}>
              <View style={styles.dot} />
              <View style={styles.pointText}>
                <Text style={styles.pointTitle}>{p.title}</Text>
                <Text style={styles.pointDesc}>{p.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Begin 按钮 */}
        <TouchableOpacity style={styles.beginBtn} onPress={handleBegin} activeOpacity={0.85}>
          <Text style={styles.beginText}>Begin</Text>
        </TouchableOpacity>

        <Text style={styles.noAccount}>No account required to start</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12111B",
  },
  hero: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },
  iconText: {
    fontSize: 28,
    color: Colors.accent,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: Colors.textOnDark,
    letterSpacing: -0.5,
    lineHeight: 38,
    textAlign: "center",
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 56,
    maxWidth: 300,
  },
  points: {
    flexDirection: "column",
    gap: 18,
    width: "100%",
    maxWidth: 300,
    marginBottom: 52,
  },
  point: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginTop: 7,
    flexShrink: 0,
  },
  pointText: {
    flex: 1,
  },
  pointTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textOnDark,
    marginBottom: 2,
  },
  pointDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    lineHeight: 18,
  },
  beginBtn: {
    width: "100%",
    maxWidth: 300,
    paddingVertical: 16,
    backgroundColor: Colors.textOnDark,
    borderRadius: 14,
    alignItems: "center",
  },
  beginText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#12111B",
    letterSpacing: -0.2,
  },
  noAccount: {
    color: "rgba(255,255,255,0.25)",
    fontSize: 12,
    marginTop: 14,
  },
});
