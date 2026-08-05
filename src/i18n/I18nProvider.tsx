"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type Lang, type DictKey, dict } from "./dict";

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: DictKey) => string;
  tTenGod: (cn: string) => string;
  tStem: (stem: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children, initialLang = "zh" }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    document.cookie = `bazi-lang=${newLang};path=/;max-age=31536000;SameSite=Lax`;
    document.documentElement.lang = newLang === "zh" ? "zh-CN" : "en";
  }, []);

  const t = useCallback(
    (key: DictKey): string => {
      const entry = dict[key] as Record<Lang, string> | undefined;
      if (!entry) return key;
      return entry[lang] || entry.en || key;
    },
    [lang]
  );

  const tTenGod = useCallback(
    (cn: string): string => {
      const map = dict.tenGodNames[lang] as Record<string, string>;
      return map?.[cn] || cn;
    },
    [lang]
  );

  const tStem = useCallback(
    (stem: string): string => {
      const map = dict.bagua[lang] as Record<string, string>;
      return map?.[stem] || stem;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tTenGod, tStem }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
