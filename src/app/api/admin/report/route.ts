import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { generateReport } from "@/lib/ai-report";
import { sendEmail, buildReportDeliveryEmail } from "@/lib/email";
import { calculateBazi } from "@/lib/bazi-calculator";

interface Order {
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
}

function getOrder(id: string): Order | null {
  const dir = process.env.ORDERS_DIR || path.join(process.cwd(), "data", "orders");
  const filepath = path.join(dir, `${id}.json`);
  if (!fs.existsSync(filepath)) return null;
  return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}

function saveOrder(order: Order): void {
  const dir = process.env.ORDERS_DIR || path.join(process.cwd(), "data", "orders");
  fs.writeFileSync(path.join(dir, `${order.orderId}.json`), JSON.stringify(order, null, 2));
}

const PRODUCT_NAMES: Record<string, string> = {
  "life-blueprint": "Life Blueprint",
  "year-ahead": "Year Ahead",
  "annual-pass": "Annual Pass",
};

// POST — 生成报告（调用 DeepSeek）
export async function POST(request: Request) {
  const { orderId } = await request.json();
  if (!orderId) {
    return NextResponse.json({ error: "缺少 orderId" }, { status: 400 });
  }

  const order = getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }

  const reportType =
    order.productId === "year-ahead"
      ? "year-ahead"
      : order.productId === "annual-pass"
        ? "life-blueprint"
        : "life-blueprint";

  // 使用程序精确排盘
  const chart = calculateBazi({
    birthDate: order.birthDate,
    birthTime: order.birthTime || "unknown",
    birthCity: order.birthCity,
    gender: order.gender || "other",
  });

  console.log(`\n🔮 Bazi Chart for ${order.name}:`);
  console.log(`   ${chart.yearPillar.stem}${chart.yearPillar.branch} ${chart.monthPillar.stem}${chart.monthPillar.branch} ${chart.dayPillar.stem}${chart.dayPillar.branch} ${chart.hourPillar.stem}${chart.hourPillar.branch}`);
  console.log(`   Day Master: ${chart.dayMaster} (${chart.dayMasterYinYang} ${chart.dayMasterElement})`);
  console.log(`   True Solar Time: ${chart.trueSolarTime.note}`);

  try {
    const reportMarkdown = await generateReport(
      {
        name: order.name,
        birthDate: order.birthDate,
        birthTime: order.birthTime,
        birthCity: order.birthCity,
        gender: order.gender || "other",
        focusArea: order.focusArea,
        orderDate: order.createdAt,
      },
      reportType as "life-blueprint" | "year-ahead" | "monthly",
      chart
    );

    const reportsDir = path.join(process.cwd(), "data", "reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
    fs.writeFileSync(path.join(reportsDir, `${orderId}.md`), reportMarkdown);

    return NextResponse.json({ success: true, report: reportMarkdown });
  } catch (err) {
    console.error("生成报告失败:", err);
    return NextResponse.json({ error: "生成报告失败，请重试" }, { status: 500 });
  }
}

// PUT — 发送报告邮件给客户
export async function PUT(request: Request) {
  const { orderId } = await request.json();
  if (!orderId) {
    return NextResponse.json({ error: "缺少 orderId" }, { status: 400 });
  }

  const order = getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }

  const reportsDir = path.join(process.cwd(), "data", "reports");
  const reportPath = path.join(reportsDir, `${orderId}.md`);
  if (!fs.existsSync(reportPath)) {
    return NextResponse.json({ error: "报告尚未生成" }, { status: 400 });
  }

  const reportMarkdown = fs.readFileSync(reportPath, "utf-8");
  const productName = PRODUCT_NAMES[order.productId] || "Bazi Reading";

  const sent = await sendEmail({
    to: order.email,
    subject: `Your ${productName} Is Ready — Bazi Bliss`,
    html: buildReportDeliveryEmail(order.name, productName, reportMarkdown),
  });

  if (sent) {
    order.status = "fulfilled";
    saveOrder(order);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "邮件发送失败，请检查 Resend 配置" }, { status: 500 });
}
