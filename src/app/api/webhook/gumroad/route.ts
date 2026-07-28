/**
 * Gumroad Webhook — 接收付款通知（备份通道）
 *
 * 主流程通过 thank-you 页面直接触发发货。
 * 此 webhook 仅作为备份，记录付款事件。
 *
 * 在 Gumroad 后台 Advanced → Ping 中设置：
 *   https://bazi-bliss.vercel.app/api/webhook/gumroad
 */

import { NextRequest, NextResponse } from "next/server";
import { getProductByGumroadPermalink } from "@/lib/gumroad";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);

    const email = params.get("email");
    const permalink = params.get("product_permalink");
    const productName = params.get("product_name");
    const price = params.get("price");

    if (!email || !permalink) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const product = getProductByGumroadPermalink(permalink);
    const priceFormatted = price ? `$${(parseInt(price) / 100).toFixed(2)}` : "";

    console.log(`💰 Gumroad sale: ${email} → ${productName || permalink} ${priceFormatted}`);
    console.log(`   Product: ${product?.name || "unknown"} | Permalink: ${permalink}`);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Gumroad webhook error:", err);
    return new NextResponse("Error", { status: 500 });
  }
}
