/**
 * POST /api/fulfill
 *
 * Thank-you 页面调用：收到浏览器传来的订单数据（从 localStorage 取回），
 * 生成报告并发送邮件。不依赖服务器端存储。
 */

import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "@/lib/ai-report";
import { sendEmail, buildReportDeliveryEmail, buildAnnualPassDeliveryEmail } from "@/lib/email";
import { calculateBazi } from "@/lib/bazi-calculator";
import { PRODUCT_MAP } from "@/lib/gumroad";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, birthDate, birthTime, birthCity, gender, focusArea, productId } = body;

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
      const [lifeBlueprint, yearAhead] = await Promise.all([
        generateReport(birthInfo, "life-blueprint", chart),
        generateReport(birthInfo, "year-ahead", chart),
      ]);

      await sendEmail({
        to: email,
        subject: "Your Bazi Bliss Annual Pass — Reports Are Ready!",
        html: buildAnnualPassDeliveryEmail(name, lifeBlueprint, yearAhead),
      });

      console.log(`   ✅ Annual Pass reports sent to ${email}`);
    } else {
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
