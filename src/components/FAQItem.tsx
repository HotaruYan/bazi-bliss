"use client";

import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-stone-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-center justify-between text-left hover:text-amber-700 transition-colors"
      >
        <span className="font-medium text-stone-900 pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`faq-answer ${open ? "open" : "closed"}`}
      >
        <p className="pb-5 text-sm text-stone-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}
