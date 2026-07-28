"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  total: number;
  todayCount: number;
  pending: number;
  fulfilled: number;
}

interface OrderItem {
  orderId: string;
  name: string;
  productId: string;
  status: string;
  createdAt: string;
}

const PRODUCT_LABELS: Record<string, string> = {
  "life-blueprint": "Life Blueprint",
  "year-ahead": "Year Ahead",
  "annual-pass": "Annual Pass",
};

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  pending: { label: "待处理", className: "bg-gray-100 text-gray-600" },
  paid: { label: "已付款", className: "bg-yellow-100 text-yellow-700" },
  fulfilled: { label: "已完成", className: "bg-green-100 text-green-700" },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, todayCount: 0, pending: 0, fulfilled: 0 });
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats);
        setRecentOrders(data.orders.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "总订单", value: stats.total, icon: "📦", color: "border-l-[#c8a951]" },
    { label: "今日订单", value: stats.todayCount, icon: "📅", color: "border-l-blue-500" },
    { label: "待处理", value: stats.pending, icon: "⏳", color: "border-l-yellow-500" },
    { label: "已完成", value: stats.fulfilled, icon: "✅", color: "border-l-green-500" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">数据看板</h1>
        <p className="text-sm text-[#6b6459] mt-1">运营数据概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-[#1a1a1a] border border-[#2a2a2a] border-l-4 ${card.color} rounded-xl p-4`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6b6459]">{card.label}</span>
              <span className="text-xl">{card.icon}</span>
            </div>
            <p className="text-2xl font-bold">
              {loading ? "-" : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* 最近订单 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#9c9588] uppercase tracking-wider">最近订单</h2>
          <Link href="/admin/orders" className="text-xs text-[#c8a951] hover:text-[#d4b96a] transition-colors">
            查看全部 →
          </Link>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-sm text-[#6b6459]">加载中...</div>
          ) : recentOrders.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#6b6459]">暂无订单</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-left text-xs text-[#6b6459] uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">订单 ID</th>
                  <th className="px-4 py-3 font-medium">客户</th>
                  <th className="px-4 py-3 font-medium">产品</th>
                  <th className="px-4 py-3 font-medium">状态</th>
                  <th className="px-4 py-3 font-medium">日期</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const st = STATUS_MAP[order.status] || STATUS_MAP.pending;
                  return (
                    <tr key={order.orderId} className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#252525] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-[#6b6459]">
                        {order.orderId.slice(0, 12)}...
                      </td>
                      <td className="px-4 py-3">{order.name}</td>
                      <td className="px-4 py-3 text-[#9c9588] text-xs">
                        {PRODUCT_LABELS[order.productId] || order.productId}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.className}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#6b6459] text-xs">
                        {order.createdAt.slice(0, 10)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
