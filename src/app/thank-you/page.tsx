"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type FulfillStatus = "loading" | "success" | "error" | "idle";

export default function ThankYouPage() {
  const [status, setStatus] = useState<FulfillStatus>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("bazi_order");
    if (!raw) {
      setStatus("idle");
      return;
    }

    // 清理 localStorage，避免重复提交
    localStorage.removeItem("bazi_order");

    let orderData;
    try {
      orderData = JSON.parse(raw);
    } catch {
      setStatus("idle");
      return;
    }

    setStatus("loading");

    fetch("/api/fulfill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage("Your report is being generated and will arrive in your inbox shortly!");
        } else {
          setStatus("error");
          setMessage(data.error || "Something went wrong.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error. Don't worry — we'll process your order manually.");
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-[#c8a951]/30">
          {status === "loading" ? (
            <svg className="w-10 h-10 animate-spin text-[#c8a951]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : status === "error" ? (
            <svg className="w-10 h-10 text-[#f0a0a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-10 h-10 text-[#c8a951]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[#f0e6d3] mb-4">
          {status === "loading" ? "Crafting Your Report..." : "Thank You For Your Order!"}
        </h1>

        {status === "loading" && (
          <p className="text-[#9c9588] text-lg mb-8">
            Your personalized Bazi report is being generated now. Please don't close this page.
          </p>
        )}

        {status === "success" && (
          <p className="text-[#9c9588] text-lg mb-8 max-w-md mx-auto leading-relaxed">
            {message}
          </p>
        )}

        {status === "error" && (
          <p className="text-red-400 text-lg mb-8">{message}</p>
        )}

        {status === "idle" && (
          <p className="text-[#9c9588] text-lg mb-8 max-w-md mx-auto leading-relaxed">
            Your order has been received. Your personalized Bazi report will be delivered to your email within 24 hours.
          </p>
        )}

        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6 md:p-8 mb-8 text-left max-w-md mx-auto">
          <h3 className="font-bold text-[#f0e6d3] mb-4">What happens next?</h3>
          <ol className="space-y-3 text-sm text-[#9c9588]">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#252525] text-[#c8a951] flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <span>We calculate your Bazi birth chart using classical methods.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#252525] text-[#c8a951] flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <span>Our AI generates your comprehensive, personalized report.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#252525] text-[#c8a951] flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <span>Your report arrives in your inbox — usually within minutes!</span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/blog" className="px-6 py-3 bg-[#1a1a1a] text-[#f0e6d3] rounded-xl font-medium hover:bg-[#252525] transition-colors border border-[#2a2a2a]">
            Read Our Blog
          </Link>
          <Link href="/" className="px-6 py-3 bg-[#c8a951] text-[#0f0f0f] rounded-xl font-medium hover:bg-[#d4b96a] transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
