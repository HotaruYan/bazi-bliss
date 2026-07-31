import { create } from "zustand";
import { calculateBazi, calculateDaYun, type BaziChart, type BirthInfoInput, type DaYunResult } from "../engine";
import { analyzeStrength, type StrengthResult } from "../engine";

interface ChartState {
  // 出生信息
  name: string;
  birthDate: string;    // YYYY-MM-DD
  birthTime: string;    // HH:MM
  birthCity: string;
  gender: "male" | "female";

  // 计算结果
  chart: BaziChart | null;
  daYun: DaYunResult | null;
  strength: StrengthResult | null;

  // 动作
  setBirthInfo: (info: Partial<Pick<ChartState, "name" | "birthDate" | "birthTime" | "birthCity" | "gender">>) => void;
  calculate: () => void;
  resetChart: () => void;
}

export const useChartStore = create<ChartState>((set, get) => ({
  name: "",
  birthDate: "2000-01-01",
  birthTime: "12:00",
  birthCity: "Beijing",
  gender: "male",

  chart: null,
  daYun: null,
  strength: null,

  setBirthInfo: (info) => {
    set(info);
  },

  calculate: () => {
    const { birthDate, birthTime, birthCity, gender } = get();
    if (!birthDate || !birthTime) return;

    const input: BirthInfoInput = {
      birthDate,
      birthTime,
      birthCity,
      gender,
    };

    const chart = calculateBazi(input);
    const daYun = calculateDaYun(chart, birthDate, gender);
    const strength = analyzeStrength(chart);

    set({ chart, daYun, strength });
  },

  resetChart: () => {
    set({
      name: "",
      birthDate: "",
      birthTime: "",
      birthCity: "",
      gender: "male",
      chart: null,
      daYun: null,
      strength: null,
    });
  },
}));
