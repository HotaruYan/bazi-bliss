"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <div className="flex h-full">
      {/* 侧边栏 */}
      <aside className="w-56 bg-[#0a0a0a] border-r border-[#2a2a2a] flex flex-col shrink-0">
        <Link href="/admin" className="px-5 py-5 border-b border-[#2a2a2a] block">
          <span className="text-lg font-bold tracking-tight">
            Bazi<span className="text-[#c8a951]">Bliss</span>
          </span>
          <span className="text-xs text-[#6b6459] block mt-0.5">管理后台</span>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <SidebarLink href="/admin" icon={DashboardIcon} label="数据看板" />
          <SidebarLink href="/admin/orders" icon={OrdersIcon} label="订单管理" />
          <SidebarLink href="/" icon={SiteIcon} label="返回前台" external />
        </nav>

        <div className="px-3 py-4 border-t border-[#2a2a2a]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9c9588] hover:text-red-400 hover:bg-[#1a1a1a] transition-colors w-full"
          >
            <LogoutIcon className="w-4 h-4 shrink-0" />
            退出登录
          </button>
        </div>
      </aside>

      {/* 主内容 */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  label,
  external,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  external?: boolean;
}) {
  const Comp = external ? "a" : Link;
  const extraProps = external ? { target: "_blank", rel: "noreferrer" } : {};

  return (
    <Comp
      href={href}
      {...extraProps}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9c9588] hover:text-[#f0e6d3] hover:bg-[#1a1a1a] transition-colors"
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </Comp>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function OrdersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function SiteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
