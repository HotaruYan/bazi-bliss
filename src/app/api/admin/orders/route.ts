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

function getOrders(): Order[] {
  const dir = process.env.ORDERS_DIR || path.join(process.cwd(), "data", "orders");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as Order)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.toLowerCase();

  let orders = getOrders();

  if (status && status !== "all") {
    orders = orders.filter((o) => o.status === status);
  }

  if (search) {
    orders = orders.filter(
      (o) =>
        o.name.toLowerCase().includes(search) ||
        o.email.toLowerCase().includes(search) ||
        o.orderId.toLowerCase().includes(search)
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const stats = {
    total: orders.length,
    todayCount: orders.filter((o) => o.createdAt.slice(0, 10) === today).length,
    pending: orders.filter((o) => o.status !== "fulfilled").length,
    fulfilled: orders.filter((o) => o.status === "fulfilled").length,
  };

  return NextResponse.json({ orders, stats });
}
