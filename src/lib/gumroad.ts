/**
 * Gumroad 支付集成
 *
 * 使用 Gumroad 处理付款，MVP 阶段直接跳转产品链接。
 *
 * 产品链接（Gumroad 后台获得）：
 *   Life Blueprint — bazibliss.gumroad.com/l/vkpgsm
 *   Year Ahead    — bazibliss.gumroad.com/l/kzioyg
 *   Annual Pass   — bazibliss.gumroad.com/l/nntcs
 */

const THANK_YOU_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you`
  : "http://localhost:3000/thank-you";

interface ProductMapping {
  slug: string;
  name: string;
  price: string;
  gumroadPermalink: string;
}

export const PRODUCT_MAP: Record<string, ProductMapping> = {
  "life-blueprint": {
    slug: "life-blueprint",
    name: "Life Blueprint",
    price: "$39.99",
    gumroadPermalink: "vkpgsm",
  },
  "year-ahead": {
    slug: "year-ahead",
    name: "Year Ahead",
    price: "$19.99",
    gumroadPermalink: "kzioyg",
  },
  "annual-pass": {
    slug: "annual-pass",
    name: "Annual Pass",
    price: "$99.99",
    gumroadPermalink: "nntcs",
  },
};

export function getGumroadCheckoutUrl(productId: string): string {
  const product = PRODUCT_MAP[productId];
  if (!product) return THANK_YOU_URL;
  // wanted=true 跳过产品描述页直达付款
  // url= 指定付款成功后跳回 thank-you 页
  return `https://bazibliss.gumroad.com/l/${product.gumroadPermalink}?wanted=true&url=${encodeURIComponent(THANK_YOU_URL)}`;
}

export function getProductByGumroadPermalink(permalink: string): ProductMapping | undefined {
  return Object.values(PRODUCT_MAP).find((p) => p.gumroadPermalink === permalink);
}
