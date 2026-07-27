import { NextRequest, NextResponse } from "next/server";
import { sendEmail, buildConfirmationEmail } from "@/lib/email";
import type { OrderData } from "@/lib/lemon-squeezy";

/**
 * POST /api/webhook/lemon-squeezy
 *
 * 接收 Lemon Squeezy 的订单 webhook。
 * 当用户付款成功后，Lemon Squeezy 会向此端点发送通知。
 *
 * MVP 阶段行为：
 * 1. 验证 webhook 签名
 * 2. 提取订单信息和自定义数据（出生信息等）
 * 3. 发送确认邮件给用户
 * 4. 将订单标记为待处理（运营者手动触发 AI 生成）
 *
 * 环境变量：ORDERS_DIR — 订单文件存储目录（可选，默认 ./data/orders）
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-signature") || "";

    // MVP: 跳过签名验证（.env 中不配置 LEMON_SQUEEZY_SIGNING_SECRET 则跳过）
    const signingSecret = process.env.LEMON_SQUEEZY_SIGNING_SECRET;
    if (signingSecret) {
      // TODO: 实现 HMAC-SHA256 签名验证
      // const expected = crypto.createHmac("sha256", signingSecret).update(body).digest("hex");
      // if (expected !== signature) return new NextResponse("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(body);
    const eventName = event.meta?.event_name;

    // 只处理订单创建事件
    if (eventName !== "order_created") {
      return NextResponse.json({ received: true, event: eventName });
    }

    const order = event.data;
    const orderId = order.id;
    const attributes = event.data.attributes;

    // 提取自定义数据
    const customData = attributes.custom_data || attributes.checkout_data?.custom || {};
    const email = attributes.user_email || attributes.user_data?.email;
    const name = attributes.user_name || customData?.name || "Customer";

    const orderData: OrderData = {
      orderId,
      name,
      email,
      birthDate: customData.birthDate || "",
      birthTime: customData.birthTime || "unknown",
      birthCity: customData.birthCity || "",
      focusArea: customData.focusArea || "general",
      productId: customData.productId || "life-blueprint",
      status: "paid",
      createdAt: new Date().toISOString(),
    };

    // 保存订单到本地文件（供运营者查看和处理）
    await saveOrderToLocal(orderData);

    // 发送确认邮件
    const productNames: Record<string, string> = {
      "life-blueprint": "Life Blueprint",
      "year-ahead": "Year Ahead",
      "annual-pass": "Annual Pass",
    };
    const productName = productNames[orderData.productId] || "Bazi Reading";

    await sendEmail({
      to: email,
      subject: `Your ${productName} Order — Bazi Bliss`,
      html: buildConfirmationEmail(name, productName),
    });

    console.log(`✅ New order received: ${orderId} — ${name} (${productName})`);
    console.log(`   Email sent to: ${email}`);
    console.log(`   ⚠ Manual action needed: Generate AI report for this order.`);

    return NextResponse.json({ received: true, orderId });
  } catch (err) {
    console.error("Webhook error:", err);
    return new NextResponse("Webhook processing error", { status: 500 });
  }
}

// ============================================================
// MVP: 本地文件存储（不需要数据库）
// 后续升级到 Vercel KV / PostgreSQL
// ============================================================

import fs from "fs";
import path from "path";

function getOrdersDir(): string {
  const dir = process.env.ORDERS_DIR || path.join(process.cwd(), "data", "orders");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

async function saveOrderToLocal(order: OrderData): Promise<void> {
  try {
    const dir = getOrdersDir();
    const filename = `${order.orderId}.json`;
    const filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, JSON.stringify(order, null, 2));
  } catch (err) {
    console.error("Failed to save order locally:", err);
  }
}

// ============================================================
// GET: 订单管理页面（简单）
// 生产环境需加认证保护
// ============================================================

export async function GET() {
  try {
    const dir = getOrdersDir();
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
    const orders = files.map((f) => {
      const data = fs.readFileSync(path.join(dir, f), "utf-8");
      return JSON.parse(data) as OrderData;
    });

    // 按时间倒序
    orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ orders, total: orders.length });
  } catch {
    return NextResponse.json({ orders: [], total: 0 });
  }
}
