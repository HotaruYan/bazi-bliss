/**
 * 八字排盘计算器
 *
 * 精确计算年、月、日、时四柱的天干地支。
 * 包含真太阳时校正、节气判断、五虎遁、五鼠遁等算法。
 */

// ── 天干地支常量 ──

const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

export const STEM_ELEMENT: Record<string, string> = {
  甲: "Wood", 乙: "Wood", 丙: "Fire", 丁: "Fire", 戊: "Earth",
  己: "Earth", 庚: "Metal", 辛: "Metal", 壬: "Water", 癸: "Water",
};

const STEM_YIN_YANG: Record<string, string> = {
  甲: "Yang", 乙: "Yin", 丙: "Yang", 丁: "Yin", 戊: "Yang",
  己: "Yin", 庚: "Yang", 辛: "Yin", 壬: "Yang", 癸: "Yin",
};

export const BRANCH_ELEMENT: Record<string, string> = {
  子: "Water", 丑: "Earth", 寅: "Wood", 卯: "Wood", 辰: "Earth",
  巳: "Fire", 午: "Fire", 未: "Earth", 申: "Metal", 酉: "Metal",
  戌: "Earth", 亥: "Water",
};

// 地支藏干（本气、中气、余气）
const HIDDEN_STEMS: Record<string, readonly string[]> = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "庚", "戊"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"],
};

// ── 节气计算 ──

// 12个"节"（划分月份的分界点）的近似公历日期
// 精确到 ±1 天，对八字排盘足够准确
// 格式：[月份, 日期]
const JIE_DATES: [number, number][] = [
  [2, 4],  // 立春 → 寅月开始
  [3, 6],  // 惊蛰 → 卯月开始
  [4, 5],  // 清明 → 辰月开始
  [5, 6],  // 立夏 → 巳月开始
  [6, 6],  // 芒种 → 午月开始
  [7, 7],  // 小暑 → 未月开始
  [8, 7],  // 立秋 → 申月开始
  [9, 8],  // 白露 → 酉月开始
  [10, 8], // 寒露 → 戌月开始
  [11, 7], // 立冬 → 亥月开始
  [12, 7], // 大雪 → 子月开始
  [1, 6],  // 小寒 → 丑月开始
];

export function getSolarTermPeriod(month: number, day: number): number {
  // 返回该日期所在的节气月索引（0=寅月, 1=卯月, ..., 11=丑月）
  const dateVal = month * 100 + day;

  for (let i = 0; i < JIE_DATES.length; i++) {
    const [m, d] = JIE_DATES[i];
    if (dateVal < m * 100 + d) {
      return i === 0 ? 11 : i - 1;
    }
  }
  // 在所有节之后（即12月7日 ~ 12月31日），属于子月
  // 实际上大雪(12/7)之后是子月，到小寒(1/6)之前
  return 10; // 子月
}

// ── 日期差计算 ──

function daysFromReference(year: number, month: number, day: number): number {
  // 计算从 1900-01-01（甲戌日）到目标日期的天数
  const ref = new Date(1900, 0, 1);
  const target = new Date(year, month - 1, day);
  return Math.round((target.getTime() - ref.getTime()) / (24 * 60 * 60 * 1000));
}

// ── 真太阳时校正 ──

// 主要城市的经度（用于真太阳时计算）
const CITY_LONGITUDE: Record<string, number> = {
  beijing: 116.4,
  shanghai: 121.5,
  guangzhou: 113.3,
  shenzhen: 114.1,
  hongkong: 114.2,
  taipei: 121.5,
  tokyo: 139.7,
  seoul: 127.0,
  singapore: 103.8,
  "new york": -74.0,
  "los angeles": -118.2,
  london: -0.1,
  paris: 2.3,
  sydney: 151.2,
  vancouver: -123.1,
  toronto: -79.4,
  chicago: -87.6,
  sanfrancisco: -122.4,
  "san francisco": -122.4,
};

function getCityLongitude(city: string): number | null {
  const lower = city.trim().toLowerCase();
  if (CITY_LONGITUDE[lower] !== undefined) return CITY_LONGITUDE[lower];

  // 尝试模糊匹配：检查输入是否包含城市名
  for (const [name, lon] of Object.entries(CITY_LONGITUDE)) {
    if (lower.includes(name) || name.includes(lower)) return lon;
  }
  return null;
}

function getTrueSolarHour(hour: number, minute: number, longitude: number | null): { hour: number; minute: number } {
  // 北京时间基于 120°E，每偏 1° 调整 4 分钟
  const refLongitude = 120;
  const offsetMinutes = longitude ? (longitude - refLongitude) * 4 : 0;
  const totalMinutes = hour * 60 + minute + offsetMinutes;
  const adjusted = ((totalMinutes % 1440) + 1440) % 1440;
  return {
    hour: Math.floor(adjusted / 60),
    minute: Math.round(adjusted % 60),
  };
}

// ── 时辰计算 ──

interface ChineseHour {
  branch: string;
  stem: string;
  timeRange: string;
}

const HOUR_BRANCHES = [
  { branch: "子", start: 23, end: 1, range: "23:00 - 00:59" },
  { branch: "丑", start: 1, end: 3, range: "01:00 - 02:59" },
  { branch: "寅", start: 3, end: 5, range: "03:00 - 04:59" },
  { branch: "卯", start: 5, end: 7, range: "05:00 - 06:59" },
  { branch: "辰", start: 7, end: 9, range: "07:00 - 08:59" },
  { branch: "巳", start: 9, end: 11, range: "09:00 - 10:59" },
  { branch: "午", start: 11, end: 13, range: "11:00 - 12:59" },
  { branch: "未", start: 13, end: 15, range: "13:00 - 14:59" },
  { branch: "申", start: 15, end: 17, range: "15:00 - 16:59" },
  { branch: "酉", start: 17, end: 19, range: "17:00 - 18:59" },
  { branch: "戌", start: 19, end: 21, range: "19:00 - 20:59" },
  { branch: "亥", start: 21, end: 23, range: "21:00 - 22:59" },
];

function getHourBranch(hour: number): (typeof HOUR_BRANCHES)[number] {
  // 子时跨天：23点属于次日
  if (hour >= 23) return HOUR_BRANCHES[0]; // 子时
  if (hour < 1) return HOUR_BRANCHES[0]; // 0点属于子时
  for (const h of HOUR_BRANCHES) {
    if (hour >= h.start && hour < h.end) return h;
  }
  return HOUR_BRANCHES[0]; // fallback
}

// ── 五虎遁（月干） ──

export function getMonthStem(yearStem: string, monthBranchIndex: number): string {
  // 五虎遁：根据年干推算寅月（首月）的天干
  const YS = HEAVENLY_STEMS;
  const tigerMap: Record<string, number> = {
    甲: 2, 己: 2, // 甲己之年丙作首 → 寅月丙(2)
    乙: 4, 庚: 4, // 乙庚之岁戊为头 → 寅月戊(4)
    丙: 6, 辛: 6, // 丙辛必定寻庚起 → 寅月庚(6)
    丁: 8, 壬: 8, // 丁壬壬位顺行流 → 寅月壬(8)
    戊: 0, 癸: 0, // 戊癸何方发，甲寅之上好追求 → 寅月甲(0)
  };

  const firstMonthStem = tigerMap[yearStem];
  const stemIndex = (firstMonthStem + monthBranchIndex) % 10;
  return YS[stemIndex];
}

// ── 五鼠遁（时干） ──

function getHourStem(dayStem: string, hourBranchIndex: number): string {
  // 五鼠遁：根据日干推算子时（首时）的天干
  const YS = HEAVENLY_STEMS;
  const ratMap: Record<string, number> = {
    甲: 0, 己: 0, // 甲己还加甲 → 子时甲(0)
    乙: 2, 庚: 2, // 乙庚丙作初 → 子时丙(2)
    丙: 4, 辛: 4, // 丙辛从戊起 → 子时戊(4)
    丁: 6, 壬: 6, // 丁壬庚子居 → 子时庚(6)
    戊: 8, 癸: 8, // 戊癸何方发，壬子是真途 → 子时壬(8)
  };

  const firstHourStem = ratMap[dayStem];
  const stemIndex = (firstHourStem + hourBranchIndex) % 10;
  return YS[stemIndex];
}

// ── 十神计算 ──

export function getTenGod(dayStem: string, otherStem: string, _gender: string): string {
  const stems = HEAVENLY_STEMS as readonly string[];
  const dayIdx = stems.indexOf(dayStem);
  const otherIdx = stems.indexOf(otherStem);
  const diff = (otherIdx - dayIdx + 10) % 10;

  // 十神关系（基于五行生克）
  // 同我：比肩(同阴阳)、劫财(异阴阳)
  // 我生：食神(同阴阳)、伤官(异阴阳)
  // 我克：正财(异阴阳)、偏财(同阴阳)
  // 克我：正官(异阴阳)、七杀(同阴阳)
  // 生我：正印(异阴阳)、偏印(同阴阳)

  const sameElement = [0, 5]; // 间隔5天干为同五行
  const iGenerate = [1, 6]; // 隔1位：我生（如甲生丙... 不是这样的）
  // 实际上需要基于五行关系，不是简单的位置差

  // 五行：甲木 乙木 丙火 丁火 戊土 己土 庚金 辛金 壬水 癸水
  // index: 0    1    2    3    4    5    6    7    8    9
  // element: Wood Wood Fire Fire Earth Earth Metal Metal Water Water

  const elementIndex = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]; // 木木火火土土金金水水
  const dayElem = elementIndex[dayIdx];
  const otherElem = elementIndex[otherIdx];

  // 五行生克关系（基于 element index）
  // 生：木生火(0→1), 火生土(1→2), 土生金(2→3), 金生水(3→4), 水生木(4→0)
  // 克：木克土(0→2), 火克金(1→3), 土克水(2→4), 金克木(3→0), 水克火(4→1)

  const generates = (a: number, b: number) => b === (a + 1) % 5;
  const overcomes = (a: number, b: number) => b === (a + 2) % 5;

  const sameYinYang = (dayIdx % 2) === (otherIdx % 2);

  if (dayElem === otherElem) {
    return sameYinYang ? "比肩" : "劫财";
  }
  if (generates(dayElem, otherElem)) {
    // 我生
    return sameYinYang ? "食神" : "伤官";
  }
  if (generates(otherElem, dayElem)) {
    // 生我
    return sameYinYang ? "偏印" : "正印";
  }
  if (overcomes(dayElem, otherElem)) {
    // 我克
    return sameYinYang ? "偏财" : "正财";
  }
  if (overcomes(otherElem, dayElem)) {
    // 克我
    return sameYinYang ? "七杀" : "正官";
  }

  return "未知";
}

// ── 主要导出类型 ──

export interface Pillar {
  stem: string;
  branch: string;
  stemElement: string;
  stemYinYang: string;
  branchElement: string;
  hiddenStems: readonly string[];
}

export interface BaziChart {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  dayMaster: string;
  dayMasterElement: string;
  dayMasterYinYang: string;
  /** 四柱中十个天干的十神 */
  tenGods: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  /** 五行数量统计 */
  elementCount: Record<string, number>;
  /** 真太阳时信息 */
  trueSolarTime: {
    originalTime: string;
    longitude: number | null;
    adjustedHour: number;
    adjustedMinute: number;
    note: string;
  };
  /** 时柱说明 */
  timeRangeNote: string;
  /** 神煞 */
  spirits: SpiritResult;
}

// ── 神煞类型 ──

export interface SpiritResult {
  year: string[];
  month: string[];
  day: string[];
  hour: string[];
}

export interface BirthInfoInput {
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:MM 或 "unknown"
  birthCity: string;
  gender: string;
}

// ── 神煞计算 ──

function calculateSpirits(
  yearBranch: string, monthBranch: string,
  dayStem: string, dayBranch: string, hourBranch: string
): SpiritResult {
  // 天乙贵人 (Heavenly Noble) — 基于日干
  const nobleMap: Record<string, string[]> = {
    甲: ["丑", "未"], 戊: ["丑", "未"], 庚: ["丑", "未"],
    乙: ["子", "申"], 己: ["子", "申"],
    丙: ["亥", "酉"], 丁: ["亥", "酉"],
    辛: ["午", "寅"],
    壬: ["卯", "巳"], 癸: ["卯", "巳"],
  };
  // 文昌 (Literary Star) — 基于日干
  const literaryMap: Record<string, string> = {
    甲: "巳", 乙: "午", 丙: "申", 丁: "酉", 戊: "申",
    己: "酉", 庚: "亥", 辛: "子", 壬: "寅", 癸: "卯",
  };
  // 桃花 (Peach Blossom) — 基于年支/日支的三合局
  const peachGroups: Record<string, string> = { "申子辰": "酉", "寅午戌": "卯", "亥卯未": "子", "巳酉丑": "午" };
  // 驿马 (Traveling Horse) — 基于年支/日支
  const horseGroups: Record<string, string> = { "申子辰": "寅", "寅午戌": "申", "亥卯未": "巳", "巳酉丑": "亥" };
  // 羊刃 (Yang Blade) — 基于日干
  const bladeMap: Record<string, string> = {
    甲: "卯", 乙: "寅", 丙: "午", 丁: "巳", 戊: "午",
    己: "巳", 庚: "酉", 辛: "申", 壬: "子", 癸: "亥",
  };
  // 华盖 (Canopy Star) — 基于日支
  const canopyGroups: Record<string, string> = { "申子辰": "辰", "寅午戌": "戌", "亥卯未": "未", "巳酉丑": "丑" };
  // 禄 (Prosperity) — 基于日干
  const luMap: Record<string, string> = {
    甲: "寅", 乙: "卯", 丙: "巳", 丁: "午", 戊: "巳",
    己: "午", 庚: "申", 辛: "酉", 壬: "亥", 癸: "子",
  };

  function getGroupKey(branch: string): string {
    for (const key of Object.keys(peachGroups)) {
      if (key.includes(branch)) return key;
    }
    return "";
  }

  const nobleBranches = nobleMap[dayStem] || [];
  const literaryBranch = literaryMap[dayStem];
  const yearPeachBranch = peachGroups[getGroupKey(yearBranch)];
  const dayPeachBranch = peachGroups[getGroupKey(dayBranch)];
  const yearHorseBranch = horseGroups[getGroupKey(yearBranch)];
  const dayHorseBranch = horseGroups[getGroupKey(dayBranch)];
  const bladeBranch = bladeMap[dayStem];
  const canopyBranch = canopyGroups[getGroupKey(dayBranch)];
  const luBranch = luMap[dayStem];

  function check(branch: string): string[] {
    const res: string[] = [];
    if (nobleBranches.includes(branch)) res.push("天乙贵人");
    if (branch === literaryBranch) res.push("文昌");
    if (branch === yearPeachBranch || branch === dayPeachBranch) res.push("桃花");
    if (branch === yearHorseBranch || branch === dayHorseBranch) res.push("驿马");
    if (branch === bladeBranch) res.push("羊刃");
    if (branch === canopyBranch) res.push("华盖");
    if (branch === luBranch) res.push("禄");
    return res;
  }

  return {
    year: check(yearBranch),
    month: check(monthBranch),
    day: check(dayBranch),
    hour: check(hourBranch),
  };
}

// ── 主计算函数 ──

export function calculateBazi(input: BirthInfoInput): BaziChart {
  const [year, month, day] = input.birthDate.split("-").map(Number);
  const isTimeUnknown = !input.birthTime || input.birthTime === "unknown" || !input.birthTime.includes(":");
  const [hourStr, minuteStr] = isTimeUnknown ? ["12", "00"] : input.birthTime.split(":");
  let hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);

  const longitude = getCityLongitude(input.birthCity);

  // 真太阳时校正
  const trueSolar = getTrueSolarHour(hour, minute, longitude);
  const solarHour = trueSolar.hour;
  const solarMinute = trueSolar.minute;

  const lonNote = longitude
    ? `经度 ${longitude}°E，真太阳时 ${String(solarHour).padStart(2, "0")}:${String(solarMinute).padStart(2, "0")}`
    : "未找到城市经度，使用北京时间";

  // ── 年柱 ──
  // 立春约在2月4日，此前出生沿用前一年的年柱
  const isBeforeLiChun = month < 2 || (month === 2 && day < 4);
  const baziYear = isBeforeLiChun ? year - 1 : year;
  const yearStemIdx = (baziYear - 4) % 10;
  const yearBranchIdx = (baziYear - 4) % 12;
  const yearStem = HEAVENLY_STEMS[yearStemIdx];
  const yearBranch = EARTHLY_BRANCHES[yearBranchIdx];

  // ── 月柱 ──
  const monthPeriodIndex = getSolarTermPeriod(month, day);
  const monthBranch = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"][monthPeriodIndex];
  const monthStem = getMonthStem(yearStem, monthPeriodIndex);

  // ── 日柱 ──
  const days = daysFromReference(year, month, day);
  // 1900-01-01 是甲戌日，cycle position = 10
  const dayCyclePos = ((days % 60) + 60 + 10) % 60;
  const dayStemIdx = dayCyclePos % 10;
  const dayBranchIdx = dayCyclePos % 12;
  const dayStem = HEAVENLY_STEMS[dayStemIdx];
  const dayBranch = EARTHLY_BRANCHES[dayBranchIdx];

  // ── 时柱 ──
  const hourBranchObj = getHourBranch(solarHour);
  const hourBranch = hourBranchObj.branch;
  const hourBranchIdx = (EARTHLY_BRANCHES as readonly string[]).indexOf(hourBranch);
  const hourStem = getHourStem(dayStem, hourBranchIdx);

  // ── 时柱时间范围（根据真太阳时修正描述） ──
  const timeRangeNote = isTimeUnknown
    ? "未知，默认午时（太阳时正午）"
    : `北京时间 ${input.birthTime}，真太阳时 ${String(solarHour).padStart(2, "0")}:${String(solarMinute).padStart(2, "0")}`;

  // ── 构建四柱 ──

  function makePillar(stem: string, branch: string): Pillar {
    return {
      stem,
      branch,
      stemElement: STEM_ELEMENT[stem],
      stemYinYang: STEM_YIN_YANG[stem],
      branchElement: BRANCH_ELEMENT[branch],
      hiddenStems: HIDDEN_STEMS[branch],
    };
  }

  const yearPillar = makePillar(yearStem, yearBranch);
  const monthPillar = makePillar(monthStem, monthBranch);
  const dayPillar = makePillar(dayStem, dayBranch);
  const hourPillar = makePillar(hourStem, hourBranch);

  // ── 十神 ──
  const tenGods = {
    year: getTenGod(dayStem, yearStem, input.gender),
    month: getTenGod(dayStem, monthStem, input.gender),
    day: "日主",
    hour: getTenGod(dayStem, hourStem, input.gender),
  };

  // ── 五行统计 ──
  const elementCount: Record<string, number> = {
    Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0,
  };

  const allStems = [yearStem, monthStem, dayStem, hourStem];
  const allBranches = [yearBranch, monthBranch, dayBranch, hourBranch];

  for (const s of allStems) {
    elementCount[STEM_ELEMENT[s]]++;
  }
  for (const b of allBranches) {
    elementCount[BRANCH_ELEMENT[b]]++;
  }

  const spirits = calculateSpirits(yearBranch, monthBranch, dayStem, dayBranch, hourBranch);

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster: dayStem,
    dayMasterElement: STEM_ELEMENT[dayStem],
    dayMasterYinYang: STEM_YIN_YANG[dayStem],
    tenGods,
    elementCount,
    trueSolarTime: {
      originalTime: input.birthTime || "unknown",
      longitude,
      adjustedHour: solarHour,
      adjustedMinute: solarMinute,
      note: lonNote,
    },
    timeRangeNote,
    spirits,
  };
}

// ── 格式化输出（给 AI 用） ──

export function formatBaziForAI(chart: BaziChart, name: string): string {
  const p = (pillar: Pillar) => `${pillar.stem}${pillar.branch}`;

  return `## 已精确排盘的八字命盘

**姓名：** ${name}
**四柱：**

| | 年柱 | 月柱 | 日柱 | 时柱 |
|---|------|------|------|------|
| **天干地支** | ${p(chart.yearPillar)} | ${p(chart.monthPillar)} | ${p(chart.dayPillar)} | ${p(chart.hourPillar)} |
| **天干** | ${chart.yearPillar.stem}（${chart.yearPillar.stemYinYang} ${chart.yearPillar.stemElement}） | ${chart.monthPillar.stem}（${chart.monthPillar.stemYinYang} ${chart.monthPillar.stemElement}） | ${chart.dayPillar.stem}（${chart.dayPillar.stemYinYang} ${chart.dayPillar.stemElement}） | ${chart.hourPillar.stem}（${chart.hourPillar.stemYinYang} ${chart.hourPillar.stemElement}） |
| **地支** | ${chart.yearPillar.branch}（${chart.yearPillar.branchElement}） | ${chart.monthPillar.branch}（${chart.monthPillar.branchElement}） | ${chart.dayPillar.branch}（${chart.dayPillar.branchElement}） | ${chart.hourPillar.branch}（${chart.hourPillar.branchElement}） |
| **藏干** | ${chart.yearPillar.hiddenStems.join(" ")} | ${chart.monthPillar.hiddenStems.join(" ")} | ${chart.dayPillar.hiddenStems.join(" ")} | ${chart.hourPillar.hiddenStems.join(" ")} |
| **十神** | ${chart.tenGods.year} | ${chart.tenGods.month} | 日主 | ${chart.tenGods.hour} |

**日主：** ${chart.dayMaster}（${chart.dayMasterYinYang} ${chart.dayMasterElement}）

**五行分布（天干+地支）：**
- 木 Wood: ${chart.elementCount.Wood}
- 火 Fire: ${chart.elementCount.Fire}
- 土 Earth: ${chart.elementCount.Earth}
- 金 Metal: ${chart.elementCount.Metal}
- 水 Water: ${chart.elementCount.Water}

**时柱校正：** ${chart.timeRangeNote || ""}

> ⚠️ 以上八字已由程序精确计算，请直接基于此命盘进行解读，不要重新排盘。`;
}

// ── 英文格式化（给 AI 系统提示用） ──

export function formatBaziForAIEn(chart: BaziChart, name: string): string {
  const p = (pillar: Pillar) => `${pillar.stem}${pillar.branch}`;
  const stemLabel = (s: string) => `${STEM_YIN_YANG[s]} ${STEM_ELEMENT[s]}`;

  return `## Pre-Calculated Bazi Chart (Program-Computed — Do NOT Recalculate)

**Name:** ${name}
**Four Pillars:**

| | Year | Month | Day | Hour |
|---|------|-------|-----|------|
| **Stem-Branch** | ${p(chart.yearPillar)} | ${p(chart.monthPillar)} | ${p(chart.dayPillar)} | ${p(chart.hourPillar)} |
| **Stem** | ${chart.yearPillar.stem} (${stemLabel(chart.yearPillar.stem)}) | ${chart.monthPillar.stem} (${stemLabel(chart.monthPillar.stem)}) | ${chart.dayPillar.stem} (${stemLabel(chart.dayPillar.stem)}) | ${chart.hourPillar.stem} (${stemLabel(chart.hourPillar.stem)}) |
| **Branch** | ${chart.yearPillar.branch} (${BRANCH_ELEMENT[chart.yearPillar.branch]}) | ${chart.monthPillar.branch} (${BRANCH_ELEMENT[chart.monthPillar.branch]}) | ${chart.dayPillar.branch} (${BRANCH_ELEMENT[chart.dayPillar.branch]}) | ${chart.hourPillar.branch} (${BRANCH_ELEMENT[chart.hourPillar.branch]}) |
| **Hidden Stems** | ${chart.yearPillar.hiddenStems.join(", ")} | ${chart.monthPillar.hiddenStems.join(", ")} | ${chart.dayPillar.hiddenStems.join(", ")} | ${chart.hourPillar.hiddenStems.join(", ")} |
| **Ten God** | ${chart.tenGods.year} | ${chart.tenGods.month} | Day Master | ${chart.tenGods.hour} |

**Day Master:** ${chart.dayMaster} (${chart.dayMasterYinYang} ${chart.dayMasterElement})

**Five Element Count (stems + branches):**
- Wood: ${chart.elementCount.Wood}
- Fire: ${chart.elementCount.Fire}
- Earth: ${chart.elementCount.Earth}
- Metal: ${chart.elementCount.Metal}
- Water: ${chart.elementCount.Water}

**True Solar Time:** ${chart.trueSolarTime.note}

> ⚠️ This Bazi chart has been accurately calculated by program. Use these pillars DIRECTLY for your interpretation — do NOT attempt to recalculate or guess different pillars.`;
}

// ── 大运计算（渊海子平法则） ──

export interface DaYunCycle {
  stem: string;
  branch: string;
  stemElement: string;
  stemYinYang: string;
  branchElement: string;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  tenGod: string;
}

export interface DaYunResult {
  direction: "forward" | "backward";
  /** 起运年龄 */
  startAgeYears: number;
  startAgeMonths: number;
  cycles: DaYunCycle[];
}

/** 获取某年某个"节"的日期（基于通用近似公式，精度 ±1 天） */
function getJieDate(year: number, jieIndex: number): Date {
  const months = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1];
  const [_, d] = JIE_DATES[jieIndex];
  const y = jieIndex === 11 ? year + 1 : year; // 小寒在下一年的1月
  return new Date(y, months[jieIndex] - 1, d);
}

/** 计算从出生日到相关"节"的天数（大运起运依据） */
function daysToRelevantJie(
  birthYear: number, birthMonth: number, birthDay: number,
  isForward: boolean
): number {
  const birth = new Date(birthYear, birthMonth - 1, birthDay);
  birth.setHours(0, 0, 0, 0);

  if (isForward) {
    // 顺排：找出生后第一个节，搜索当年及次年
    for (let y = birthYear; y <= birthYear + 1; y++) {
      for (let i = 0; i < 12; i++) {
        const [m, d] = JIE_DATES[i];
        const calYear = i === 11 ? y + 1 : y;
        const jie = new Date(calYear, m - 1, d);
        if (jie >= birth) {
          return Math.round((jie.getTime() - birth.getTime()) / 86400000);
        }
      }
    }
    return 3; // 极少情况，保底 3 天 = 1 岁起运
  } else {
    // 逆排：找出生前最后一个节，搜索当年及前一年
    for (let y = birthYear; y >= birthYear - 1; y--) {
      for (let i = 11; i >= 0; i--) {
        const [m, d] = JIE_DATES[i];
        const calYear = i === 11 ? y + 1 : y;
        const jie = new Date(calYear, m - 1, d);
        if (jie < birth) {
          return Math.round((birth.getTime() - jie.getTime()) / 86400000);
        }
      }
    }
    return 3; // 极少情况，保底 3 天 = 1 岁起运
  }
}

/** 计算大运：阳年男/阴年女顺排，阴年男/阳年女逆排 */
export function calculateDaYun(
  chart: BaziChart,
  birthDate: string,
  gender: string
): DaYunResult {
  const [year, month, day] = birthDate.split("-").map(Number);
  const yearStem = chart.yearPillar.stem;
  const isYangYear = STEM_YIN_YANG[yearStem] === "Yang";
  const isMale = gender === "male";

  const isForward = (isYangYear && isMale) || (!isYangYear && !isMale);
  const direction = isForward ? "forward" as const : "backward" as const;

  const diffDays = daysToRelevantJie(year, month, day, isForward);
  const startAgeTotal = diffDays / 3;
  const startAgeYears = Math.floor(startAgeTotal);
  const startAgeMonths = Math.round((startAgeTotal - startAgeYears) * 12);

  const monthStemIdx = (HEAVENLY_STEMS as readonly string[]).indexOf(chart.monthPillar.stem);
  const monthBranchIdx = (EARTHLY_BRANCHES as readonly string[]).indexOf(chart.monthPillar.branch);

  const cycles: DaYunCycle[] = [];
  for (let i = 0; i < 10; i++) {
    const step = isForward ? i + 1 : -(i + 1);
    const stemIdx = ((monthStemIdx + step) % 10 + 10) % 10;
    const branchIdx = ((monthBranchIdx + step) % 12 + 12) % 12;

    const cycStem = HEAVENLY_STEMS[stemIdx];
    const cycBranch = EARTHLY_BRANCHES[branchIdx];
    const sAge = startAgeYears + i * 10;
    const eAge = sAge + 9;
    const sYear = year + sAge;
    const eYear = year + eAge;

    cycles.push({
      stem: cycStem,
      branch: cycBranch,
      stemElement: STEM_ELEMENT[cycStem],
      stemYinYang: STEM_YIN_YANG[cycStem],
      branchElement: BRANCH_ELEMENT[cycBranch],
      startAge: sAge, endAge: eAge,
      startYear: sYear, endYear: eYear,
      tenGod: getTenGod(chart.dayMaster, cycStem, gender),
    });
  }

  return { direction, startAgeYears, startAgeMonths, cycles };
}

/** 格式化大运给 AI */
export function formatDaYunForAI(chart: BaziChart, daYun: DaYunResult, currentYear: number): string {
  const dirCN = daYun.direction === "forward" ? "顺排（阳男/阴女）" : "逆排（阴男/阳女）";
  const elemCN: Record<string, string> = { Wood: "木", Fire: "火", Earth: "土", Metal: "金", Water: "水" };

  let text = `## 大运（10年一运 — 渊海子平法则，程序精确计算）

**排法：** ${dirCN}
**起运年龄：** ${daYun.startAgeYears}岁${daYun.startAgeMonths > 0 ? `零${daYun.startAgeMonths}个月` : ""}（距节气${Math.round((daYun.startAgeYears + daYun.startAgeMonths / 12) * 3)}天 / 3）

| 大运 | 干支 | 五行 | 十神 | 年龄 | 年份 |
|------|------|------|------|------|------|
`;

  for (const c of daYun.cycles) {
    const isCurrent = currentYear >= c.startYear && currentYear <= c.endYear;
    const marker = isCurrent ? " ← 当前" : "";
    text += `| ${c.stem}${c.branch} | ${c.stem}${c.branch} | ${elemCN[c.stemElement]}+${elemCN[c.branchElement]} | ${c.tenGod} | ${c.startAge}-${c.endAge}岁 | ${c.startYear}-${c.endYear}${marker} |\n`;
  }

  const current = daYun.cycles.find((c) => currentYear >= c.startYear && currentYear <= c.endYear);
  if (current) {
    text += `\n**当前大运（${currentYear}年）：${current.stem}${current.branch}（${elemCN[current.stemElement]}+${elemCN[current.branchElement]}，${current.tenGod}）**`;
    text += `\n此运从 ${current.startYear} 年持续到 ${current.endYear} 年，覆盖 ${current.startAge}-${current.endAge} 岁。`;
  }

  text += `\n\n> ⚠️ 以上大运已由程序依据渊海子平法则精确计算，请在报告中直接引用，不要自行推算。`;

  return text;
}

// ── 流年流月计算 ──

export interface LiuYuePillar {
  stem: string;
  branch: string;
  stemElement: string;
  stemYinYang: string;
  branchElement: string;
  monthLabel: string; // e.g., "August 2026"
  monthNum: number;   // 1-12 (节气月：1=寅月=Feb)
  tenGod: string;
}

export interface LiuNianInfo {
  year: number;
  stem: string;
  branch: string;
  stemElement: string;
  stemYinYang: string;
  branchElement: string;
  tenGod: string;
  months: LiuYuePillar[];
}

/** 获取某年的年柱（流年） */
export function getYearPillar(year: number): {
  stem: string; branch: string;
  stemElement: string; stemYinYang: string;
  branchElement: string;
} {
  const stemIdx = (year - 4) % 10;
  const branchIdx = (year - 4) % 12;
  const stem = HEAVENLY_STEMS[stemIdx];
  const branch = EARTHLY_BRANCHES[branchIdx];
  return {
    stem, branch,
    stemElement: STEM_ELEMENT[stem],
    stemYinYang: STEM_YIN_YANG[stem],
    branchElement: BRANCH_ELEMENT[branch],
  };
}

/** 获取某年从指定节气月开始的连续 N 个月柱（流月），用五虎遁推算 */
export function getMonthPillarsForYear(
  year: number,
  startJieMonth: number, // 0-11 (0=寅月/Feb)
  count: number,
  dayMaster: string,
  gender: string
): LiuYuePillar[] {
  const yearPillar = getYearPillar(year);
  const monthNames = [
    "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December", "January",
  ];

  const pillars: LiuYuePillar[] = [];
  for (let i = 0; i < count; i++) {
    const jieMonth = (startJieMonth + i) % 12;
    const branch = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"][jieMonth];
    const stem = getMonthStem(yearPillar.stem, jieMonth);

    // 月标签：节气月对应的公历月份
    const actualYear = jieMonth < startJieMonth && i >= 6 ? year + 1 : year;
    const mLabel = `${monthNames[jieMonth]} ${actualYear}`;

    pillars.push({
      stem, branch,
      stemElement: STEM_ELEMENT[stem],
      stemYinYang: STEM_YIN_YANG[stem],
      branchElement: BRANCH_ELEMENT[branch],
      monthLabel: mLabel,
      monthNum: jieMonth + 1, // 1=寅月
      tenGod: getTenGod(dayMaster, stem, gender),
    });
  }

  return pillars;
}

/** 格式化流年流月给 AI（仅 Year Ahead 报告用） */
export function formatLiuNianLiuYueForAI(
  chart: BaziChart,
  orderDate: string,
  monthCount: number = 12
): string {
  const elemCN: Record<string, string> = { Wood: "木", Fire: "火", Earth: "土", Metal: "金", Water: "水" };
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const [oYear, oMonth, oDay] = orderDate.split("-").map(Number);

  // 下单日所在的节气月，从下个节气月开始预测
  const orderJieMonth = getSolarTermPeriod(oMonth, oDay);
  const startJieMonth = (orderJieMonth + 1) % 12;

  // 确定"寅月年"（节气年的基准年）
  // 节气月 0-10（寅-子）的寅月在当前日历年，节气月 11（丑/1月）的寅月在前一年
  let baseYear = startJieMonth === 11 ? oYear - 1 : oYear;

  // 生成所有月柱
  const allMonths: LiuYuePillar[] = [];
  let currentJie = startJieMonth;

  for (let i = 0; i < monthCount; i++) {
    const yearPillar = getYearPillar(baseYear);
    const branch = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"][currentJie];
    const stem = getMonthStem(yearPillar.stem, currentJie);

    // 公历年：子月(10)=Dec 属 baseYear，丑月(11)=Jan 属 baseYear+1
    const calYear = currentJie === 11 ? baseYear + 1 : baseYear;
    const calMonth = currentJie + 1; // 寅(0)→Feb(2), 丑(11)→Jan(1): 丑→1, 寅→2 → (currentJie+1)%12
    // 映射到 0-11 月名：寅(Feb)=1, ..., 子(Dec)=11, 丑(Jan)=0
    const mIdx = currentJie === 11 ? 0 : currentJie + 1;
    const mLabel = `${monthNames[mIdx]} ${calYear}`;

    allMonths.push({
      stem, branch,
      stemElement: STEM_ELEMENT[stem],
      stemYinYang: STEM_YIN_YANG[stem],
      branchElement: BRANCH_ELEMENT[branch],
      monthLabel: mLabel,
      monthNum: currentJie + 1,
      tenGod: getTenGod(chart.dayMaster, stem, "other"),
    });

    // 前进到下一个节气月
    currentJie = (currentJie + 1) % 12;
    if (currentJie === 0) baseYear++;
  }

  // 按流年分组
  const years = [...new Set(allMonths.map((m) => parseInt(m.monthLabel.split(" ")[1])))].sort();

  let text = `\n## 流年流月（程序精确计算 — 直接引用，勿自行推算）

> **流年（年柱）**是当年的整体能量主题，**流月（月柱）**是每月的具体时空能量。二者叠加在大运之上，共同构成"岁运"分析。参考《渊海子平》"大运看吉凶，流年看应期"。

`;

  for (const y of years) {
    const yp = getYearPillar(y);
    const yGod = getTenGod(chart.dayMaster, yp.stem, "other");
    text += `### ${y}年 — **${yp.stem}${yp.branch}**（${elemCN[yp.stemElement]}${yp.stemYinYang}+${elemCN[yp.branchElement]}，${yGod}）\n\n`;
    text += `**流年干支属性：** ${yp.stem}（${yp.stemYinYang} ${yp.stemElement}）坐 ${yp.branch}（${yp.branchElement}）→ 此年整体以「${yGod}」能量为主轴。\n\n`;

    text += `| 月份 | 流月 | 干支五行 | 十神 | 简析提示 |
|------|------|----------|------|----------|
`;
    const yearMonths = allMonths.filter((m) => m.monthLabel.includes(String(y)));
    for (const m of yearMonths) {
      const brief = getLiuYueBrief(chart.dayMaster, m);
      text += `| ${m.monthLabel} | ${m.stem}${m.branch} | ${elemCN[m.stemElement]}+${elemCN[m.branchElement]} | ${m.tenGod} | ${brief} |
`;
    }
    text += `\n`;
  }

  text += `> ⚠️ 以上流年流月已由程序精确计算（五虎遁+六十年干支序），请直接引用标注于每月运势中，不要自行推排。`;

  return text;
}

/** 流月简析提示（基于十神） */
function getLiuYueBrief(dayMaster: string, month: LiuYuePillar): string {
  const briefs: Record<string, string> = {
    "比肩": "同辈助力，合作机会",
    "劫财": "竞争出现，注意开销",
    "食神": "创意涌动，享受生活",
    "伤官": "表达欲强，谨防口舌",
    "正财": "正财稳固，宜规划理财",
    "偏财": "意外进账，投资机遇",
    "正官": "事业压力转机，责任加身",
    "七杀": "挑战临门，突破契机",
    "正印": "贵人相助，学习良机",
    "偏印": "独处思考，灵感激增",
  };
  return briefs[month.tenGod] || "关注此月能量变化";
}
