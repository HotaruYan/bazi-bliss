export type Lang = "zh" | "en";

export const dict = {
  // 导航
  nav_home: { zh: "首页", en: "Home" },
  nav_chart: { zh: "免费排盘", en: "Free Chart" },
  nav_order: { zh: "获取解读", en: "Get Reading" },
  nav_about: { zh: "关于", en: "About" },
  nav_blog: { zh: "博客", en: "Blog" },
  nav_faq: { zh: "常见问题", en: "FAQ" },
  nav_cta: { zh: "免费排盘", en: "Free Chart" },

  // 首页
  home_badge: { zh: "千年智慧 · AI赋能", en: "Ancient Wisdom · AI-Powered" },
  home_title: { zh: "探索你的", en: "Discover Your" },
  home_title_highlight: { zh: "命盘蓝图", en: "Life Blueprint" },
  home_subtitle: { zh: "用千年传承的八字命理，读懂你的天赋、方向与人生节奏。AI 加持，让古老智慧触手可及。", en: "Your birth date holds a map of your personality, career path, relationships, and life rhythm. Unlock it with AI-powered Bazi analysis." },
  home_cta_free: { zh: "免费排盘 →", en: "Get Your Free Chart →" },
  home_cta_order: { zh: "查看付费解读", en: "View Paid Readings" },
  home_delivery_note: { zh: "排盘免费 · 深度解读付费 · 无需注册", en: "Free chart · Paid interpretation · No account required" },

  // 首页价值主张
  home_vp1_title: { zh: "深度个性化", en: "Deeply Personal" },
  home_vp1_desc: { zh: "基于你精确的出生年月日时，生成独一无二的命盘。每个人的八字都是宇宙间仅此一份的地图。", en: "Unlike Western astrology, Bazi takes a completely different approach — it draws from your exact birth date, time, and place to reveal the elemental energies shaping who you are." },
  home_vp2_title: { zh: "实用指导", en: "Practical Insights" },
  home_vp2_desc: { zh: "不是模糊的星座运势。你的报告会给出关于事业时机、关系模式和人生节奏的具体指引。", en: "Not vague horoscopes. Your report gives you concrete guidance on career timing, relationship patterns, and when to push forward versus when to hold back." },
  home_vp3_title: { zh: "终身价值", en: "Lifetime Value" },
  home_vp3_desc: { zh: "出生盘永远不会变，但大运和流年在变。你的命盘是一本可以反复查阅的人生参考书。", en: "Your chart stays with you forever. The Annual Pass keeps you updated with monthly forecasts aligned to your personal luck cycles." },

  // 首页「如何使用」
  home_how_title: { zh: "三步开始", en: "How It Works" },
  home_how_step1_title: { zh: "填写出生信息", en: "Share Your Birth Info" },
  home_how_step1_desc: { zh: "输入出生日期、时间、地点。只需2分钟。", en: "Enter your birth date, time, and place. Takes less than 2 minutes." },
  home_how_step2_title: { zh: "查看免费命盘", en: "View Your Free Chart" },
  home_how_step2_desc: { zh: "即时生成你的八字四柱、五行分布和十神关系。", en: "Instantly see your Four Pillars, Five Elements, and Ten Gods." },
  home_how_step3_title: { zh: "获取深度解读", en: "Get Your Interpretation" },
  home_how_step3_desc: { zh: "需要完整解读？AI 将为你生成8000字个性化命盘报告。", en: "Want the full picture? Get an 8000-word AI-powered personalized report delivered to your inbox." },

  // 首页FAQ
  home_faq_title: { zh: "常见问题", en: "Common Questions" },
  home_faq1_q: { zh: "什么是八字？", en: "What is Bazi?" },
  home_faq1_a: { zh: "八字，又称四柱命理，是基于出生年月日时的一套中国古代人格与命运分析体系。可以把它理解为一张「人生蓝图」，揭示你的天赋倾向、优势、挑战以及人生机遇的节奏。已有超过一千年历史，如今借助 AI 让每个人都能轻松了解。", en: "Bazi, also known as the Four Pillars of Destiny, is an ancient Chinese system of personality and destiny analysis based on your birth date and time. Think of it as a 'life blueprint' that reveals your natural tendencies, strengths, challenges, and the rhythm of opportunities throughout your life." },
  home_faq2_q: { zh: "免费排盘能看到什么？", en: "What do I get in the free chart?" },
  home_faq2_a: { zh: "免费排盘会显示你的完整八字四柱（年柱、月柱、日柱、时柱）、日主五行、五行分布、十神关系等基础信息。深度解读（如事业运、感情运、财运、大运走势等）则需要付费获取 AI 生成的详细报告。", en: "The free chart shows your complete Four Pillars, Day Master, Five Element distribution, and Ten Gods. For in-depth interpretation (career, love, wealth, luck cycles), you can purchase an AI-generated report." },
  home_faq3_q: { zh: "需要提供什么信息？", en: "What information do I need?" },
  home_faq3_a: { zh: "需要你的出生日期（年月日）、出生时间（尽可能精确，粗略估计也可以）、出生城市。出生时间用于精确计算时柱，如果不确定可以选「未知」，我们会默认使用正午12点。", en: "You'll need your birth date, birth time (as precise as possible — even an estimate helps), and the city where you were born. If you don't know your exact birth time, you can select 'Unknown' and we'll use noon as a default." },
  home_faq4_q: { zh: "深度报告多久能收到？", en: "How long does it take?" },
  home_faq4_a: { zh: "深度解读报告通常在购买后24小时内发送到你的邮箱。大多数报告几小时内即可收到。", en: "Your report is typically delivered to your email within 24 hours of purchase. Most reports are delivered much sooner — often within a few hours." },
  home_faq_view_all: { zh: "查看全部问题 →", en: "View all questions →" },

  // 排盘页
  chart_title: { zh: "免费八字排盘", en: "Free Bazi Chart" },
  chart_subtitle: { zh: "输入出生信息，即刻生成你的专属命盘", en: "Enter your birth info and see your Bazi chart instantly" },
  chart_form_name: { zh: "姓名/昵称", en: "Name / Nickname" },
  chart_form_name_placeholder: { zh: "你的名字", en: "Your name" },
  chart_form_gender: { zh: "性别", en: "Gender" },
  chart_form_gender_male: { zh: "男", en: "Male" },
  chart_form_gender_female: { zh: "女", en: "Female" },
  chart_form_gender_select: { zh: "请选择", en: "Select" },
  chart_form_birth_date: { zh: "出生日期", en: "Birth Date" },
  chart_form_birth_time: { zh: "出生时间", en: "Birth Time" },
  chart_form_birth_city: { zh: "出生城市", en: "Birth City" },
  chart_form_birth_city_placeholder: { zh: "例如：北京、上海", en: "e.g. Beijing, New York" },
  chart_form_time_unknown: { zh: "未知（默认午时）", en: "Unknown (default noon)" },
  chart_form_submit: { zh: "生成命盘", en: "Generate Chart" },
  chart_form_time_note: { zh: "精确时间用于真太阳时校正。不确定可留空，默认中午12:00。", en: "Precise time is used for true solar time correction. Leave blank if unknown (default noon)." },
  chart_form_gender_note: { zh: "性别影响十神解读，同一命盘男女读法不同", en: "Gender is essential for accurate Bazi interpretation — the same chart reads differently for men and women" },

  // 排盘结果
  chart_result_title: { zh: "你的八字命盘", en: "Your Bazi Chart" },
  chart_day_master: { zh: "日主", en: "Day Master" },
  chart_four_pillars: { zh: "四柱", en: "Four Pillars" },
  chart_year: { zh: "年柱", en: "Year" },
  chart_month: { zh: "月柱", en: "Month" },
  chart_day: { zh: "日柱", en: "Day" },
  chart_hour: { zh: "时柱", en: "Hour" },
  chart_stem: { zh: "天干", en: "Stem" },
  chart_branch: { zh: "地支", en: "Branch" },
  chart_hidden_stems: { zh: "藏干", en: "Hidden Stems" },
  chart_ten_god: { zh: "十神", en: "Ten God" },
  chart_five_elements: { zh: "五行分布", en: "Five Elements" },
  chart_true_solar: { zh: "真太阳时", en: "True Solar Time" },
  chart_cta_title: { zh: "想要完整的命盘解读？", en: "Want a Full Interpretation?" },
  chart_cta_desc: { zh: "AI 将根据你的八字生成一份8000字的深度解读报告，涵盖性格、事业、财运、感情和未来大运走势。", en: "Get an 8000-word AI-powered report covering your personality, career, wealth, relationships, and life path." },
  chart_cta_btn: { zh: "获取深度解读 →", en: "Get Your Full Reading →" },
  chart_error_required: { zh: "请填写必填字段", en: "Please fill in all required fields" },
  chart_error_date: { zh: "请输入完整的出生日期", en: "Please enter a complete birth date" },

  // 付费解读页 (order)
  order_title: { zh: "获取深度命盘解读", en: "Get Your Bazi Reading" },
  order_select: { zh: "选择解读类型", en: "Select Your Reading" },
  order_info: { zh: "个人信息", en: "Personal Info" },
  order_birth: { zh: "出生信息", en: "Birth Info" },
  order_submit: { zh: "继续付款 — ", en: "Continue to Payment — " },
  order_privacy: { zh: "你的信息仅用于生成报告，绝不会被分享。报告将在24小时内发送至你的邮箱。", en: "Your information is only used to generate your report and will never be shared. Your report will be delivered within 24 hours." },
  order_name_req: { zh: "请填写姓名", en: "Name is required." },
  order_email_req: { zh: "请填写邮箱", en: "Email is required." },
  order_email_invalid: { zh: "请输入有效的邮箱地址", en: "Enter a valid email address." },
  order_date_req: { zh: "请选择出生日期", en: "Birth date is required." },
  order_city_req: { zh: "请填写出生城市", en: "Birth city is required." },
  order_gender_req: { zh: "请选择性别", en: "Please select your gender." },
  order_error: { zh: "出了点问题，请重试。", en: "Something went wrong. Please try again." },

  // 产品
  product_life_blueprint: { zh: "命盘深度解读", en: "Life Blueprint" },
  product_life_blueprint_desc: { zh: "8000+字完整命盘分析报告", en: "8000+ word complete birth chart analysis" },
  product_year_ahead: { zh: "流年运势", en: "Year Ahead" },
  product_year_ahead_desc: { zh: "3000+字年度运势预测与指引", en: "3000+ word annual forecast & guidance" },
  product_annual_pass: { zh: "年度会员", en: "Annual Pass" },
  product_annual_pass_desc: { zh: "5年月度运势 + 免费命盘深度解读 ($39.99)", en: "5-Year monthly forecasts + Free Life Blueprint ($39.99)" },

  // 通用
  site_title: { zh: "Bazi Bliss — AI八字命盘解读", en: "Bazi Bliss — Discover Your Life Blueprint" },
  site_desc: { zh: "用AI解锁八字命盘的秘密。获取8000字个性化命盘解读，涵盖事业、感情、财富、健康。", en: "Unlock the secrets of your birth chart with AI-powered Bazi analysis. Get a personalized 8000-word Life Blueprint." },
  footer_tagline: { zh: "千年智慧遇见现代AI。通过八字命理探索你的人生蓝图。", en: "Ancient Chinese wisdom meets modern AI. Discover your life blueprint through the art of Bazi astrology." },
  footer_pages: { zh: "页面", en: "Pages" },
  footer_disclaimer_title: { zh: "免责声明", en: "Disclaimer" },
  footer_disclaimer: { zh: "Bazi Bliss 提供的内容仅供娱乐和自我反思之用。不能替代专业的医疗、法律或财务建议。命盘显示的是倾向而非宿命——你始终拥有自由意志。", en: "Bazi Bliss provides content for entertainment and self-reflection purposes only. It is not a substitute for professional medical, legal, or financial advice. Your birth chart shows tendencies, not destiny — you always have free will." },
  footer_copyright: { zh: "版权所有。仅供娱乐用途。", en: "All rights reserved. For entertainment purposes only." },

  // CTA 区域
  cta_title: { zh: "准备好探索你的命盘了吗？", en: "Ready to Discover Your Blueprint?" },
  cta_subtitle: { zh: "千年智慧凝聚在你的出生时间里。看看它会告诉你什么。", en: "Your birth chart contains wisdom that has guided people for over a thousand years. See what it reveals about you." },
  cta_btn: { zh: "免费排盘 →", en: "Get Your Free Chart →" },

  // 产品展示区
  pricing_title: { zh: "选择你的解读", en: "Choose Your Reading" },
  pricing_desc: { zh: "一次性付费。无需订阅（除非你想要）。24小时内发送到你的邮箱。", en: "One-time payment. No subscription required (unless you want one). Delivered to your email within 24 hours." },

  // 五行
  wood: { zh: "木", en: "Wood" },
  fire: { zh: "火", en: "Fire" },
  earth: { zh: "土", en: "Earth" },
  metal: { zh: "金", en: "Metal" },
  water: { zh: "水", en: "Water" },
  yang: { zh: "阳", en: "Yang" },
  yin: { zh: "阴", en: "Yin" },
  day_master_label: { zh: "日主", en: "Day Master" },

  // 十神
  ten_god_bijian: { zh: "比肩", en: "Peer" },
  ten_god_jiecai: { zh: "劫财", en: "Rival" },
  ten_god_shishen: { zh: "食神", en: "Talent" },
  ten_god_shangguan: { zh: "伤官", en: "Rebellion" },
  ten_god_zhengcai: { zh: "正财", en: "Wealth" },
  ten_god_piancai: { zh: "偏财", en: "Windfall" },
  ten_god_zhengguan: { zh: "正官", en: "Authority" },
  ten_god_qisha: { zh: "七杀", en: "Pressure" },
  ten_god_zhengyin: { zh: "正印", en: "Support" },
  ten_god_pianyin: { zh: "偏印", en: "Wisdom" },

  tenGodNames: {
    zh: { "比肩": "比肩", "劫财": "劫财", "食神": "食神", "伤官": "伤官", "正财": "正财", "偏财": "偏财", "正官": "正官", "七杀": "七杀", "正印": "正印", "偏印": "偏印", "日主": "日主", "未知": "未知" },
    en: { "比肩": "Peer", "劫财": "Rival", "食神": "Talent", "伤官": "Rebellion", "正财": "Wealth", "偏财": "Windfall", "正官": "Authority", "七杀": "Pressure", "正印": "Support", "偏印": "Wisdom", "日主": "Day Master", "未知": "Unknown" },
  },

  // 月份（英文名用于form）
  month_jan: { zh: "1月", en: "January" },
  month_feb: { zh: "2月", en: "February" },
  month_mar: { zh: "3月", en: "March" },
  month_apr: { zh: "4月", en: "April" },
  month_may: { zh: "5月", en: "May" },
  month_jun: { zh: "6月", en: "June" },
  month_jul: { zh: "7月", en: "July" },
  month_aug: { zh: "8月", en: "August" },
  month_sep: { zh: "9月", en: "September" },
  month_oct: { zh: "10月", en: "October" },
  month_nov: { zh: "11月", en: "November" },
  month_dec: { zh: "12月", en: "December" },
  month_label: { zh: "月", en: "Month" },
  day_label: { zh: "日", en: "Day" },
  year_label: { zh: "年", en: "Year" },

  // 命盘结果中的C TA
  result_want_more: { zh: "想要完整的命盘解读？", en: "Want a Full Interpretation?" },
  result_cta_desc: { zh: "AI 将根据你的八字生成深度解读报告，涵盖性格、事业、财运、感情和未来大运走势。", en: "Get an AI-powered report covering your personality, career, wealth, relationships, and life path." },
  result_cta_btn: { zh: "获取深度解读 →", en: "Get Your Full Reading →" },

  // 八卦
  bagua: {
    zh: {
      "甲": "甲木（阳）",
      "乙": "乙木（阴）",
      "丙": "丙火（阳）",
      "丁": "丁火（阴）",
      "戊": "戊土（阳）",
      "己": "己土（阴）",
      "庚": "庚金（阳）",
      "辛": "辛金（阴）",
      "壬": "壬水（阳）",
      "癸": "癸水（阴）",
    },
    en: {
      "甲": "Jia Wood (Yang)",
      "乙": "Yi Wood (Yin)",
      "丙": "Bing Fire (Yang)",
      "丁": "Ding Fire (Yin)",
      "戊": "Wu Earth (Yang)",
      "己": "Ji Earth (Yin)",
      "庚": "Geng Metal (Yang)",
      "辛": "Xin Metal (Yin)",
      "壬": "Ren Water (Yang)",
      "癸": "Gui Water (Yin)",
    },
  },
} as const;

export type DictKey = keyof typeof dict;
