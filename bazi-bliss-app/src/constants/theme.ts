// 设计系统 — 100% 对齐 ios-mockup-v2.html 效果图

export const Colors = {
  // 主背景
  bg: "#F9F6F1",
  // 卡片 / 模态
  card: "#FFFFFF",
  // 深色底（引导页、Cosmic Weather、CTA）
  deep: "#12111B",

  // 品牌色
  accent: "#C8846E",
  accentLight: "#FDF2EE",
  accentBg: "#FDF9F7",

  // 文字
  text: "#12111B",
  textSecondary: "#86868B",
  textBody: "#3C3C43",
  textOnDark: "#FFFFFF",
  textOnDarkMuted: "rgba(255,255,255,0.55)",

  // 五行配色 — 严格对齐效果图
  wood: "#5B8C5A",
  fire: "#D94E3C",
  earth: "#B8956A",
  metal: "#C8A951",
  water: "#5B8FA8",

  // 分隔线 / 边框
  border: "#EBE7E0",
  borderLight: "#F5F2EC",

  // 模糊锁定区
  blur: "rgba(249,246,241,0.7)",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const FontSize = {
  tiny: 10,
  caption: 12,
  small: 13,
  body: 15,
  bodyLarge: 17,
  h3: 18,
  h2: 22,
  h1: 28,
  hero: 34,
} as const;

export const FontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const Shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

// 五行配色映射
export const ELEMENT_COLORS: Record<string, string> = {
  Wood: Colors.wood,
  Fire: Colors.fire,
  Earth: Colors.earth,
  Metal: Colors.metal,
  Water: Colors.water,
};
