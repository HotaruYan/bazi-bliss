"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  orderId: string;
  name: string;
  email: string;
  productId: string;
  status: string;
  createdAt: string;
}

const PRODUCT_LABELS: Record<string, string> = {
  "life-blueprint": "Life Blueprint",
  "year-ahead": "Year Ahead",
  "annual-pass": "Annual Pass",
};

const PRODUCT_PRICES: Record<string, string> = {
  "life-blueprint": "$39.99",
  "year-ahead": "$19.99",
  "annual-pass": "$99.99",
};

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  pending: { label: "待处理", className: "bg-gray-100 text-gray-600" },
  paid: { label: "已付款", className: "bg-yellow-100 text-yellow-700" },
  fulfilled: { label: "已完成", className: "bg-green-100 text-green-700" },
};

const STATUS_TABS = [
  { value: "all", label: "全部" },
  { value: "paid", label: "已付款" },
  { value: "pending", label: "待处理" },
  { value: "fulfilled", label: "已完成" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (search) params.set("search", search);

    fetch(`/api/admin/orders?${params}`)
      .then((r) => r.json())
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, [statusFilter, search]);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">订单管理</h1>
          <p className="text-sm text-[#6b6459] mt-1">
            共 {orders.length} 条订单
            {statusFilter !== "all" && ` · 筛选: ${STATUS_TABS.find((t) => t.value === statusFilter)?.label}`}
          </p>
        </div>
      </div>

      {/* 搜索 + 筛选 */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="搜索姓名、邮箱或订单ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-sm px-4 py-2.5 rounded-xl border-2 border-[#2a2a2a] bg-[#1a1a1a] text-[#f0e6d3] placeholder-[#6b6459] text-sm focus:outline-none focus:border-[#c8a951] transition-colors"
        />
        <div className="flex gap-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === tab.value
                  ? "bg-[#c8a951] text-[#0f0f0f]"
                  : "text-[#9c9588] hover:text-[#f0e6d3]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 订单表格 */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-[#6b6459]">加载中...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#6b6459]">暂无订单</p>
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="text-sm text-[#c8a951] mt-2 hover:underline"
              >
                清除筛选
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a] text-left text-xs text-[#6b6459] uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">订单 ID</th>
                <th className="px-4 py-3 font-medium">客户</th>
                <th className="px-4 py-3 font-medium">产品</th>
                <th className="px-4 py-3 font-medium">金额</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">日期</th>
                <th className="px-4 py-3 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const st = STATUS_MAP[order.status] || STATUS_MAP.pending;
                return (
                  <tr
                    key={order.orderId}
                    className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#252525] transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[#6b6459]">
                      {order.orderId.slice(0, 14)}...
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{order.name}</div>
                      <div className="text-xs text-[#6b6459]">{order.email}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#9c9588]">
                      {PRODUCT_LABELS[order.productId] || order.productId}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {PRODUCT_PRICES[order.productId] || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.className}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#6b6459] text-xs">
                      {order.createdAt.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.orderId}`}
                        className="text-[#c8a951] text-xs hover:underline"
                      >
                        处理 →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
