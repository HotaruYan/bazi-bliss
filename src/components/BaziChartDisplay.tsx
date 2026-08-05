"use client";

import { useI18n } from "@/i18n";
import type { BaziChart } from "@/lib/bazi-calculator";

const ELEMENT_COLORS: Record<string, string> = {
  Wood: "#4CAF50",
  Fire: "#F44336",
  Earth: "#FF9800",
  Metal: "#FFD700",
  Water: "#2196F3",
};

const ELEMENT_ICONS: Record<string, string> = {
  Wood: "🌳",
  Fire: "🔥",
  Earth: "⛰️",
  Metal: "⚔️",
  Water: "💧",
};

const STEM_ELEMENT_CN: Record<string, { element: string; yinYang: string; icon: string }> = {
  "甲": { element: "木", yinYang: "阳", icon: "🌳" },
  "乙": { element: "木", yinYang: "阴", icon: "🌿" },
  "丙": { element: "火", yinYang: "阳", icon: "☀️" },
  "丁": { element: "火", yinYang: "阴", icon: "🕯️" },
  "戊": { element: "土", yinYang: "阳", icon: "⛰️" },
  "己": { element: "土", yinYang: "阴", icon: "🌾" },
  "庚": { element: "金", yinYang: "阳", icon: "⚔️" },
  "辛": { element: "金", yinYang: "阴", icon: "💍" },
  "壬": { element: "水", yinYang: "阳", icon: "🌊" },
  "癸": { element: "水", yinYang: "阴", icon: "💧" },
};

interface Props {
  chart: BaziChart;
  name: string;
}

export default function BaziChartDisplay({ chart, name }: Props) {
  const { t, tTenGod } = useI18n();

  const dayMasterInfo = STEM_ELEMENT_CN[chart.dayMaster];
  const maxElement = Math.max(...Object.values(chart.elementCount), 1);

  return (
    <div className="space-y-8">
      {/* 标题 + 日主 */}
      <div className="text-center">
        <p className="text-sm text-[#9c9588] mb-2">{t("chart_result_title")}</p>
        <h2 className="text-2xl font-bold text-[#f0e6d3] mb-4">{name}</h2>
        <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#1a1a1a] border border-[#c8a951]/30">
          <span className="text-sm text-[#9c9588]">{t("day_master_label")}</span>
          <span className="text-4xl">{dayMasterInfo?.icon}</span>
          <div className="text-left">
            <span className="text-3xl font-bold text-[#c8a951]">{chart.dayMaster}</span>
            <p className="text-xs text-[#9c9588]">
              {dayMasterInfo?.yinYang}{dayMasterInfo?.element} · {chart.dayMasterElement}
            </p>
          </div>
        </div>
      </div>

      {/* 四柱表格 */}
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              <th className="py-3 px-4 text-sm font-semibold text-[#9c9588]"></th>
              <th className="py-3 px-4 text-sm font-semibold text-[#c8a951]">{t("chart_year")}</th>
              <th className="py-3 px-4 text-sm font-semibold text-[#c8a951]">{t("chart_month")}</th>
              <th className="py-3 px-4 text-sm font-semibold text-[#c8a951]">{t("chart_day")}</th>
              <th className="py-3 px-4 text-sm font-semibold text-[#c8a951]">{t("chart_hour")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {/* 天干地支 */}
            <tr>
              <td className="py-3 px-4 text-sm text-[#9c9588] font-medium">{t("chart_stem")}{t("chart_branch")}</td>
              {([chart.yearPillar, chart.monthPillar, chart.dayPillar, chart.hourPillar] as const).map((p, i) => (
                <td key={i} className="py-3 px-4">
                  <span className="text-2xl font-bold text-[#f0e6d3] tracking-widest">
                    {p.stem}{p.branch}
                  </span>
                </td>
              ))}
            </tr>
            {/* 天干 */}
            <tr>
              <td className="py-2 px-4 text-sm text-[#9c9588]">{t("chart_stem")}</td>
              {([chart.yearPillar, chart.monthPillar, chart.dayPillar, chart.hourPillar] as const).map((p, i) => {
                const info = STEM_ELEMENT_CN[p.stem];
                return (
                  <td key={i} className="py-2 px-4 text-sm text-[#f0e6d3]">
                    {p.stem} {info?.icon} <span className="text-[#9c9588] text-xs">({info?.yinYang}{info?.element})</span>
                  </td>
                );
              })}
            </tr>
            {/* 地支 */}
            <tr>
              <td className="py-2 px-4 text-sm text-[#9c9588]">{t("chart_branch")}</td>
              {([chart.yearPillar, chart.monthPillar, chart.dayPillar, chart.hourPillar] as const).map((p, i) => (
                <td key={i} className="py-2 px-4 text-sm text-[#f0e6d3]">
                  {p.branch} <span className="text-[#9c9588] text-xs">({p.branchElement})</span>
                </td>
              ))}
            </tr>
            {/* 藏干 */}
            <tr>
              <td className="py-2 px-4 text-sm text-[#9c9588]">{t("chart_hidden_stems")}</td>
              {([chart.yearPillar, chart.monthPillar, chart.dayPillar, chart.hourPillar] as const).map((p, i) => (
                <td key={i} className="py-2 px-4 text-sm text-[#9c9588]">
                  {p.hiddenStems.join(" ")}
                </td>
              ))}
            </tr>
            {/* 十神 */}
            <tr>
              <td className="py-2 px-4 text-sm text-[#9c9588]">{t("chart_ten_god")}</td>
              <td className="py-2 px-4 text-sm text-[#c8a951] font-medium">{tTenGod(chart.tenGods.year)}</td>
              <td className="py-2 px-4 text-sm text-[#c8a951] font-medium">{tTenGod(chart.tenGods.month)}</td>
              <td className="py-2 px-4 text-sm text-[#c8a951] font-bold">{tTenGod(chart.tenGods.day)}</td>
              <td className="py-2 px-4 text-sm text-[#c8a951] font-medium">{tTenGod(chart.tenGods.hour)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 五行分布 */}
      <div>
        <h3 className="text-sm font-semibold text-[#9c9588] mb-4 text-center">
          {t("chart_five_elements")}
        </h3>
        <div className="space-y-3 max-w-md mx-auto">
          {Object.entries(chart.elementCount).map(([element, count]) => (
            <div key={element} className="flex items-center gap-3">
              <span className="w-12 text-sm text-[#9c9588] text-right">
                {ELEMENT_ICONS[element]} {t(element.toLowerCase() as "wood" | "fire" | "earth" | "metal" | "water")}
              </span>
              <div className="flex-1 h-5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(count / maxElement) * 100}%`,
                    backgroundColor: ELEMENT_COLORS[element],
                    opacity: 0.7,
                  }}
                />
              </div>
              <span className="w-6 text-sm text-[#f0e6d3] font-bold text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 真太阳时 */}
      <div className="text-center text-xs text-[#6b6459]">
        {t("chart_true_solar")}：{chart.trueSolarTime.note}
      </div>

      {/* CTA */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#252525] border border-[#c8a951]/20 text-center">
        <h3 className="text-lg font-bold text-[#f0e6d3] mb-2">{t("result_want_more")}</h3>
        <p className="text-sm text-[#9c9588] mb-4 max-w-md mx-auto">
          {t("result_cta_desc")}
        </p>
        <a
          href="/order"
          className="inline-block px-6 py-3 bg-[#c8a951] text-[#0f0f0f] rounded-xl font-bold text-sm hover:bg-[#d4b96a] transition-all shadow-lg shadow-[#c8a951]/20"
        >
          {t("result_cta_btn")}
        </a>
      </div>
    </div>
  );
}
