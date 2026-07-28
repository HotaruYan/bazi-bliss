"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError("密码错误，请重试");
      }
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Bazi<span className="text-[#c8a951]">Bliss</span>
          </h1>
          <p className="text-sm text-[#6b6459] mt-2">管理后台登录</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#9c9588] mb-1.5">
              管理员密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="请输入密码"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border-2 border-[#2a2a2a] bg-[#0f0f0f] text-[#f0e6d3] placeholder-[#6b6459] focus:outline-none focus:border-[#c8a951] transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-[#c8a951] text-[#0f0f0f] rounded-xl font-semibold hover:bg-[#d4b96a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "验证中..." : "登录"}
          </button>
        </form>

        <p className="text-xs text-[#6b6459] text-center mt-6">
          Bazi Bliss Admin · v1.0
        </p>
      </div>
    </div>
  );
}
