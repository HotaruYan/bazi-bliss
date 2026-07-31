import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Radius, Shadow } from "../../src/constants/theme";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useChartStore } from "../../src/store/useChartStore";

const OTHER_TOOLS = [
  {
    id: "tarot",
    label: "Tarot Bliss",
    desc: "Daily draws, Celtic Cross spreads & AI interpretations",
    icon: "🃏",
  },
  {
    id: "star",
    label: "Star Chart",
    desc: "Western astrology birth chart, transits & synastry",
    icon: "✧",
  },
  {
    id: "zen",
    label: "Zen Room",
    desc: "Guided meditation timed to your elemental rhythm",
    icon: "☸",
  },
];

export default function YouScreen() {
  const { isSignedIn, user, signIn, logout, isLoading } = useAuthStore();
  const { chart } = useChartStore();

  const displayName = user?.name || "You";
  const avatarChar = displayName.charAt(0).toUpperCase();
  const cosmicId = chart
    ? `${chart.dayMaster} ${chart.dayMasterElement}`
    : "Set your chart";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profile}>
          <View style={styles.avatarLg}>
            <Text style={styles.avatarLgText}>{avatarChar}</Text>
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.cosmicId}>Cosmic ID · {cosmicId}</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberText}>
              {isSignedIn ? "Member" : "Free Member"}
            </Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>
          <View style={styles.rowGroup}>
            {!isSignedIn ? (
              <TouchableOpacity style={styles.row} onPress={signIn} disabled={isLoading}>
                <View style={[styles.rowIcon, { backgroundColor: "#F5F2EC" }]}>
                  <Ionicons name="logo-apple" size={18} color={Colors.text} />
                </View>
                <Text style={styles.rowLabel}>Sign in with Apple</Text>
                <Text style={styles.rowChevron}>›</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: "#F5F2EC" }]}>
                <Ionicons name="refresh" size={18} color={Colors.text} />
              </View>
              <Text style={styles.rowLabel}>Restore Purchases</Text>
              <Text style={styles.rowChevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferences</Text>
          <View style={styles.rowGroup}>
            <TouchableOpacity style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: "#F5F2EC" }]}>
                <Ionicons name="notifications" size={18} color={Colors.text} />
              </View>
              <Text style={styles.rowLabel}>Notifications</Text>
              <Text style={styles.rowValue}>On</Text>
              <Text style={styles.rowChevron}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]}>
              <View style={[styles.rowIcon, { backgroundColor: "#F5F2EC" }]}>
                <Ionicons name="information-circle" size={18} color={Colors.text} />
              </View>
              <Text style={styles.rowLabel}>About Bazi Bliss</Text>
              <Text style={styles.rowChevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Other Tools */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Other Tools</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.toolsScroll}
          contentContainerStyle={styles.toolsContent}
        >
          {OTHER_TOOLS.map((tool) => (
            <View key={tool.id} style={styles.toolCard}>
              <View style={styles.toolIcon}>
                <Text style={styles.toolEmoji}>{tool.icon}</Text>
              </View>
              <Text style={styles.toolName}>{tool.label}</Text>
              <Text style={styles.toolDesc}>{tool.desc}</Text>
              <View style={styles.toolBadge}>
                <Text style={styles.toolBadgeText}>Coming Soon</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Sign Out */}
        {isSignedIn ? (
          <TouchableOpacity style={styles.signOutBtn} onPress={logout}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        ) : null}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Bazi Bliss v1.0 · Made with care</Text>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Bazi Bliss is for self-discovery and wellness purposes only. It does not provide
          medical, legal, or financial advice.
        </Text>

        {/* Legal links */}
        <View style={styles.legalLinks}>
          <TouchableOpacity onPress={() => router.push("/privacy")}>
            <Text style={styles.legalLinkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.legalDot}>·</Text>
          <TouchableOpacity onPress={() => router.push("/terms")}>
            <Text style={styles.legalLinkText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>

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
    paddingBottom: 40,
  },
  // Profile
  profile: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 0,
  },
  avatarLg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.deep,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarLgText: {
    fontSize: 28,
    fontWeight: "600",
    color: Colors.accent,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cosmicId: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: "500",
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  memberBadge: {
    backgroundColor: "#F5F2EC",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  memberText: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  // Sections
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 0,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  rowGroup: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    ...Shadow.card,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderBottomWidth: 0.5,
    borderColor: "#F5F2EC",
    gap: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  rowValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  rowChevron: {
    fontSize: 16,
    color: "#C7C7CC",
  },
  // Tools
  toolsScroll: {
    paddingLeft: 0,
  },
  toolsContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  toolCard: {
    width: 140,
    padding: 20,
    paddingHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 18,
    alignItems: "center",
    ...Shadow.card,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1D1B2E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  toolEmoji: {
    fontSize: 24,
  },
  toolName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
  },
  toolDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 18,
    textAlign: "center",
  },
  toolBadge: {
    marginTop: 10,
    backgroundColor: "#FDF2EE",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  toolBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.accent,
    letterSpacing: 0.3,
  },
  // Sign Out
  signOutBtn: {
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 14,
    backgroundColor: Colors.card,
    borderRadius: 14,
    alignItems: "center",
    ...Shadow.card,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#E53935",
  },
  // Footer
  footer: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 0,
  },
  footerText: {
    fontSize: 12,
    color: "#C7C7CC",
  },
  // Disclaimer
  disclaimer: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 12,
    paddingHorizontal: 32,
  },
  legalLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  legalLinkText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: "500",
  },
  legalDot: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  bottom: {
    height: 40,
  },
});
