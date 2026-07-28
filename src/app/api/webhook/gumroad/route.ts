/**
 * Gumroad Webhook — 接收付款成功通知，自动生成报告并发送邮件
 *
 * 在 Gumroad 后台 Advanced → Ping 中设置此 URL：
 *   https://bazi-bliss.vercel.app/api/webhook/gumroad
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getProductByGumroadPermalink } from "@/lib/gumroad";
import { generateReport } from "@/lib/ai-report";
import { sendEmail, buildReportDeliveryEmail, buildAnnualPassDeliveryEmail } from "@/lib/email";
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

function findPendingOrder(email: string, permalink: string): OrderFile | null {
  const dir = path.join(process.cwd(), "data", "orders");
  if (!fs.existsSync(dir)) return null;

  const product = getProductByGumroadPermalink(permalink);
  if (!product) return null;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const candidates: OrderFile[] = [];

  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
    if (data.email === email && data.productId === product.slug && data.status === "pending") {
      candidates.push(data);
    }
  }

  if (candidates.length === 0) return null;
  // 取最新的 pending 订单
  candidates.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return candidates[0];
}

async function generateAndDeliver(order: OrderFile): Promise<void> {
  console.log(`🔮 Generating reports for ${order.orderId} — ${order.name}`);

  const chart = calculateBazi({
    birthDate: order.birthDate,
    birthTime: order.birthTime || "unknown",
    birthCity: order.birthCity,
    gender: order.gender || "other",
  });

  const birthInfo = {
    name: order.name,
    birthDate: order.birthDate,
    birthTime: order.birthTime,
    birthCity: order.birthCity,
    gender: order.gender || "other",
    focusArea: order.focusArea,
    orderDate: order.createdAt,
  };

  if (order.productId === "annual-pass") {
    // Annual Pass: 生成两份报告
    const [lifeBlueprint, yearAhead] = await Promise.all([
      generateReport(birthInfo, "life-blueprint", chart),
      generateReport(birthInfo, "year-ahead", chart),
    ]);

    const reportsDir = path.join(process.cwd(), "data", "reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
    fs.writeFileSync(path.join(reportsDir, `${order.orderId}-life-blueprint.md`), lifeBlueprint);
    fs.writeFileSync(path.join(reportsDir, `${order.orderId}-year-ahead.md`), yearAhead);

    await sendEmail({
      to: order.email,
      subject: "Your Bazi Bliss Annual Pass — Reports Are Ready!",
      html: buildAnnualPassDeliveryEmail(order.name, lifeBlueprint, yearAhead),
    });

    order.subscriptionActive = true;
    console.log(`   ✅ Annual Pass delivered — reports + subscription active`);
  } else {
    // 普通订单: 生成单份报告
    const reportType = order.productId === "year-ahead" ? "year-ahead" : "life-blueprint";
    const productName = order.productId === "year-ahead" ? "Year Ahead" : "Life Blueprint";
    const reportMarkdown = await generateReport(birthInfo, reportType, chart);

    const reportsDir = path.join(process.cwd(), "data", "reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
    fs.writeFileSync(path.join(reportsDir, `${order.orderId}.md`), reportMarkdown);

    await sendEmail({
      to: order.email,
      subject: `Your ${productName} Is Ready — Bazi Bliss`,
      html: buildReportDeliveryEmail(order.name, productName, reportMarkdown),
    });

    console.log(`   ✅ ${productName} delivered`);
  }

  // 标记完成
  order.status = "fulfilled";
  const dir = process.env.ORDERS_DIR || path.join(process.cwd(), "data", "orders");
  fs.writeFileSync(path.join(dir, `${order.orderId}.json`), JSON.stringify(order, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    // Gumroad 发送的是 form-encoded 数据
    const body = await request.text();
    const params = new URLSearchParams(body);

    const email = params.get("email");
    const permalink = params.get("product_permalink");
    const productName = params.get("product_name");

    console.log(`💰 Gumroad sale: ${email} bought ${productName} (${permalink})`);

    if (!email || !permalink) {
      return NextResponse.json({ error: "Missing email or product_permalink" }, { status: 400 });
    }

    // 匹配 pending 订单
    const order = findPendingOrder(email, permalink);

    if (!order) {
      console.log(`   ⚠ No pending order found for ${email} + ${permalink}, creating from webhook...`);
      // TODO: 若将来需要从 webhook 数据直接创建订单
      return NextResponse.json({ received: true, note: "No matching pending order" });
    }

    // 标记为已付款
    order.status = "paid";
    const dir = process.env.ORDERS_DIR || path.join(process.cwd(), "data", "orders");
    fs.writeFileSync(path.join(dir, `${order.orderId}.json`), JSON.stringify(order, null, 2));
    console.log(`   ✅ Order ${order.orderId} marked as paid`);

    // 自动生成报告并发货（异步，不阻塞 webhook 响应）
    generateAndDeliver(order).catch((err) => {
      console.error(`   ❌ Auto-delivery failed for ${order.orderId}:`, err);
    });

    return NextResponse.json({ received: true, orderId: order.orderId });
  } catch (err) {
    console.error("Gumroad webhook error:", err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
