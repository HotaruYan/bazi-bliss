import { useRef, useCallback } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, FontSize, Radius } from "../../constants/theme";

export interface Chapter {
  id: string;
  title: string;
  index: number;
}

interface Props {
  chapters: Chapter[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function ChapterChips({ chapters, activeIndex, onSelect }: Props) {
  const scrollRef = useRef<ScrollView>(null);

  const handleSelect = useCallback(
    (index: number) => {
      onSelect(index);
      scrollRef.current?.scrollTo({ x: index * 100, animated: true });
    },
    [onSelect]
  );

  if (chapters.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {chapters.map((ch, i) => {
          const isActive = i === activeIndex;
          return (
            <TouchableOpacity
              key={ch.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => handleSelect(i)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {ch.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },
  scroll: {
    paddingHorizontal: 4,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.deep,
    borderColor: Colors.deep,
  },
  chipText: {
    fontSize: FontSize.caption,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.textOnDark,
  },
});
