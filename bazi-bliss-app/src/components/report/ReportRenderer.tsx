import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Colors, FontSize } from "../../constants/theme";
import { TermModal } from "./TermModal";

interface Props {
  content: string;
}

interface Section {
  heading: string;
  body: string;
  subsections: Array<{ heading: string; body: string }>;
}

// 解析 report 为章节
function parseSections(markdown: string): Section[] {
  const sections: Section[] = [];
  const lines = markdown.split("\n");

  let currentSection: Section | null = null;
  let currentSub: { heading: string; body: string } | null = null;
  let buffer: string[] = [];

  function flushBuffer() {
    const text = buffer.join("\n").trim();
    buffer = [];
    if (!text) return;

    if (currentSub) {
      currentSub.body = text;
      if (currentSection) {
        currentSection.subsections.push({ ...currentSub });
      }
      currentSub = null;
    } else if (currentSection) {
      currentSection.body = text;
    }
  }

  for (const line of lines) {
    if (line.startsWith("## ")) {
      flushBuffer();
      if (currentSection) sections.push(currentSection);
      currentSection = { heading: line.slice(3).trim(), body: "", subsections: [] };
      currentSub = null;
    } else if (line.startsWith("### ")) {
      flushBuffer();
      currentSub = { heading: line.slice(4).trim(), body: "" };
    } else {
      buffer.push(line);
    }
  }

  flushBuffer();
  if (currentSection) sections.push(currentSection);

  return sections;
}

// 粗体文本解析
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text style={styles.paragraph}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text key={i} style={styles.bold}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        return <Text key={i}>{part}</Text>;
      })}
    </Text>
  );
}

export function ReportRenderer({ content }: Props) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const sections = parseSections(content);

  return (
    <>
      {sections.map((section, si) => (
        <View key={si} style={styles.section}>
          <Text style={styles.heading}>{section.heading}</Text>

          {section.body ? (
            <RichText text={section.body} />
          ) : null}

          {section.subsections.map((sub, ssi) => (
            <View key={ssi} style={styles.subsection}>
              <Text style={styles.subheading}>{sub.heading}</Text>
              <RichText text={sub.body} />
            </View>
          ))}
        </View>
      ))}

      <TermModal
        visible={!!selectedTerm}
        term={selectedTerm || ""}
        onClose={() => setSelectedTerm(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  heading: {
    fontSize: FontSize.h3,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  subheading: {
    fontSize: FontSize.bodyLarge,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
  },
  subsection: {
    marginTop: 14,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 8,
  },
  bold: {
    fontWeight: "700",
    color: Colors.text,
  },
});
