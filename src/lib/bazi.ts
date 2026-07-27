/**
 * 八字排盘辅助
 *
 * MVP 阶段：排盘由 DeepSeek 在生成报告时直接完成。
 * V1.0 阶段：集成 @openfate/bazi-engine 做本地确定性排盘，AI 只负责解读。
 *
 * 本文件为 V1.0 预留接口，方便后续平滑升级。
 */

export interface BaziChart {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
}

interface Pillar {
  heavenlyStem: string;
  earthlyBranch: string;
  heavenlyStemElement: string;
  earthlyBranchElement: string;
  hiddenStems: string[];
}

/**
 * V1.0: 接入 @openfate/bazi-engine 后替换此函数
 *
 * import { BaziEngine } from "@openfate/bazi-engine";
 *
 * const engine = new BaziEngine();
 * const chart = engine.calculate({
 *   year: 1990,
 *   month: 5,
 *   day: 15,
 *   hour: 14,
 *   latitude: 39.9,
 *   longitude: 116.4,
 * });
 */
export function calculateBaziChart(_birthInfo: {
  year: number;
  month: number;
  day: number;
  hour: number;
  latitude: number;
  longitude: number;
}): BaziChart | null {
  // MVP: 暂时返回 null，由 DeepSeek 直接排盘
  // V1.0: 返回真实排盘结果
  return null;
}

export function getDayMaster(chart: BaziChart): string {
  return chart.dayPillar.heavenlyStem;
}

export function getElementBalance(chart: BaziChart): Record<string, number> {
  const elements = ["Wood", "Fire", "Earth", "Metal", "Water"];
  const balance: Record<string, number> = {};

  for (const el of elements) {
    balance[el] = 0;
  }

  const pillars = [
    chart.yearPillar,
    chart.monthPillar,
    chart.dayPillar,
    chart.hourPillar,
  ];

  for (const p of pillars) {
    balance[p.heavenlyStemElement] = (balance[p.heavenlyStemElement] || 0) + 1;
    balance[p.earthlyBranchElement] = (balance[p.earthlyBranchElement] || 0) + 1;
  }

  return balance;
}
