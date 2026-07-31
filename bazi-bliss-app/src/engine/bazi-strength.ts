/**
 * 八字身强身弱判断 + 喜用神计算
 *
 * 综合四大经典：
 * - 《渊海子平》：得令、得地、得势，三得其二为身强
 * - 《三命通会》：通根为重中之重，格局中和为贵
 * - 《滴天髓》：众寡论、源流论、配合干支
 * - 《穷通宝鉴》：逐月调候用神，十二月分论
 */

import type { BaziChart } from "./bazi-calculator";

type Element = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

const FIVE_ELEMENTS: Element[] = ["Wood", "Fire", "Earth", "Metal", "Water"];

const STEM_ELEM: Record<string, Element> = {
  甲: "Wood", 乙: "Wood", 丙: "Fire", 丁: "Fire", 戊: "Earth",
  己: "Earth", 庚: "Metal", 辛: "Metal", 壬: "Water", 癸: "Water",
};

const STEM_YY: Record<string, "Yang" | "Yin"> = {
  甲: "Yang", 乙: "Yin", 丙: "Yang", 丁: "Yin", 戊: "Yang",
  己: "Yin", 庚: "Yang", 辛: "Yin", 壬: "Yang", 癸: "Yin",
};

const BRANCH_MAIN: Record<string, Element> = {
  子: "Water", 丑: "Earth", 寅: "Wood", 卯: "Wood",
  辰: "Earth", 巳: "Fire", 午: "Fire", 未: "Earth",
  申: "Metal", 酉: "Metal", 戌: "Earth", 亥: "Water",
};

// 地支藏干（本气、中气、余气）
const HIDDEN: Record<string, string[]> = {
  子: ["癸"], 丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"], 卯: ["乙"],
  辰: ["戊", "乙", "癸"], 巳: ["丙", "庚", "戊"],
  午: ["丁", "己"], 未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"], 酉: ["辛"],
  戌: ["戊", "辛", "丁"], 亥: ["壬", "甲"],
};

// ── 一、得令：月令旺相休囚死（渊海子平） ──

function getMonthWangXiang(order: Element[]): Record<Element, string> {
  // order: [旺, 相, 休, 囚, 死]
  const labels = ["旺", "相", "休", "囚", "死"];
  const map: Record<string, string> = {};
  order.forEach((e, i) => { map[e] = labels[i]; });
  return map;
}

function monthStrengthOrder(monthBranch: string): Element[] {
  const main = BRANCH_MAIN[monthBranch];
  const i = FIVE_ELEMENTS.indexOf(main);
  return [
    main,                             // 旺：月令本气
    FIVE_ELEMENTS[(i + 1) % 5],       // 相：我生者
    FIVE_ELEMENTS[(i + 4) % 5],       // 休：生我者
    FIVE_ELEMENTS[(i + 3) % 5],       // 囚：克我者
    FIVE_ELEMENTS[(i + 2) % 5],       // 死：我克者
  ];
}

function getMonthStatus(dmElement: Element, monthBranch: string): { status: string; score: number } {
  const order = monthStrengthOrder(monthBranch);
  const idx = order.indexOf(dmElement);
  const labels = ["旺", "相", "休", "囚", "死"];
  const scores = [40, 25, 15, 8, 0];
  return { status: labels[idx], score: scores[idx] };
}

// ── 二、得地：通根检测（三命通会） ──

interface RootInfo {
  hasRoot: boolean;
  strongRoot: boolean;    // 本气根
  mediumRoot: boolean;    // 中气根
  weakRoot: boolean;      // 余气根
  rootBranches: string[]; // 哪几柱有根
  rootScore: number;
}

function checkRoot(dmElement: Element, branches: string[]): RootInfo {
  let hasRoot = false;
  let strongRoot = false;
  let mediumRoot = false;
  let weakRoot = false;
  const rootBranches: string[] = [];
  let rootScore = 0;

  for (const br of branches) {
    const hidden = HIDDEN[br];
    if (!hidden) continue;
    for (let j = 0; j < hidden.length; j++) {
      if (STEM_ELEM[hidden[j]] === dmElement) {
        hasRoot = true;
        rootBranches.push(br);
        if (j === 0) {
          strongRoot = true;
          rootScore += 12;
        } else if (j === 1) {
          mediumRoot = true;
          rootScore += 7;
        } else {
          weakRoot = true;
          rootScore += 4;
        }
        break; // 一根只计一次
      }
    }
  }

  return { hasRoot, strongRoot, mediumRoot, weakRoot, rootBranches, rootScore };
}

// ── 三、得势：天干众寡（滴天髓） ──

function getStemSupport(stem: string, dmElement: Element, isDayStem: boolean): number {
  if (isDayStem) return 0; // 日主不作自我帮扶

  const elem = STEM_ELEM[stem];
  const dmIdx = FIVE_ELEMENTS.indexOf(dmElement);
  if (elem === dmElement) return 14;        // 比劫
  if (elem === FIVE_ELEMENTS[(dmIdx + 4) % 5]) return 10; // 印星
  if (elem === FIVE_ELEMENTS[(dmIdx + 3) % 5]) return -10; // 官杀
  if (elem === FIVE_ELEMENTS[(dmIdx + 1) % 5]) return -7;  // 食伤
  return -5; // 财
}

function getBranchSupport(branch: string, dmElement: Element): number {
  const main = BRANCH_MAIN[branch];
  const dmIdx = FIVE_ELEMENTS.indexOf(dmElement);
  if (main === dmElement) return 10;            // 地支比劫
  if (main === FIVE_ELEMENTS[(dmIdx + 4) % 5]) return 7;  // 地支印星
  if (main === FIVE_ELEMENTS[(dmIdx + 3) % 5]) return -8; // 官杀
  if (main === FIVE_ELEMENTS[(dmIdx + 1) % 5]) return -5; // 食伤
  return -3; // 财
}

// ── 四、穷通宝鉴逐月调候 ──

interface TiaoHou {
  favorable: Element[];   // 调候用神
  notes: string;
}

function getTiaoHou(dayStem: string, monthBranch: string): TiaoHou {
  const dm = dayStem;
  const m = monthBranch;

  // 甲木
  if (dm === "甲") {
    if (["寅", "卯"].includes(m)) return { favorable: ["Fire"], notes: "春木向阳，喜火温暖" };
    if (["巳", "午"].includes(m)) return { favorable: ["Water"], notes: "夏木枯焦，喜水滋润" };
    if (["申", "酉"].includes(m)) return { favorable: ["Fire", "Metal"], notes: "秋木凋零，先用火制金，次用水" };
    if (["亥", "子"].includes(m)) return { favorable: ["Fire"], notes: "冬木寒湿，喜火暖局" };
    if (["辰", "未", "戌", "丑"].includes(m)) return { favorable: ["Water", "Fire"], notes: "四季土月，水火既济" };
  }

  // 乙木
  if (dm === "乙") {
    if (["寅", "卯"].includes(m)) return { favorable: ["Water", "Fire"], notes: "春乙喜水润火暖" };
    if (["巳", "午"].includes(m)) return { favorable: ["Water"], notes: "夏木最需水润" };
    if (["申", "酉"].includes(m)) return { favorable: ["Fire", "Water"], notes: "秋木用火制金护木" };
    if (["亥", "子"].includes(m)) return { favorable: ["Fire"], notes: "冬木寒，喜火解冻" };
    if (["辰", "未", "戌", "丑"].includes(m)) return { favorable: ["Water", "Fire"], notes: "四季土月，水润火暖" };
  }

  // 丙火
  if (dm === "丙") {
    if (["寅", "卯"].includes(m)) return { favorable: ["Water"], notes: "春火渐旺，需水调济" };
    if (["巳", "午"].includes(m)) return { favorable: ["Water"], notes: "夏火炎炎，非水不济，尤喜壬水" };
    if (["申", "酉"].includes(m)) return { favorable: ["Wood"], notes: "秋火退气，喜木来生" };
    if (["亥", "子"].includes(m)) return { favorable: ["Wood", "Fire"], notes: "冬火将灭，喜木生火暖局" };
    if (["辰", "未", "戌", "丑"].includes(m)) return { favorable: ["Wood", "Water"], notes: "土晦火，需木疏土，水调候" };
  }

  // 丁火
  if (dm === "丁") {
    if (["寅", "卯"].includes(m)) return { favorable: ["Wood"], notes: "春丁如灯，喜木添油" };
    if (["巳", "午"].includes(m)) return { favorable: ["Water"], notes: "夏火猛烈，需水调候" };
    if (["申", "酉"].includes(m)) return { favorable: ["Wood", "Fire"], notes: "秋火微弱，喜木火扶助" };
    if (["亥", "子"].includes(m)) return { favorable: ["Wood"], notes: "冬火欲熄，最需甲木生扶" };
    if (["辰", "未", "戌", "丑"].includes(m)) return { favorable: ["Wood", "Fire"], notes: "土重晦火，需木疏土火助燃" };
  }

  // 戊土
  if (dm === "戊") {
    if (["寅", "卯"].includes(m)) return { favorable: ["Fire", "Metal"], notes: "春木克土，需火化木生土，金制木" };
    if (["巳", "午"].includes(m)) return { favorable: ["Water"], notes: "夏土燥烈，急需水润" };
    if (["申", "酉"].includes(m)) return { favorable: ["Fire"], notes: "秋金泄土，喜火生土" };
    if (["亥", "子"].includes(m)) return { favorable: ["Fire", "Earth"], notes: "冬土寒湿，喜火暖土" };
    if (["辰", "未", "戌", "丑"].includes(m)) return { favorable: ["Metal", "Water"], notes: "四季土旺，喜金泄秀，水润" };
  }

  // 己土
  if (dm === "己") {
    if (["寅", "卯"].includes(m)) return { favorable: ["Fire"], notes: "春木克己土，需火化杀生身" };
    if (["巳", "午"].includes(m)) return { favorable: ["Water"], notes: "夏土干燥，需水滋润" };
    if (["申", "酉"].includes(m)) return { favorable: ["Fire"], notes: "秋金泄土，喜火生扶" };
    if (["亥", "子"].includes(m)) return { favorable: ["Fire", "Earth"], notes: "冬土寒湿，喜火暖土" };
    if (["辰", "未", "戌", "丑"].includes(m)) return { favorable: ["Metal", "Water", "Wood"], notes: "四季土厚，喜金泄水润木疏" };
  }

  // 庚金
  if (dm === "庚") {
    if (["寅", "卯"].includes(m)) return { favorable: ["Earth", "Fire"], notes: "春木旺金囚，需土生金，火炼金成器" };
    if (["巳", "午"].includes(m)) return { favorable: ["Earth", "Water"], notes: "夏火克金，需土泄火生金，水制火" };
    if (["申", "酉"].includes(m)) return { favorable: ["Fire", "Water"], notes: "秋金当令最旺，喜火炼金成器，水泄秀" };
    if (["亥", "子"].includes(m)) return { favorable: ["Fire", "Earth"], notes: "冬金水冷金寒，先用丙火解冻，次用戊土制水" };
    if (["辰", "未", "戌", "丑"].includes(m)) return { favorable: ["Fire", "Water", "Wood"], notes: "土重埋金，需木疏土，火炼金，水润" };
  }

  // 辛金
  if (dm === "辛") {
    if (["寅", "卯"].includes(m)) return { favorable: ["Earth", "Water"], notes: "春木旺，辛金柔弱，需土生金，水润木" };
    if (["巳", "午"].includes(m)) return { favorable: ["Earth", "Water"], notes: "夏火克辛金，需土泄火生金，水制火护金" };
    if (["申", "酉"].includes(m)) return { favorable: ["Water"], notes: "秋金当令，喜水淘洗，金水相涵" };
    if (["亥", "子"].includes(m)) return { favorable: ["Fire"], notes: "冬金水冷，喜火暖局" };
    if (["辰", "未", "戌", "丑"].includes(m)) return { favorable: ["Water", "Wood"], notes: "土重埋金，需水润木疏" };
  }

  // 壬水
  if (dm === "壬") {
    if (["寅", "卯"].includes(m)) return { favorable: ["Metal", "Fire"], notes: "春水渐退，喜金生水，火暖局" };
    if (["巳", "午"].includes(m)) return { favorable: ["Metal"], notes: "夏水枯涸，急需金来生水" };
    if (["申", "酉"].includes(m)) return { favorable: ["Fire", "Wood"], notes: "秋水通源最旺，喜火暖局，木泄秀" };
    if (["亥", "子"].includes(m)) return { favorable: ["Fire", "Earth"], notes: "冬水泛滥，喜火暖局，土制水" };
    if (["辰", "未", "戌", "丑"].includes(m)) return { favorable: ["Metal", "Wood"], notes: "土克水，需金化土生水，木疏土" };
  }

  // 癸水
  if (dm === "癸") {
    if (["寅", "卯"].includes(m)) return { favorable: ["Metal"], notes: "春木泄癸水，需金生水" };
    if (["巳", "午"].includes(m)) return { favorable: ["Metal"], notes: "夏水干涸，急需金生水" };
    if (["申", "酉"].includes(m)) return { favorable: ["Fire"], notes: "秋水通源，喜火暖局" };
    if (["亥", "子"].includes(m)) return { favorable: ["Fire", "Earth"], notes: "冬水冷冽，喜火暖土制" };
    if (["辰", "未", "戌", "丑"].includes(m)) return { favorable: ["Metal", "Wood"], notes: "土克水，需金化土，木疏土" };
  }

  return { favorable: [], notes: "无特殊调候" };
}

// ── 五、综合旺衰判断（渊海子平三得原则 + 滴天髓众寡） ──

export interface StrengthResult {
  score: number;
  monthStatus: string;
  monthScore: number;
  supportScore: number;
  drainScore: number;
  rootInfo: RootInfo;
  level: "极强" | "身强" | "中和偏强" | "中和" | "中和偏弱" | "身弱" | "极弱";
  isStrong: boolean;
  specialPattern: string | null;
  guide: Element;        // 用神
  helper: Element;       // 喜神
  shadow: Element;       // 忌神
  allFavorable: Element[];
  tiaoHou: TiaoHou;      // 穷通宝鉴调候
  explanation: string;
  classicalNotes: string;
}

export function analyzeStrength(chart: BaziChart): StrengthResult {
  const dmElement = chart.dayMasterElement as Element;
  const dmStem = chart.dayMaster;
  const dmYY = chart.dayMasterYinYang;

  const allStems = [
    chart.yearPillar.stem, chart.monthPillar.stem,
    chart.dayPillar.stem, chart.hourPillar.stem,
  ];
  const allBranches = [
    chart.yearPillar.branch, chart.monthPillar.branch,
    chart.dayPillar.branch, chart.hourPillar.branch,
  ];

  // ── 得令：月令旺相休囚死（渊海子平） ──
  const monthBranch = chart.monthPillar.branch;
  const { status: monthStatus, score: monthScore } = getMonthStatus(dmElement, monthBranch);

  // ── 得地：通根检测（三命通会） ──
  const rootInfo = checkRoot(dmElement, allBranches);

  // ── 得势：天干地支生扶（滴天髓） ──
  let supportScore = 0;
  let drainScore = 0;

  for (let i = 0; i < 4; i++) {
    const isDayStem = i === 2;
    const ss = getStemSupport(allStems[i], dmElement, isDayStem);
    if (ss > 0) supportScore += ss;
    else drainScore += Math.abs(ss);
  }

  for (const br of allBranches) {
    const bs = getBranchSupport(br, dmElement);
    if (bs > 0) supportScore += bs;
    else drainScore += Math.abs(bs);
  }

  // 通根加分
  supportScore += rootInfo.rootScore;

  // 总评分
  const totalScore = monthScore + supportScore - drainScore * 0.7;
  // 对克泄耗打 7 折，因为克泄耗的力量在生扶面前偏弱（滴天髓：生扶众则克泄难敌）

  // ── 从格检测（滴天髓：众寡论） ──
  // 计算日主五行+印星总数 vs 其余
  const dmIdx = FIVE_ELEMENTS.indexOf(dmElement);
  const generator = FIVE_ELEMENTS[(dmIdx + 4) % 5];

  let dmCount = 0, generatorCount = 0, restCount = 0;
  for (const s of allStems) { if (STEM_ELEM[s] === dmElement) dmCount++; else if (STEM_ELEM[s] === generator) generatorCount++; else restCount++; }
  for (const b of allBranches) { if (BRANCH_MAIN[b] === dmElement) dmCount++; else if (BRANCH_MAIN[b] === generator) generatorCount++; else restCount++; }

  const supportCount = dmCount + generatorCount;

  let specialPattern: string | null = null;
  if (supportCount >= 6) {
    specialPattern = "从强格 (Follow Strong)";
  } else if (supportCount <= 1) {
    specialPattern = "从弱格 (Follow Weak)";
  }

  // ── 定旺衰级别 ──
  let level: StrengthResult["level"];
  let isStrong: boolean;

  // 三得原则（渊海子平）
  const hasDeLing = monthStatus === "旺" || monthStatus === "相";
  const hasDeDi = rootInfo.hasRoot;
  const hasDeShi = supportScore >= 25;
  const deCount = [hasDeLing, hasDeDi, hasDeShi].filter(Boolean).length;

  if (specialPattern === "从强格 (Follow Strong)") {
    level = "极强"; isStrong = true;
  } else if (specialPattern === "从弱格 (Follow Weak)") {
    level = "极弱"; isStrong = false;
  } else if (deCount >= 2 && totalScore >= 30) {
    // 三得其二 + 评分不低 → 身强
    if (totalScore >= 50) { level = "身强"; isStrong = true; }
    else { level = "中和偏强"; isStrong = true; }
  } else if (deCount <= 1 && totalScore < 25) {
    if (totalScore < 10) { level = "身弱"; isStrong = false; }
    else { level = "中和偏弱"; isStrong = false; }
  } else {
    // 三得不明确时（只得其一且分数居中），按总分判定
    if (totalScore >= 30) { level = "中和偏强"; isStrong = true; }
    else if (totalScore >= 25) { level = "中和"; isStrong = false; }
    else { level = "中和偏弱"; isStrong = false; }
  }

  // ── 穷通宝鉴调候 ──
  const tiaoHou = getTiaoHou(dmStem, monthBranch);

  // ── 喜用神（病药法 + 调候） ──
  const overcomer = FIVE_ELEMENTS[(dmIdx + 3) % 5]; // 克我 → 官杀
  const overcome = FIVE_ELEMENTS[(dmIdx + 2) % 5];  // 我克 → 财
  const generated = FIVE_ELEMENTS[(dmIdx + 1) % 5]; // 我生 → 食伤

  let guide: Element;
  let helper: Element;
  let shadow: Element;
  let allFavorable: Element[];

  if (specialPattern === "从强格 (Follow Strong)") {
    guide = dmElement;
    helper = generator;
    shadow = overcomer;
    allFavorable = [dmElement, generator];
  } else if (specialPattern === "从弱格 (Follow Weak)") {
    guide = overcome;
    helper = generated;
    shadow = generator;
    allFavorable = [overcome, overcomer, generated];
  } else if (isStrong) {
    // 身强：喜克泄耗
    // 优先选调候元素（穷通宝鉴）如果在克泄耗中
    const drainCandidates = [overcomer, overcome, generated];
    const tiaoHouInDrain = tiaoHou.favorable.filter((e) => drainCandidates.includes(e));
    guide = tiaoHouInDrain.length > 0 ? tiaoHouInDrain[0] : overcomer;
    helper = drainCandidates.find((e) => e !== guide) || overcome;
    shadow = dmElement;
    allFavorable = drainCandidates;
  } else {
    // 身弱：喜生扶
    const supportCandidates = [generator, dmElement];
    const tiaoHouInSupport = tiaoHou.favorable.filter((e) => supportCandidates.includes(e));
    guide = tiaoHouInSupport.length > 0 ? tiaoHouInSupport[0] : generator;
    helper = supportCandidates.find((e) => e !== guide) || dmElement;
    shadow = overcomer;
    allFavorable = supportCandidates;
  }

  // ── 古典分析文本 ──
  const elemCN: Record<string, string> = { Wood: "木", Fire: "火", Earth: "土", Metal: "金", Water: "水" };

  const classicalNotes = `
**四书合参：**

- **渊海子平** — 得令：${monthStatus}（月令${BRANCH_MAIN[monthBranch]}，日主${dmElement}居${monthStatus}位）| 得地：${rootInfo.hasRoot ? `有根（${rootInfo.rootBranches.join("、")}）` : "无根"} | 得势：${hasDeShi ? "有势" : "无势"} | 三得其${deCount} → ${deCount >= 2 ? "身强" : "本应身弱，但结合滴天髓众寡论，详见下文"}

- **三命通会** — ${rootInfo.hasRoot ? `通根于${rootInfo.rootBranches.join("、")}${rootInfo.strongRoot ? "，本气根深，力量坚实" : ""}` : "四柱无根，如浮萍无依"}。辰戌丑未为四库，${allBranches.filter((b) => ["辰", "戌", "丑", "未"].includes(b) && BRANCH_MAIN[b] === generator).length > 0 ? "有印库为根，是为生扶" : ""}

- **滴天髓** — 天干${allStems.filter((s) => STEM_ELEM[s] === dmElement).length}重${dmElement}，${allStems.filter((s) => STEM_ELEM[s] === generator).length}重${generator}。${dmCount >= 3 ? "比劫林立，众者为强——虽失令亦可身强" : dmCount <= 1 ? "日主孤弱，无一帮扶" : "日主有伴，不孤不众"}

- **穷通宝鉴** — ${dmStem}（${elemCN[dmElement]}）生于${monthBranch}月（${BRANCH_MAIN[monthBranch]}月）。${tiaoHou.notes}。
`;

  const explanation = `${isStrong ? "身强" : "身弱"}。用神${elemCN[guide]}（${guide}），喜神${elemCN[helper]}（${helper}），忌${elemCN[shadow]}（${shadow}）。`;

  return {
    score: totalScore,
    monthStatus, monthScore, supportScore, drainScore,
    rootInfo,
    level, isStrong, specialPattern,
    guide, helper, shadow, allFavorable,
    tiaoHou,
    explanation,
    classicalNotes,
  };
}

// ── 格式化给 AI ──

export function formatStrengthForAI(chart: BaziChart, strength: StrengthResult): string {
  const elemCN: Record<string, string> = { Wood: "木", Fire: "火", Earth: "土", Metal: "金", Water: "水" };

  return `## 旺衰分析（四书合参，程序精确计算）

**日主：** ${chart.dayMaster}（${chart.dayMasterYinYang} ${chart.dayMasterElement}）
**月令：** ${chart.monthPillar.branch}月 → 日主${elemCN[chart.dayMasterElement as Element]}居「${strength.monthStatus}」位（得分${strength.monthScore}）
**旺衰等级：** **${strength.level}**（${strength.isStrong ? "身强" : "身弱"}）
${strength.specialPattern ? `**特殊格局：** ${strength.specialPattern}` : ""}

**喜用神（四书合参结果）：**
- 🟢 **用神（Guide）：${elemCN[strength.guide]}（${strength.guide}）** — 最有利的元素
- 🟢 **喜神（Helper）：${elemCN[strength.helper]}（${strength.helper}）** — 次要有利的元素
- 🔴 **忌神（Shadow）：${elemCN[strength.shadow]}（${strength.shadow}）** — 最不利的元素
- 全部喜用：${strength.allFavorable.map((e) => `${elemCN[e]}(${e})`).join("、")}

${strength.classicalNotes}

> **For the Feng Shui/Lucky Items section:** Recommend items matching the Guide (${elemCN[strength.guide]}) and Helper (${elemCN[strength.helper]}) elements. NEVER recommend items matching the Shadow (${elemCN[strength.shadow]}) element.`;
}
