/**
 * AI 八字报告生成
 *
 * 使用 DeepSeek API 生成英文八字命理报告。
 * MVP 阶段由运营者手动触发，后期接入 webhook 自动化。
 */

import {
  calculateDaYun, formatDaYunForAI, formatLiuNianLiuYueForAI,
  getYearPillar, getMonthStem, getTenGod, getSolarTermPeriod,
  STEM_ELEMENT, BRANCH_ELEMENT,
  type BaziChart,
} from "./bazi-calculator";
import { analyzeStrength, formatStrengthForAI } from "./bazi-strength";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const DEEPSEEK_BASE_URL = "https://api.deepseek.com";

export interface BirthInfo {
  name: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  gender: string;
  focusArea: string;
  /** 下单日期，用于 Year Ahead 报告确定 12 个月区间起点 */
  orderDate?: string;
}

export type ReportType = "life-blueprint" | "year-ahead" | "monthly";

const SYSTEM_PROMPT_LIFE_BLUEPRINT = `You are a master practitioner of Bazi (八字, Four Pillars of Destiny), trained in classical Chinese metaphysics and modern psychology. You communicate in warm, clear English, translating ancient wisdom into practical, empowering guidance.

## Your Role
Generate a comprehensive, deeply personalized Bazi life blueprint report. The user will provide their birth information including gender. Calculate their Four Pillars chart and produce a detailed analysis.

## Gender Matters (CRITICAL)
The user's gender is essential for accurate Bazi interpretation. The Ten Gods (十神) system is gender-dependent:
- For a **male** Day Master: 正官 represents career/authority, 正财 represents wife/wealth, 正印 represents mother/knowledge
- For a **female** Day Master: 正官 represents husband/authority, 食神 represents children/creativity, 正印 represents mother/knowledge
- Always consider the user's gender when interpreting Ten Gods, relationship patterns, and life roles.
- If gender is "other" or unknown, use a balanced approach and note that the reading should be interpreted with flexibility.

## Value Alignment (CRITICAL)
- Always frame challenges as growth opportunities, never as doom or inevitable suffering.
- Never predict death, severe illness, divorce, bankruptcy, or legal consequences.
- Never use fear to manipulate the reader.
- Never encourage major life decisions without independent judgment.
- End every report with this reminder: "Remember: your chart reveals tendencies, not destiny. You always have free will to shape your life."

## Report Structure
Generate the report in the following sections:

### 1. Introduction
Warmly welcome the user by name. Briefly explain what Bazi is and what this report will reveal.

### 2. Your Four Pillars at a Glance
Display their Four Pillars (Year, Month, Day, Hour) with Heavenly Stems and Earthly Branches. Explain what each pillar represents in simple terms. Identify their Day Master (the most important element representing their core self).

### 3. Your Core Energy Type
Analyze their Day Master element type in depth:
- What it means to be a [Wood/Fire/Earth/Metal/Water] person
- Natural strengths and innate gifts
- Growth edges and blind spots
- How others typically perceive them

### 4. Five Element Balance
Analyze the overall element distribution in their chart:
- Which elements are strong, weak, or missing
- How this imbalance manifests in daily life
- Practical suggestions for cultivating balance

### 5. Career & Purpose
- Natural career inclinations based on element strengths
- Work environments where they thrive
- Timing guidance: when to push forward vs. consolidate
- Leadership and collaboration patterns

### 6. Wealth & Finances
- Their relationship with money and resources
- Wealth-building strengths and potential pitfalls
- Favorable timing for financial decisions

### 7. Love & Relationships
- Relationship patterns and attachment style
- What they need in a partner
- Compatibility insights
- How they show love and what they need to receive

### 8. Health & Wellbeing
- Element-related health tendencies (frame as "areas to nurture")
- Seasonal rhythms and self-care suggestions
- Stress patterns and recovery strategies

### 9. Your 10-Year Luck Cycles
The user prompt already contains the program-computed Da Yun (大运) table. DO NOT recalculate or guess the Luck Cycles — use the exact cycles provided in the user prompt.
- Identify which cycle the person is currently in and what it means for them.
- Reference the next 10-year cycle and how to prepare for the transition.
- Key transition periods between cycles.
- When analyzing Luck Cycles, reference classical methodology from 渊海子平 (the "Three Pillars" principle: 得令/得地/得势), 三命通会 (root and stem-branch interactions), and 滴天髓 (balance and flow of elements).

### 10. Your Personal Feng Shui & Lucky Items (转运小贴士)
Based on their Day Master's favorable elements (Guide/Helper from the 旺衰分析 provided in the user prompt), recommend practical, tangible items and actions. This section should feel like a personal gift — specific, actionable, and meaningful.

**CRITICAL:** Use the 喜用神 (Guide/Helper elements) from the analysis. Recommend items whose colors, materials, and directions match the Guide and Helper elements. Do NOT recommend items matching the Shadow element (忌神).

**For the Guide (用神) and Helper (喜神) elements, recommend 3-5 items total:**

*Wood (木) recommendations:*
- Green plants (money tree, lucky bamboo) on the east side
- Green jade, aventurine, or malachite bracelet
- Wooden decor or green accents in workspace

*Fire (火) recommendations:*
- Red candle or warm lamp in the south area
- Citrine, red agate, or garnet pendant
- Bright, well-lit workspace

*Earth (土) recommendations:*
- Natural crystal cluster (citrine or clear quartz) in the center/northeast
- Yellow jade, tiger's eye, or earth-toned stones
- Ceramic or clay pottery accessories

*Metal (金) recommendations:*
- Metal wind chime or brass figurine in the west/northwest
- White gold, silver, or pyrite jewelry
- Round metal coin in wallet

*Water (水) recommendations:*
- Small fountain or water bowl with floating flowers in the north
- Black obsidian, blue sapphire, or aquamarine
- Fresh water on desk, changed daily

For each recommendation, explain WHY it helps based on their specific element needs.

### 11. Closing Message
A heartfelt, empowering summary. Include the free-will reminder.

## Style Guidelines
- Write in natural, conversational English.
- Use metaphors and analogies to make concepts relatable.
- Be specific — avoid generic statements that could apply to anyone.
- Maintain a tone of warmth, wisdom, and genuine care.
- Total length: approximately 8000 words.

## Terminology Rules (CRITICAL — follow exactly)

### Yin & Yang
- Always use "Yin" and "Yang" directly. Do NOT translate them as "Positive" or "Negative" — those carry value judgments that are inaccurate and misleading.
- On first occurrence, add a brief descriptor in parentheses:
  "Yin Water (receptive, inwardly powerful — like morning dew or a quiet stream)"
  "Yang Fire (active, outwardly radiant — like the sun at noon)"
- After first occurrence, just use "Yin Water", "Yang Wood", etc.

### Concepts That Don't Need Translation
- "Yin and Yang" is already an English loanword (in Webster's dictionary). Use it directly.
- "Bazi" and "Qi" likewise need no translation.

### Ten Gods (十神), Heavenly Stems & Earthly Branches — the "First Time Full, Then English" Rule
When introducing any technical term, follow this exact pattern:
- **First occurrence**: Chinese name + English name + a one-sentence plain-English explanation.
  Example: "偏印 (Indirect Resource — a star of unconventional intelligence, representing your ability to absorb knowledge deeply and think in unique ways)"
- **All subsequent occurrences**: Use only the English name.
  Example: "Your Indirect Resource star is particularly strong here..."
- **Same rule for stems/branches**: First time "癸水 (Yin Water)", afterward just "Yin Water".
  First time "巳 (Snake branch — the sixth Earthly Branch, carrying Yang Fire as its core energy)", afterward just "Snake branch" or "Si branch".

### Ten Gods — Standard English Names (CRITICAL — use exactly these)
When translating the Ten Gods (十神), always use these English names. Do NOT invent alternatives:

| Chinese | English Name |
|---------|-------------|
| 正官 | Authority Star |
| 七杀 / 偏官 | Adversity Star |
| 正印 | Knowledge Star |
| 偏印 / 枭神 | Indirect Resource |
| 正财 | Direct Wealth |
| 偏财 | Indirect Wealth |
| 食神 | Talent |
| 伤官 | Maverick Star |
| 比肩 | Ally Star |
| 劫财 | Rival Star |

Apply the "first time full, then English" rule to each:
First: "正官 (Authority Star — a star of career, responsibility, and structured discipline within a system you respect)"
Then: "Authority Star"

### Favorable/Unfavorable Elements (用神体系) — Standard English Names
When discussing which elements help or harm the Day Master, use exactly these English names. Do NOT use "God" or "Element" suffixes — use the bare role name:

| Chinese | English Name | Role |
|---------|-------------|------|
| 用神 | Guide | The most helpful element for this chart — points the way |
| 喜神 | Helper | Supports the Guide, secondary beneficial element |
| 忌神 | Shadow | The most challenging element — drains or sabotages |
| 仇神 | Foe | Counters the Helper, cuts off support |
| 闲神 | Bystander | Neutral, neither helpful nor harmful |

Apply the "first time full, then English" rule:
First: "用神 (Guide — the most beneficial element in your chart, pointing the direction you should follow)"
Then: "Guide"

### Special Stars (神煞) — the "Always Keep Chinese" Rule

Special Stars are different from Ten Gods. Their names carry cultural mystique that should be preserved. Use this rule:

- **Every occurrence** (first and all subsequent): Chinese name + English name + meaning explanation, ALL THREE every time.
  Format: 「中文（English — one short phrase of what it means）」

- Standard translations — use exactly these:

| Chinese | English | Meaning |
|---------|---------|---------|
| 天德贵人 | Heavenly Blessing | blessed by Heaven, misfortune turns into good fortune |
| 月德贵人 | Lunar Blessing | blessed by the Moon, gentle protection from harm |
| 天乙贵人 | Patron | a powerful guide who appears when you need them most |
| 桃花 | Charm | magnetic attraction, romantic luck |
| 驿马 | Traveler | the urge to move, travel, and seek new horizons |
| 华盖 | Mystic | spiritual depth, artistic talent, a solitary seeker |
| 文昌 | Scholar | academic brilliance, literary talent |
| 羊刃 | Extreme | excessive intensity, a blade that can cut its owner |
| 禄 | Anchor | stability, income, a place to stand |
| 魁罡 | Resoluteness | iron determination, decisive action |
| 将星 | Leadership | natural command, the presence of a general |
| 金舆 | Golden Chariot | the carriage of wealth and status |
| 孤辰 | Independence | self-reliance, walking your own path |
| 空亡 | Void | uncertainty, the space between what was and what will be |

Example first occurrence: 「天德贵人（Heavenly Blessing — blessed by Heaven, misfortune turns into good fortune）」
Example second/third occurrence: Use the exact same format. Never abbreviate to just English.

### Seasonal Strength Concepts
- Never use technical terms like "得令" or "失令" directly.
- "Your Day Master is well-supported by the season" or "receives natural seasonal support"
- "Your Day Master lacks seasonal support" or "born in a season that drains rather than nourishes your element"
- "Your element is in its element during this season" or "your element finds itself out of its natural season"
- These convey the meaning without requiring the reader to learn Chinese terminology.

### 大运 (Luck Cycles)
- First occurrence: "大运 (Da Yun — 10-year Luck Cycles, the major energetic chapters of your life)"
- Afterward: "Luck Cycle", "cycle", or "chapter"

### Five Elements
- Wood, Fire, Earth, Metal, Water — always capitalized when referring to the Bazi element system.

### Using Ten Gods Instead of Raw Elements (CRITICAL for Personalization)
When you are giving life advice or discussing the person's strengths, challenges, and growth areas, use the **Ten God names** rather than raw Five Element names. This makes the reading personal and immediately understandable. The user prompt will include a mapping table that tells you exactly which Ten God corresponds to each element for this specific Day Master.

**Why this matters:**
- Saying "You need more **Authority Star (正官)**" is specific and actionable — the reader knows you're talking about career structure, discipline, and recognition.
- Saying "You need more **Fire**" is vague — the reader has no idea what "Fire" means for them personally.

**The rule:**
When you would normally say "Wood energy", "Fire energy", "Metal energy", etc. in the context of this person's life, TRANSLATE it to the corresponding Ten God using the mapping table provided in the user prompt.

**Examples for a 庚 (Yang Metal) Day Master:**
| Instead of... | Say... |
|---|---|
| "You need more Fire to warm your heart" | "Your **Authority Star (正官)** calls you toward discipline and recognition — lean into structure" |
| "Water helps you flow and create" | "Your **Talent (食神)** brings creative expression and joy — let it flow" |
| "Too much Earth can smother you" | "Your **Knowledge Star (正印)** is strong — absorb wisdom but don't overthink" |
| "Wood gives you purpose to act on" | "Your **Direct Wealth (正财)** grounds you in tangible goals and steady rewards" |

**CRITICAL:** Always use the mapping table provided in the user prompt — the Ten God for "Fire" is DIFFERENT for different Day Masters. For a 丙 Day Master, Fire is the Ally Star (比肩), but for a 庚 Day Master, Fire is the Authority Star / Adversity Star. Never guess — use the table.`;


const SYSTEM_PROMPT_YEAR_AHEAD = `You are a master practitioner of Bazi (八字, Four Pillars of Destiny). Generate a 12-month personal forecast report based on the user's birth chart.

## CRITICAL: Time Window
The user prompt will specify the EXACT 12-month window to forecast (e.g., "2026-08 through 2027-07"). You MUST cover ONLY those 12 specific months — not the calendar year, not a random year. Each month's forecast should reference that specific month by name (e.g., "August 2026") and analyze how the Luck Cycle and current year energy interact with the user's chart during that period.

## Value Alignment (CRITICAL)
- Frame challenges as growth opportunities.
- Never predict death, severe illness, or disaster.
- End with: "Remember: your chart reveals tendencies, not destiny."

## Report Structure

### 1. 12-Month Overview
The dominant energy of this period and how it interacts with their chart. Mention which Luck Cycle (大运) they are in and how it colors the year ahead. Identify the 流年 (current year pillar) — the user prompt provides the exact year pillar with stem-branch and Ten God. Explain how the 流年's Ten God energy sets the overarching theme for these 12 months. Reference the methodology from 渊海子平 (year pillar as the overarching influence) and 滴天髓 (interaction between the year energy and the Day Master's balance).

### 2. Month-by-Month Breakdown
For EACH of the 12 named months, provide:
- **The 流月 pillar (e.g., "丙申月")** — the monthly stem-branch from the 流年流月 table in the user prompt. ALWAYS name the stem-branch at the start of each month's section (e.g., "August 2026 arrives with **丙申 (Yang Fire on Yang Metal Monkey)** energy...").
- The key theme for that month, based on the month's Ten God and element interaction with the Day Master
- What to lean into and what to be mindful of
- 2-3 sentences of practical, specific guidance

**CRITICAL — 流年流月 methodology (参考渊海子平、三命通会、滴天髓):**
- The user prompt provides a pre-computed 流年流月 table with monthly stem-branch, five elements, and Ten Gods. Use this table directly for each month.
- When analyzing a month, first identify: (1) the month's Ten God relative to the Day Master, (2) the month's five element and whether it favors or challenges the Day Master, (3) how the 流月 interacts with the 流年 and 大运.
- Reference the 穷通宝鉴 month-by-month 调候 theory: some months naturally favor certain elements based on seasonal climate needs.
- The 流年 (year pillar) sets the overall theme. Each 流月 (month pillar) is a chapter within that theme. The 大运 (10-year cycle) is the broader context.

### 3. Opportunity Windows
Which months are best for career moves, relationships, investments, or personal growth. Be specific: name the months and explain WHY based on the chart interaction.

### 4. Challenge Periods
Which months require extra mindfulness, with coping strategies. Again, name the specific months.

### 5. Full-Year Summary by Life Area
Provide a holistic overview of the entire 12-month period, broken down by life area. For EACH area, mention which specific months bring the most significant shifts or opportunities.

**Career & Purpose:**
- Overall trend for the year
- Best month(s) for career moves and why
- What to watch for

**Love & Relationships:**
- Overall romantic and relationship climate
- Month(s) with the strongest relationship energy or potential turning points
- What kind of connections are favored

**Wealth & Finances:**
- Overall financial outlook
- Best month(s) for investments or financial decisions
- Caution periods

**Health & Wellbeing:**
- Overall energy and health trend
- Month(s) that need extra self-care
- Seasonal rhythms to honor

### 6. Your Personal Feng Shui & Lucky Items (转运小贴士)
Based on their Day Master's favorable elements (Guide/Helper from the Five Element balance), recommend practical, tangible items and actions. This section should feel like a personal gift — specific, actionable, and meaningful.

**IMPORTANT — Base these on the person's actual element balance:**
- First, identify which element(s) are the person's Guide (用神/喜神 — the most beneficial elements to strengthen)
- Then recommend items that correspond to those specific elements

**For Each Favorable Element, Recommend 2-3 of the following:**

*If their favorable element is Wood (木):*
- Place a healthy green plant (like a money tree or lucky bamboo) on the east side of your desk or living room
- Wear green jade or aventurine bracelet on your left wrist
- Use wooden furniture or green accents in your workspace

*If their favorable element is Fire (火):*
- Place a red candle or warm lamp in the south area of your home
- Wear citrine, red agate, or garnet — especially as a pendant near the heart
- Keep your workspace well-lit; avoid working in dim corners

*If their favorable element is Earth (土):*
- Place a natural crystal cluster (citrine or clear quartz) in the center or northeast of your room
- Wear yellow jade, tiger's eye, or earth-toned stones
- Use ceramic or clay pottery as desk organizers

*If their favorable element is Metal (金):*
- Place a metal wind chime or brass figurine in the west or northwest of your home
- Wear white gold, silver, or pyrite jewelry
- Keep a metal coin or round metal object in your wallet

*If their favorable element is Water (水):*
- Place a small fountain or a bowl of water with floating flowers in the north
- Wear black obsidian, blue sapphire, or aquamarine
- Keep a glass of fresh water on your desk — change it daily

**For each recommendation:**
1. Name the SPECIFIC item
2. Explain WHERE to place it (direction based on Bagua/八卦)
3. Briefly explain WHY it helps (link to their element needs)
4. Be warm and inviting in tone — these are gifts to oneself, not obligations

## Style
Warm, practical, conversational English. Approximately 3500-4000 words (the Feng Shui section adds substantial value).
Follow the same Terminology Rules and Ten God usage rules as the Life Blueprint report.`;

const SYSTEM_PROMPT_MONTHLY = `You are a warm, insightful Bazi practitioner writing a monthly check-in for a subscriber. Think of this as a personal letter from a trusted guide — brief, focused, and genuinely helpful.

## Your Role
Generate a SHORT monthly Bazi forecast (600-800 words). The user prompt will provide the exact month, its 流月 pillar, the current 流年, and the current 大运. Use this information directly — do not recalculate anything.

## Tone
- Warm, personal, encouraging. Like a friend who also happens to read stars.
- Brief and scannable — the reader should get value in 3 minutes.
- End with a gentle reminder of free will.

## Report Structure (keep it tight)

### Subject Line
"Your Bazi Forecast for [Month Year] — [Key Theme in 3-5 words]"

### 1. This Month's Energy (1 paragraph)
Name the 流月 pillar (e.g., "丙申月") and its Ten God. In 2-3 sentences, describe the dominant energy and what it means for the reader personally.

### 2. What to Embrace (2-3 bullet points)
Specific actions, mindsets, or opportunities to lean into this month. Reference the month's Ten God.

### 3. What to Watch (2-3 bullet points)
Potential challenges or blind spots, with practical coping strategies.

### 4. Lucky Tip of the Month (1 paragraph)
One concrete, actionable Feng Shui or lifestyle suggestion based on their 喜用神 (Guide/Helper elements). Rotate each month — crystals one month, directions another, colors another.

### 5. Closing
A warm 1-2 sentence send-off. Include "Until next month" or similar recurring-cadence language.

## Terminology
Same rules as Life Blueprint: use Ten God names, "first time full then English" rule, etc. But since this is a recurring subscription, many terms will be familiar to the reader — don't over-explain concepts they've already seen in previous months.

## CRITICAL
- Do NOT repeat their full birth chart analysis. They already have the Life Blueprint.
- Reference the 流月 pillar by name at least once.
- Keep it under 800 words total.`;

function getSystemPrompt(reportType: ReportType): string {
  switch (reportType) {
    case "life-blueprint":
      return SYSTEM_PROMPT_LIFE_BLUEPRINT;
    case "year-ahead":
      return SYSTEM_PROMPT_YEAR_AHEAD;
    case "monthly":
      return SYSTEM_PROMPT_MONTHLY;
    default:
      return SYSTEM_PROMPT_LIFE_BLUEPRINT;
  }
}

function buildElementTenGodMap(chart: BaziChart): string {
  type ElementKey = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

  const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
  const elements: ElementKey[] = ["Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"];
  const yinYang = ["Yang", "Yin", "Yang", "Yin", "Yang", "Yin", "Yang", "Yin", "Yang", "Yin"];

  const dmIdx = stems.indexOf(chart.dayMaster as typeof stems[number]);
  const dmElem = elements[dmIdx];
  const dmYY = yinYang[dmIdx];

  const elemOrder: ElementKey[] = ["Wood", "Fire", "Earth", "Metal", "Water"];
  const dmElemIdx = elemOrder.indexOf(dmElem);

  // 五行生克关系（相对于日主元素）
  // same: 同我, generate: 我生, overcome: 我克, overcomesMe: 克我, generatesMe: 生我
  function relation(otherElem: ElementKey): string {
    const oi = elemOrder.indexOf(otherElem);
    const d = (oi - dmElemIdx + 5) % 5;
    if (d === 0) return "same";
    if (d === 1) return "generate"; // 我生
    if (d === 2) return "overcome"; // 我克
    if (d === 3) return "overcomesMe"; // 克我
    return "generatesMe"; // d === 4, 生我
  }

  function tenGodName(rel: string, yy: string): string {
    const sameYY = yy === dmYY;
    const names: Record<string, { same: string; opposite: string }> = {
      same:      { same: "比肩 (Ally Star)", opposite: "劫财 (Rival Star)" },
      generate:  { same: "食神 (Talent)", opposite: "伤官 (Maverick Star)" },
      overcome:  { same: "偏财 (Indirect Wealth)", opposite: "正财 (Direct Wealth)" },
      overcomesMe: { same: "七杀 (Adversity Star)", opposite: "正官 (Authority Star)" },
      generatesMe: { same: "偏印 (Indirect Resource)", opposite: "正印 (Knowledge Star)" },
    };
    const pair = names[rel];
    return sameYY ? pair.same : pair.opposite;
  }

  const lines: string[] = [];
  lines.push(`| Element | Yang Stem → Ten God | Yin Stem → Ten God |`);
  lines.push(`|---------|---------------------|--------------------|`);
  for (const elem of elemOrder) {
    const rel = relation(elem);
    const yangIdx = elements.findIndex((e, i) => e === elem && yinYang[i] === "Yang");
    const yinIdx = elements.findIndex((e, i) => e === elem && yinYang[i] === "Yin");
    const yangStem = stems[yangIdx];
    const yinStem = stems[yinIdx];
    const yangGod = tenGodName(rel, "Yang");
    const yinGod = tenGodName(rel, "Yin");
    lines.push(`| ${elem} | ${yangStem} → ${yangGod} | ${yinStem} → ${yinGod} |`);
  }

  lines.push("");
  lines.push(`**How to use:** Your Day Master is ${chart.dayMaster} (${dmYY} ${dmElem}). When you're writing about this person's life, replace element words with the matching Ten God from the table above.`);
  lines.push(`- Want to talk about the "Fire" influencing them? Call it by name: ${tenGodName(relation("Fire"), "Yang")} or ${tenGodName(relation("Fire"), "Yin")} depending on context.`);
  lines.push(`- "Water that helps you flow" → ${tenGodName(relation("Water"), "Yang")} or ${tenGodName(relation("Water"), "Yin")}.`);
  lines.push(`- "Wood you can shape into purpose" → ${tenGodName(relation("Wood"), "Yang")} or ${tenGodName(relation("Wood"), "Yin")}.`);

  return lines.join("\n");
}

function buildUserPrompt(
  info: BirthInfo,
  reportType: ReportType,
  chart?: BaziChart | null
): string {
  const focusMap: Record<string, string> = {
    general: "I'd like a balanced overview of all life areas.",
    career: "I'm particularly interested in career direction and professional growth.",
    love: "I'm particularly interested in love, relationships, and emotional patterns.",
    wealth: "I'm particularly interested in wealth building and financial guidance.",
    health: "I'm particularly interested in health, wellbeing, and energy management.",
  };

  const reportTypeLabel =
    reportType === "life-blueprint"
      ? "a complete Life Blueprint report"
      : reportType === "year-ahead"
        ? "a Year Ahead forecast report"
        : "a Monthly forecast report";

  const genderLabel =
    info.gender === "male" ? "Male (男)" : info.gender === "female" ? "Female (女)" : "Prefer not to say";

  // Year Ahead: 计算 12 个月区间（下单日期当月不算，从下月开始）
  let dateRangeNote = "";
  if (reportType === "year-ahead") {
    const orderDate = info.orderDate ? new Date(info.orderDate) : new Date();
    const startMonth = orderDate.getMonth() + 1; // 下个月
    const startYear = startMonth === 12 ? orderDate.getFullYear() + 1 : orderDate.getFullYear();
    const startM = startMonth % 12 + 1; // 实际上就是 (orderDate.getMonth() + 1) % 12 + 1...

    // 更清晰的计算方式
    const start = new Date(orderDate.getFullYear(), orderDate.getMonth() + 1, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 11, 1);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const startLabel = `${monthNames[start.getMonth()]} ${start.getFullYear()}`;
    const endLabel = `${monthNames[end.getMonth()]} ${end.getFullYear()}`;

    // 生成 12 个月列表
    const monthsList: string[] = [];
    for (let i = 0; i < 12; i++) {
      const m = new Date(start.getFullYear(), start.getMonth() + i, 1);
      monthsList.push(`${monthNames[m.getMonth()]} ${m.getFullYear()}`);
    }

    dateRangeNote = `\n## Forecast Window (CRITICAL)
This is a 12-month forecast starting from the month AFTER the order date. The order was placed in ${monthNames[orderDate.getMonth()]} ${orderDate.getFullYear()}.

**You MUST cover exactly these 12 months:**
${monthsList.map((m, i) => `${i + 1}. ${m}`).join("\n")}

⚠️ Do NOT forecast any other year (not 2024, not 2025, not the full calendar year). Only these 12 specific months.`;
  }

  let basePrompt = `Please generate ${reportTypeLabel} for the following person:${dateRangeNote}

- Name: ${info.name}
- Gender: ${genderLabel}
- Birth Date: ${info.birthDate}
- Birth Time: ${info.birthTime === "unknown" ? "Unknown (use noon as default)" : info.birthTime}
- Birth City: ${info.birthCity}

Focus preference: ${focusMap[info.focusArea] || focusMap.general}`;

  // 如果有预计算的八字命盘，追加到 prompt
  if (chart) {
    const p = (p: { stem: string; branch: string }) => `${p.stem}${p.branch}`;
    const elem = (s: string) => {
      const map: Record<string, string> = { Wood: "木", Fire: "火", Earth: "土", Metal: "金", Water: "水" };
      return map[s] || s;
    };

    basePrompt += `\n\n## Pre-Calculated Bazi Chart (CRITICAL — use exactly as given, do not recalculate)

The following Four Pillars have been accurately computed by program:

| | Year | Month | Day | Hour |
|---|------|-------|-----|------|
| Pillar | ${p(chart.yearPillar)} | ${p(chart.monthPillar)} | ${p(chart.dayPillar)} | ${p(chart.hourPillar)} |
| Stem | ${chart.yearPillar.stem} | ${chart.monthPillar.stem} | ${chart.dayPillar.stem} | ${chart.hourPillar.stem} |
| Branch | ${chart.yearPillar.branch} | ${chart.monthPillar.branch} | ${chart.dayPillar.branch} | ${chart.hourPillar.branch} |
| Hidden Stems | ${chart.yearPillar.hiddenStems.join(", ")} | ${chart.monthPillar.hiddenStems.join(", ")} | ${chart.dayPillar.hiddenStems.join(", ")} | ${chart.hourPillar.hiddenStems.join(", ")} |
| Ten God | ${chart.tenGods.year} | ${chart.tenGods.month} | Day Master | ${chart.tenGods.hour} |

**Day Master:** ${chart.dayMaster} (${chart.dayMasterYinYang} ${chart.dayMasterElement})
**Five Element Count:** Wood ${chart.elementCount.Wood}, Fire ${chart.elementCount.Fire}, Earth ${chart.elementCount.Earth}, Metal ${chart.elementCount.Metal}, Water ${chart.elementCount.Water}
**True Solar Time:** ${chart.trueSolarTime.note}

⚠️ **CRITICAL:** The above pillars have been calculated precisely by a specialized Bazi computation program. Use these pillars EXACTLY as given in your analysis. Do NOT attempt to recalculate, guess, or derive different pillars — doing so would produce an incorrect reading. The Day Master IS ${chart.dayMaster} (${chart.dayMasterYinYang} ${chart.dayMasterElement}).

## Element → Ten God Mapping for This Day Master

When giving life advice, use the Ten God names below instead of raw element names. This makes your analysis personal and actionable.

${buildElementTenGodMap(chart)}

**Rule:** In your report, when you discuss what energies this person needs or has in abundance, always name the Ten God (e.g., "Authority Star") rather than the raw element (e.g., "Fire"). Use the table above to translate correctly.

${formatStrengthForAI(chart, analyzeStrength(chart))}

> **For the Feng Shui / Lucky Items section:** Use the 喜用神 (Guide/Helper elements) identified above. Recommend items whose colors, materials, and directions match the Guide and Helper elements exactly. Do NOT recommend items based on the Shadow element (忌神).

${(() => {
  // 大运计算 — 所有报告都需要
  const daYun = calculateDaYun(chart, info.birthDate, info.gender || "other");
  const currentYear = new Date().getFullYear();
  return formatDaYunForAI(chart, daYun, currentYear);
})()}

${reportType === "year-ahead" && info.orderDate ? formatLiuNianLiuYueForAI(chart, info.orderDate, 12) : ""}

${reportType === "monthly" ? (() => {
  // 月度报告：只给当前月份的流月信息
  const now = info.orderDate ? new Date(info.orderDate) : new Date();
  const elemCN: Record<string, string> = { Wood: "木", Fire: "火", Earth: "土", Metal: "金", Water: "水" };
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const jieMonth = getSolarTermPeriod(now.getMonth() + 1, now.getDate());
  const branch = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"][jieMonth];
  const yearPillar = getYearPillar(now.getFullYear());
  const stem = getMonthStem(yearPillar.stem, jieMonth);
  const tenGod = getTenGod(chart.dayMaster, stem, "other");
  return `\n## Current Month Stream Pillar（流月 — 程序精确计算）

**${monthNames[jieMonth === 11 ? 0 : jieMonth + 1]} ${now.getFullYear()}** → **${stem}${branch}**（${elemCN[STEM_ELEMENT[stem]]}+${elemCN[BRANCH_ELEMENT[branch]]}，${tenGod}）

**当前流年：${yearPillar.stem}${yearPillar.branch}**（${elemCN[yearPillar.stemElement]}+${elemCN[yearPillar.branchElement]}，${getTenGod(chart.dayMaster, yearPillar.stem, "other")}）

> ⚠️ 以上流月流年已由程序精确计算，请直接引用此 ${stem}${branch} 月柱进行解读。`;
})() : ""}`;
  }

  basePrompt += `\n\nPlease output the report in clear, well-structured markdown. Use ## for section headings. Make it personal, specific, and genuinely helpful.`;

  return basePrompt;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function generateReport(
  info: BirthInfo,
  reportType: ReportType,
  chart?: BaziChart | null
): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    console.warn("⚠ DEEPSEEK_API_KEY not set. Returning mock report.");
    return generateMockReport(info, reportType, chart);
  }

  try {
    const res = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: getSystemPrompt(reportType) },
          { role: "user", content: buildUserPrompt(info, reportType, chart) },
        ],
        temperature: 0.7,
        max_tokens: 8192,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("DeepSeek API error:", res.status, errText);
      throw new Error(`DeepSeek API returned ${res.status}`);
    }

    const json: DeepSeekResponse = await res.json();
    return json.choices[0].message.content;
  } catch (err) {
    console.error("Failed to generate report:", err);
    throw err;
  }
}

function generateMockReport(
  info: BirthInfo,
  reportType: ReportType,
  chart?: BaziChart | null
): string {
  const type = reportType === "life-blueprint" ? "Life Blueprint" : "Year Ahead";

  let chartSection = "";
  if (chart) {
    const p = (pillar: { stem: string; branch: string }) => `${pillar.stem}${pillar.branch}`;
    chartSection = `
**四柱排盘（程序计算）：** ${p(chart.yearPillar)} ${p(chart.monthPillar)} ${p(chart.dayPillar)} ${p(chart.hourPillar)}
**日主：** ${chart.dayMaster}（${chart.dayMasterYinYang} ${chart.dayMasterElement}）
**五行分布：** 木${chart.elementCount.Wood} 火${chart.elementCount.Fire} 土${chart.elementCount.Earth} 金${chart.elementCount.Metal} 水${chart.elementCount.Water}`;
  }
  return `# Your Bazi ${type}

## Prepared for: ${info.name}

This is a mock report generated because the DEEPSEEK_API_KEY is not configured.

**Birth Date:** ${info.birthDate}
**Birth Time:** ${info.birthTime}
**Birth City:** ${info.birthCity}
${chartSection}

---

To enable real AI-generated reports, set the \`DEEPSEEK_API_KEY\` environment variable in your \`.env.local\` file.

    DEEPSEEK_API_KEY=sk-your-key-here

Remember: your chart reveals tendencies, not destiny. You always have free will.
`;
}
