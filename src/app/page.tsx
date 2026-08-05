"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import ProductCards from "@/components/ProductCards";
import FAQItem from "@/components/FAQItem";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0f0f0f]">
        {/* 太极背景 */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.04]"
            viewBox="0 0 200 200" fill="none"
          >
            <circle cx="100" cy="100" r="98" stroke="#c8a951" strokeWidth="2" />
            <path d="M100 2 A98 98 0 0 1 100 198 A49 49 0 0 1 100 100 A49 49 0 0 0 100 2Z" fill="#c8a951" />
            <circle cx="100" cy="51" r="16" fill="#0f0f0f" />
            <circle cx="100" cy="149" r="16" fill="#c8a951" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#c8a951]/8 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 py-24 md:py-36 text-center z-10">
          <p className="text-[#c8a951] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            {t("home_badge")}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6 text-[#f0e6d3]">
            {t("home_title")}{" "}
            <span className="text-gold">{t("home_title_highlight")}</span>
          </h1>
          <p className="text-lg md:text-xl text-[#9c9588] max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("home_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/chart"
              className="px-8 py-4 btn-gold rounded-xl text-lg shadow-xl shadow-[#c8a951]/20"
            >
              {t("home_cta_free")}
            </Link>
            <Link
              href="/order"
              className="px-8 py-4 bg-white/5 text-[#f0e6d3] rounded-xl font-semibold text-lg hover:bg-white/10 transition-all border border-[#2a2a2a]"
            >
              {t("home_cta_order")}
            </Link>
          </div>
          <p className="mt-6 text-xs text-[#9c9588]">{t("home_delivery_note")}</p>
        </div>
      </section>

      {/* 价值主张 */}
      <section className="py-20 md:py-28 bg-[#0f0f0f]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f0e6d3] mb-4">
              Why People Are Discovering Their Bazi
            </h2>
            <p className="text-[#9c9588] max-w-xl mx-auto">
              A 1,000-year-old system, now powered by AI to give you clarity in a chaotic world.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
                title: t("home_vp1_title"),
                desc: t("home_vp1_desc"),
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: t("home_vp2_title"),
                desc: t("home_vp2_desc"),
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: t("home_vp3_title"),
                desc: t("home_vp3_desc"),
              },
            ].map((vp, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#1a1a1a] text-[#c8a951] flex items-center justify-center border border-[#2a2a2a]">
                  {vp.icon}
                </div>
                <h3 className="text-lg font-bold text-[#f0e6d3] mb-2">{vp.title}</h3>
                <p className="text-sm text-[#9c9588] leading-relaxed">{vp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 三步使用 */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#f0e6d3] text-center mb-12">
            {t("home_how_title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: t("home_how_step1_title"), desc: t("home_how_step1_desc") },
              { step: "2", title: t("home_how_step2_title"), desc: t("home_how_step2_desc") },
              { step: "3", title: t("home_how_step3_title"), desc: t("home_how_step3_desc") },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#c8a951] text-[#0f0f0f] font-bold text-lg flex items-center justify-center">
                  {item.step}
                </div>
                <h3 className="font-bold text-[#f0e6d3] mb-2">{item.title}</h3>
                <p className="text-sm text-[#9c9588]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 产品卡片 */}
      <section className="py-20 md:py-28 bg-[#0f0f0f]" id="pricing">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f0e6d3] mb-4">
              {t("pricing_title")}
            </h2>
            <p className="text-[#9c9588] max-w-xl mx-auto">{t("pricing_desc")}</p>
          </div>
          <ProductCards />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#0f0f0f]">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#f0e6d3] text-center mb-12">
            {t("home_faq_title")}
          </h2>
          <div>
            <FAQItem question={t("home_faq1_q")} answer={t("home_faq1_a")} />
            <FAQItem question={t("home_faq2_q")} answer={t("home_faq2_a")} />
            <FAQItem question={t("home_faq3_q")} answer={t("home_faq3_a")} />
            <FAQItem question={t("home_faq4_q")} answer={t("home_faq4_a")} />
          </div>
          <div className="text-center mt-8">
            <Link href="/faq" className="text-[#c8a951] font-medium text-sm hover:text-[#d4b96a] transition-colors">
              {t("home_faq_view_all")}
            </Link>
          </div>
        </div>
      </section>

      {/* 最终CTA */}
      <section className="py-20 bg-[#0a0a0a] text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.03]"
            viewBox="0 0 200 200" fill="none"
          >
            <circle cx="100" cy="100" r="98" stroke="#c8a951" strokeWidth="2" />
            <path d="M100 2 A98 98 0 0 1 100 198 A49 49 0 0 1 100 100 A49 49 0 0 0 100 2Z" fill="#c8a951" />
            <circle cx="100" cy="51" r="16" fill="#0a0a0a" />
            <circle cx="100" cy="149" r="16" fill="#c8a951" />
          </svg>
        </div>
        <div className="max-w-2xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#f0e6d3]">
            {t("cta_title")}
          </h2>
          <p className="text-[#9c9588] mb-8 text-lg">{t("cta_subtitle")}</p>
          <Link
            href="/chart"
            className="inline-block px-8 py-4 btn-gold rounded-xl text-lg shadow-xl shadow-[#c8a951]/20"
          >
            {t("cta_btn")}
          </Link>
        </div>
      </section>
    </>
  );
}
