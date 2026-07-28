import { NextRequest, NextResponse } from "next/server";
import { createCheckout } from "@/lib/lemon-squeezy";

/**
 * POST /api/checkout
 *
 * 接收用户订单表单，创建 Lemon Squeezy 付款链接并返回。
 * MVP 阶段：订单数据通过 Lemon Squeezy checkout_data custom 字段传递。
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

    const checkoutUrl = await createCheckout({
      name,
      email,
      birthDate,
      birthTime: birthTime || "unknown",
      birthCity,
      gender,
      focusArea: focusArea || "general",
      productId,
    });

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "Unable to create checkout. Please try again or contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error("Checkout API error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
