"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  orderId: string;
  name: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  gender: string;
  focusArea: string;
  productId: string;
  status: string;
  createdAt: string;
}

const PRODUCT_LABELS: Record<string, string> = {
  "life-blueprint": "Life Blueprint",
  "year-ahead": "Year Ahead",
  "annual-pass": "Annual Pass",
};

const GENDER_LABELS: Record<string, string> = {
  male: "Male",
  female: "Female",
};

const FOCUS_LABELS: Record<string, string> = {
  general: "综合运势",
  career: "事业",
  love: "感情",
  wealth: "财富",
  health: "健康",
};

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  pending: { text: "待处理", color: "text-gray-400" },
  paid: { text: "已付款", color: "text-yellow-500" },
  fulfilled: { text: "已完成", color: "text-green-500" },
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [hasReport, setHasReport] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.order);
        setHasReport(data.hasReport);
        setReport(data.reportContent);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/admin/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id }),
      });
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
        setHasReport(true);
      } else {
        setError(data.error || "生成失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!confirm("确认发送报告邮件给客户？")) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/admin/report", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder((prev) => (prev ? { ...prev, status: "fulfilled" } : prev));
        alert("邮件已发送！");
      } else {
        setError(data.error || "发送失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-[#6b6459]">加载中...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#6b6459] mb-3">订单不存在</p>
        <Link href="/admin/orders" className="text-[#c8a951] text-sm hover:underline">返回订单列表</Link>
      </div>
    );
  }

  const st = STATUS_LABELS[order.status] || STATUS_LABELS.pending;

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      {/* 顶部导航 */}
      <div className="flex items-center gap-3 text-sm">
        <Link href="/admin/orders" className="text-[#6b6459] hover:text-[#c8a951] transition-colors">
          ← 订单列表
        </Link>
        <span className="text-[#6b6459]">/</span>
        <span className="text-[#9c9588] font-mono text-xs">{order.orderId.slice(0, 14)}...</span>
      </div>

      {/* 订单信息 + 报告操作 双栏 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* 左栏：订单信息 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">订单信息</h2>
              <span className={`text-xs font-medium ${st.color}`}>{st.text}</span>
            </div>

            <dl className="space-y-3 text-sm">
              <Row label="客户姓名" value={order.name} />
              <Row label="邮箱" value={order.email} />
              <Row label="产品" value={PRODUCT_LABELS[order.productId] || order.productId} />
              <Row label="出生日期" value={order.birthDate} />
              <Row label="出生时间" value={order.birthTime === "unknown" ? "未知（默认午时）" : order.birthTime} />
              <Row label="出生地点" value={order.birthCity} />
              <Row label="性别" value={GENDER_LABELS[order.gender] || order.gender || "未填写"} />
              <Row label="关注领域" value={FOCUS_LABELS[order.focusArea] || order.focusArea} />
              <Row label="下单时间" value={order.createdAt.slice(0, 10)} />
              <Row label="订单 ID" value={order.orderId} mono />
            </dl>
          </div>

          {/* 操作区 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-sm">报告操作</h3>

            {!hasReport && (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3 bg-[#c8a951] text-[#0f0f0f] rounded-xl font-semibold hover:bg-[#d4b96a] transition-all disabled:opacity-50"
              >
                {generating ? "⏳ AI 正在生成报告..." : "✨ 生成 AI 报告"}
              </button>
            )}

            {hasReport && (
              <>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full py-2.5 bg-[#252525] text-[#f0e6d3] rounded-xl font-medium text-sm hover:bg-[#2a2a2a] transition-all disabled:opacity-50 border border-[#2a2a2a]"
                >
                  {generating ? "⏳ 重新生成中..." : "🔄 重新生成报告"}
                </button>

                {order.status !== "fulfilled" && (
                  <button
                    onClick={handleSend}
                    disabled={sending}
                    className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50"
                  >
                    {sending ? "📧 发送中..." : "📧 发送邮件给客户"}
                  </button>
                )}

                {order.status === "fulfilled" && (
                  <div className="text-center py-2 text-sm text-green-500 flex items-center justify-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    报告已发送
                  </div>
                )}
              </>
            )}

            {generating && (
              <p className="text-xs text-[#6b6459] text-center">
                DeepSeek AI 正在分析八字命盘，预计需要 30-60 秒...
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* 右栏：报告预览 */}
        <div className="lg:col-span-3">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 min-h-[400px]">
            <h2 className="font-bold mb-4">报告预览</h2>
            {generating ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#6b6459]">
                <div className="w-8 h-8 border-2 border-[#c8a951] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm">DeepSeek 正在分析八字命盘...</p>
              </div>
            ) : report ? (
              <article className="prose prose-invert prose-sm max-w-none">
                <ReportRenderer markdown={report} />
              </article>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-[#6b6459]">
                <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm">点击"生成 AI 报告"开始</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[#6b6459] shrink-0">{label}</dt>
      <dd className={`text-right truncate ${mono ? "font-mono text-xs text-[#9c9588]" : ""}`}>{value}</dd>
    </div>
  );
}

function ReportRenderer({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");
  return (
    <div className="space-y-3 text-sm leading-relaxed text-[#9c9588]">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;

        if (trimmed.startsWith("### ")) {
          return <h3 key={i} className="text-base font-bold text-[#f0e6d3] mt-6 mb-2">{trimmed.replace("### ", "")}</h3>;
        }
        if (trimmed.startsWith("## ")) {
          return <h2 key={i} className="text-lg font-bold text-[#c8a951] mt-8 mb-3 border-b border-[#2a2a2a] pb-2">{trimmed.replace("## ", "")}</h2>;
        }
        if (trimmed.startsWith("# ")) {
          return <h1 key={i} className="text-xl font-bold text-[#f0e6d3] mt-4 mb-4">{trimmed.replace("# ", "")}</h1>;
        }
        if (trimmed.startsWith("- ")) {
          return <li key={i} className="ml-4 text-[#9c9588]">{trimmed.replace("- ", "")}</li>;
        }
        if (trimmed.startsWith("**") && trimmed.includes("**")) {
          return <p key={i} className="font-semibold text-[#f0e6d3] mt-4">{trimmed.replace(/\*\*/g, "")}</p>;
        }
        return <p key={i}>{trimmed}</p>;
      })}
    </div>
  );
}
