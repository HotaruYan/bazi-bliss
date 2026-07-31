import { ScrollView, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize } from "../src/constants/theme";

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Privacy Policy</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last updated: July 31, 2026</Text>

        <Section title="1. Information We Collect">
          We collect only the information necessary to provide your Bazi readings:
          {"\n\n"}• Your birth date, time, and city (to calculate your natal chart)
          {"\n"}• Your name (to personalize reports)
          {"\n"}• Your Apple ID email (for account creation, only if you choose to sign in)
          {"\n"}• Push notification token (only if you opt in to notifications)
          {"\n\n"}We do NOT collect or sell personal data for advertising, tracking, or any third-party purpose.
        </Section>

        <Section title="2. How We Use Your Data">
          • Your birth information is used solely to calculate your Bazi chart and generate AI-powered insights.
          {"\n"}• Your Apple ID is used for account authentication and purchase restoration.
          {"\n"}• Push tokens are used only to notify you when new monthly reports arrive.
          {"\n"}• We do not share, sell, or rent your personal data to any third party.
        </Section>

        <Section title="3. Data Storage & Security">
          • All data is stored securely on Vercel and Upstash Redis infrastructure.
          {"\n"}• Communication between the app and our servers is encrypted via HTTPS.
          {"\n"}• You may request deletion of your data at any time by contacting us.
        </Section>

        <Section title="4. Third-Party Services">
          Bazi Bliss uses the following third-party services:
          {"\n\n"}• <Text style={styles.bold}>RevenueCat</Text> — for purchase management. RevenueCat processes Apple ID transaction receipts. See RevenueCat's privacy policy for details.
          {"\n"}• <Text style={styles.bold}>DeepSeek AI</Text> — for generating personalized report content. Your birth chart data is sent to DeepSeek's API for processing. No personally identifiable information is included.
          {"\n"}• <Text style={styles.bold}>Resend</Text> — for delivering email reports (only if you provide your email).
        </Section>

        <Section title="5. Your Rights">
          You have the right to:
          {"\n"}• Access the personal data we hold about you
          {"\n"}• Request correction or deletion of your data
          {"\n"}• Withdraw consent at any time
          {"\n"}• Export your data in a portable format
          {"\n\n"}To exercise any of these rights, contact us at privacy@bazibliss.com.
        </Section>

        <Section title="6. Children's Privacy">
          Bazi Bliss is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
        </Section>

        <Section title="7. Changes to This Policy">
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
        </Section>

        <Section title="8. Contact Us">
          If you have any questions about this privacy policy, please contact us at:
          {"\n\n"}Email: privacy@bazibliss.com
          {"\n"}Website: https://bazibliss.com
        </Section>

        <View style={styles.bottom} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.wrapper}>
      <Text style={sectionStyles.title}>{title}</Text>
      <Text style={sectionStyles.body}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  navTitle: { fontSize: FontSize.body, fontWeight: "600", color: Colors.text },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  lastUpdated: { fontSize: FontSize.caption, color: Colors.textSecondary, marginBottom: 24 },
  bold: { fontWeight: "700" },
  bottom: { height: 60 },
});

const sectionStyles = StyleSheet.create({
  wrapper: { marginBottom: 24 },
  title: {
    fontSize: FontSize.bodyLarge,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  body: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
