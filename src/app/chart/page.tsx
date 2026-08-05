"use client";

import { useState } from "react";
import { useI18n } from "@/i18n";
import FreeChartForm from "@/components/FreeChartForm";
import BaziChartDisplay from "@/components/BaziChartDisplay";
import type { BaziChart, BirthInfoInput } from "@/lib/bazi-calculator";

export default function ChartPage() {
  const { t } = useI18n();
  const [result, setResult] = useState<{ chart: BaziChart; input: BirthInfoInput } | null>(null);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="max-w-2xl mx-auto px-4 py-16 md:py-24">
        {/* 页面标题 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f0e6d3] mb-3">
            {t("chart_title")}
          </h1>
          <p className="text-[#9c9588]">{t("chart_subtitle")}</p>
        </div>

        {/* 表单 */}
        <FreeChartForm onChartReady={(chart, input) => setResult({ chart, input })} />

        {/* 结果 */}
        {result && (
          <div className="mt-12 pt-12 border-t border-[#2a2a2a]">
            <BaziChartDisplay chart={result.chart} name={result.input.birthDate} />
          </div>
        )}
      </div>
    </div>
  );
}
