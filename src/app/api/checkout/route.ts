import { NextRequest, NextResponse } from "next/server";
import { getGumroadCheckoutUrl, PRODUCT_MAP } from "@/lib/gumroad";

/**
 * POST /api/checkout
 *
 * 验证订单信息，返回 Gumroad 付款链接。
 * 订单数据由前端存 localStorage，付款后回到 thank-you 页触发发货。
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, birthDate, birthTime, birthCity, gender, focusArea, productId } = body;

    if (!name || !email || !birthDate || !birthCity || !gender || !productId) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    if (!PRODUCT_MAP[productId]) {
      return NextResponse.json({ error: "Invalid product." }, { status: 400 });
    }

    const checkoutUrl = getGumroadCheckoutUrl(productId);

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
