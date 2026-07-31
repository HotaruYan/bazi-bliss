import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Radius, Shadow } from "../../src/constants/theme";
import { useChartStore } from "../../src/store/useChartStore";

interface HistoryItem {
  id: string;
  name: string;
  date: string;
  time: string;
  dayMaster: string;
  dayMasterElement: string;
  dayun: string;
  avatarColor: string;
}

export default function HistoryScreen() {
  const { chart, daYun, birthDate, birthTime, name, resetChart } = useChartStore();

  // 用当前排盘生成历史记录
  const items: HistoryItem[] = chart
    ? [
        {
          id: "1",
          name: name || "You",
          date: birthDate,
          time: birthTime,
          dayMaster: chart.dayMaster,
          dayMasterElement: chart.dayMasterElement,
          dayun: daYun?.cycles.find(
            (c) => new Date().getFullYear() >= c.startYear && new Date().getFullYear() <= c.endYear
          )
            ? `${daYun.cycles[0].stem}${daYun.cycles[0].branch}`
            : "",
          avatarColor: "#FDF2EE",
        },
      ]
    : [];

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push("/(tabs)/chart")}
      activeOpacity={0.7}
    >
      <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
        <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{item.date}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.metaText}>{item.time}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.metaText}>
            {item.dayMaster} {item.dayMasterElement}
          </Text>
        </View>
      </View>
      {item.dayun ? (
        <View style={styles.dayunBadge}>
          <Text style={styles.dayunText}>{item.dayun}</Text>
        </View>
      ) : null}
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyEmoji}>☯</Text>
      </View>
      <Text style={styles.emptyTitle}>No charts yet</Text>
      <Text style={styles.emptySub}>
        Calculate your first birth chart to see it here. You can save and compare multiple charts.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 头部 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Chart History</Text>
          <Text style={styles.count}>
            {items.length > 0 ? `${items.length} saved chart${items.length > 1 ? "s" : ""}` : "No charts"}
          </Text>
        </View>
        {items.length > 0 && (
          <TouchableOpacity>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 搜索栏 */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color="#8E8E93" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#8E8E93"
        />
      </View>

      {/* 列表 */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />

      {/* 新建按钮 */}
      <View style={styles.bottomBtn}>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => {
            resetChart();
            router.push("/(tabs)/chart");
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.newBtnText}>+ New Chart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.3,
  },
  count: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
    marginTop: 2,
  },
  editBtn: {
    fontSize: 16,
    color: Colors.accent,
    fontWeight: "500",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#F2F0EB",
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  list: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  // Card
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 18,
    backgroundColor: Colors.card,
    borderRadius: 16,
    gap: 14,
    ...Shadow.card,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F2EC",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.accent,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 3,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#D1CDC4",
    flexShrink: 0,
  },
  dayunBadge: {
    backgroundColor: "#FDF2EE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dayunText: {
    fontSize: 11,
    color: Colors.accent,
    fontWeight: "500",
  },
  arrow: {
    fontSize: 18,
    color: "#C7C7CC",
    flexShrink: 0,
  },
  // Empty
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F5F2EC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyEmoji: {
    fontSize: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 260,
  },
  // Bottom button
  bottomBtn: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 14,
  },
  newBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
  },
  newBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textOnDark,
    letterSpacing: -0.2,
  },
});
