"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/i18n";
import TimeWheel from "./TimeWheel";
import LocationPicker from "./LocationPicker";

type Product = "life-blueprint" | "year-ahead" | "annual-pass";

const PRODUCT_KEYS: Record<Product, {
  labelKey: "product_life_blueprint" | "product_year_ahead" | "product_annual_pass";
  descKey: "product_life_blueprint_desc" | "product_year_ahead_desc" | "product_annual_pass_desc";
  price: string;
}> = {
  "life-blueprint": {
    labelKey: "product_life_blueprint",
    descKey: "product_life_blueprint_desc",
    price: "$39.99",
  },
  "year-ahead": {
    labelKey: "product_year_ahead",
    descKey: "product_year_ahead_desc",
    price: "$19.99",
  },
  "annual-pass": {
    labelKey: "product_annual_pass",
    descKey: "product_annual_pass_desc",
    price: "$99.99",
  },
};

interface OrderFormData {
  name: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  gender: string;
  focusArea: string;
  product: Product;
}

const GENDER_OPTIONS = [
  { value: "", labelKey: "chart_form_gender_select" as const },
  { value: "male", labelKey: "chart_form_gender_male" as const },
  { value: "female", labelKey: "chart_form_gender_female" as const },
];

export default function OrderForm() {
  const { t } = useI18n();

  const [form, setForm] = useState<OrderFormData>({
    name: "",
    email: "",
    birthDate: "",
    birthTime: "",
    birthCity: "",
    gender: "",
    focusArea: "general",
    product: "life-blueprint",
  });
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [longitude, setLongitude] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  const updateBirthDate = (month: string, day: string, year: string) => {
    if (month && day && year) {
      setForm((prev) => ({ ...prev, birthDate: `${year}-${month}-${day}` }));
    } else {
      setForm((prev) => ({ ...prev, birthDate: "" }));
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productParam = params.get("product") as Product;
    if (productParam && PRODUCT_KEYS[productParam]) {
      setForm((prev) => ({ ...prev, product: productParam }));
    }
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};

    if (!form.name.trim()) newErrors.name = t("order_name_req");
    if (!form.email.trim()) {
      newErrors.email = t("order_email_req");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t("order_email_invalid");
    }
    if (!form.birthDate) newErrors.birthDate = t("order_date_req");
    if (!form.birthCity.trim()) newErrors.birthCity = t("order_city_req");
    if (!form.gender) newErrors.gender = t("order_gender_req");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          birthDate: form.birthDate,
          birthTime: form.birthTime || "unknown",
          birthCity: form.birthCity,
          gender: form.gender,
          focusArea: form.focusArea,
          productId: form.product,
        }),
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        localStorage.setItem("bazi_order", JSON.stringify({
          name: form.name,
          email: form.email,
          birthDate: form.birthDate,
          birthTime: form.birthTime || "unknown",
          birthCity: form.birthCity,
          gender: form.gender,
          focusArea: form.focusArea,
          productId: form.product,
          longitude,
        }));
        window.location.href = data.checkoutUrl;
      } else if (data.error) {
        setErrors({ email: data.error });
      }
    } catch {
      setErrors({ email: t("order_error") });
    }
  };

  const updateField = (field: keyof OrderFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const selectedProduct = PRODUCT_KEYS[form.product];

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#f0e6d3] mb-3">
            {t("order_select")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.entries(PRODUCT_KEYS) as [Product, typeof PRODUCT_KEYS[Product]][]).map(
              ([key, product]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => updateField("product", key)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.product === key
                      ? "border-[#c8a951] bg-[#252525] shadow-md"
                      : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#c8a951]/50"
                  }`}
                >
                  <div className="font-bold text-[#f0e6d3] text-sm">
                    {t(product.labelKey)}
                  </div>
                  <div className="text-xs text-[#9c9588] mt-1">
                    {t(product.descKey)}
                  </div>
                  <div className="text-[#c8a951] font-bold text-sm mt-2">
                    {product.price}
                  </div>
                </button>
              )
            )}
          </div>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-[#f0e6d3] mb-1.5"
            >
              {t("chart_form_name")} <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder={t("chart_form_name_placeholder")}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-[#1a1a1a] text-[#f0e6d3] placeholder-[#6b6459] focus:outline-none focus:border-[#c8a951] transition-colors ${
                errors.name ? "border-red-400" : "border-[#2a2a2a]"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#f0e6d3] mb-1.5"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="you@email.com"
              className={`w-full px-4 py-3 rounded-xl border-2 bg-[#1a1a1a] text-[#f0e6d3] placeholder-[#6b6459] focus:outline-none focus:border-[#c8a951] transition-colors ${
                errors.email ? "border-red-400" : "border-[#2a2a2a]"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Birth Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#f0e6d3] mb-1.5">
              {t("chart_form_birth_date")} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={birthMonth}
                onChange={(e) => {
                  setBirthMonth(e.target.value);
                  updateBirthDate(e.target.value, birthDay, birthYear);
                  setErrors((prev) => { const n = { ...prev }; delete n.birthDate; return n; });
                }}
                className={`px-3 py-3 rounded-xl border-2 bg-white text-stone-900 focus:outline-none focus:border-amber-500 transition-colors text-sm ${
                  errors.birthDate && !birthMonth ? "border-red-400" : "border-[#2a2a2a]"
                }`}
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <select
                value={birthDay}
                onChange={(e) => {
                  setBirthDay(e.target.value);
                  updateBirthDate(birthMonth, e.target.value, birthYear);
                  setErrors((prev) => { const n = { ...prev }; delete n.birthDate; return n; });
                }}
                className={`px-3 py-3 rounded-xl border-2 bg-white text-stone-900 focus:outline-none focus:border-amber-500 transition-colors text-sm ${
                  errors.birthDate && !birthDay ? "border-red-400" : "border-[#2a2a2a]"
                }`}
              >
                {DAYS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <select
                value={birthYear}
                onChange={(e) => {
                  setBirthYear(e.target.value);
                  updateBirthDate(birthMonth, birthDay, e.target.value);
                  setErrors((prev) => { const n = { ...prev }; delete n.birthDate; return n; });
                }}
                className={`px-3 py-3 rounded-xl border-2 bg-white text-stone-900 focus:outline-none focus:border-amber-500 transition-colors text-sm ${
                  errors.birthDate && !birthYear ? "border-red-400" : "border-[#2a2a2a]"
                }`}
              >
                {YEARS.map((y) => (
                  <option key={y.value} value={y.value}>{y.label}</option>
                ))}
              </select>
            </div>
            {errors.birthDate && (
              <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#f0e6d3] mb-1.5">
              {t("chart_form_birth_time")}
            </label>
            <TimeWheel
              value={form.birthTime}
              onChange={(val) => updateField("birthTime", val)}
            />
            <p className="text-xs text-[#6b6459] mt-2">{t("chart_form_time_note")}</p>
          </div>

          <LocationPicker
            city={form.birthCity}
            onCityChange={(val) => updateField("birthCity", val)}
            longitude={longitude}
            onLongitudeChange={setLongitude}
            error={errors.birthCity}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-[#f0e6d3] mb-1.5">
            {t("chart_form_gender")} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {GENDER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={!opt.value}
                onClick={() => { if (opt.value) updateField("gender", opt.value); }}
                className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  form.gender === opt.value
                    ? "border-[#c8a951] bg-[#252525] text-[#f0e6d3]"
                    : opt.value
                      ? "border-[#2a2a2a] bg-[#1a1a1a] text-[#9c9588] hover:border-[#c8a951]/50"
                      : "border-[#2a2a2a] bg-[#1a1a1a] text-[#6b6459] cursor-not-allowed"
                }`}
              >
                {t(opt.labelKey)}
              </button>
            ))}
          </div>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
          <p className="text-xs text-[#6b6459] mt-1.5">{t("chart_form_gender_note")}</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 bg-[#c8a951] text-[#0f0f0f] rounded-xl font-bold text-lg hover:bg-[#d4b96a] transition-all shadow-lg shadow-[#c8a951]/20"
        >
          {t("order_submit")}{selectedProduct.price}
        </button>

        <p className="text-xs text-[#6b6459] text-center">{t("order_privacy")}</p>
      </form>
    </>
  );
}
