/**
 * 地理编码工具
 *
 * 四级策略：
 *   1. 内置中国城市库 (china-cities.ts, 340+ 城市) → 毫秒级
 *   2. 内置国际城市库 (world-cities.ts, 160+ 城市) → 毫秒级
 *   3. OpenStreetMap Nominatim → 地名搜索 → 最终回退
 */

import { lookupCity } from "./china-cities";
import { lookupWorldCity } from "./world-cities";

export interface GeoResult {
  longitude: number;
  latitude: number;
  displayName: string;  // 格式化地名
  source: "browser" | "nominatim" | "dictionary";
}

// ── Level 1: 浏览器定位 ──

export function getBrowserLocation(): Promise<{ longitude: number; latitude: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      reject(new Error("浏览器不支持定位"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          longitude: pos.coords.longitude,
          latitude: pos.coords.latitude,
        });
      },
      (err) => {
        reject(new Error(getGeolocationErrorMessage(err)));
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
    );
  });
}

function getGeolocationErrorMessage(err: GeolocationPositionError): string {
  switch (err.code) {
    case err.PERMISSION_DENIED: return "定位权限被拒绝";
    case err.POSITION_UNAVAILABLE: return "无法获取位置信息";
    case err.TIMEOUT: return "定位超时";
    default: return "定位失败";
  }
}

// ── Level 2: Nominatim 地名搜索 ──

interface NominatimResult {
  lon: string;
  lat: string;
  display_name: string;
}

export async function searchPlace(query: string): Promise<GeoResult | null> {
  // 1. 先查中国城市库（340+ 城市）
  const cnCity = lookupCity(query);
  if (cnCity) {
    return {
      longitude: cnCity.lng,
      latitude: cnCity.lat,
      displayName: cnCity.province ? `${cnCity.name}，${cnCity.province}` : cnCity.name,
      source: "dictionary",
    };
  }

  // 2. 再查国际城市库（160+ 城市）
  const worldCity = lookupWorldCity(query);
  if (worldCity) {
    return {
      longitude: worldCity.lng,
      latitude: worldCity.lat,
      displayName: worldCity.province ? `${worldCity.name}，${worldCity.province}` : worldCity.name,
      source: "dictionary",
    };
  }

  // 3. 回退到 Nominatim API
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=zh`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "BaziBliss/1.0 (bazibliss.com)",
        "Accept-Language": "zh,en",
      },
    });

    if (!res.ok) return null;

    const data: NominatimResult[] = await res.json();
    if (!data || data.length === 0) return null;

    return {
      longitude: parseFloat(data[0].lon),
      latitude: parseFloat(data[0].lat),
      displayName: data[0].display_name,
      source: "nominatim",
    };
  } catch {
    return null;
  }
}

// ── Level 3: 反向地理编码（经纬度 → 地名） ──

export async function reverseGeocode(longitude: number, latitude: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=zh`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "BaziBliss/1.0 (bazibliss.com)",
        "Accept-Language": "zh,en",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.display_name || null;
  } catch {
    return null;
  }
}
