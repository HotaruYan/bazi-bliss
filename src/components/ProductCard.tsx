"use client";

import { useRouter } from "next/navigation";

interface ProductCardProps {
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  features: string[];
  highlighted?: boolean;
  productId: "life-blueprint" | "year-ahead" | "annual-pass";
}

export default function ProductCard({
  title,
  subtitle,
  price,
  originalPrice,
  features,
  highlighted = false,
  productId,
}: ProductCardProps) {
  const router = useRouter();

  return (
    <div
      className={`relative rounded-2xl border-2 p-8 flex flex-col card-hover ${
        highlighted
          ? "border-amber-500 bg-white shadow-xl shadow-amber-100/50"
          : "border-stone-200 bg-white"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
          Most Popular
        </span>
      )}

      <h3 className="text-xl font-bold text-stone-900 mb-1">{title}</h3>
      <p className="text-sm text-stone-500 mb-4">{subtitle}</p>

      <div className="mb-6">
        <span className="text-4xl font-bold text-stone-900">{price}</span>
        {originalPrice && (
          <span className="ml-2 text-lg text-stone-400 line-through">
            {originalPrice}
          </span>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
            <svg
              className="w-4 h-4 text-amber-600 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={() =>
          router.push(`/order?product=${productId}`)
        }
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
          highlighted
            ? "bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-200"
            : "bg-stone-900 text-white hover:bg-stone-800"
        }`}
      >
        Choose {title}
      </button>
    </div>
  );
}
