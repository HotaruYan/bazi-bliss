import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import { Colors, FontSize, Radius, Shadow } from "../../constants/theme";

const Haptics: any =
  Platform.OS === "ios" || Platform.OS === "android"
    ? require("expo-haptics")
    : null;

interface Fortune {
  stars: string;
  sign: string;
  quote: string;
  advice: string;
}

const FORTUNES: Fortune[] = [
  {
    stars: "★★★★★",
    sign: "Radiant",
    quote: "The river does not rush — yet it reaches the sea.",
    advice:
      "Today, patience is your superpower. Something you've been pushing hard on doesn't need more force. It needs time. Step back, let things settle, and trust the process.",
  },
  {
    stars: "★★★★",
    sign: "Bright",
    quote: "A door you've been knocking on is about to open.",
    advice:
      "Stay ready. The opportunity coming your way won't look like you expected, but it's exactly what you need. Say yes before you feel ready.",
  },
  {
    stars: "★★★★★",
    sign: "Resilient",
    quote: "Stillness is not emptiness — it is preparation.",
    advice:
      "You don't need to push today. Let things unfold. The pause you're in isn't a setback — it's the inhale before the leap. Trust your rhythm.",
  },
  {
    stars: "★★★",
    sign: "Steady",
    quote: "Water finds its way around every obstacle. So will you.",
    advice:
      "There's a stubborn situation you've been fighting head-on. Try flowing around it instead. Flexibility today will win what force couldn't.",
  },
  {
    stars: "★★★★★",
    sign: "Courageous",
    quote: "The mountain does not bow to the wind — and neither do you.",
    advice:
      "Today calls for quiet resolve. Stand your ground on something that matters. You don't need to be loud — just firm. The right people will respect it.",
  },
  {
    stars: "★★★★",
    sign: "Inspired",
    quote: "A spark doesn't ask permission to become a flame.",
    advice:
      "Creative energy is high today. Follow the idea that keeps tugging at you, even if it seems impractical. The best things usually start that way.",
  },
  {
    stars: "★★★★★",
    sign: "Aligned",
    quote: "The stars are not in a hurry — and neither should you be.",
    advice:
      "You're exactly where you need to be. The timing that frustrates you is actually protecting you. Something better is being prepared. Let it cook.",
  },
  {
    stars: "★★★",
    sign: "Reflective",
    quote: "Not every question needs an answer today.",
    advice:
      "Sit with the uncertainty. What feels like confusion is actually wisdom gathering itself. Clarity comes when you stop chasing it.",
  },
];

const STICK_COUNT = 16;

export function FortuneShaker() {
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [shaking, setShaking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasShaken, setHasShaken] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const popStickAnim = useRef(new Animated.Value(0)).current;

  const handleShake = useCallback(async () => {
    if (shaking) return;
    setShaking(true);
    setShowModal(false);

    if (Haptics) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // 摇晃动画
    const shake = Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 6, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 70, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 70, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 2, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]);

    // 弹签动画
    popStickAnim.setValue(0);

    shake.start(() => {
      const pick = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      setFortune(pick);
      setHasShaken(true);
      setShaking(false);

      // 弹签弹出动画
      Animated.sequence([
        Animated.timing(popStickAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(true);
      });

      if (Haptics) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    });
  }, [shaking, shakeAnim, popStickAnim]);

  const closeModal = () => setShowModal(false);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Daily Fortune</Text>
      <Text style={styles.title}>What does today hold?</Text>

      {/* 签筒 */}
      <TouchableOpacity
        onPress={handleShake}
        disabled={shaking}
        activeOpacity={0.8}
        style={styles.tubeArea}
      >
        <Animated.View
          style={[
            styles.tube,
            { transform: [{ rotate: shakeAnim.interpolate({
              inputRange: [-6, 6],
              outputRange: ["-6deg", "6deg"],
            }) }] },
          ]}
        >
          {/* 筒内签条 */}
          <View style={styles.sticksWrap}>
            {Array.from({ length: STICK_COUNT }).map((_, i) => (
              <View key={i} style={styles.stick} />
            ))}
          </View>
          {/* 弹出的签 */}
          {hasShaken && (
            <Animated.View
              style={[
                styles.poppingStick,
                {
                  transform: [
                    {
                      translateY: popStickAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -52],
                      }),
                    },
                    {
                      rotate: popStickAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "-8deg"],
                      }),
                    },
                  ],
                  opacity: popStickAnim,
                },
              ]}
            />
          )}
        </Animated.View>
      </TouchableOpacity>

      {!hasShaken && !shaking && (
        <>
          <Text style={styles.hint}>Tap to reveal today's guidance</Text>
          <Text style={styles.freeBadge}>1 free shake daily</Text>
        </>
      )}

      {hasShaken && !shaking && (
        <Text style={styles.shakenHint}>Today's fortune — revealed</Text>
      )}

      {/* 摇签结果 */}
      {fortune && hasShaken && (
        <View style={styles.resultBox}>
          <Text style={styles.resultStars}>{fortune.stars} · {fortune.sign}</Text>
          <Text style={styles.resultQuote}>"{fortune.quote}"</Text>
          <Text style={styles.resultAdvice}>{fortune.advice}</Text>
        </View>
      )}

      {/* Fortune Modal */}
      <Modal visible={showModal} animationType="fade" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalStars}>✦ ✦ ✦</Text>
            {fortune && (
              <>
                <Text style={styles.modalSign}>{fortune.stars} · {fortune.sign}</Text>
                <Text style={styles.modalQuote}>{`"${fortune.quote}"`}</Text>
                <Text style={styles.modalAdvice}>{fortune.advice}</Text>
              </>
            )}
            <TouchableOpacity style={styles.modalBtn} onPress={closeModal}>
              <Text style={styles.modalBtnText}>Lucky!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 22,
    padding: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    ...Shadow.card,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.2,
    marginBottom: 16,
  },
  tubeArea: {
    paddingVertical: 8,
  },
  tube: {
    width: 80,
    height: 160,
    borderRadius: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#E8E4DC",
    // 渐变效果用叠加层模拟
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    overflow: "hidden",
    position: "relative",
  },
  sticksWrap: {
    position: "absolute",
    top: 8,
    left: 12,
    right: 12,
    bottom: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 2,
    alignContent: "flex-start",
    paddingTop: 6,
  },
  stick: {
    width: 6,
    height: 42,
    backgroundColor: "#F5F0E8",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  poppingStick: {
    position: "absolute",
    top: 12,
    left: "50%",
    width: 6,
    height: 56,
    backgroundColor: "#FDF2EE",
    borderRadius: 3,
    marginLeft: -3,
    shadowColor: "#C8846E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  hint: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  freeBadge: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.textSecondary,
    letterSpacing: 0.2,
    marginTop: 4,
  },
  shakenHint: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  // 结果卡片
  resultBox: {
    marginTop: 16,
    padding: 18,
    backgroundColor: "#FDF9F7",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F5EDE7",
    width: "100%",
  },
  resultStars: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 6,
  },
  resultQuote: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.text,
    lineHeight: 25,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  resultAdvice: {
    fontSize: 13,
    color: "#636366",
    lineHeight: 20,
  },
  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  modal: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 28,
    paddingHorizontal: 24,
    alignItems: "center",
    ...Shadow.elevated,
  },
  modalStars: {
    fontSize: 32,
    marginBottom: 14,
    letterSpacing: 4,
    color: Colors.accent,
  },
  modalSign: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  modalQuote: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    lineHeight: 27,
    letterSpacing: -0.3,
    marginBottom: 10,
    textAlign: "center",
  },
  modalAdvice: {
    fontSize: 14,
    color: "#636366",
    lineHeight: 20,
    marginBottom: 22,
    textAlign: "center",
  },
  modalBtn: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: Colors.deep,
    borderRadius: 14,
    alignItems: "center",
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textOnDark,
    letterSpacing: -0.2,
  },
});
