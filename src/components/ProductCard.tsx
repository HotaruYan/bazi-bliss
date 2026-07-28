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
      className={`relative rounded-2xl border-2 p-8 flex flex-col transition-all duration-300 h-full ${
        highlighted
          ? "border-[#c8a951] bg-[#1a1a1a] shadow-xl shadow-[#c8a951]/10"
          : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#c8a951] hover:shadow-xl hover:shadow-[#c8a951]/10"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#c8a951] text-[#0f0f0f] text-xs font-bold rounded-full uppercase tracking-wider">
          Most Popular
        </span>
      )}

      <h3 className="text-xl font-bold text-[#f0e6d3] mb-1">{title}</h3>
      <p className="text-sm text-[#9c9588] mb-4">{subtitle}</p>

      <div className="mb-6">
        <span className="text-4xl font-bold text-[#f0e6d3]">{price}</span>
        {originalPrice && (
          <span className="ml-2 text-lg text-[#5c5548] line-through">
            {originalPrice}
          </span>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#9c9588]">
            <svg
              className="w-4 h-4 text-[#c8a951] mt-0.5 shrink-0"
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
            ? "bg-[#c8a951] text-[#0f0f0f] hover:bg-[#d4b96a] shadow-lg shadow-[#c8a951]/20"
            : "bg-[#252525] text-[#f0e6d3] hover:bg-[#2a2a2a]"
        }`}
      >
        Choose {title}
      </button>
    </div>
  );
}
