import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Order {
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

function getOrder(id: string): Order | null {
  const dir = process.env.ORDERS_DIR || path.join(process.cwd(), "data", "orders");
  const filepath = path.join(dir, `${id}.json`);
  if (!fs.existsSync(filepath)) return null;
  return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}

function saveOrder(order: Order): void {
  const dir = process.env.ORDERS_DIR || path.join(process.cwd(), "data", "orders");
  const filepath = path.join(dir, `${order.orderId}.json`);
  fs.writeFileSync(filepath, JSON.stringify(order, null, 2));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }

  const reportsDir = path.join(process.cwd(), "data", "reports");
  const reportPath = path.join(reportsDir, `${id}.md`);
  const hasReport = fs.existsSync(reportPath);
  const reportContent = hasReport ? fs.readFileSync(reportPath, "utf-8") : null;

  return NextResponse.json({ order, hasReport, reportContent });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }

  const body = await request.json();
  if (body.status) order.status = body.status;
  saveOrder(order);

  return NextResponse.json({ success: true, order });
}
