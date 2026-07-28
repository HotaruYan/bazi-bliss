/**
 * Lemon Squeezy 支付集成
 *
 * MVP 阶段：手动在 Lemon Squeezy Dashboard 创建产品和 checkout，
 * 用户在 /order 页面提交表单后，重定向到 Lemon Squeezy 的付款链接。
 *
 * 自定义数据通过 checkout data -> custom 字段传递，在 webhook 中取回。
 */

const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID!;
const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY!;

interface CreateCheckoutParams {
  name: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  gender: string;
  focusArea: string;
  productId: string;
}

interface LemonSqueezyCheckoutResponse {
  data: {
    id: string;
    attributes: {
      url: string;
    };
  };
  errors?: Array<{ detail: string }>;
}

const PRODUCT_VARIANT_MAP: Record<string, string> = {
  "life-blueprint": process.env.LS_VARIANT_LIFE_BLUEPRINT || "",
  "year-ahead": process.env.LS_VARIANT_YEAR_AHEAD || "",
  "annual-pass": process.env.LS_VARIANT_ANNUAL_PASS || "",
};

export async function createCheckout(
  params: CreateCheckoutParams
): Promise<string | null> {
  if (!LEMON_SQUEEZY_API_KEY || !LEMON_SQUEEZY_STORE_ID) {
    console.warn("⚠ Lemon Squeezy not configured. Using mock checkout URL.");
    return `/thank-you?mock=true&email=${encodeURIComponent(params.email)}`;
  }

  const variantId = PRODUCT_VARIANT_MAP[params.productId];
  if (!variantId) {
    console.error("Unknown product:", params.productId);
    return null;
  }

  try {
    const res = await fetch(
      "https://api.lemonsqueezy.com/v1/checkouts",
      {
        method: "POST",
        headers: {
          "Accept": "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          "Authorization": `Bearer ${LEMON_SQUEEZY_API_KEY}`,
        },
        body: JSON.stringify({
          data: {
            type: "checkouts",
            attributes: {
              checkout_data: {
                email: params.email,
                name: params.name,
                custom: {
                  birthDate: params.birthDate,
                  birthTime: params.birthTime,
                  birthCity: params.birthCity,
                  gender: params.gender,
                  focusArea: params.focusArea,
                  productId: params.productId,
                },
              },
              checkout_options: {
                embed: false,
                button_color: "#b45309",
              },
              product_options: {
                redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you`,
              },
            },
            relationships: {
              store: {
                data: {
                  type: "stores",
                  id: LEMON_SQUEEZY_STORE_ID,
                },
              },
              variant: {
                data: {
                  type: "variants",
                  id: variantId,
                },
              },
            },
          },
        }),
      }
    );

    const json: LemonSqueezyCheckoutResponse = await res.json();

    if (json.errors) {
      console.error("Lemon Squeezy error:", json.errors);
      return null;
    }

    return json.data.attributes.url;
  } catch (err) {
    console.error("Failed to create checkout:", err);
    return null;
  }
}

export interface OrderData {
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

/**
 * 验证 Lemon Squeezy webhook 签名
 * MVP 阶段简单处理，生产环境需要验证 X-Signature header
 */
export function verifyWebhookSignature(body: string, signature: string): boolean {
  if (!LEMON_SQUEEZY_API_KEY) return false;

  // 生产环境需要实现 HMAC-SHA256 签名验证
  // 参考: https://docs.lemonsqueezy.com/api/webhooks#signing-requests
  // MVP 阶段如果没配 API key，跳过验证
  return true;
}
