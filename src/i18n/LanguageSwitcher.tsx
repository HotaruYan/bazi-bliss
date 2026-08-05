"use client";

import { useI18n } from "./I18nProvider";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <button
      onClick={() => setLang(lang === "zh" ? "en" : "zh")}
      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] text-[#9c9588] hover:text-[#c8a951] hover:border-[#c8a951]/50 transition-all"
      aria-label={lang === "zh" ? "Switch to English" : "切换到中文"}
      title={lang === "zh" ? "Switch to English" : "切换到中文"}
    >
      {lang === "zh" ? "EN" : "中"}
    </button>
  );
}
