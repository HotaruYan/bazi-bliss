// 八字引擎 — 纯 TypeScript，零依赖，从 Web 版直接复制
export {
  calculateBazi,
  calculateDaYun,
  getYearPillar,
  getMonthPillarsForYear,
  formatBaziForAI,
  formatBaziForAIEn,
  formatDaYunForAI,
  formatLiuNianLiuYueForAI,
  getSolarTermPeriod,
  getMonthStem,
  getTenGod,
  STEM_ELEMENT,
  BRANCH_ELEMENT,
} from "./bazi-calculator";

export type {
  BaziChart,
  Pillar,
  BirthInfoInput,
  DaYunResult,
  DaYunCycle,
  LiuNianInfo,
  LiuYuePillar,
  SpiritResult,
} from "./bazi-calculator";

export { analyzeStrength, formatStrengthForAI } from "./bazi-strength";

export type { StrengthResult } from "./bazi-strength";
