"use client";

import { useState, useEffect, useRef } from "react";
import TimeWheel from "./TimeWheel";

type Product = "life-blueprint" | "year-ahead" | "annual-pass";

const PRODUCTS: Record<
  Product,
  { label: string; desc: string; price: string }
> = {
  "life-blueprint": {
    label: "Life Blueprint",
    desc: "8000+ word complete birth chart analysis",
    price: "$39.99",
  },
  "year-ahead": {
    label: "Year Ahead",
    desc: "3000+ word annual forecast & guidance",
    price: "$19.99",
  },
  "annual-pass": {
    label: "Annual Pass",
    desc: "Life Blueprint + Year Ahead + 12 monthly forecasts",
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
  { value: "", label: "Select" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function OrderForm() {
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
  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const MONTHS = [
    { value: "", label: "Month" },
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const YEARS = Array.from({ length: 101 }, (_, i) => {
    const y = currentYear - i;
    return { value: String(y), label: String(y) };
  });
  YEARS.unshift({ value: "", label: "Year" });

  const DAYS = Array.from({ length: 31 }, (_, i) => {
    const d = String(i + 1).padStart(2, "0");
    return { value: d, label: String(i + 1) };
  });
  DAYS.unshift({ value: "", label: "Day" });

  // 月日年变化时自动合成 birthDate
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
    if (productParam && PRODUCTS[productParam]) {
      setForm((prev) => ({ ...prev, product: productParam }));
    }
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};

    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!form.birthDate) newErrors.birthDate = "Birth date is required.";
    if (!form.birthCity.trim()) newErrors.birthCity = "Birth city is required.";
    if (!form.gender) newErrors.gender = "Please select your gender.";

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
        // 订单数据暂存浏览器，付款后 thank-you 页读取并触发发货
        localStorage.setItem("bazi_order", JSON.stringify({
          name: form.name,
          email: form.email,
          birthDate: form.birthDate,
          birthTime: form.birthTime || "unknown",
          birthCity: form.birthCity,
          gender: form.gender,
          focusArea: form.focusArea,
          productId: form.product,
        }));
        window.location.href = data.checkoutUrl;
      } else if (data.error) {
        setErrors({ email: data.error });
      }
    } catch {
      setErrors({ email: "Something went wrong. Please try again." });
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

  const selectedProduct = PRODUCTS[form.product];

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#f0e6d3] mb-3">
            Select Your Reading
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.entries(PRODUCTS) as [Product, typeof PRODUCTS[Product]][]).map(
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
                    {product.label}
                  </div>
                  <div className="text-xs text-[#9c9588] mt-1">
                    {product.desc}
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
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Your full name"
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
              Email Address <span className="text-red-500">*</span>
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
              Birth Date <span className="text-red-500">*</span>
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
              Birth Time
            </label>
            <TimeWheel
              value={form.birthTime}
              onChange={(val) => updateField("birthTime", val)}
            />
            <p className="text-xs text-[#6b6459] mt-2">
              Precise time is used to calculate true solar time. Leave blank if unknown (we'll default to noon).
            </p>
          </div>

          <div>
            <label
              htmlFor="birthCity"
              className="block text-sm font-semibold text-[#f0e6d3] mb-1.5"
            >
              Birth City <span className="text-red-500">*</span>
            </label>
            <input
              id="birthCity"
              type="text"
              value={form.birthCity}
              onChange={(e) => updateField("birthCity", e.target.value)}
              placeholder="e.g. New York, USA"
              className={`w-full px-4 py-3 rounded-xl border-2 bg-[#1a1a1a] text-[#f0e6d3] placeholder-[#6b6459] focus:outline-none focus:border-[#c8a951] transition-colors ${
                errors.birthCity ? "border-red-400" : "border-[#2a2a2a]"
              }`}
            />
            {errors.birthCity && (
              <p className="text-red-500 text-xs mt-1">{errors.birthCity}</p>
            )}
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-[#f0e6d3] mb-1.5">
            Gender <span className="text-red-500">*</span>
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
                {opt.label}
              </button>
            ))}
          </div>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
          <p className="text-xs text-[#6b6459] mt-1.5">
            Gender is essential for accurate Bazi interpretation — the same chart reads differently for men and women
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 bg-[#c8a951] text-[#0f0f0f] rounded-xl font-bold text-lg hover:bg-[#d4b96a] transition-all shadow-lg shadow-[#c8a951]/20"
        >
          Continue to Payment — {selectedProduct.price}
        </button>

        <p className="text-xs text-[#6b6459] text-center">
          Your information is only used to generate your report and will never
          be shared. Your report will be delivered to your email within 24 hours.
        </p>
      </form>
    </>
  );
}
