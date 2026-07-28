import { Geist, Geist_Mono } from "next/font/google";
import { AdminShell } from "./admin-shell";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: { template: "%s — Bazi Bliss Admin", default: "Admin — Bazi Bliss" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="h-full bg-[#0f0f0f] text-[#f0e6d3] antialiased">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
