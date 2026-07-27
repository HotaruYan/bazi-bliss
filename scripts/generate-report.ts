/**
 * 运营脚本：手动生成八字报告
 *
 * MVP 阶段使用方式：
 * 1. 确保 .env.local 中配置了 DEEPSEEK_API_KEY 和 RESEND_API_KEY
 * 2. 在终端运行：
 *    npx tsx scripts/generate-report.ts daisy <order-id>
 *    npx tsx scripts/generate-report.ts process
 *    npx tsx scripts/generate-report.ts list
 *
 * 命令说明：
 *   list     — 列出所有待处理的订单
 *   process  — 处理所有待处理订单
 *   <id>     — 处理指定订单
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// 加载环境变量
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

import { generateReport } from "../src/lib/ai-report";
import { sendEmail, buildReportDeliveryEmail } from "../src/lib/email";

const ORDERS_DIR = path.join(process.cwd(), "data", "orders");

interface OrderFile {
  orderId: string;
  name: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  focusArea: string;
  productId: string;
  status: "pending" | "paid" | "fulfilled";
  createdAt: string;
}

function listOrders(): OrderFile[] {
  if (!fs.existsSync(ORDERS_DIR)) return [];
  const files = fs.readdirSync(ORDERS_DIR).filter((f) => f.endsWith(".json"));
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(ORDERS_DIR, f), "utf-8")))
    .filter((o: OrderFile) => o.status !== "fulfilled")
    .sort(
      (a: OrderFile, b: OrderFile) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

async function processOrder(order: OrderFile): Promise<void> {
  console.log(`\n🔮 Processing: ${order.orderId} — ${order.name}`);
  console.log(`   Product: ${order.productId}`);
  console.log(`   Email: ${order.email}`);

  const reportType =
    order.productId === "year-ahead"
      ? "year-ahead"
      : order.productId === "annual-pass"
        ? "life-blueprint"
        : "life-blueprint";

  const productNames: Record<string, string> = {
    "life-blueprint": "Life Blueprint",
    "year-ahead": "Year Ahead",
    "annual-pass": "Annual Pass",
  };
  const productName = productNames[order.productId] || "Bazi Reading";

  try {
    // 1. 生成报告
    console.log("   ⏳ Generating AI report...");
    const reportMarkdown = await generateReport(
      {
        name: order.name,
        birthDate: order.birthDate,
        birthTime: order.birthTime,
        birthCity: order.birthCity,
        focusArea: order.focusArea,
      },
      reportType as "life-blueprint" | "year-ahead" | "monthly"
    );

    // 2. 保存报告
    const reportsDir = path.join(process.cwd(), "data", "reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
    const reportPath = path.join(reportsDir, `${order.orderId}.md`);
    fs.writeFileSync(reportPath, reportMarkdown);
    console.log(`   ✅ Report saved: ${reportPath}`);

    // 3. 发送邮件
    console.log(`   ⏳ Sending email to ${order.email}...`);
    const sent = await sendEmail({
      to: order.email,
      subject: `Your ${productName} Is Ready — Bazi Bliss`,
      html: buildReportDeliveryEmail(order.name, productName, reportMarkdown),
    });

    if (sent) {
      console.log(`   ✅ Email sent!`);
    } else {
      console.log(`   ⚠ Email not sent (check RESEND_API_KEY)`);
    }

    // 4. 标记为已完成
    order.status = "fulfilled";
    fs.writeFileSync(
      path.join(ORDERS_DIR, `${order.orderId}.json`),
      JSON.stringify(order, null, 2)
    );
    console.log(`   ✅ Order marked as fulfilled.\n`);
  } catch (err) {
    console.error(`   ❌ Failed to process order: ${err}\n`);
  }
}

async function main(): Promise<void> {
  const command = process.argv[2];

  if (!command) {
    console.log(`
Bazi Bliss — Report Generation Script (MVP)

Usage:
  npx tsx scripts/generate-report.ts list      List pending orders
  npx tsx scripts/generate-report.ts process   Process all pending orders
  npx tsx scripts/generate-report.ts <id>      Process a specific order
`);
    return;
  }

  if (command === "list") {
    const orders = listOrders();
    if (orders.length === 0) {
      console.log("No pending orders. 🎉");
      return;
    }
    console.log(`\n📋 Pending orders: ${orders.length}\n`);
    orders.forEach((o) => {
      console.log(
        `  ${o.orderId.slice(0, 8)}... | ${o.name.padEnd(20)} | ${o.productId.padEnd(18)} | ${o.status} | ${o.createdAt.slice(0, 10)}`
      );
    });
    return;
  }

  if (command === "process") {
    const orders = listOrders();
    if (orders.length === 0) {
      console.log("No pending orders to process.");
      return;
    }
    console.log(`Processing ${orders.length} orders...\n`);
    for (const order of orders) {
      await processOrder(order);
    }
    console.log("Done! 🎉");
    return;
  }

  // 处理指定订单
  const orderPath = path.join(ORDERS_DIR, `${command}.json`);
  if (!fs.existsSync(orderPath)) {
    console.error(`Order not found: ${command}`);
    return;
  }
  const order = JSON.parse(fs.readFileSync(orderPath, "utf-8"));
  await processOrder(order);
  console.log("Done! 🎉");
}

main().catch(console.error);
