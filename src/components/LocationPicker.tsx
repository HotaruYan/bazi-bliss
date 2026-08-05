"use client";

import { useState, useCallback, useRef } from "react";
import { useI18n } from "@/i18n";
import { searchPlace } from "@/lib/geocode";

interface Props {
  city: string;
  onCityChange: (city: string) => void;
  longitude: number | null;
  onLongitudeChange: (lng: number | null) => void;
  error?: string;
}

export default function LocationPicker({ city, onCityChange, longitude, onLongitudeChange, error }: Props) {
  const { t } = useI18n();
  const [showManualLng, setShowManualLng] = useState(false);
  const [manualLngStr, setManualLngStr] = useState("");
  const [geoStatus, setGeoStatus] = useState<"idle" | "searching" | "found" | "not_found" | "error">("idle");
  const [geoSource, setGeoSource] = useState<string>("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── 地名搜索（防抖） ──
  const handleCityInput = useCallback(
    (value: string) => {
      onCityChange(value);
      setGeoSource("");
      onLongitudeChange(null); // 重置经度，等待重新检测
      setGeoStatus("idle");

      // 清除上次的定时器
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

      if (!value.trim()) return;

      // 防抖 500ms 后搜索
      searchTimerRef.current = setTimeout(async () => {
        setGeoStatus("searching");
        const result = await searchPlace(value.trim());
        if (result) {
          onLongitudeChange(result.longitude);
          setGeoSource(result.source === "dictionary" ? "内置城市库" : "OpenStreetMap");
          setGeoStatus("found");

          // 如果是 Nominatim 返回的详细地址，自动提取城市名填入
          if (result.source === "nominatim" && result.displayName.length > value.length) {
            // 取地址前几级，作为更好的城市名
            const shortName = result.displayName.split(",").slice(0, 3).join(",");
            if (shortName !== value) {
              onCityChange(shortName);
            }
          }
        } else {
          setGeoStatus("not_found");
          setGeoSource("");
          onLongitudeChange(null);
        }
      }, 500);
    },
    [onCityChange, onLongitudeChange]
  );

  const handleManualLng = (val: string) => {
    setManualLngStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= -180 && num <= 180) {
      onLongitudeChange(num);
    }
  };

  return (
    <div>
      {/* 城市输入 */}
      <label className="block text-sm font-semibold text-[#f0e6d3] mb-1.5">
        {t("chart_form_birth_city")} <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={city}
        onChange={(e) => handleCityInput(e.target.value)}
        placeholder={t("chart_form_birth_city_placeholder")}
        className={`w-full px-4 py-3 rounded-xl border-2 bg-[#1a1a1a] text-[#f0e6d3] placeholder-[#6b6459] focus:outline-none focus:border-[#c8a951] transition-colors ${
          error ? "border-red-400" : "border-[#2a2a2a]"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {/* 搜索状态 */}
      <div className="mt-2 space-y-1">
        {/* 地名搜索成功 */}
        {geoStatus === "found" && longitude !== null && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#7cb342]">
              📍 经度：{longitude.toFixed(2)}°E（{geoSource}）
            </span>
            <button
              type="button"
              onClick={() => { setShowManualLng(!showManualLng); setManualLngStr(showManualLng ? "" : String(longitude)); }}
              className="text-xs text-[#c8a951] hover:text-[#d4b96a] underline"
            >
              {showManualLng ? "取消修改" : "手动修改"}
            </button>
          </div>
        )}

        {/* 搜索中 */}
        {geoStatus === "searching" && (
          <span className="text-xs text-[#6b6459]">🔍 正在查找经纬度...</span>
        )}

        {/* 未找到 */}
        {geoStatus === "not_found" && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#ff9800]">⚠️ 未识别该城市，请尝试输入完整名称（如"石家庄"而非"石家庄市"）或手动输入经度</span>
            <button
              type="button"
              onClick={() => setShowManualLng(!showManualLng)}
              className="text-xs text-[#c8a951] hover:text-[#d4b96a] underline"
            >
              {showManualLng ? "取消" : "输入经度"}
            </button>
          </div>
        )}

        {/* 定位失败 */}
        {geoStatus === "error" && geoSource && (
          <span className="text-xs text-[#ff9800]">⚠️ {geoSource}，请手动输入城市或经度</span>
        )}

        {/* 手动输入经度 */}
        {showManualLng && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              min="-180"
              max="180"
              value={manualLngStr}
              onChange={(e) => handleManualLng(e.target.value)}
              placeholder="116.4"
              className="w-28 px-3 py-1.5 rounded-lg border-2 bg-[#0f0f0f] text-[#f0e6d3] text-sm placeholder-[#6b6459] focus:outline-none focus:border-[#c8a951] border-[#2a2a2a]"
            />
            <span className="text-xs text-[#6b6459]">°E（东经为正，西经为负）</span>
          </div>
        )}
      </div>

      {/* 真太阳时提示 */}
      {longitude !== null && (
        <p className="text-xs text-[#6b6459] mt-1">
          真太阳时修正：北京时间基准 120°E，当前偏移 {(longitude - 120) * 4 > 0 ? "+" : ""}{Math.round((longitude - 120) * 4)} 分钟
        </p>
      )}
    </div>
  );
}
