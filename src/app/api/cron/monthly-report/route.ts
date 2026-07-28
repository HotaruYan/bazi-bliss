/**
 * Vercel Cron Job — 每月1号自动生成月运并发送邮件
 *
 * 触发方式：Vercel Cron（vercel.json 中配置）
 * 安全验证：检查 CRON_SECRET 请求头
 */

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { generateReport } from "@/lib/ai-report";
import { sendEmail, buildMonthlyReportEmail } from "@/lib/email";
import { calculateBazi } from "@/lib/bazi-calculator";

interface OrderFile {
  orderId: string;
  name: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  gender: string;
  focusArea: string;
  productId: string;
  status: "pending" | "paid" | "fulfilled";
  createdAt: string;
  subscriptionActive?: boolean;
}

function getActiveSubscribers(): OrderFile[] {
  const dir = path.join(process.cwd(), "data", "orders");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")))
    .filter((o: OrderFile) => o.subscriptionActive === true);
}

function logResult(orderId: string, success: boolean, error?: string): void {
  const dir = path.join(process.cwd(), "data", "cron-logs");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const logPath = path.join(dir, `${month}.jsonl`);
  const entry = JSON.stringify({
    timestamp: now.toISOString(),
    orderId,
    success,
    error: error || null,
  });
  fs.appendFileSync(logPath, entry + "\n");
}

export async function GET(request: Request) {
  // 验证 CRON_SECRET
  const authHeader = request.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscribers = getActiveSubscribers();

  if (subscribers.length === 0) {
    console.log("📭 No active subscribers this month.");
    return NextResponse.json({ success: true, processed: 0, message: "No active subscribers" });
  }

  console.log(`📬 Processing ${subscribers.length} active subscriber(s)...`);

  const now = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const monthLabel = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  let successCount = 0;
  let failCount = 0;

  for (const order of subscribers) {
    try {
      const chart = calculateBazi({
        birthDate: order.birthDate,
        birthTime: order.birthTime || "unknown",
        birthCity: order.birthCity,
        gender: order.gender || "other",
      });

      console.log(`   ⏳ ${order.name} (${order.orderId})...`);

      const report = await generateReport(
        {
          name: order.name,
          birthDate: order.birthDate,
          birthTime: order.birthTime,
          birthCity: order.birthCity,
          gender: order.gender || "other",
          focusArea: order.focusArea || "general",
          orderDate: now.toISOString().split("T")[0], // 当前日期，用于计算流月
        },
        "monthly",
        chart
      );

      const sent = await sendEmail({
        to: order.email,
        subject: `Your Bazi Forecast for ${monthLabel}`,
        html: buildMonthlyReportEmail(order.name, monthLabel, report),
      });

      if (sent) {
        successCount++;
        logResult(order.orderId, true);
        console.log(`   ✅ ${order.name}`);
      } else {
        failCount++;
        logResult(order.orderId, false, "Email send failed");
        console.log(`   ⚠ ${order.name} — email send failed`);
      }
    } catch (err: any) {
      failCount++;
      logResult(order.orderId, false, err.message || String(err));
      console.error(`   ❌ ${order.name}: ${err}`);
    }
  }

  console.log(`\n📊 Monthly report complete: ${successCount} sent, ${failCount} failed`);

  return NextResponse.json({
    success: true,
    processed: subscribers.length,
    successCount,
    failCount,
    month: monthLabel,
  });
}
