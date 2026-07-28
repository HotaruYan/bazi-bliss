import { NextRequest, NextResponse } from "next/server";
import { getGumroadCheckoutUrl, PRODUCT_MAP } from "@/lib/gumroad";
import fs from "fs";
import path from "path";

/**
 * POST /api/checkout
 *
 * 接收用户订单表单，保存订单为 pending，返回 Gumroad 付款链接。
 * 付款成功后 Gumroad Webhook 通知我们，自动生成报告。
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, birthDate, birthTime, birthCity, gender, focusArea, productId } = body;

    // 基本验证
    if (!name || !email || !birthDate || !birthCity || !gender || !productId) {
      return NextResponse.json(
        { error: "Missing required fields. Please fill in all required information." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!PRODUCT_MAP[productId]) {
      return NextResponse.json(
        { error: "Invalid product selected." },
        { status: 400 }
      );
    }

    const product = PRODUCT_MAP[productId];

    // 生成唯一订单 ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const orderId = `${product.slug}-${timestamp}-${random}`;

    // 保存 pending 订单
    const order = {
      orderId,
      name,
      email,
      birthDate,
      birthTime: birthTime || "unknown",
      birthCity,
      gender,
      focusArea: focusArea || "general",
      productId,
      status: "pending",
      createdAt: new Date().toISOString(),
      ...(productId === "annual-pass" ? { subscriptionActive: false } : {}),
    };

    const dir = process.env.ORDERS_DIR || path.join(process.cwd(), "data", "orders");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${orderId}.json`), JSON.stringify(order, null, 2));

    console.log(`📝 Order saved: ${orderId} — ${name} (${product.name})`);

    const checkoutUrl = getGumroadCheckoutUrl(productId);

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error("Checkout API error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
