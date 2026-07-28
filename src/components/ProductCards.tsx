"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

const products = [
  {
    title: "Life Blueprint",
    subtitle: "Complete birth chart analysis",
    price: "$39.99",
    features: [
      "8000+ word personalized PDF report",
      "5 dimensions: Personality, Career, Wealth, Love & Health",
      "Your 10-year luck cycles explained",
      "Element balance & energy type analysis",
      "Delivered within 24 hours",
    ],
    productId: "life-blueprint" as const,
  },
  {
    title: "Year Ahead",
    subtitle: "Annual forecast & guidance",
    price: "$19.99",
    features: [
      "3000+ word yearly forecast report",
      "Month-by-month energy breakdown",
      "Key opportunity windows identified",
      "Challenge periods with coping strategies",
      "Delivered within 24 hours",
    ],
    productId: "year-ahead" as const,
  },
  {
    title: "Annual Pass",
    subtitle: "Year-round guidance",
    price: "$99.99",
    originalPrice: "$139.97",
    features: [
      "Everything in Life Blueprint",
      "Everything in Year Ahead",
      "Monthly email forecasts for 12 months",
      "Priority email support",
      "One free follow-up question",
    ],
    productId: "annual-pass" as const,
  },
];

export default function ProductCards() {
  const [selected, setSelected] = useState<string>("life-blueprint");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      {products.map((product) => (
        <div
          key={product.productId}
          onClick={() => setSelected(product.productId)}
          className="cursor-pointer"
        >
          <ProductCard
            {...product}
            highlighted={selected === product.productId}
          />
        </div>
      ))}
    </div>
  );
}
