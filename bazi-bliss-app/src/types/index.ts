// 共享类型定义

export type { BaziChart, Pillar, BirthInfoInput, DaYunResult, DaYunCycle, LiuNianInfo, LiuYuePillar } from "../engine";

// 用户出生信息
export interface BirthProfile {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;   // 0-23
  minute: number;  // 0-59
  gender: "male" | "female";
  city: string;
  timezone: string;
}

// IAP 产品
export type Entitlement = "life_blueprint" | "year_ahead" | "annual_pass";

export interface ProductInfo {
  id: Entitlement;
  price: string;
  currencyCode: string;
}

// 报告
export interface AIReport {
  id: string;
  type: Entitlement;
  title: string;
  content: string;
  createdAt: string;
  birthProfile: BirthProfile;
}
