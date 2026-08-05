"use client";

import { useState } from "react";
import { useI18n } from "@/i18n";
import TimeWheel from "./TimeWheel";
import LocationPicker from "./LocationPicker";
import { calculateBazi, type BaziChart, type BirthInfoInput } from "@/lib/bazi-calculator";

interface Props {
  onChartReady: (chart: BaziChart, input: BirthInfoInput) => void;
}

export default function FreeChartForm({ onChartReady }: Props) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState("");

  const birthDate = birthMonth && birthDay && birthYear
    ? `${birthYear}-${birthMonth}-${birthDay}`
    : "";

  const MONTHS = [
    { value: "", label: t("month_label") },
    { value: "01", label: t("month_jan") },
    { value: "02", label: t("month_feb") },
    { value: "03", label: t("month_mar") },
    { value: "04", label: t("month_apr") },
    { value: "05", label: t("month_may") },
    { value: "06", label: t("month_jun") },
    { value: "07", label: t("month_jul") },
    { value: "08", label: t("month_aug") },
    { value: "09", label: t("month_sep") },
    { value: "10", label: t("month_oct") },
    { value: "11", label: t("month_nov") },
    { value: "12", label: t("month_dec") },
  ];

  const currentYear = new Date().getFullYear();
  const YEARS = Array.from({ length: 101 }, (_, i) => {
    const y = currentYear - i;
    return { value: String(y), label: String(y) };
  });
  YEARS.unshift({ value: "", label: t("year_label") });

  const DAYS = Array.from({ length: 31 }, (_, i) => {
    const d = String(i + 1).padStart(2, "0");
    return { value: d, label: String(i + 1) };
  });
  DAYS.unshift({ value: "", label: t("day_label") });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !gender || !birthDate || !birthCity.trim()) {
      setError(t("chart_error_required"));
      return;
    }
    if (!birthMonth || !birthDay || !birthYear) {
      setError(t("chart_error_date"));
      return;
    }

    const input: BirthInfoInput = {
      birthDate,
      birthTime: birthTime || "unknown",
      birthCity: birthCity.trim(),
      gender,
      longitude,
    };

    const chart = calculateBazi(input);
    onChartReady(chart, input);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* 姓名 + 性别 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#f0e6d3] mb-1.5">
            {t("chart_form_name")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("chart_form_name_placeholder")}
            className="w-full px-4 py-3 rounded-xl border-2 bg-[#1a1a1a] text-[#f0e6d3] placeholder-[#6b6459] focus:outline-none focus:border-[#c8a951] transition-colors border-[#2a2a2a]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#f0e6d3] mb-1.5">
            {t("chart_form_gender")} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled
              className="py-3 rounded-xl border-2 border-[#2a2a2a] bg-[#1a1a1a] text-[#6b6459] text-sm font-medium cursor-not-allowed"
            >
              {t("chart_form_gender_select")}
            </button>
            <button
              type="button"
              onClick={() => setGender("male")}
              className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                gender === "male"
                  ? "border-[#c8a951] bg-[#252525] text-[#f0e6d3]"
                  : "border-[#2a2a2a] bg-[#1a1a1a] text-[#9c9588] hover:border-[#c8a951]/50"
              }`}
            >
              {t("chart_form_gender_male")}
            </button>
            <button
              type="button"
              onClick={() => setGender("female")}
              className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                gender === "female"
                  ? "border-[#c8a951] bg-[#252525] text-[#f0e6d3]"
                  : "border-[#2a2a2a] bg-[#1a1a1a] text-[#9c9588] hover:border-[#c8a951]/50"
              }`}
            >
              {t("chart_form_gender_female")}
            </button>
          </div>
          <p className="text-xs text-[#6b6459] mt-1.5">{t("chart_form_gender_note")}</p>
        </div>
      </div>

      {/* 出生日期 */}
      <div>
        <label className="block text-sm font-semibold text-[#f0e6d3] mb-1.5">
          {t("chart_form_birth_date")} <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={birthMonth}
            onChange={(e) => setBirthMonth(e.target.value)}
            className="px-3 py-3 rounded-xl border-2 bg-white text-stone-900 focus:outline-none focus:border-amber-500 transition-colors text-sm border-[#2a2a2a]"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
            className="px-3 py-3 rounded-xl border-2 bg-white text-stone-900 focus:outline-none focus:border-amber-500 transition-colors text-sm border-[#2a2a2a]"
          >
            {DAYS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          <select
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="px-3 py-3 rounded-xl border-2 bg-white text-stone-900 focus:outline-none focus:border-amber-500 transition-colors text-sm border-[#2a2a2a]"
          >
            {YEARS.map((y) => (
              <option key={y.value} value={y.value}>{y.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 出生时间 + 城市定位 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#f0e6d3] mb-1.5">
            {t("chart_form_birth_time")}
          </label>
          <TimeWheel value={birthTime} onChange={setBirthTime} />
          <p className="text-xs text-[#6b6459] mt-2">{t("chart_form_time_note")}</p>
        </div>

        <LocationPicker
          city={birthCity}
          onCityChange={setBirthCity}
          longitude={longitude}
          onLongitudeChange={setLongitude}
        />
      </div>

      {/* 提交 */}
      <button
        type="submit"
        className="w-full py-4 bg-[#c8a951] text-[#0f0f0f] rounded-xl font-bold text-lg hover:bg-[#d4b96a] transition-all shadow-lg shadow-[#c8a951]/20"
      >
        {t("chart_form_submit")}
      </button>
    </form>
  );
}
