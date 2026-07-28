import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Bazi Bliss — Discover Your Life Blueprint with Ancient Chinese Wisdom",
  description:
    "Unlock the secrets of your birth chart with AI-powered Bazi analysis. Get a personalized 8000-word Life Blueprint covering career, love, wealth, and health.",
  keywords: [
    "bazi",
    "chinese astrology",
    "life blueprint",
    "birth chart",
    "five elements",
    "chinese zodiac",
    "fortune telling",
    "destiny analysis",
  ],
  openGraph: {
    title: "Bazi Bliss — Your Life Blueprint",
    description:
      "Ancient Chinese wisdom meets AI. Discover what your birth date reveals about your destiny.",
    type: "website",
  },
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/order", label: "Get Your Blueprint" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0f0f0f] text-[#f0e6d3]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0f0f0f]/85 backdrop-blur-md border-b border-[#2a2a2a]">
          <nav className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-[#f0e6d3] hover:text-[#c8a951] transition-colors"
            >
              Bazi<span className="text-[#c8a951]">Bliss</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#9c9588] hover:text-[#c8a951] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/order"
                className="px-4 py-2 bg-[#c8a951] text-[#0f0f0f] rounded-lg hover:bg-[#d4b96a] transition-colors text-sm font-semibold"
              >
                Order Now
              </Link>
            </div>
            <Link
              href="/order"
              className="md:hidden px-3 py-1.5 bg-[#c8a951] text-[#0f0f0f] rounded-lg text-sm font-semibold"
            >
              Order
            </Link>
          </nav>
        </header>

        {/* Main */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-[#0a0a0a] text-[#9c9588] py-16 border-t border-[#2a2a2a]">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-[#f0e6d3] font-bold text-lg mb-3">
                Bazi<span className="text-[#c8a951]">Bliss</span>
              </h3>
              <p className="text-sm leading-relaxed">
                Ancient Chinese wisdom meets modern AI. Discover your life
                blueprint through the art of Bazi astrology.
              </p>
            </div>
            <div>
              <h4 className="text-[#f0e6d3] font-semibold mb-3 text-sm uppercase tracking-wider">
                Pages
              </h4>
              <ul className="space-y-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-[#c8a951] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[#f0e6d3] font-semibold mb-3 text-sm uppercase tracking-wider">
                Disclaimer
              </h4>
              <p className="text-xs leading-relaxed">
                Bazi Bliss provides content for entertainment and
                self-reflection purposes only. It is not a substitute for
                professional medical, legal, or financial advice. Your birth
                chart shows tendencies, not destiny — you always have free will.
              </p>
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-4 mt-10 pt-6 border-t border-[#2a2a2a] text-center text-xs">
            &copy; {new Date().getFullYear()} Bazi Bliss. All rights reserved.
            For entertainment purposes only.
          </div>
        </footer>
      </body>
    </html>
  );
}
