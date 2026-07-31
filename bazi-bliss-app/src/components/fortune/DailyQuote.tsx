import { View, Text, StyleSheet } from "react-native";
import { Colors, FontSize } from "../../constants/theme";

const QUOTES = [
  {
    text: 'The best time to plant a tree was twenty years ago. The second best time is now.',
    highlight: ["twenty years ago", "now"],
  },
  {
    text: "Know thyself, and you shall know the universe and the gods.",
    highlight: ["Know thyself"],
  },
  {
    text: "Nature does not hurry, yet everything is accomplished.",
    highlight: ["everything is accomplished"],
  },
  {
    text: "The cosmos is within us. We are made of star-stuff.",
    highlight: ["star-stuff"],
  },
  {
    text: "What you seek is seeking you. Be still and let it find you.",
    highlight: ["Be still"],
  },
  {
    text: "You are not a drop in the ocean. You are the entire ocean in a drop.",
    highlight: ["the entire ocean"],
  },
  {
    text: "The wound is the place where the light enters you.",
    highlight: ["the light enters you"],
  },
];

function getDailyQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

export function DailyQuote() {
  const quote = getDailyQuote();

  // 渲染带高亮的文本
  const renderText = () => {
    let text = quote.text;
    const parts: { text: string; highlight: boolean }[] = [];

    // 找到高亮词位置
    const highlightPositions: { start: number; end: number }[] = [];
    for (const h of quote.highlight) {
      const idx = text.indexOf(h);
      if (idx >= 0) {
        highlightPositions.push({ start: idx, end: idx + h.length });
      }
    }
    highlightPositions.sort((a, b) => a.start - b.start);

    // 拆分
    let pos = 0;
    for (const hp of highlightPositions) {
      if (hp.start > pos) {
        parts.push({ text: text.slice(pos, hp.start), highlight: false });
      }
      parts.push({ text: text.slice(hp.start, hp.end), highlight: true });
      pos = hp.end;
    }
    if (pos < text.length) {
      parts.push({ text: text.slice(pos), highlight: false });
    }

    return (
      <Text style={styles.quoteText}>
        {parts.map((p, i) => (
          <Text key={i} style={p.highlight ? styles.highlight : undefined}>
            {p.text}
          </Text>
        ))}
      </Text>
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Today's Words</Text>
      {renderText()}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.deep,
    borderRadius: 18,
    padding: 18,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 17,
    fontWeight: "500",
    lineHeight: 21,
    letterSpacing: -0.2,
    color: "rgba(255,255,255,0.9)",
  },
  highlight: {
    color: Colors.accent,
    fontStyle: "italic",
  },
});
