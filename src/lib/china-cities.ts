/**
 * 中国县级以上行政区划经纬度数据库
 *
 * 覆盖：直辖市、省会、地级市、自治州、盟、省直管县级市
 * 数据来源：公开行政区划数据
 * 用途：用户输入出生城市 → 自动匹配经度 → 真太阳时修正
 */

export interface CityEntry {
  name: string;       // 中文名
  province: string;   // 所属省份
  lng: number;        // 经度
  lat: number;        // 纬度
  alias?: string[];   // 别名/简称/旧称
}

// 所有数据，key 为去除"市/县/区/州/盟"后缀的纯地名（用于模糊匹配）
const CITIES: CityEntry[] = [
  // ═══════════════════════════════════════════
  // 直辖市
  // ═══════════════════════════════════════════
  { name: "北京", province: "北京", lng: 116.40, lat: 39.90, alias: ["beijing", "北平", "燕京", "帝都"] },
  { name: "上海", province: "上海", lng: 121.47, lat: 31.23, alias: ["shanghai", "申城", "魔都"] },
  { name: "天津", province: "天津", lng: 117.20, lat: 39.13, alias: ["tianjin", "津门"] },
  { name: "重庆", province: "重庆", lng: 106.55, lat: 29.57, alias: ["chongqing", "山城", "渝"] },

  // ═══════════════════════════════════════════
  // 河北省 (11地级市 + 省直管)
  // ═══════════════════════════════════════════
  { name: "石家庄", province: "河北", lng: 114.51, lat: 38.04 },
  { name: "唐山", province: "河北", lng: 118.18, lat: 39.63 },
  { name: "秦皇岛", province: "河北", lng: 119.60, lat: 39.93, alias: ["北戴河", "山海关"] },
  { name: "邯郸", province: "河北", lng: 114.54, lat: 36.63 },
  { name: "邢台", province: "河北", lng: 114.50, lat: 37.07 },
  { name: "保定", province: "河北", lng: 115.48, lat: 38.87, alias: ["雄安"] },
  { name: "张家口", province: "河北", lng: 114.89, lat: 40.77 },
  { name: "承德", province: "河北", lng: 117.96, lat: 40.95 },
  { name: "沧州", province: "河北", lng: 116.84, lat: 38.30 },
  { name: "廊坊", province: "河北", lng: 116.68, lat: 39.52 },
  { name: "衡水", province: "河北", lng: 115.67, lat: 37.74 },
  { name: "定州", province: "河北", lng: 114.99, lat: 38.52 },
  { name: "辛集", province: "河北", lng: 115.22, lat: 37.94 },

  // ═══════════════════════════════════════════
  // 山西省 (11地级市)
  // ═══════════════════════════════════════════
  { name: "太原", province: "山西", lng: 112.55, lat: 37.87 },
  { name: "大同", province: "山西", lng: 113.30, lat: 40.08 },
  { name: "阳泉", province: "山西", lng: 113.57, lat: 37.86 },
  { name: "长治", province: "山西", lng: 113.12, lat: 36.20 },
  { name: "晋城", province: "山西", lng: 112.85, lat: 35.49 },
  { name: "朔州", province: "山西", lng: 112.43, lat: 39.33 },
  { name: "晋中", province: "山西", lng: 112.75, lat: 37.69 },
  { name: "运城", province: "山西", lng: 111.00, lat: 35.02 },
  { name: "忻州", province: "山西", lng: 112.73, lat: 38.42 },
  { name: "临汾", province: "山西", lng: 111.52, lat: 36.09 },
  { name: "吕梁", province: "山西", lng: 111.14, lat: 37.52 },

  // ═══════════════════════════════════════════
  // 内蒙古自治区 (12盟市)
  // ═══════════════════════════════════════════
  { name: "呼和浩特", province: "内蒙古", lng: 111.75, lat: 40.84, alias: ["呼市"] },
  { name: "包头", province: "内蒙古", lng: 109.84, lat: 40.66 },
  { name: "乌海", province: "内蒙古", lng: 106.79, lat: 39.66 },
  { name: "赤峰", province: "内蒙古", lng: 118.89, lat: 42.26 },
  { name: "通辽", province: "内蒙古", lng: 122.24, lat: 43.62 },
  { name: "鄂尔多斯", province: "内蒙古", lng: 109.78, lat: 39.61 },
  { name: "呼伦贝尔", province: "内蒙古", lng: 119.77, lat: 49.21, alias: ["海拉尔"] },
  { name: "巴彦淖尔", province: "内蒙古", lng: 107.39, lat: 40.74 },
  { name: "乌兰察布", province: "内蒙古", lng: 113.13, lat: 40.99, alias: ["集宁"] },
  { name: "兴安", province: "内蒙古", lng: 122.04, lat: 46.08, alias: ["乌兰浩特"] },
  { name: "锡林郭勒", province: "内蒙古", lng: 116.05, lat: 43.93, alias: ["锡林浩特"] },
  { name: "阿拉善", province: "内蒙古", lng: 105.73, lat: 38.83, alias: ["阿拉善左旗"] },

  // ═══════════════════════════════════════════
  // 辽宁省 (14地级市)
  // ═══════════════════════════════════════════
  { name: "沈阳", province: "辽宁", lng: 123.43, lat: 41.80 },
  { name: "大连", province: "辽宁", lng: 121.61, lat: 38.91 },
  { name: "鞍山", province: "辽宁", lng: 122.99, lat: 41.11 },
  { name: "抚顺", province: "辽宁", lng: 123.96, lat: 41.88 },
  { name: "本溪", province: "辽宁", lng: 123.77, lat: 41.29 },
  { name: "丹东", province: "辽宁", lng: 124.35, lat: 40.00 },
  { name: "锦州", province: "辽宁", lng: 121.14, lat: 41.10 },
  { name: "营口", province: "辽宁", lng: 122.23, lat: 40.67 },
  { name: "阜新", province: "辽宁", lng: 121.67, lat: 42.02 },
  { name: "辽阳", province: "辽宁", lng: 123.24, lat: 41.27 },
  { name: "盘锦", province: "辽宁", lng: 122.07, lat: 41.12 },
  { name: "铁岭", province: "辽宁", lng: 123.73, lat: 42.22 },
  { name: "朝阳", province: "辽宁", lng: 120.45, lat: 41.57 },
  { name: "葫芦岛", province: "辽宁", lng: 120.84, lat: 40.71 },

  // ═══════════════════════════════════════════
  // 吉林省 (9地级市州)
  // ═══════════════════════════════════════════
  { name: "长春", province: "吉林", lng: 125.32, lat: 43.82 },
  { name: "吉林", province: "吉林", lng: 126.55, lat: 43.84 },
  { name: "四平", province: "吉林", lng: 124.37, lat: 43.17 },
  { name: "辽源", province: "吉林", lng: 125.14, lat: 42.89 },
  { name: "通化", province: "吉林", lng: 125.94, lat: 41.73 },
  { name: "白山", province: "吉林", lng: 126.42, lat: 41.94 },
  { name: "松原", province: "吉林", lng: 124.82, lat: 45.14 },
  { name: "白城", province: "吉林", lng: 122.84, lat: 45.62 },
  { name: "延边", province: "吉林", lng: 129.51, lat: 42.91, alias: ["延吉"] },

  // ═══════════════════════════════════════════
  // 黑龙江省 (13地级市)
  // ═══════════════════════════════════════════
  { name: "哈尔滨", province: "黑龙江", lng: 126.64, lat: 45.80, alias: ["哈市", "冰城"] },
  { name: "齐齐哈尔", province: "黑龙江", lng: 123.92, lat: 47.35 },
  { name: "鸡西", province: "黑龙江", lng: 130.97, lat: 45.30 },
  { name: "鹤岗", province: "黑龙江", lng: 130.30, lat: 47.33 },
  { name: "双鸭山", province: "黑龙江", lng: 131.16, lat: 46.64 },
  { name: "大庆", province: "黑龙江", lng: 125.03, lat: 46.59 },
  { name: "伊春", province: "黑龙江", lng: 128.84, lat: 47.73 },
  { name: "佳木斯", province: "黑龙江", lng: 130.32, lat: 46.80 },
  { name: "七台河", province: "黑龙江", lng: 130.96, lat: 45.77 },
  { name: "牡丹江", province: "黑龙江", lng: 129.63, lat: 44.55 },
  { name: "黑河", province: "黑龙江", lng: 127.49, lat: 50.25 },
  { name: "绥化", province: "黑龙江", lng: 126.97, lat: 46.64 },
  { name: "大兴安岭", province: "黑龙江", lng: 124.12, lat: 50.42, alias: ["加格达奇"] },

  // ═══════════════════════════════════════════
  // 江苏省 (13地级市)
  // ═══════════════════════════════════════════
  { name: "南京", province: "江苏", lng: 118.80, lat: 32.06, alias: ["nanjing", "金陵"] },
  { name: "无锡", province: "江苏", lng: 120.31, lat: 31.49 },
  { name: "徐州", province: "江苏", lng: 117.18, lat: 34.27 },
  { name: "常州", province: "江苏", lng: 119.97, lat: 31.81 },
  { name: "苏州", province: "江苏", lng: 120.59, lat: 31.30, alias: ["suzhou", "姑苏"] },
  { name: "南通", province: "江苏", lng: 120.89, lat: 31.98 },
  { name: "连云港", province: "江苏", lng: 119.22, lat: 34.60 },
  { name: "淮安", province: "江苏", lng: 119.02, lat: 33.61 },
  { name: "盐城", province: "江苏", lng: 120.16, lat: 33.35 },
  { name: "扬州", province: "江苏", lng: 119.41, lat: 32.39 },
  { name: "镇江", province: "江苏", lng: 119.42, lat: 32.19 },
  { name: "泰州", province: "江苏", lng: 119.92, lat: 32.46 },
  { name: "宿迁", province: "江苏", lng: 118.28, lat: 33.96 },

  // ═══════════════════════════════════════════
  // 浙江省 (11地级市)
  // ═══════════════════════════════════════════
  { name: "杭州", province: "浙江", lng: 120.21, lat: 30.25, alias: ["hangzhou", "临安"] },
  { name: "宁波", province: "浙江", lng: 121.54, lat: 29.87 },
  { name: "温州", province: "浙江", lng: 120.70, lat: 28.00 },
  { name: "嘉兴", province: "浙江", lng: 120.76, lat: 30.75 },
  { name: "湖州", province: "浙江", lng: 120.09, lat: 30.89 },
  { name: "绍兴", province: "浙江", lng: 120.58, lat: 30.05 },
  { name: "金华", province: "浙江", lng: 119.65, lat: 29.08, alias: ["义乌"] },
  { name: "衢州", province: "浙江", lng: 118.87, lat: 28.94 },
  { name: "舟山", province: "浙江", lng: 122.21, lat: 29.99 },
  { name: "台州", province: "浙江", lng: 121.42, lat: 28.66 },
  { name: "丽水", province: "浙江", lng: 119.92, lat: 28.47 },

  // ═══════════════════════════════════════════
  // 安徽省 (16地级市)
  // ═══════════════════════════════════════════
  { name: "合肥", province: "安徽", lng: 117.23, lat: 31.82 },
  { name: "芜湖", province: "安徽", lng: 118.43, lat: 31.35 },
  { name: "蚌埠", province: "安徽", lng: 117.39, lat: 32.92 },
  { name: "淮南", province: "安徽", lng: 117.02, lat: 32.63 },
  { name: "马鞍山", province: "安徽", lng: 118.51, lat: 31.67 },
  { name: "淮北", province: "安徽", lng: 116.80, lat: 33.97 },
  { name: "铜陵", province: "安徽", lng: 117.81, lat: 30.93 },
  { name: "安庆", province: "安徽", lng: 117.05, lat: 30.53 },
  { name: "黄山", province: "安徽", lng: 118.34, lat: 29.72, alias: ["屯溪"] },
  { name: "滁州", province: "安徽", lng: 118.32, lat: 32.30 },
  { name: "阜阳", province: "安徽", lng: 115.81, lat: 32.89 },
  { name: "宿州", province: "安徽", lng: 116.97, lat: 33.65 },
  { name: "六安", province: "安徽", lng: 116.50, lat: 31.73 },
  { name: "亳州", province: "安徽", lng: 115.78, lat: 33.85 },
  { name: "池州", province: "安徽", lng: 117.49, lat: 30.66 },
  { name: "宣城", province: "安徽", lng: 118.76, lat: 30.95 },

  // ═══════════════════════════════════════════
  // 福建省 (9地级市)
  // ═══════════════════════════════════════════
  { name: "福州", province: "福建", lng: 119.30, lat: 26.07 },
  { name: "厦门", province: "福建", lng: 118.09, lat: 24.48, alias: ["xiamen", "鹭岛"] },
  { name: "莆田", province: "福建", lng: 119.01, lat: 25.45 },
  { name: "三明", province: "福建", lng: 117.64, lat: 26.26 },
  { name: "泉州", province: "福建", lng: 118.59, lat: 24.91 },
  { name: "漳州", province: "福建", lng: 117.66, lat: 24.51 },
  { name: "南平", province: "福建", lng: 118.18, lat: 26.64 },
  { name: "龙岩", province: "福建", lng: 117.02, lat: 25.08 },
  { name: "宁德", province: "福建", lng: 119.55, lat: 26.67 },

  // ═══════════════════════════════════════════
  // 江西省 (11地级市)
  // ═══════════════════════════════════════════
  { name: "南昌", province: "江西", lng: 115.86, lat: 28.68 },
  { name: "景德镇", province: "江西", lng: 117.18, lat: 29.27 },
  { name: "萍乡", province: "江西", lng: 113.85, lat: 27.63 },
  { name: "九江", province: "江西", lng: 115.95, lat: 29.71 },
  { name: "新余", province: "江西", lng: 114.92, lat: 27.82 },
  { name: "鹰潭", province: "江西", lng: 117.04, lat: 28.24 },
  { name: "赣州", province: "江西", lng: 114.93, lat: 25.83 },
  { name: "吉安", province: "江西", lng: 114.99, lat: 27.11, alias: ["井冈山"] },
  { name: "宜春", province: "江西", lng: 114.42, lat: 27.82 },
  { name: "抚州", province: "江西", lng: 116.36, lat: 27.95 },
  { name: "上饶", province: "江西", lng: 117.97, lat: 28.45 },

  // ═══════════════════════════════════════════
  // 山东省 (16地级市)
  // ═══════════════════════════════════════════
  { name: "济南", province: "山东", lng: 117.00, lat: 36.65 },
  { name: "青岛", province: "山东", lng: 120.38, lat: 36.07, alias: ["qingdao"] },
  { name: "淄博", province: "山东", lng: 118.05, lat: 36.81 },
  { name: "枣庄", province: "山东", lng: 117.32, lat: 34.81 },
  { name: "东营", province: "山东", lng: 118.67, lat: 37.43 },
  { name: "烟台", province: "山东", lng: 121.45, lat: 37.46 },
  { name: "潍坊", province: "山东", lng: 119.16, lat: 36.71 },
  { name: "济宁", province: "山东", lng: 116.59, lat: 35.41, alias: ["曲阜"] },
  { name: "泰安", province: "山东", lng: 117.09, lat: 36.20, alias: ["泰山"] },
  { name: "威海", province: "山东", lng: 122.12, lat: 37.51 },
  { name: "日照", province: "山东", lng: 119.53, lat: 35.42 },
  { name: "临沂", province: "山东", lng: 118.36, lat: 35.10 },
  { name: "德州", province: "山东", lng: 116.36, lat: 37.44 },
  { name: "聊城", province: "山东", lng: 115.99, lat: 36.46 },
  { name: "滨州", province: "山东", lng: 117.97, lat: 37.38 },
  { name: "菏泽", province: "山东", lng: 115.48, lat: 35.23 },

  // ═══════════════════════════════════════════
  // 河南省 (17地级市 + 1省直管)
  // ═══════════════════════════════════════════
  { name: "郑州", province: "河南", lng: 113.63, lat: 34.75 },
  { name: "开封", province: "河南", lng: 114.31, lat: 34.80 },
  { name: "洛阳", province: "河南", lng: 112.45, lat: 34.62 },
  { name: "平顶山", province: "河南", lng: 113.30, lat: 33.74 },
  { name: "安阳", province: "河南", lng: 114.39, lat: 36.10 },
  { name: "鹤壁", province: "河南", lng: 114.30, lat: 35.75 },
  { name: "新乡", province: "河南", lng: 113.93, lat: 35.30 },
  { name: "焦作", province: "河南", lng: 113.24, lat: 35.22 },
  { name: "濮阳", province: "河南", lng: 115.03, lat: 35.76 },
  { name: "许昌", province: "河南", lng: 113.85, lat: 34.04 },
  { name: "漯河", province: "河南", lng: 114.02, lat: 33.58 },
  { name: "三门峡", province: "河南", lng: 111.20, lat: 34.77 },
  { name: "南阳", province: "河南", lng: 112.53, lat: 32.99 },
  { name: "商丘", province: "河南", lng: 115.66, lat: 34.41 },
  { name: "信阳", province: "河南", lng: 114.07, lat: 32.13 },
  { name: "周口", province: "河南", lng: 114.70, lat: 33.63 },
  { name: "驻马店", province: "河南", lng: 114.02, lat: 32.98 },
  { name: "济源", province: "河南", lng: 112.60, lat: 35.07 },

  // ═══════════════════════════════════════════
  // 湖北省 (13地级市州)
  // ═══════════════════════════════════════════
  { name: "武汉", province: "湖北", lng: 114.31, lat: 30.60, alias: ["wuhan", "江城"] },
  { name: "黄石", province: "湖北", lng: 115.04, lat: 30.20 },
  { name: "十堰", province: "湖北", lng: 110.80, lat: 32.63, alias: ["武当山"] },
  { name: "宜昌", province: "湖北", lng: 111.29, lat: 30.69, alias: ["三峡"] },
  { name: "襄阳", province: "湖北", lng: 112.12, lat: 32.01 },
  { name: "鄂州", province: "湖北", lng: 114.89, lat: 30.39 },
  { name: "荆门", province: "湖北", lng: 112.20, lat: 31.04 },
  { name: "孝感", province: "湖北", lng: 113.93, lat: 30.93 },
  { name: "荆州", province: "湖北", lng: 112.24, lat: 30.33 },
  { name: "黄冈", province: "湖北", lng: 114.88, lat: 30.45 },
  { name: "咸宁", province: "湖北", lng: 114.33, lat: 29.84 },
  { name: "随州", province: "湖北", lng: 113.38, lat: 31.69 },
  { name: "恩施", province: "湖北", lng: 109.48, lat: 30.27 },

  // ═══════════════════════════════════════════
  // 湖南省 (14地级市州)
  // ═══════════════════════════════════════════
  { name: "长沙", province: "湖南", lng: 112.94, lat: 28.23, alias: ["changsha", "星城"] },
  { name: "株洲", province: "湖南", lng: 113.13, lat: 27.83 },
  { name: "湘潭", province: "湖南", lng: 112.94, lat: 27.83 },
  { name: "衡阳", province: "湖南", lng: 112.57, lat: 26.89 },
  { name: "邵阳", province: "湖南", lng: 111.47, lat: 27.24 },
  { name: "岳阳", province: "湖南", lng: 113.13, lat: 29.36 },
  { name: "常德", province: "湖南", lng: 111.70, lat: 29.03 },
  { name: "张家界", province: "湖南", lng: 110.48, lat: 29.12 },
  { name: "益阳", province: "湖南", lng: 112.33, lat: 28.58 },
  { name: "郴州", province: "湖南", lng: 113.02, lat: 25.77 },
  { name: "永州", province: "湖南", lng: 111.61, lat: 26.42 },
  { name: "怀化", province: "湖南", lng: 109.97, lat: 27.57 },
  { name: "娄底", province: "湖南", lng: 112.01, lat: 27.70 },
  { name: "湘西", province: "湖南", lng: 109.74, lat: 28.32, alias: ["吉首", "凤凰"] },

  // ═══════════════════════════════════════════
  // 广东省 (21地级市)
  // ═══════════════════════════════════════════
  { name: "广州", province: "广东", lng: 113.26, lat: 23.13, alias: ["guangzhou", "羊城", "花城"] },
  { name: "韶关", province: "广东", lng: 113.60, lat: 24.81 },
  { name: "深圳", province: "广东", lng: 114.06, lat: 22.54, alias: ["shenzhen", "鹏城"] },
  { name: "珠海", province: "广东", lng: 113.58, lat: 22.27 },
  { name: "汕头", province: "广东", lng: 116.68, lat: 23.35 },
  { name: "佛山", province: "广东", lng: 113.12, lat: 23.02, alias: ["顺德", "南海"] },
  { name: "江门", province: "广东", lng: 113.08, lat: 22.58 },
  { name: "湛江", province: "广东", lng: 110.36, lat: 21.27 },
  { name: "茂名", province: "广东", lng: 110.93, lat: 21.66 },
  { name: "肇庆", province: "广东", lng: 112.47, lat: 23.05 },
  { name: "惠州", province: "广东", lng: 114.42, lat: 23.11 },
  { name: "梅州", province: "广东", lng: 116.12, lat: 24.29 },
  { name: "汕尾", province: "广东", lng: 115.38, lat: 22.79 },
  { name: "河源", province: "广东", lng: 114.70, lat: 23.74 },
  { name: "阳江", province: "广东", lng: 111.98, lat: 21.86 },
  { name: "清远", province: "广东", lng: 113.06, lat: 23.68 },
  { name: "东莞", province: "广东", lng: 113.75, lat: 23.02 },
  { name: "中山", province: "广东", lng: 113.38, lat: 22.52 },
  { name: "潮州", province: "广东", lng: 116.62, lat: 23.66 },
  { name: "揭阳", province: "广东", lng: 116.37, lat: 23.55 },
  { name: "云浮", province: "广东", lng: 112.04, lat: 22.92 },

  // ═══════════════════════════════════════════
  // 广西壮族自治区 (14地级市)
  // ═══════════════════════════════════════════
  { name: "南宁", province: "广西", lng: 108.37, lat: 22.82 },
  { name: "柳州", province: "广西", lng: 109.43, lat: 24.33 },
  { name: "桂林", province: "广西", lng: 110.29, lat: 25.27, alias: ["guilin"] },
  { name: "梧州", province: "广西", lng: 111.28, lat: 23.48 },
  { name: "北海", province: "广西", lng: 109.12, lat: 21.48 },
  { name: "防城港", province: "广西", lng: 108.35, lat: 21.69 },
  { name: "钦州", province: "广西", lng: 108.65, lat: 21.96 },
  { name: "贵港", province: "广西", lng: 109.60, lat: 23.11 },
  { name: "玉林", province: "广西", lng: 110.18, lat: 22.63 },
  { name: "百色", province: "广西", lng: 106.62, lat: 23.90 },
  { name: "贺州", province: "广西", lng: 111.57, lat: 24.40 },
  { name: "河池", province: "广西", lng: 108.06, lat: 24.69 },
  { name: "来宾", province: "广西", lng: 109.22, lat: 23.75 },
  { name: "崇左", province: "广西", lng: 107.37, lat: 22.38 },

  // ═══════════════════════════════════════════
  // 海南省 (4地级市 + 省直管县)
  // ═══════════════════════════════════════════
  { name: "海口", province: "海南", lng: 110.20, lat: 20.04 },
  { name: "三亚", province: "海南", lng: 109.51, lat: 18.25 },
  { name: "三沙", province: "海南", lng: 112.34, lat: 16.83 },
  { name: "儋州", province: "海南", lng: 109.58, lat: 19.52 },
  { name: "琼海", province: "海南", lng: 110.47, lat: 19.26 },
  { name: "文昌", province: "海南", lng: 110.80, lat: 19.55 },
  { name: "万宁", province: "海南", lng: 110.39, lat: 18.80 },
  { name: "五指山", province: "海南", lng: 109.52, lat: 18.78 },
  { name: "东方", province: "海南", lng: 108.65, lat: 19.10 },

  // ═══════════════════════════════════════════
  // 四川省 (21地级市州)
  // ═══════════════════════════════════════════
  { name: "成都", province: "四川", lng: 104.07, lat: 30.57, alias: ["chengdu", "蓉城", "锦城"] },
  { name: "自贡", province: "四川", lng: 104.78, lat: 29.34 },
  { name: "攀枝花", province: "四川", lng: 101.72, lat: 26.58 },
  { name: "泸州", province: "四川", lng: 105.44, lat: 28.87 },
  { name: "德阳", province: "四川", lng: 104.40, lat: 31.13 },
  { name: "绵阳", province: "四川", lng: 104.68, lat: 31.47 },
  { name: "广元", province: "四川", lng: 105.82, lat: 32.44 },
  { name: "遂宁", province: "四川", lng: 105.57, lat: 30.53 },
  { name: "内江", province: "四川", lng: 105.06, lat: 29.58 },
  { name: "乐山", province: "四川", lng: 103.76, lat: 29.55, alias: ["峨眉山"] },
  { name: "南充", province: "四川", lng: 106.11, lat: 30.80 },
  { name: "眉山", province: "四川", lng: 103.85, lat: 30.08 },
  { name: "宜宾", province: "四川", lng: 104.62, lat: 28.77 },
  { name: "广安", province: "四川", lng: 106.63, lat: 30.46 },
  { name: "达州", province: "四川", lng: 107.47, lat: 31.21 },
  { name: "雅安", province: "四川", lng: 103.04, lat: 29.98 },
  { name: "巴中", province: "四川", lng: 106.75, lat: 31.86 },
  { name: "资阳", province: "四川", lng: 104.63, lat: 30.13 },
  { name: "阿坝", province: "四川", lng: 102.22, lat: 31.90, alias: ["九寨沟", "马尔康"] },
  { name: "甘孜", province: "四川", lng: 101.96, lat: 30.05, alias: ["康定", "稻城"] },
  { name: "凉山", province: "四川", lng: 102.27, lat: 27.90, alias: ["西昌"] },

  // ═══════════════════════════════════════════
  // 贵州省 (9地级市州)
  // ═══════════════════════════════════════════
  { name: "贵阳", province: "贵州", lng: 106.63, lat: 26.65 },
  { name: "六盘水", province: "贵州", lng: 104.83, lat: 26.59 },
  { name: "遵义", province: "贵州", lng: 106.93, lat: 27.73 },
  { name: "安顺", province: "贵州", lng: 105.95, lat: 26.25, alias: ["黄果树"] },
  { name: "毕节", province: "贵州", lng: 105.29, lat: 27.28 },
  { name: "铜仁", province: "贵州", lng: 109.19, lat: 27.72 },
  { name: "黔西南", province: "贵州", lng: 104.90, lat: 25.09, alias: ["兴义"] },
  { name: "黔东南", province: "贵州", lng: 107.98, lat: 26.58, alias: ["凯里"] },
  { name: "黔南", province: "贵州", lng: 107.52, lat: 26.25, alias: ["都匀"] },

  // ═══════════════════════════════════════════
  // 云南省 (16地级市州)
  // ═══════════════════════════════════════════
  { name: "昆明", province: "云南", lng: 102.83, lat: 24.88, alias: ["kunming", "春城"] },
  { name: "曲靖", province: "云南", lng: 103.80, lat: 25.50 },
  { name: "玉溪", province: "云南", lng: 102.55, lat: 24.35 },
  { name: "保山", province: "云南", lng: 99.18, lat: 25.11 },
  { name: "昭通", province: "云南", lng: 103.72, lat: 27.34 },
  { name: "丽江", province: "云南", lng: 100.23, lat: 26.86 },
  { name: "普洱", province: "云南", lng: 100.97, lat: 22.83 },
  { name: "临沧", province: "云南", lng: 100.09, lat: 23.88 },
  { name: "楚雄", province: "云南", lng: 101.55, lat: 25.04 },
  { name: "红河", province: "云南", lng: 103.40, lat: 23.37, alias: ["蒙自"] },
  { name: "文山", province: "云南", lng: 104.22, lat: 23.40 },
  { name: "西双版纳", province: "云南", lng: 100.80, lat: 22.01, alias: ["景洪"] },
  { name: "大理", province: "云南", lng: 100.23, lat: 25.61 },
  { name: "德宏", province: "云南", lng: 98.58, lat: 24.43, alias: ["芒市"] },
  { name: "怒江", province: "云南", lng: 98.85, lat: 25.85, alias: ["泸水"] },
  { name: "迪庆", province: "云南", lng: 99.70, lat: 27.83, alias: ["香格里拉"] },

  // ═══════════════════════════════════════════
  // 西藏自治区 (7地级市)
  // ═══════════════════════════════════════════
  { name: "拉萨", province: "西藏", lng: 91.17, lat: 29.65 },
  { name: "日喀则", province: "西藏", lng: 88.89, lat: 29.27 },
  { name: "昌都", province: "西藏", lng: 97.17, lat: 31.14 },
  { name: "林芝", province: "西藏", lng: 94.36, lat: 29.65 },
  { name: "山南", province: "西藏", lng: 91.77, lat: 29.24 },
  { name: "那曲", province: "西藏", lng: 92.07, lat: 31.48 },
  { name: "阿里", province: "西藏", lng: 80.11, lat: 32.50, alias: ["狮泉河"] },

  // ═══════════════════════════════════════════
  // 陕西省 (10地级市)
  // ═══════════════════════════════════════════
  { name: "西安", province: "陕西", lng: 108.94, lat: 34.26, alias: ["xian", "长安"] },
  { name: "铜川", province: "陕西", lng: 108.95, lat: 34.90 },
  { name: "宝鸡", province: "陕西", lng: 107.24, lat: 34.36 },
  { name: "咸阳", province: "陕西", lng: 108.71, lat: 34.33 },
  { name: "渭南", province: "陕西", lng: 109.50, lat: 34.50, alias: ["华山"] },
  { name: "延安", province: "陕西", lng: 109.49, lat: 36.59 },
  { name: "汉中", province: "陕西", lng: 107.02, lat: 33.07 },
  { name: "榆林", province: "陕西", lng: 109.73, lat: 38.29 },
  { name: "安康", province: "陕西", lng: 109.03, lat: 32.68 },
  { name: "商洛", province: "陕西", lng: 109.92, lat: 33.87 },

  // ═══════════════════════════════════════════
  // 甘肃省 (14地级市州)
  // ═══════════════════════════════════════════
  { name: "兰州", province: "甘肃", lng: 103.73, lat: 36.06 },
  { name: "嘉峪关", province: "甘肃", lng: 98.29, lat: 39.77 },
  { name: "金昌", province: "甘肃", lng: 102.19, lat: 38.52 },
  { name: "白银", province: "甘肃", lng: 104.14, lat: 36.55 },
  { name: "天水", province: "甘肃", lng: 105.72, lat: 34.58 },
  { name: "武威", province: "甘肃", lng: 102.64, lat: 37.93 },
  { name: "张掖", province: "甘肃", lng: 100.45, lat: 38.93 },
  { name: "平凉", province: "甘肃", lng: 106.67, lat: 35.54 },
  { name: "酒泉", province: "甘肃", lng: 98.52, lat: 39.74, alias: ["敦煌"] },
  { name: "庆阳", province: "甘肃", lng: 107.64, lat: 35.71 },
  { name: "定西", province: "甘肃", lng: 104.62, lat: 35.58 },
  { name: "陇南", province: "甘肃", lng: 104.93, lat: 33.40 },
  { name: "临夏", province: "甘肃", lng: 103.21, lat: 35.60 },
  { name: "甘南", province: "甘肃", lng: 102.92, lat: 34.99, alias: ["合作"] },

  // ═══════════════════════════════════════════
  // 青海省 (8地级市州)
  // ═══════════════════════════════════════════
  { name: "西宁", province: "青海", lng: 101.78, lat: 36.62 },
  { name: "海东", province: "青海", lng: 102.10, lat: 36.50 },
  { name: "海北", province: "青海", lng: 100.90, lat: 36.96 },
  { name: "黄南", province: "青海", lng: 102.02, lat: 35.52 },
  { name: "海南", province: "青海", lng: 100.62, lat: 36.29 },
  { name: "果洛", province: "青海", lng: 100.24, lat: 34.47 },
  { name: "玉树", province: "青海", lng: 97.01, lat: 33.00 },
  { name: "海西", province: "青海", lng: 97.37, lat: 37.38, alias: ["格尔木", "德令哈"] },

  // ═══════════════════════════════════════════
  // 宁夏回族自治区 (5地级市)
  // ═══════════════════════════════════════════
  { name: "银川", province: "宁夏", lng: 106.23, lat: 38.49 },
  { name: "石嘴山", province: "宁夏", lng: 106.38, lat: 39.02 },
  { name: "吴忠", province: "宁夏", lng: 106.20, lat: 37.99 },
  { name: "固原", province: "宁夏", lng: 106.24, lat: 36.02 },
  { name: "中卫", province: "宁夏", lng: 105.20, lat: 37.50 },

  // ═══════════════════════════════════════════
  // 新疆维吾尔自治区 (14地级市州)
  // ═══════════════════════════════════════════
  { name: "乌鲁木齐", province: "新疆", lng: 87.62, lat: 43.83, alias: ["urumqi", "乌市"] },
  { name: "克拉玛依", province: "新疆", lng: 84.89, lat: 45.58 },
  { name: "吐鲁番", province: "新疆", lng: 89.19, lat: 42.95 },
  { name: "哈密", province: "新疆", lng: 93.51, lat: 42.83 },
  { name: "昌吉", province: "新疆", lng: 87.31, lat: 44.01 },
  { name: "博尔塔拉", province: "新疆", lng: 82.07, lat: 44.91, alias: ["博乐"] },
  { name: "巴音郭楞", province: "新疆", lng: 86.15, lat: 41.76, alias: ["库尔勒"] },
  { name: "阿克苏", province: "新疆", lng: 80.26, lat: 41.17 },
  { name: "克孜勒苏", province: "新疆", lng: 76.17, lat: 39.71, alias: ["阿图什"] },
  { name: "喀什", province: "新疆", lng: 75.99, lat: 39.47 },
  { name: "和田", province: "新疆", lng: 79.92, lat: 37.11 },
  { name: "伊犁", province: "新疆", lng: 81.32, lat: 43.92, alias: ["伊宁"] },
  { name: "塔城", province: "新疆", lng: 82.98, lat: 46.75 },
  { name: "阿勒泰", province: "新疆", lng: 88.14, lat: 47.85 },

  // ═══════════════════════════════════════════
  // 台湾省 (6主要城市)
  // ═══════════════════════════════════════════
  { name: "台北", province: "台湾", lng: 121.56, lat: 25.04, alias: ["taipei"] },
  { name: "高雄", province: "台湾", lng: 120.31, lat: 22.63, alias: ["kaohsiung"] },
  { name: "台中", province: "台湾", lng: 120.68, lat: 24.15, alias: ["taichung"] },
  { name: "台南", province: "台湾", lng: 120.22, lat: 23.00, alias: ["tainan"] },
  { name: "基隆", province: "台湾", lng: 121.74, lat: 25.13 },
  { name: "新竹", province: "台湾", lng: 120.97, lat: 24.81 },

  // ═══════════════════════════════════════════
  // 香港 / 澳门
  // ═══════════════════════════════════════════
  { name: "香港", province: "香港", lng: 114.17, lat: 22.28, alias: ["hongkong", "hong kong"] },
  { name: "澳门", province: "澳门", lng: 113.55, lat: 22.19, alias: ["macau", "macao"] },

  // ═══════════════════════════════════════════
  // 常见县级市/区（用户可能直接输入）
  // ═══════════════════════════════════════════
  { name: "雄安新区", province: "河北", lng: 116.10, lat: 39.05 },
  { name: "滨海新区", province: "天津", lng: 117.70, lat: 39.00 },
  { name: "浦东", province: "上海", lng: 121.54, lat: 31.24, alias: ["浦东新区"] },
  { name: "涿州", province: "河北", lng: 115.98, lat: 39.49 },
  { name: "三河", province: "河北", lng: 117.08, lat: 39.98, alias: ["燕郊"] },
  { name: "昆山", province: "江苏", lng: 120.98, lat: 31.38 },
  { name: "江阴", province: "江苏", lng: 120.27, lat: 31.91 },
  { name: "张家港", province: "江苏", lng: 120.55, lat: 31.88 },
  { name: "常熟", province: "江苏", lng: 120.75, lat: 31.65 },
  { name: "太仓", province: "江苏", lng: 121.13, lat: 31.45 },
  { name: "宜兴", province: "江苏", lng: 119.82, lat: 31.36 },
  { name: "义乌", province: "浙江", lng: 120.07, lat: 29.31 },
  { name: "慈溪", province: "浙江", lng: 121.27, lat: 30.17 },
  { name: "诸暨", province: "浙江", lng: 120.24, lat: 29.71 },
  { name: "瑞安", province: "浙江", lng: 120.65, lat: 27.78 },
  { name: "乐清", province: "浙江", lng: 120.99, lat: 28.12 },
  { name: "温岭", province: "浙江", lng: 121.37, lat: 28.37 },
  { name: "晋江", province: "福建", lng: 118.58, lat: 24.82 },
  { name: "福清", province: "福建", lng: 119.38, lat: 25.72 },
  { name: "石狮", province: "福建", lng: 118.65, lat: 24.73 },
  { name: "蓬莱", province: "山东", lng: 120.76, lat: 37.81 },
  { name: "滕州", province: "山东", lng: 117.16, lat: 35.09 },
  { name: "荣成", province: "山东", lng: 122.49, lat: 37.16 },
  { name: "寿光", province: "山东", lng: 118.79, lat: 36.86 },
  { name: "新郑", province: "河南", lng: 113.74, lat: 34.40 },
  { name: "登封", province: "河南", lng: 113.03, lat: 34.46, alias: ["少林寺"] },
  { name: "浏阳", province: "湖南", lng: 113.64, lat: 28.16 },
  { name: "韶山", province: "湖南", lng: 112.53, lat: 27.93 },
  { name: "增城", province: "广东", lng: 113.83, lat: 23.29 },
  { name: "从化", province: "广东", lng: 113.59, lat: 23.55 },
  { name: "普宁", province: "广东", lng: 116.17, lat: 23.30 },
  { name: "高州", province: "广东", lng: 110.85, lat: 21.92 },
  { name: "兴宁", province: "广东", lng: 115.73, lat: 24.14 },
  { name: "陆丰", province: "广东", lng: 115.65, lat: 22.95 },
  { name: "阆中", province: "四川", lng: 105.99, lat: 31.56 },
  { name: "峨眉山", province: "四川", lng: 103.48, lat: 29.60 },
  { name: "都江堰", province: "四川", lng: 103.65, lat: 30.99 },
  { name: "仁怀", province: "贵州", lng: 106.40, lat: 27.79, alias: ["茅台"] },
  { name: "瑞丽", province: "云南", lng: 97.85, lat: 24.02 },
  { name: "腾冲", province: "云南", lng: 98.49, lat: 25.02 },
  { name: "敦煌", province: "甘肃", lng: 94.66, lat: 40.14 },
  { name: "格尔木", province: "青海", lng: 94.90, lat: 36.41 },
  { name: "满洲里", province: "内蒙古", lng: 117.38, lat: 49.60 },
  { name: "二连浩特", province: "内蒙古", lng: 111.98, lat: 43.65 },
  { name: "漠河", province: "黑龙江", lng: 122.54, lat: 52.97 },
  { name: "抚远", province: "黑龙江", lng: 134.29, lat: 48.37 },
  { name: "长白山", province: "吉林", lng: 128.06, lat: 42.05 },
  { name: "可可西里", province: "青海", lng: 92.44, lat: 35.37 },
  { name: "南沙", province: "广东", lng: 113.60, lat: 22.77 },
];

// ═══════════════════════════════════════════
// 查找引擎
// ═══════════════════════════════════════════

/** 构建索引：所有可搜索的文本 → 城市条目 */
let searchIndex: Map<string, CityEntry> | null = null;

function buildIndex(): Map<string, CityEntry> {
  if (searchIndex) return searchIndex;
  searchIndex = new Map();

  for (const city of CITIES) {
    // 完整名称
    addToIndex(city.name, city);
    addToIndex(city.name + "市", city);
    addToIndex(city.name + "县", city);
    addToIndex(city.province + city.name, city);

    // 别名
    if (city.alias) {
      for (const a of city.alias) {
        addToIndex(a.toLowerCase(), city);
      }
    }
  }

  return searchIndex;
}

function addToIndex(key: string, city: CityEntry) {
  const k = key.toLowerCase().trim();
  if (!searchIndex!.has(k)) {
    searchIndex!.set(k, city);
  }
}

/**
 * 根据用户输入的字符串查找城市经纬度
 * 策略：
 *   1. 精确匹配（去除"省市县区"后缀后）
 *   2. 包含匹配（输入是城市名的一部分）
 *   3. 返回 null 表示未找到
 */
export function lookupCity(input: string): CityEntry | null {
  const index = buildIndex();
  const raw = input.trim();
  if (!raw) return null;

  // 1. 精确匹配
  const exact = index.get(raw.toLowerCase());
  if (exact) return exact;

  // 去掉常见的后缀再试
  const stripped = raw.replace(/[省市县区州盟旗]$/, "").trim();
  if (stripped !== raw) {
    const s = index.get(stripped.toLowerCase());
    if (s) return s;
  }

  // 2. 前缀/包含匹配
  const lowerRaw = raw.toLowerCase();
  for (const [key, city] of index) {
    if (key.includes(lowerRaw) || lowerRaw.includes(key)) {
      return city;
    }
  }

  return null;
}

/** 获取城市总数（调试用） */
export function getCityCount(): number {
  return CITIES.length;
}
