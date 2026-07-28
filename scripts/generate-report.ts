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

// 必须在 import 本地模块前加载环境变量（ESM import 会被提升）
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}


const ORDERS_DIR = path.join(process.cwd(), "data", "orders");

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

  const isAnnualPass = order.productId === "annual-pass";

  const productNames: Record<string, string> = {
    "life-blueprint": "Life Blueprint",
    "year-ahead": "Year Ahead",
    "annual-pass": "Annual Pass",
  };
  const productName = productNames[order.productId] || "Bazi Reading";

  try {
    // 动态导入本地模块（确保 dotenv 已加载）
    const [{ generateReport }, { sendEmail, buildReportDeliveryEmail, buildAnnualPassDeliveryEmail }, { calculateBazi }] =
      await Promise.all([
        import("../src/lib/ai-report"),
        import("../src/lib/email"),
        import("../src/lib/bazi-calculator"),
      ]);

    // 0. 先精确排盘
    const chart = calculateBazi({
      birthDate: order.birthDate,
      birthTime: order.birthTime || "unknown",
      birthCity: order.birthCity,
      gender: order.gender || "other",
    });
    console.log(`   📐 Chart: ${chart.yearPillar.stem}${chart.yearPillar.branch} ${chart.monthPillar.stem}${chart.monthPillar.branch} ${chart.dayPillar.stem}${chart.dayPillar.branch} ${chart.hourPillar.stem}${chart.hourPillar.branch}`);
    console.log(`   ☀ Day Master: ${chart.dayMaster} (${chart.dayMasterYinYang} ${chart.dayMasterElement})`);

    // 1. 生成报告（Annual Pass 生成两份）
    console.log("   ⏳ Generating AI report(s)...");
    const birthInfo = {
      name: order.name,
      birthDate: order.birthDate,
      birthTime: order.birthTime,
      birthCity: order.birthCity,
      gender: order.gender || "other",
      focusArea: order.focusArea,
      orderDate: order.createdAt,
    };

    if (isAnnualPass) {
      // Annual Pass: 生成 Life Blueprint + Year Ahead 两份报告
      const [lifeBlueprint, yearAhead] = await Promise.all([
        generateReport(birthInfo, "life-blueprint", chart),
        generateReport(birthInfo, "year-ahead", chart),
      ]);

      // 保存两份报告
      const reportsDir = path.join(process.cwd(), "data", "reports");
      if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
      const bpPath = path.join(reportsDir, `${order.orderId}-life-blueprint.md`);
      const yaPath = path.join(reportsDir, `${order.orderId}-year-ahead.md`);
      fs.writeFileSync(bpPath, lifeBlueprint);
      fs.writeFileSync(yaPath, yearAhead);
      console.log(`   ✅ Reports saved: ${bpPath}, ${yaPath}`);

      // 发送 Annual Pass 专属交付邮件（含两份报告预览）
      console.log(`   ⏳ Sending Annual Pass delivery email to ${order.email}...`);
      const sent = await sendEmail({
        to: order.email,
        subject: `Your Bazi Bliss Annual Pass — Reports Are Ready!`,
        html: buildAnnualPassDeliveryEmail(order.name, lifeBlueprint, yearAhead),
      });

      if (sent) {
        console.log(`   ✅ Email sent!`);
      } else {
        console.log(`   ⚠ Email not sent (check RESEND_API_KEY)`);
      }

      // 激活订阅
      order.subscriptionActive = true;
    } else {
      // 普通订单：生成单份报告
      const reportType = order.productId === "year-ahead" ? "year-ahead" : "life-blueprint";
      const reportMarkdown = await generateReport(birthInfo, reportType, chart);

      const reportsDir = path.join(process.cwd(), "data", "reports");
      if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
      const reportPath = path.join(reportsDir, `${order.orderId}.md`);
      fs.writeFileSync(reportPath, reportMarkdown);
      console.log(`   ✅ Report saved: ${reportPath}`);

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
    }

    // 4. 标记为已完成
    order.status = "fulfilled";
    fs.writeFileSync(
      path.join(ORDERS_DIR, `${order.orderId}.json`),
      JSON.stringify(order, null, 2)
    );
    console.log(`   ✅ Order marked as fulfilled.${isAnnualPass ? " 🔁 Subscription active." : ""}\n`);
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
