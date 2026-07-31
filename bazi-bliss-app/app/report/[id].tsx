import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Radius, Shadow, Spacing } from "../../src/constants/theme";
import { api } from "../../src/services/api";
import {
  ChapterChips,
  ReportRenderer,
  ReportSkeleton,
  InsightCallout,
} from "../../src/components/report";
import type { Chapter } from "../../src/components/report";

interface ReportData {
  id: string;
  type: "life_blueprint" | "year_ahead" | "monthly";
  title: string;
  content: string;
  createdAt: string;
}

const TYPE_META: Record<string, { icon: keyof typeof Ionicons.glyphMap; label: string; color: string }> = {
  life_blueprint: { icon: "compass", label: "Life Blueprint", color: Colors.accent },
  year_ahead: { icon: "calendar", label: "Year Ahead", color: Colors.accent },
  monthly: { icon: "moon", label: "Monthly", color: "#7C4DFF" },
};

// 从内容解析章节
function extractChapters(content: string): Chapter[] {
  const matches = content.match(/^## (.+)$/gm);
  if (!matches) return [];
  return matches.map((m, i) => ({
    id: `ch-${i}`,
    title: m.replace(/^## /, "").trim(),
    index: i,
  }));
}

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const sectionRefs = useRef<Record<number, number>>({});
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (id) fetchReport();
  }, [id]);

  const fetchReport = async () => {
    setLoading(true);
    const { data, error: err } = await api.get<{ report: ReportData }>(`/report/${id}`);

    if (err || !data?.report) {
      setError(err || "Report not found");
    } else {
      setReport(data.report);
    }
    setLoading(false);
  };

  const chapters = report ? extractChapters(report.content) : [];
  const meta = report ? TYPE_META[report.type] || TYPE_META.life_blueprint : TYPE_META.life_blueprint;

  const handleChapterSelect = useCallback(
    (index: number) => {
      setActiveChapter(index);
      const y = sectionRefs.current[index];
      if (y !== undefined) {
        scrollRef.current?.scrollTo({ y: y - 100, animated: true });
      }
    },
    [chapters]
  );

  const handleSectionLayout = (index: number, y: number) => {
    sectionRefs.current[index] = y;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 导航栏 */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {report?.title || "Report"}
        </Text>
        <View style={styles.backBtn} />
      </View>

      {loading ? (
        <ReportSkeleton />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.textSecondary} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchReport}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : report ? (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero 头部 */}
          <View style={styles.hero}>
            <View style={[styles.heroIcon, { backgroundColor: meta.color + "15" }]}>
              <Ionicons name={meta.icon} size={28} color={meta.color} />
            </View>
            <Text style={styles.heroLabel}>{meta.label}</Text>
            <Text style={styles.heroTitle}>{report.title}</Text>
            <Text style={styles.heroDate}>
              {new Date(report.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          {/* 章节导航 */}
          {chapters.length > 1 && (
            <ChapterChips
              chapters={chapters}
              activeIndex={activeChapter}
              onSelect={handleChapterSelect}
            />
          )}

          {/* 分隔线 */}
          <View style={styles.divider} />

          {/* 正文 */}
          <ReportRenderer content={report.content} />
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  navTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: FontSize.body,
    fontWeight: "600",
    color: Colors.text,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  // Hero
  hero: {
    alignItems: "center",
    paddingVertical: 32,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: FontSize.h2,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  heroDate: {
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 20,
  },
  // Error
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: Colors.deep,
    borderRadius: Radius.full,
  },
  retryText: {
    fontSize: FontSize.body,
    fontWeight: "600",
    color: Colors.textOnDark,
  },
});
