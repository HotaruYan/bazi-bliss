/**
 * POST /api/fulfill
 *
 * Thank-you 页面调用：收到浏览器传来的订单数据（从 localStorage 取回），
 * 生成报告并发送邮件。
 *
 * Annual Pass（$99.99）逻辑：
 *   1. 立即生成并发送 Life Blueprint + 第一年 Year Ahead
 *   2. 保存订单到 data/orders/，标记 subscriptionActive=true
 *   3. 每月1号 Cron Job 自动发月运
 *   4. 每年自动续发下一年 Year Ahead（共5年）
 */

import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "@/lib/ai-report";
import { sendEmail, buildReportDeliveryEmail, buildAnnualPassDeliveryEmail } from "@/lib/email";
import { calculateBazi } from "@/lib/bazi-calculator";
import { PRODUCT_MAP } from "@/lib/gumroad";
import { saveOrder, type OrderRecord } from "@/lib/storage";

function generateOrderId(): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `gumroad-${ts}-${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, birthDate, birthTime, birthCity, gender, focusArea, productId, longitude } = body;

    if (!name || !email || !birthDate || !productId) {
      return NextResponse.json({ error: "Missing order data." }, { status: 400 });
    }

    const product = PRODUCT_MAP[productId];
    if (!product) {
      return NextResponse.json({ error: "Unknown product." }, { status: 400 });
    }

    console.log(`🔮 Fulfill: ${name} (${email}) — ${product.name}`);

    const chart = calculateBazi({
      birthDate,
      birthTime: birthTime || "unknown",
      birthCity: birthCity || "",
      gender: gender || "other",
      longitude: longitude ?? undefined,
    });

    const birthInfo = {
      name,
      birthDate,
      birthTime: birthTime || "unknown",
      birthCity: birthCity || "",
      gender: gender || "other",
      focusArea: focusArea || "general",
      orderDate: new Date().toISOString().split("T")[0],
    };

    if (productId === "annual-pass") {
      // Annual Pass: 立即生成 Life Blueprint + 第一年 Year Ahead
      const [lifeBlueprint, yearAhead] = await Promise.all([
        generateReport(birthInfo, "life-blueprint", chart),
        generateReport(birthInfo, "year-ahead", chart),
      ]);

      await sendEmail({
        to: email,
        subject: "Your Bazi Bliss Annual Pass — Reports Are Ready!",
        html: buildAnnualPassDeliveryEmail(name, lifeBlueprint, yearAhead),
      });

      // 保存订单 + 订阅追踪信息
      const now = new Date();
      const subscriptionEnd = new Date(now);
      subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 5);

      await saveOrder({
        orderId: generateOrderId(),
        name,
        email,
        birthDate,
        birthTime: birthTime || "unknown",
        birthCity: birthCity || "",
        gender: gender || "other",
        focusArea: focusArea || "general",
        productId: "annual-pass",
        status: "fulfilled",
        createdAt: now.toISOString(),
        subscriptionActive: true,
        subscriptionStart: now.toISOString().split("T")[0],
        subscriptionEnd: subscriptionEnd.toISOString().split("T")[0],
        yearAheadCount: 1,
        lastYearAheadDate: now.toISOString().split("T")[0],
      });

      console.log(`   ✅ Annual Pass reports sent to ${email} — 订阅已激活 (${5}年)`);
    } else {
      // 普通订单：单份报告
      const reportType = productId === "year-ahead" ? "year-ahead" : "life-blueprint";
      const report = await generateReport(birthInfo, reportType, chart);

      await sendEmail({
        to: email,
        subject: `Your ${product.name} Is Ready — Bazi Bliss`,
        html: buildReportDeliveryEmail(name, product.name, report),
      });

      console.log(`   ✅ ${product.name} report sent to ${email}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Fulfill error:", err);
    return NextResponse.json({ error: "Failed to generate report." }, { status: 500 });
  }
}
