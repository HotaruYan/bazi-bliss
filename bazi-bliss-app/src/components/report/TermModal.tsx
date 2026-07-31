import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from "react-native";
import { Colors, FontSize, Radius, Shadow, ELEMENT_COLORS } from "../../constants/theme";
import { STEM_ELEMENT, BRANCH_ELEMENT } from "../../engine";

// 八字术语词典
interface TermInfo {
  title: string;
  subtitle?: string;
  meaning: string[];
  tags: string[];
}

const TERM_DICTIONARY: Record<string, TermInfo> = {
  // 十天干
  "甲": {
    title: "Jia",
    subtitle: "Yang Wood · Heavenly Stem",
    meaning: [
      "The first Heavenly Stem. Like a towering tree — symbolizing leadership, directness, and a pioneering spirit. Jia people are natural-born leaders who grow steadily toward great heights.",
      "As your Day Master, this defines your core self: bold, ambitious, and unafraid to stand alone. You grow slowly but surely — and when you reach your full height, everyone notices.",
    ],
    tags: ["Element: Wood", "Polarity: Yang", "Direction: East"],
  },
  "乙": {
    title: "Yi",
    subtitle: "Yin Wood · Heavenly Stem",
    meaning: [
      "The second Heavenly Stem. Like grass or a vine — flexible, artistic, and diplomatic. Yi people bend without breaking and find their way around obstacles rather than crashing through them.",
      "As your Day Master, you're adaptable and graceful. You achieve through persistence and charm rather than brute force — and you're more resilient than anyone gives you credit for.",
    ],
    tags: ["Element: Wood", "Polarity: Yin", "Direction: East"],
  },
  "丙": {
    title: "Bing",
    subtitle: "Yang Fire · Heavenly Stem",
    meaning: [
      "The third Heavenly Stem. Like the sun at noon — passionate, generous, and radiant. Bing people light up every room they enter and inspire those around them with their warmth and energy.",
      "As your Day Master, you're a natural source of light and motivation. You give freely of yourself — sometimes too freely. Learn when to pull back so you don't burn out.",
    ],
    tags: ["Element: Fire", "Polarity: Yang", "Direction: South"],
  },
  "丁": {
    title: "Ding",
    subtitle: "Yin Fire · Heavenly Stem",
    meaning: [
      "The fourth Heavenly Stem. Like a candle flame or a star — focused, refined, and quietly intense. Ding people don't need to be the biggest flame in the room to make an impact.",
      "As your Day Master, your strength is concentration. You burn steadily and precisely, seeing what others miss. Your warmth is selective — reserved for those who earn it.",
    ],
    tags: ["Element: Fire", "Polarity: Yin", "Direction: South"],
  },
  "戊": {
    title: "Wu",
    subtitle: "Yang Earth · Heavenly Stem",
    meaning: [
      "The fifth Heavenly Stem. Like a mountain — stable, honest, and immovable when it matters. Wu people are the bedrock others build on. You're patient, reliable, and deeply principled.",
      "As your Day Master, you're the steady hand in every crisis. People trust you instinctively because you've earned it. Your word is your bond — and everyone knows it.",
    ],
    tags: ["Element: Earth", "Polarity: Yang", "Direction: Center"],
  },
  "己": {
    title: "Ji",
    subtitle: "Yin Earth · Heavenly Stem",
    meaning: [
      "The sixth Heavenly Stem. Like garden soil — nurturing, careful, and endlessly supportive. Ji people make things grow. You create environments where others thrive.",
      "As your Day Master, you're the quiet cultivator. You work behind the scenes, tending to details most people overlook. Your care is tangible — people feel it.",
    ],
    tags: ["Element: Earth", "Polarity: Yin", "Direction: Center"],
  },
  "庚": {
    title: "Geng",
    subtitle: "Yang Metal · Heavenly Stem",
    meaning: [
      "The seventh Heavenly Stem. Like an axe or sword — determined, bold, and transformative. Geng people cut through what no longer serves and forge something new from the raw material of life.",
      "As your Day Master, you're decisive and commanding. You don't hesitate when action is needed. Your decisiveness is rare — protect it, but temper it with compassion.",
    ],
    tags: ["Element: Metal", "Polarity: Yang", "Direction: West"],
  },
  "辛": {
    title: "Xin",
    subtitle: "Yin Metal · Heavenly Stem",
    meaning: [
      "The eighth Heavenly Stem. Like jewelry or a fine needle — elegant, precise, and refined. Xin people care about quality over quantity and have an eye for detail others envy.",
      "As your Day Master, you have exacting standards — for yourself first, then for the world. Your taste is impeccable. Just be careful not to let perfectionism become paralysis.",
    ],
    tags: ["Element: Metal", "Polarity: Yin", "Direction: West"],
  },
  "壬": {
    title: "Ren",
    subtitle: "Yang Water · Heavenly Stem",
    meaning: [
      "The ninth Heavenly Stem. The great ocean — vast, deep, and perpetually in motion. Unlike still lake water, Yang Water is powerful, ambitious, and unstoppable over time.",
      "As your Day Master, this defines your core self: intuitive, perceptive, calm on the surface with immense depth beneath. You feel everything, but you choose what to show.",
    ],
    tags: ["Element: Water", "Polarity: Yang", "Direction: North"],
  },
  "癸": {
    title: "Gui",
    subtitle: "Yin Water · Heavenly Stem",
    meaning: [
      "The tenth Heavenly Stem. Like rain or morning dew — intuitive, mysterious, and quietly powerful. Gui people don't announce themselves. They don't need to. They simply feel, absorb, and understand.",
      "As your Day Master, your perception borders on psychic. You read rooms, people, and energies effortlessly. Your stillness is deceptive — there's a universe moving beneath the surface.",
    ],
    tags: ["Element: Water", "Polarity: Yin", "Direction: North"],
  },
  // 十二地支
  "子": {
    title: "Zi · The Rat",
    subtitle: "Yang Water · Earthly Branch",
    meaning: [
      "Mid-winter, deep night, the north. The Rat is the first of the twelve animals — it begins the cycle. Pure Water energy: intelligent, resourceful, and socially astute.",
      "In your Day Pillar, this amplifies your Water nature — doubling your intuition and emotional depth. It also brings the Peach Blossom star, giving you a natural magnetism that draws people in.",
    ],
    tags: ["Animal: Rat", "Season: Winter", "Direction: North"],
  },
  "丑": {
    title: "Chou · The Ox",
    subtitle: "Yin Earth · Earthly Branch",
    meaning: [
      "Late winter, deep cold. The Ox embodies patience, diligence, and steady accumulation. Nothing flashy — just reliable, methodical progress toward long-term goals.",
      "In your chart, this branch anchors you with practicality. You build things that last because you're willing to do the work others skip.",
    ],
    tags: ["Animal: Ox", "Season: Winter", "Direction: North-East"],
  },
  "寅": {
    title: "Yin · The Tiger",
    subtitle: "Yang Wood · Earthly Branch",
    meaning: [
      "Early spring, dawn. The Tiger embodies action, ambition, and bold new ventures. This is the energy of beginnings — raw, fearless, and hungry for life.",
      "In your chart, this branch gives you a pioneering spirit. You're not afraid to go first. You thrive in uncharted territory where others hesitate.",
    ],
    tags: ["Animal: Tiger", "Season: Spring", "Direction: North-East"],
  },
  "卯": {
    title: "Mao · The Rabbit",
    subtitle: "Yin Wood · Earthly Branch",
    meaning: [
      "Spring's peak, morning. The Rabbit embodies gentleness, diplomacy, and artistic grace. This is the energy of growth without force — the quiet unfolding of life.",
      "In your chart, this branch gives you an elegant touch. You resolve conflict through grace, not confrontation. You make hard things look effortless.",
    ],
    tags: ["Animal: Rabbit", "Season: Spring", "Direction: East"],
  },
  "辰": {
    title: "Chen · The Dragon",
    subtitle: "Yang Earth · Earthly Branch",
    meaning: [
      "Spring into summer. The Dragon embodies leadership, charisma, and transformation. This is mythic energy — larger than life, magnetic, impossible to ignore.",
      "In your chart, this branch gives you presence. When you enter a room, people notice. You carry yourself with a natural authority that can't be taught.",
    ],
    tags: ["Animal: Dragon", "Season: Late Spring", "Direction: South-East"],
  },
  "巳": {
    title: "Si · The Snake",
    subtitle: "Yang Fire · Earthly Branch",
    meaning: [
      "Early summer. The Snake embodies adaptability, wisdom, and strategic thinking. This is the energy of the strategist — patient, precise, and always three moves ahead.",
      "In your chart, this branch makes you a natural planner. You see patterns others miss and strike at exactly the right moment. Your timing is often uncanny.",
    ],
    tags: ["Animal: Snake", "Season: Summer", "Direction: South-East"],
  },
  "午": {
    title: "Wu · The Horse",
    subtitle: "Yin Fire · Earthly Branch",
    meaning: [
      "High summer, noon. The Horse embodies peak energy, freedom, and passionate expression. This is the energy of full power — unrestrained, radiant, and alive.",
      "In your chart, this branch gives you a fiery heart. When you love something, you love it completely. Your enthusiasm is contagious — and it's your greatest gift.",
    ],
    tags: ["Animal: Horse", "Season: Summer", "Direction: South"],
  },
  "未": {
    title: "Wei · The Goat",
    subtitle: "Yin Earth · Earthly Branch",
    meaning: [
      "Late summer. The Goat embodies creativity, caution, and quiet determination. This is the energy of the artist — sensitive, discerning, and deeply feeling.",
      "In your chart, this branch gives you creative depth. You express what others can only feel. Your sensitivity isn't weakness — it's the source of your power.",
    ],
    tags: ["Animal: Goat", "Season: Late Summer", "Direction: South-West"],
  },
  "申": {
    title: "Shen · The Monkey",
    subtitle: "Yang Metal · Earthly Branch",
    meaning: [
      "Early autumn. The Monkey embodies skill, strategy, and clever problem-solving. This is the energy of the inventor — restless, curious, and brilliantly resourceful.",
      "In your chart, this branch makes you a natural problem-solver. You find solutions where others see dead ends. Your mind works differently — and that's your edge.",
    ],
    tags: ["Animal: Monkey", "Season: Autumn", "Direction: South-West"],
  },
  "酉": {
    title: "You · The Rooster",
    subtitle: "Yin Metal · Earthly Branch",
    meaning: [
      "Autumn's peak, evening. The Rooster embodies refinement, precision, and orderly beauty. This is the energy of the craftsman — exacting, meticulous, and proud of quality.",
      "In your chart, this branch gives you high standards. You notice what's off by a millimeter. Your eye for detail is a professional superpower — use it wisely.",
    ],
    tags: ["Animal: Rooster", "Season: Autumn", "Direction: West"],
  },
  "戌": {
    title: "Xu · The Dog",
    subtitle: "Yang Earth · Earthly Branch",
    meaning: [
      "Autumn into winter. The Dog embodies loyalty, protection, and steadfast guardianship. This is the energy of the guardian — faithful to the core and fierce in defense of what matters.",
      "In your chart, this branch makes you deeply loyal. Once you commit, you're all in. People who earn your trust have it for life — and you'll defend them to the end.",
    ],
    tags: ["Animal: Dog", "Season: Late Autumn", "Direction: North-West"],
  },
  "亥": {
    title: "Hai · The Pig",
    subtitle: "Yin Water · Earthly Branch",
    meaning: [
      "Deep winter. The Pig embodies completion, intuition, and the quiet before renewal. This is the energy of the dreamer — gentle on the outside, vast and deep within.",
      "In your chart, this branch deepens your emotional waters. You understand things without being told. Your intuition is a compass — trust it even when logic disagrees.",
    ],
    tags: ["Animal: Pig", "Season: Winter", "Direction: North-West"],
  },
  // 十神
  "正官": {
    title: "Direct Officer",
    subtitle: "正官 · Zheng Guan · Ten God",
    meaning: [
      "The authority that disciplines you with fairness. Same polarity, controlling element. Represents career, rules, social standing, and duty.",
      "In your chart, this star brings structure and recognition. When balanced: a respected leader who earns authority naturally. When excessive: rigidity and over-control.",
    ],
    tags: ["Controlling", "Same Polarity", "Authority"],
  },
  "七杀": {
    title: "Seven Killings",
    subtitle: "七杀 · Qi Sha · Ten God",
    meaning: [
      "The authority that challenges you through pressure. Opposite polarity, controlling element. Represents competition, ambition, and crisis-driven growth.",
      "In your chart, this star brings intensity and drive. When harnessed: heroic and decisive. When unchecked: reckless confrontation. You work better under pressure than most.",
    ],
    tags: ["Controlling", "Opposite Polarity", "Challenge"],
  },
  "正财": {
    title: "Direct Wealth",
    subtitle: "正财 · Zheng Cai · Ten God",
    meaning: [
      "Steady, earned income from consistent effort. Same polarity, controlled element. Represents salary, savings, and traditional financial values.",
      "In your chart, this star brings financial discipline. You build wealth the steady way — through reputation and consistent work. Nothing flashy, but real.",
    ],
    tags: ["Controlled", "Same Polarity", "Steady Income"],
  },
  "偏财": {
    title: "Indirect Wealth",
    subtitle: "偏财 · Pian Cai · Ten God",
    meaning: [
      "Unexpected, windfall-style income. Opposite polarity, controlled element. Represents investments, side hustles, and entrepreneurial flair.",
      "In your chart, this star brings financial risk-tolerance. Gains come in bursts. You're willing to bet on yourself — and more often than not, it pays off.",
    ],
    tags: ["Controlled", "Opposite Polarity", "Windfall"],
  },
  "正印": {
    title: "Direct Resource",
    subtitle: "正印 · Zheng Yin · Ten God",
    meaning: [
      "Nourishing knowledge from formal study and mentors. Same polarity, supporting element. Represents education, certification, and protective authority.",
      "In your chart, this star brings scholarly energy. You absorb wisdom from tradition. Learning comes naturally — and you're at your best when you have a good teacher.",
    ],
    tags: ["Supporting", "Same Polarity", "Scholar"],
  },
  "偏印": {
    title: "Indirect Resource",
    subtitle: "偏印 · Pian Yin · Ten God",
    meaning: [
      "Unconventional wisdom from intuition and solitary study. Opposite polarity, supporting element. Represents esoteric knowledge and creative breakthroughs.",
      "In your chart, this star brings outsider genius. You learn on your own terms. What others need teachers for, you figure out yourself. Your mind is beautifully unconventional.",
    ],
    tags: ["Supporting", "Opposite Polarity", "Autodidact"],
  },
  "食神": {
    title: "Eating God",
    subtitle: "食神 · Shi Shen · Ten God",
    meaning: [
      "Your natural creative output — effortless self-expression. Same polarity, generated element. Represents art, enjoyment, and turning ideas into tangible results.",
      "In your chart, this star brings creative flow. Ideas come to you naturally. Self-expression isn't work for you — it's relief. Your creativity is a gift that wants to be shared.",
    ],
    tags: ["Generated", "Same Polarity", "Creativity"],
  },
  "伤官": {
    title: "Hurting Officer",
    subtitle: "伤官 · Shang Guan · Ten God",
    meaning: [
      "Intense, provocative creative fire. Opposite polarity, generated element. Represents bold self-expression, rebellion against norms, and disruptive ideas.",
      "In your chart, this star brings brilliant edges. You see what should change — and you're not afraid to say it. Just remember: the sharpest sword also needs a sheath.",
    ],
    tags: ["Generated", "Opposite Polarity", "Rebellion"],
  },
  "比肩": {
    title: "Friend",
    subtitle: "比肩 · Bi Jian · Ten God",
    meaning: [
      "Same element, same polarity as your Day Master. Think of it as a sibling, a peer, a mirror of yourself. Represents self-reliance, independence, and standing on your own feet.",
      "In your chart, the Friend Star suggests you grew up learning to rely on yourself. You're comfortable being independent — sometimes too comfortable. Asking for help doesn't come naturally.",
    ],
    tags: ["Same Element", "Same Polarity", "Self-Reliance"],
  },
  "劫财": {
    title: "Rob Wealth",
    subtitle: "劫财 · Jie Cai · Ten God",
    meaning: [
      "Same element, opposite polarity. The rival who pushes you to grow. Represents competition, partnership tensions, and the push-pull of shared resources.",
      "In your chart, this star brings competitive fire. You're pushed to be better by the people around you. Competition doesn't discourage you — it sharpens you.",
    ],
    tags: ["Same Element", "Opposite Polarity", "Competition"],
  },
  "日主": {
    title: "Day Master",
    subtitle: "日主 · Ri Zhu · Chart Center",
    meaning: [
      "The Heavenly Stem of your birth day — this IS you. Your core identity, personality, and the central reference point for the entire chart.",
      "Every pillar, every star, every element is interpreted through its relationship to your Day Master. Understanding your Day Master is the key to understanding your entire chart.",
    ],
    tags: ["Core Self", "Chart Center", "Identity"],
  },
};

interface Props {
  visible: boolean;
  term: string;
  onClose: () => void;
}

function charColor(char: string): string {
  const elem = STEM_ELEMENT[char] || BRANCH_ELEMENT[char];
  return ELEMENT_COLORS[elem] || Colors.text;
}

export function TermModal({ visible, term, onClose }: Props) {
  const info = TERM_DICTIONARY[term];
  // 判断是否单字（天干地支）
  const isSingleChar = term.length === 1 && (STEM_ELEMENT[term] || BRANCH_ELEMENT[term]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          {info ? (
            <>
              {/* 大字展示（天干地支） */}
              {isSingleChar && (
                <Text style={[styles.bigChar, { color: charColor(term) }]}>
                  {term}
                </Text>
              )}
              <Text style={[styles.termName, isSingleChar && { marginTop: 4 }]}>
                {info.title}
              </Text>
              {info.subtitle && (
                <Text style={styles.termSub}>{info.subtitle}</Text>
              )}
              <View style={styles.divider} />
              {info.meaning.map((p, i) => (
                <Text key={i} style={styles.meaning}>
                  {p}
                </Text>
              ))}
              <View style={styles.tags}>
                {info.tags.map((t) => (
                  <View key={t} style={styles.tag}>
                    <Text style={styles.tagText}>{t}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.meaning}>No definition available for "{term}".</Text>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Got it</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export { TERM_DICTIONARY };

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  modal: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: Colors.card,
    borderRadius: 22,
    padding: 28,
    paddingHorizontal: 22,
    alignItems: "center",
    ...Shadow.elevated,
  },
  bigChar: {
    fontSize: 52,
    fontWeight: "700",
    lineHeight: 56,
    marginBottom: 6,
  },
  termName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.2,
    marginBottom: 2,
    textAlign: "center",
  },
  termSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  divider: {
    width: 32,
    height: 3,
    backgroundColor: Colors.accent,
    borderRadius: 2,
    marginBottom: 14,
  },
  meaning: {
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 23,
    marginBottom: 10,
    width: "100%",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 2,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#F5F2EC",
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#636366",
  },
  closeBtn: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: Colors.deep,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
  },
  closeText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textOnDark,
    letterSpacing: -0.2,
  },
});
