"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { I18nProvider, useI18n, LanguageSwitcher, type Lang } from "@/i18n";

function Header() {
  const { t } = useI18n();
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href ? "text-[#c8a951]" : "text-[#9c9588] hover:text-[#c8a951]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#0f0f0f]/85 backdrop-blur-md border-b border-[#2a2a2a]">
      <nav className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-[#f0e6d3] hover:text-[#c8a951] transition-colors"
        >
          Bazi<span className="text-[#c8a951]">Bliss</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className={linkClass("/")}>
            {t("nav_home")}
          </Link>
          <Link href="/chart" className={linkClass("/chart")}>
            {t("nav_chart")}
          </Link>
          <Link href="/order" className={linkClass("/order")}>
            {t("nav_order")}
          </Link>
          <Link href="/about" className={linkClass("/about")}>
            {t("nav_about")}
          </Link>
          <Link href="/blog" className={linkClass("/blog")}>
            {t("nav_blog")}
          </Link>
          <Link href="/faq" className={linkClass("/faq")}>
            {t("nav_faq")}
          </Link>
          <LanguageSwitcher />
          <Link
            href="/chart"
            className="px-4 py-2 bg-[#c8a951] text-[#0f0f0f] rounded-lg hover:bg-[#d4b96a] transition-colors text-sm font-semibold"
          >
            {t("nav_cta")}
          </Link>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/chart"
            className="px-3 py-1.5 bg-[#c8a951] text-[#0f0f0f] rounded-lg text-sm font-semibold"
          >
            {t("nav_cta")}
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-[#0a0a0a] text-[#9c9588] py-16 border-t border-[#2a2a2a]">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-[#f0e6d3] font-bold text-lg mb-3">
            Bazi<span className="text-[#c8a951]">Bliss</span>
          </h3>
          <p className="text-sm leading-relaxed">{t("footer_tagline")}</p>
        </div>
        <div>
          <h4 className="text-[#f0e6d3] font-semibold mb-3 text-sm uppercase tracking-wider">
            {t("footer_pages")}
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-[#c8a951] transition-colors">{t("nav_home")}</Link></li>
            <li><Link href="/chart" className="hover:text-[#c8a951] transition-colors">{t("nav_chart")}</Link></li>
            <li><Link href="/order" className="hover:text-[#c8a951] transition-colors">{t("nav_order")}</Link></li>
            <li><Link href="/about" className="hover:text-[#c8a951] transition-colors">{t("nav_about")}</Link></li>
            <li><Link href="/blog" className="hover:text-[#c8a951] transition-colors">{t("nav_blog")}</Link></li>
            <li><Link href="/faq" className="hover:text-[#c8a951] transition-colors">{t("nav_faq")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[#f0e6d3] font-semibold mb-3 text-sm uppercase tracking-wider">
            {t("footer_disclaimer_title")}
          </h4>
          <p className="text-xs leading-relaxed">{t("footer_disclaimer")}</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 mt-10 pt-6 border-t border-[#2a2a2a] text-center text-xs">
        &copy; {new Date().getFullYear()} Bazi Bliss. {t("footer_copyright")}
      </div>
    </footer>
  );
}

export default function ClientLayout({ children, initialLang }: { children: React.ReactNode; initialLang: Lang }) {
  return (
    <I18nProvider initialLang={initialLang}>
      <div className="min-h-full flex flex-col bg-[#0f0f0f] text-[#f0e6d3]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
