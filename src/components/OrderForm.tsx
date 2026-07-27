"use client";

import { useState, useEffect, useRef } from "react";

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
  focusArea: string;
  product: Product;
}

const FOCUS_AREAS = [
  { value: "general", label: "General Life Overview" },
  { value: "career", label: "Career & Purpose" },
  { value: "love", label: "Love & Relationships" },
  { value: "wealth", label: "Wealth & Finances" },
  { value: "health", label: "Health & Wellbeing" },
];

export default function OrderForm() {
  const [form, setForm] = useState<OrderFormData>({
    name: "",
    email: "",
    birthDate: "",
    birthTime: "",
    birthCity: "",
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
          focusArea: form.focusArea,
          productId: form.product,
        }),
      });

      const data = await res.json();

      if (data.checkoutUrl) {
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
          <label className="block text-sm font-semibold text-stone-700 mb-3">
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
                      ? "border-amber-500 bg-amber-50 shadow-md"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <div className="font-bold text-stone-900 text-sm">
                    {product.label}
                  </div>
                  <div className="text-xs text-stone-500 mt-1">
                    {product.desc}
                  </div>
                  <div className="text-amber-700 font-bold text-sm mt-2">
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
              className="block text-sm font-semibold text-stone-700 mb-1.5"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Your full name"
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 transition-colors ${
                errors.name ? "border-red-400" : "border-stone-200"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-stone-700 mb-1.5"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="you@email.com"
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 transition-colors ${
                errors.email ? "border-red-400" : "border-stone-200"
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
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
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
                  errors.birthDate && !birthMonth ? "border-red-400" : "border-stone-200"
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
                  errors.birthDate && !birthDay ? "border-red-400" : "border-stone-200"
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
                  errors.birthDate && !birthYear ? "border-red-400" : "border-stone-200"
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
            <label
              htmlFor="birthTime"
              className="block text-sm font-semibold text-stone-700 mb-1.5"
            >
              Birth Time
            </label>
            <select
              id="birthTime"
              value={form.birthTime}
              onChange={(e) => updateField("birthTime", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="">Unknown (use noon)</option>
              <option value="00:00">12:00 AM — Midnight</option>
              <option value="01:00">1:00 AM</option>
              <option value="02:00">2:00 AM</option>
              <option value="03:00">3:00 AM</option>
              <option value="04:00">4:00 AM</option>
              <option value="05:00">5:00 AM</option>
              <option value="06:00">6:00 AM</option>
              <option value="07:00">7:00 AM</option>
              <option value="08:00">8:00 AM</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM — Noon</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="21:00">9:00 PM</option>
              <option value="22:00">10:00 PM</option>
              <option value="23:00">11:00 PM</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="birthCity"
              className="block text-sm font-semibold text-stone-700 mb-1.5"
            >
              Birth City <span className="text-red-500">*</span>
            </label>
            <input
              id="birthCity"
              type="text"
              value={form.birthCity}
              onChange={(e) => updateField("birthCity", e.target.value)}
              placeholder="e.g. New York, USA"
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 transition-colors ${
                errors.birthCity ? "border-red-400" : "border-stone-200"
              }`}
            />
            {errors.birthCity && (
              <p className="text-red-500 text-xs mt-1">{errors.birthCity}</p>
            )}
          </div>
        </div>

        {/* Focus Area */}
        <div>
          <label
            htmlFor="focusArea"
            className="block text-sm font-semibold text-stone-700 mb-1.5"
          >
            What would you like to focus on?
          </label>
          <select
            id="focusArea"
            value={form.focusArea}
            onChange={(e) => updateField("focusArea", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-amber-500 transition-colors"
          >
            {FOCUS_AREAS.map((area) => (
              <option key={area.value} value={area.value}>
                {area.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 bg-amber-600 text-white rounded-xl font-bold text-lg hover:bg-amber-700 transition-all shadow-lg shadow-amber-200"
        >
          Continue to Payment — {selectedProduct.price}
        </button>

        <p className="text-xs text-stone-400 text-center">
          Your information is only used to generate your report and will never
          be shared. Your report will be delivered to your email within 24 hours.
        </p>
      </form>
    </>
  );
}
