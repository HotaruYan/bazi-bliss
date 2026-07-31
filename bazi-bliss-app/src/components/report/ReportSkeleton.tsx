import { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Colors, Radius } from "../../constants/theme";

function ShimmerBlock({ width, height, style }: { width?: number | string; height: number; style?: any }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width: (width as number) || "100%",
          height,
          backgroundColor: Colors.border,
          borderRadius: Radius.sm,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function ReportSkeleton() {
  return (
    <View style={styles.container}>
      {/* Hero 骨架 */}
      <View style={styles.hero}>
        <ShimmerBlock width={60} height={60} style={{ borderRadius: 30 }} />
        <View style={styles.heroText}>
          <ShimmerBlock width="60%" height={20} />
          <ShimmerBlock width="80%" height={14} style={{ marginTop: 8 }} />
        </View>
      </View>

      {/* Chapter chips 骨架 */}
      <View style={styles.chipsRow}>
        {[60, 80, 72, 90, 64, 76].map((w, i) => (
          <ShimmerBlock key={i} width={w} height={28} style={{ borderRadius: 14 }} />
        ))}
      </View>

      {/* 段落骨架 */}
      <View style={styles.content}>
        {/* 章节标题 */}
        <ShimmerBlock width="50%" height={22} style={{ marginBottom: 12 }} />
        {/* 正文段落 */}
        <ShimmerBlock width="100%" height={14} style={{ marginBottom: 6 }} />
        <ShimmerBlock width="100%" height={14} style={{ marginBottom: 6 }} />
        <ShimmerBlock width="100%" height={14} style={{ marginBottom: 6 }} />
        <ShimmerBlock width="70%" height={14} style={{ marginBottom: 20 }} />

        {/* 第二个章节 */}
        <ShimmerBlock width="40%" height={22} style={{ marginBottom: 12 }} />
        <ShimmerBlock width="100%" height={14} style={{ marginBottom: 6 }} />
        <ShimmerBlock width="100%" height={14} style={{ marginBottom: 6 }} />
        <ShimmerBlock width="100%" height={14} style={{ marginBottom: 6 }} />
        <ShimmerBlock width="50%" height={14} style={{ marginBottom: 20 }} />

        {/* 第三个章节 */}
        <ShimmerBlock width="55%" height={22} style={{ marginBottom: 12 }} />
        <ShimmerBlock width="100%" height={14} style={{ marginBottom: 6 }} />
        <ShimmerBlock width="100%" height={14} style={{ marginBottom: 6 }} />
        <ShimmerBlock width="60%" height={14} style={{ marginBottom: 20 }} />

        {/* Callout 骨架 */}
        <ShimmerBlock width="100%" height={80} style={{ borderRadius: Radius.md, marginBottom: 20 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  heroText: {
    flex: 1,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  content: {
    gap: 0,
  },
});
