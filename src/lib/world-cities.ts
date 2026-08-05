/**
 * 国际主要城市经纬度数据库
 *
 * 覆盖全球主要城市（人口 > 100万 + 主要华人聚居城市）
 * 用途：用户输入海外出生城市 → 自动匹配经度 → 真太阳时修正
 * 未覆盖城市回退到 Nominatim API
 */

import type { CityEntry } from "./china-cities";

const WORLD_CITIES: CityEntry[] = [
  // ═══════════════════════════════════════════
  // 东亚 (East Asia)
  // ═══════════════════════════════════════════
  { name: "东京", province: "日本", lng: 139.69, lat: 35.69, alias: ["Tokyo", "東京"] },
  { name: "大阪", province: "日本", lng: 135.50, lat: 34.69, alias: ["Osaka"] },
  { name: "名古屋", province: "日本", lng: 136.91, lat: 35.18, alias: ["Nagoya"] },
  { name: "横滨", province: "日本", lng: 139.64, lat: 35.44, alias: ["Yokohama", "橫濱"] },
  { name: "京都", province: "日本", lng: 135.77, lat: 35.01, alias: ["Kyoto"] },
  { name: "札幌", province: "日本", lng: 141.35, lat: 43.06, alias: ["Sapporo"] },
  { name: "福冈", province: "日本", lng: 130.42, lat: 33.61, alias: ["Fukuoka", "福岡"] },
  { name: "神户", province: "日本", lng: 135.18, lat: 34.69, alias: ["Kobe", "神戶"] },
  { name: "首尔", province: "韩国", lng: 126.98, lat: 37.57, alias: ["Seoul", "首爾", "서울"] },
  { name: "釜山", province: "韩国", lng: 129.08, lat: 35.18, alias: ["Busan", "釜山", "부산"] },
  { name: "仁川", province: "韩国", lng: 126.71, lat: 37.46, alias: ["Incheon", "仁川"] },
  { name: "大邱", province: "韩国", lng: 128.60, lat: 35.87, alias: ["Daegu"] },
  { name: "平壤", province: "朝鲜", lng: 125.76, lat: 39.04, alias: ["Pyongyang"] },
  { name: "乌兰巴托", province: "蒙古", lng: 106.91, lat: 47.89, alias: ["Ulaanbaatar", "Ulan Bator"] },

  // ═══════════════════════════════════════════
  // 东南亚 (Southeast Asia)
  // ═══════════════════════════════════════════
  { name: "新加坡", province: "新加坡", lng: 103.85, lat: 1.29, alias: ["Singapore", "狮城"] },
  { name: "曼谷", province: "泰国", lng: 100.50, lat: 13.76, alias: ["Bangkok"] },
  { name: "清迈", province: "泰国", lng: 98.98, lat: 18.79, alias: ["Chiang Mai"] },
  { name: "吉隆坡", province: "马来西亚", lng: 101.69, lat: 3.14, alias: ["Kuala Lumpur", "KL"] },
  { name: "槟城", province: "马来西亚", lng: 100.33, lat: 5.41, alias: ["Penang", "乔治市"] },
  { name: "新山", province: "马来西亚", lng: 103.74, lat: 1.49, alias: ["Johor Bahru"] },
  { name: "雅加达", province: "印尼", lng: 106.83, lat: -6.21, alias: ["Jakarta"] },
  { name: "泗水", province: "印尼", lng: 112.75, lat: -7.25, alias: ["Surabaya"] },
  { name: "马尼拉", province: "菲律宾", lng: 120.98, lat: 14.60, alias: ["Manila"] },
  { name: "河内", province: "越南", lng: 105.85, lat: 21.03, alias: ["Hanoi", "河內"] },
  { name: "胡志明市", province: "越南", lng: 106.63, lat: 10.82, alias: ["Ho Chi Minh", "西贡", "Saigon"] },
  { name: "岘港", province: "越南", lng: 108.22, lat: 16.05, alias: ["Da Nang"] },
  { name: "金边", province: "柬埔寨", lng: 104.93, lat: 11.56, alias: ["Phnom Penh"] },
  { name: "仰光", province: "缅甸", lng: 96.15, lat: 16.87, alias: ["Yangon", "Rangoon"] },
  { name: "万象", province: "老挝", lng: 102.63, lat: 17.98, alias: ["Vientiane"] },
  { name: "斯里巴加湾", province: "文莱", lng: 114.94, lat: 4.94, alias: ["Bandar Seri Begawan"] },

  // ═══════════════════════════════════════════
  // 南亚 (South Asia)
  // ═══════════════════════════════════════════
  { name: "新德里", province: "印度", lng: 77.21, lat: 28.61, alias: ["New Delhi", "Delhi", "德里"] },
  { name: "孟买", province: "印度", lng: 72.88, lat: 19.08, alias: ["Mumbai", "Bombay"] },
  { name: "班加罗尔", province: "印度", lng: 77.59, lat: 12.97, alias: ["Bangalore", "Bengaluru"] },
  { name: "加尔各答", province: "印度", lng: 88.36, lat: 22.57, alias: ["Kolkata", "Calcutta"] },
  { name: "金奈", province: "印度", lng: 80.27, lat: 13.08, alias: ["Chennai", "Madras"] },
  { name: "伊斯兰堡", province: "巴基斯坦", lng: 73.05, lat: 33.68, alias: ["Islamabad"] },
  { name: "卡拉奇", province: "巴基斯坦", lng: 67.00, lat: 24.86, alias: ["Karachi"] },
  { name: "达卡", province: "孟加拉国", lng: 90.41, lat: 23.81, alias: ["Dhaka"] },
  { name: "科伦坡", province: "斯里兰卡", lng: 79.86, lat: 6.93, alias: ["Colombo"] },
  { name: "加德满都", province: "尼泊尔", lng: 85.32, lat: 27.72, alias: ["Kathmandu"] },
  { name: "马累", province: "马尔代夫", lng: 73.51, lat: 4.18, alias: ["Male"] },

  // ═══════════════════════════════════════════
  // 中东 (Middle East)
  // ═══════════════════════════════════════════
  { name: "迪拜", province: "阿联酋", lng: 55.27, lat: 25.20, alias: ["Dubai"] },
  { name: "阿布扎比", province: "阿联酋", lng: 54.37, lat: 24.45, alias: ["Abu Dhabi"] },
  { name: "多哈", province: "卡塔尔", lng: 51.53, lat: 25.29, alias: ["Doha"] },
  { name: "利雅得", province: "沙特阿拉伯", lng: 46.68, lat: 24.71, alias: ["Riyadh"] },
  { name: "吉达", province: "沙特阿拉伯", lng: 39.17, lat: 21.54, alias: ["Jeddah"] },
  { name: "马斯喀特", province: "阿曼", lng: 58.59, lat: 23.59, alias: ["Muscat"] },
  { name: "科威特城", province: "科威特", lng: 47.98, lat: 29.38, alias: ["Kuwait City"] },
  { name: "麦纳麦", province: "巴林", lng: 50.59, lat: 26.22, alias: ["Manama"] },
  { name: "德黑兰", province: "伊朗", lng: 51.39, lat: 35.69, alias: ["Tehran"] },
  { name: "巴格达", province: "伊拉克", lng: 44.36, lat: 33.31, alias: ["Baghdad"] },
  { name: "安卡拉", province: "土耳其", lng: 32.86, lat: 39.93, alias: ["Ankara"] },
  { name: "伊斯坦布尔", province: "土耳其", lng: 28.98, lat: 41.01, alias: ["Istanbul"] },
  { name: "特拉维夫", province: "以色列", lng: 34.78, lat: 32.09, alias: ["Tel Aviv"] },
  { name: "耶路撒冷", province: "以色列", lng: 35.21, lat: 31.77, alias: ["Jerusalem"] },
  { name: "安曼", province: "约旦", lng: 35.93, lat: 31.95, alias: ["Amman"] },
  { name: "贝鲁特", province: "黎巴嫩", lng: 35.50, lat: 33.89, alias: ["Beirut"] },

  // ═══════════════════════════════════════════
  // 中亚 (Central Asia)
  // ═══════════════════════════════════════════
  { name: "阿斯塔纳", province: "哈萨克斯坦", lng: 71.47, lat: 51.16, alias: ["Astana", "Nur-Sultan"] },
  { name: "阿拉木图", province: "哈萨克斯坦", lng: 76.93, lat: 43.24, alias: ["Almaty"] },
  { name: "塔什干", province: "乌兹别克斯坦", lng: 69.24, lat: 41.31, alias: ["Tashkent"] },
  { name: "比什凯克", province: "吉尔吉斯斯坦", lng: 74.59, lat: 42.87, alias: ["Bishkek"] },
  { name: "杜尚别", province: "塔吉克斯坦", lng: 68.79, lat: 38.54, alias: ["Dushanbe"] },

  // ═══════════════════════════════════════════
  // 欧洲 (Europe)
  // ═══════════════════════════════════════════
  { name: "伦敦", province: "英国", lng: -0.13, lat: 51.51, alias: ["London", "倫敦"] },
  { name: "曼彻斯特", province: "英国", lng: -2.24, lat: 53.48, alias: ["Manchester"] },
  { name: "伯明翰", province: "英国", lng: -1.89, lat: 52.49, alias: ["Birmingham"] },
  { name: "爱丁堡", province: "英国", lng: -3.19, lat: 55.95, alias: ["Edinburgh"] },
  { name: "巴黎", province: "法国", lng: 2.35, lat: 48.86, alias: ["Paris"] },
  { name: "马赛", province: "法国", lng: 5.37, lat: 43.30, alias: ["Marseille"] },
  { name: "里昂", province: "法国", lng: 4.84, lat: 45.76, alias: ["Lyon"] },
  { name: "柏林", province: "德国", lng: 13.41, lat: 52.52, alias: ["Berlin"] },
  { name: "慕尼黑", province: "德国", lng: 11.58, lat: 48.14, alias: ["Munich", "München"] },
  { name: "汉堡", province: "德国", lng: 10.00, lat: 53.55, alias: ["Hamburg"] },
  { name: "法兰克福", province: "德国", lng: 8.68, lat: 50.11, alias: ["Frankfurt"] },
  { name: "罗马", province: "意大利", lng: 12.50, lat: 41.90, alias: ["Rome", "Roma"] },
  { name: "米兰", province: "意大利", lng: 9.19, lat: 45.47, alias: ["Milan", "Milano"] },
  { name: "马德里", province: "西班牙", lng: -3.70, lat: 40.42, alias: ["Madrid"] },
  { name: "巴塞罗那", province: "西班牙", lng: 2.17, lat: 41.39, alias: ["Barcelona"] },
  { name: "里斯本", province: "葡萄牙", lng: -9.14, lat: 38.72, alias: ["Lisbon", "Lisboa"] },
  { name: "阿姆斯特丹", province: "荷兰", lng: 4.90, lat: 52.37, alias: ["Amsterdam"] },
  { name: "鹿特丹", province: "荷兰", lng: 4.48, lat: 51.92, alias: ["Rotterdam"] },
  { name: "布鲁塞尔", province: "比利时", lng: 4.35, lat: 50.85, alias: ["Brussels", "Bruxelles"] },
  { name: "维也纳", province: "奥地利", lng: 16.37, lat: 48.21, alias: ["Vienna", "Wien"] },
  { name: "苏黎世", province: "瑞士", lng: 8.54, lat: 47.38, alias: ["Zurich", "Zürich"] },
  { name: "日内瓦", province: "瑞士", lng: 6.14, lat: 46.20, alias: ["Geneva", "Genève"] },
  { name: "布拉格", province: "捷克", lng: 14.44, lat: 50.09, alias: ["Prague", "Praha"] },
  { name: "华沙", province: "波兰", lng: 21.01, lat: 52.23, alias: ["Warsaw", "Warszawa"] },
  { name: "布达佩斯", province: "匈牙利", lng: 19.04, lat: 47.50, alias: ["Budapest"] },
  { name: "雅典", province: "希腊", lng: 23.73, lat: 37.98, alias: ["Athens", "Athina"] },
  { name: "都柏林", province: "爱尔兰", lng: -6.26, lat: 53.35, alias: ["Dublin"] },
  { name: "哥本哈根", province: "丹麦", lng: 12.57, lat: 55.68, alias: ["Copenhagen", "København"] },
  { name: "斯德哥尔摩", province: "瑞典", lng: 18.07, lat: 59.33, alias: ["Stockholm"] },
  { name: "奥斯陆", province: "挪威", lng: 10.75, lat: 59.91, alias: ["Oslo"] },
  { name: "赫尔辛基", province: "芬兰", lng: 24.94, lat: 60.17, alias: ["Helsinki"] },
  { name: "莫斯科", province: "俄罗斯", lng: 37.62, lat: 55.76, alias: ["Moscow", "Moskva"] },
  { name: "圣彼得堡", province: "俄罗斯", lng: 30.31, lat: 59.93, alias: ["Saint Petersburg", "St Petersburg"] },
  { name: "基辅", province: "乌克兰", lng: 30.52, lat: 50.45, alias: ["Kyiv", "Kiev"] },
  { name: "布加勒斯特", province: "罗马尼亚", lng: 26.10, lat: 44.43, alias: ["Bucharest"] },
  { name: "贝尔格莱德", province: "塞尔维亚", lng: 20.46, lat: 44.81, alias: ["Belgrade"] },
  { name: "索菲亚", province: "保加利亚", lng: 23.32, lat: 42.70, alias: ["Sofia"] },
  { name: "雷克雅未克", province: "冰岛", lng: -21.87, lat: 64.15, alias: ["Reykjavik"] },

  // ═══════════════════════════════════════════
  // 北美 (North America)
  // ═══════════════════════════════════════════
  { name: "纽约", province: "美国", lng: -74.01, lat: 40.71, alias: ["New York", "NYC", "紐約"] },
  { name: "洛杉矶", province: "美国", lng: -118.24, lat: 34.05, alias: ["Los Angeles", "LA"] },
  { name: "芝加哥", province: "美国", lng: -87.63, lat: 41.88, alias: ["Chicago"] },
  { name: "休斯顿", province: "美国", lng: -95.37, lat: 29.76, alias: ["Houston"] },
  { name: "旧金山", province: "美国", lng: -122.42, lat: 37.77, alias: ["San Francisco", "SF", "三藩市"] },
  { name: "圣何塞", province: "美国", lng: -121.89, lat: 37.34, alias: ["San Jose"] },
  { name: "西雅图", province: "美国", lng: -122.33, lat: 47.61, alias: ["Seattle"] },
  { name: "波士顿", province: "美国", lng: -71.06, lat: 42.36, alias: ["Boston"] },
  { name: "华盛顿", province: "美国", lng: -77.04, lat: 38.91, alias: ["Washington DC", "Washington D.C.", "DC"] },
  { name: "费城", province: "美国", lng: -75.17, lat: 39.95, alias: ["Philadelphia"] },
  { name: "达拉斯", province: "美国", lng: -96.80, lat: 32.78, alias: ["Dallas"] },
  { name: "迈阿密", province: "美国", lng: -80.19, lat: 25.76, alias: ["Miami"] },
  { name: "亚特兰大", province: "美国", lng: -84.39, lat: 33.75, alias: ["Atlanta"] },
  { name: "拉斯维加斯", province: "美国", lng: -115.14, lat: 36.17, alias: ["Las Vegas"] },
  { name: "圣地亚哥", province: "美国", lng: -117.16, lat: 32.72, alias: ["San Diego"] },
  { name: "波特兰", province: "美国", lng: -122.68, lat: 45.52, alias: ["Portland"] },
  { name: "丹佛", province: "美国", lng: -104.99, lat: 39.74, alias: ["Denver"] },
  { name: "凤凰城", province: "美国", lng: -112.07, lat: 33.45, alias: ["Phoenix"] },
  { name: "底特律", province: "美国", lng: -83.05, lat: 42.33, alias: ["Detroit"] },
  { name: "檀香山", province: "美国", lng: -157.86, lat: 21.31, alias: ["Honolulu", "火奴鲁鲁"] },
  { name: "温哥华", province: "加拿大", lng: -123.12, lat: 49.28, alias: ["Vancouver"] },
  { name: "多伦多", province: "加拿大", lng: -79.38, lat: 43.65, alias: ["Toronto"] },
  { name: "蒙特利尔", province: "加拿大", lng: -73.57, lat: 45.50, alias: ["Montreal", "Montréal", "滿地可"] },
  { name: "卡尔加里", province: "加拿大", lng: -114.07, lat: 51.05, alias: ["Calgary"] },
  { name: "渥太华", province: "加拿大", lng: -75.70, lat: 45.42, alias: ["Ottawa"] },
  { name: "埃德蒙顿", province: "加拿大", lng: -113.49, lat: 53.55, alias: ["Edmonton"] },
  { name: "墨西哥城", province: "墨西哥", lng: -99.13, lat: 19.43, alias: ["Mexico City", "Ciudad de Mexico"] },

  // ═══════════════════════════════════════════
  // 南美 (South America)
  // ═══════════════════════════════════════════
  { name: "圣保罗", province: "巴西", lng: -46.63, lat: -23.55, alias: ["São Paulo", "Sao Paulo"] },
  { name: "里约热内卢", province: "巴西", lng: -43.20, lat: -22.91, alias: ["Rio de Janeiro", "Rio"] },
  { name: "巴西利亚", province: "巴西", lng: -47.88, lat: -15.79, alias: ["Brasilia", "Brasília"] },
  { name: "布宜诺斯艾利斯", province: "阿根廷", lng: -58.38, lat: -34.60, alias: ["Buenos Aires"] },
  { name: "圣地亚哥", province: "智利", lng: -70.67, lat: -33.45, alias: ["Santiago", "Santiago de Chile"] },
  { name: "利马", province: "秘鲁", lng: -77.04, lat: -12.05, alias: ["Lima"] },
  { name: "波哥大", province: "哥伦比亚", lng: -74.07, lat: 4.61, alias: ["Bogota", "Bogotá"] },
  { name: "加拉加斯", province: "委内瑞拉", lng: -66.90, lat: 10.48, alias: ["Caracas"] },
  { name: "基多", province: "厄瓜多尔", lng: -78.51, lat: -0.22, alias: ["Quito"] },
  { name: "拉巴斯", province: "玻利维亚", lng: -68.15, lat: -16.50, alias: ["La Paz"] },
  { name: "蒙得维的亚", province: "乌拉圭", lng: -56.16, lat: -34.90, alias: ["Montevideo"] },
  { name: "亚松森", province: "巴拉圭", lng: -57.64, lat: -25.28, alias: ["Asuncion", "Asunción"] },

  // ═══════════════════════════════════════════
  // 大洋洲 (Oceania)
  // ═══════════════════════════════════════════
  { name: "悉尼", province: "澳大利亚", lng: 151.21, lat: -33.87, alias: ["Sydney"] },
  { name: "墨尔本", province: "澳大利亚", lng: 144.96, lat: -37.81, alias: ["Melbourne"] },
  { name: "布里斯班", province: "澳大利亚", lng: 153.03, lat: -27.47, alias: ["Brisbane"] },
  { name: "珀斯", province: "澳大利亚", lng: 115.86, lat: -31.95, alias: ["Perth"] },
  { name: "阿德莱德", province: "澳大利亚", lng: 138.60, lat: -34.93, alias: ["Adelaide"] },
  { name: "堪培拉", province: "澳大利亚", lng: 149.13, lat: -35.28, alias: ["Canberra"] },
  { name: "奥克兰", province: "新西兰", lng: 174.76, lat: -36.85, alias: ["Auckland"] },
  { name: "惠灵顿", province: "新西兰", lng: 174.77, lat: -41.29, alias: ["Wellington"] },
  { name: "基督城", province: "新西兰", lng: 172.64, lat: -43.53, alias: ["Christchurch"] },
  { name: "苏瓦", province: "斐济", lng: 178.44, lat: -18.14, alias: ["Suva"] },
  { name: "莫尔兹比港", province: "巴布亚新几内亚", lng: 147.18, lat: -9.48, alias: ["Port Moresby"] },

  // ═══════════════════════════════════════════
  // 非洲 (Africa)
  // ═══════════════════════════════════════════
  { name: "开罗", province: "埃及", lng: 31.24, lat: 30.04, alias: ["Cairo"] },
  { name: "亚历山大", province: "埃及", lng: 29.92, lat: 31.20, alias: ["Alexandria"] },
  { name: "拉各斯", province: "尼日利亚", lng: 3.38, lat: 6.45, alias: ["Lagos"] },
  { name: "内罗毕", province: "肯尼亚", lng: 36.82, lat: -1.29, alias: ["Nairobi"] },
  { name: "亚的斯亚贝巴", province: "埃塞俄比亚", lng: 38.76, lat: 9.03, alias: ["Addis Ababa"] },
  { name: "约翰内斯堡", province: "南非", lng: 28.05, lat: -26.20, alias: ["Johannesburg"] },
  { name: "开普敦", province: "南非", lng: 18.42, lat: -33.93, alias: ["Cape Town"] },
  { name: "德班", province: "南非", lng: 31.02, lat: -29.86, alias: ["Durban"] },
  { name: "卡萨布兰卡", province: "摩洛哥", lng: -7.59, lat: 33.57, alias: ["Casablanca", "达尔贝达"] },
  { name: "阿尔及尔", province: "阿尔及利亚", lng: 3.06, lat: 36.75, alias: ["Algiers"] },
  { name: "突尼斯", province: "突尼斯", lng: 10.18, lat: 36.81, alias: ["Tunis"] },
  { name: "达累斯萨拉姆", province: "坦桑尼亚", lng: 39.27, lat: -6.79, alias: ["Dar es Salaam"] },
  { name: "阿克拉", province: "加纳", lng: -0.19, lat: 5.56, alias: ["Accra"] },
  { name: "达喀尔", province: "塞内加尔", lng: -17.44, lat: 14.69, alias: ["Dakar"] },
  { name: "坎帕拉", province: "乌干达", lng: 32.58, lat: 0.32, alias: ["Kampala"] },
  { name: "罗安达", province: "安哥拉", lng: 13.23, lat: -8.84, alias: ["Luanda"] },
  { name: "阿比让", province: "科特迪瓦", lng: -4.01, lat: 5.32, alias: ["Abidjan"] },
  { name: "路易港", province: "毛里求斯", lng: 57.50, lat: -20.16, alias: ["Port Louis"] },
];

// ── 索引构建 ──

let index: Map<string, CityEntry> | null = null;

function buildIndex(): Map<string, CityEntry> {
  if (index) return index;
  index = new Map();

  for (const city of WORLD_CITIES) {
    index.set(city.name.toLowerCase(), city);
    if (city.alias) {
      for (const alias of city.alias) {
        // 同名不做覆盖（中国城市优先）
        if (!index.has(alias.toLowerCase())) {
          index.set(alias.toLowerCase(), city);
        }
      }
    }
  }

  return index;
}

/**
 * 在国际城市数据库中查找城市
 * @param input 用户输入的城市名（中文或英文）
 * @returns 匹配的城市条目，未找到返回 null
 */
export function lookupWorldCity(input: string): CityEntry | null {
  const idx = buildIndex();
  const raw = input.trim();
  if (!raw) return null;

  // 精确匹配
  const exact = idx.get(raw.toLowerCase());
  if (exact) return exact;

  // 包含匹配
  const lowerRaw = raw.toLowerCase();
  for (const [key, city] of idx) {
    if (key.includes(lowerRaw) || lowerRaw.includes(key)) {
      return city;
    }
  }

  return null;
}

/** 获取国际城市数量 */
export function getWorldCityCount(): number {
  return WORLD_CITIES.length;
}
