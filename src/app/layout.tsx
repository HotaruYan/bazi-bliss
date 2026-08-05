import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import type { Lang } from "@/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bazi Bliss — AI 八字命盘解读",
  description:
    "用AI解锁八字命盘的秘密。获取8000字个性化命盘解读，涵盖事业、感情、财富、健康。免费排盘，深度解读付费。",
  keywords: [
    "bazi", "八字", "命盘", "四柱", "五行", "AI算命", "八字排盘",
    "chinese astrology", "life blueprint", "birth chart", "five elements",
  ],
  openGraph: {
    title: "Bazi Bliss — AI 八字命盘解读",
    description:
      "千年智慧遇见现代AI。免费排盘，探索你的八字命盘蓝图。",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("bazi-lang")?.value;
  const initialLang: Lang = langCookie === "en" ? "en" : "zh";

  return (
    <html
      lang={initialLang === "zh" ? "zh-CN" : "en"}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0f0f0f] text-[#f0e6d3]">
        <ClientLayout initialLang={initialLang}>{children}</ClientLayout>
      </body>
    </html>
  );
}
