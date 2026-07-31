import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize } from "../src/constants/theme";

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Terms of Service</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last updated: July 31, 2026</Text>

        <Section title="1. Acceptance of Terms">
          By using Bazi Bliss ("the App"), you agree to these Terms of Service. If you do not agree, please do not use the App.
        </Section>

        <Section title="2. Service Description">
          Bazi Bliss provides AI-generated personal insights based on traditional Chinese Bazi (Four Pillars of Destiny) principles. Our reports are created by artificial intelligence and are intended for <Text style={styles.bold}>self-discovery, wellness, and personal reflection purposes only.</Text>
        </Section>

        <Section title="3. Not Professional Advice">
          {"\n"}• Bazi Bliss content does <Text style={styles.bold}>NOT</Text> constitute medical, legal, financial, or psychological advice.
          {"\n"}• Insights are <Text style={styles.bold}>AI-generated guidance</Text>, not predictions or guarantees of future outcomes.
          {"\n"}• Always consult qualified professionals for decisions affecting your health, finances, or legal matters.
          {"\n"}• Bazi Bliss is a <Text style={styles.bold}>wellness and self-discovery tool</Text>, not a fortune-telling service.
        </Section>

        <Section title="4. Purchases & Refunds">
          {"\n"}• All purchases are processed through Apple's In-App Purchase system.
          {"\n"}• Refund requests must be submitted through Apple — we cannot process refunds directly.
          {"\n"}• Prices are displayed in your local currency and are subject to change.
          {"\n"}• Annual Pass includes 5 years of yearly reports from the date of purchase.
        </Section>

        <Section title="5. User Accounts">
          {"\n"}• You may use the free features without an account.
          {"\n"}• Sign in with Apple is required to sync purchases and access reports across devices.
          {"\n"}• You are responsible for maintaining the confidentiality of your account.
        </Section>

        <Section title="6. Intellectual Property">
          All content, design, and code in Bazi Bliss is owned by Bazi Bliss and protected by applicable intellectual property laws. AI-generated reports are for your personal use only.
        </Section>

        <Section title="7. Limitation of Liability">
          Bazi Bliss is provided "as is" without warranties of any kind. We shall not be liable for any damages arising from the use or inability to use the App.
        </Section>

        <Section title="8. Termination">
          We reserve the right to terminate or suspend access to the App for violations of these terms, without prior notice.
        </Section>

        <Section title="9. Contact">
          Questions about these terms? Reach out at:
          {"\n\n"}Email: legal@bazibliss.com
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
