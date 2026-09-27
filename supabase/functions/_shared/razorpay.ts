import { hmacHex, HttpError, secureEqual } from "./core.ts";

export type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  status: string;
};
export type RazorpayPayment = {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
};

export function razorpayCredentials(): { keyId: string; secret: string } {
  const keyId = (Deno.env.get("RAZORPAY_KEY_ID") || "").trim();
  const secret = (Deno.env.get("RAZORPAY_KEY_SECRET") || "").trim();
  if (!keyId || !secret) {
    throw new HttpError(503, "Payment service is not configured");
  }
  const checkoutMode = Deno.env.get("BLAZEBYTE_CHECKOUT_MODE");
  if (checkoutMode !== "test" && checkoutMode !== "live") {
    throw new HttpError(503, "Checkout mode is not configured");
  }
  if (!keyId.startsWith(checkoutMode === "live" ? "rzp_live_" : "rzp_test_")) {
    throw new HttpError(503, "Razorpay key does not match checkout mode");
  }
  return { keyId, secret };
}

async function razorpayFetch<T>(
  path: string,
  method: "GET" | "POST",
  body?: unknown,
): Promise<T> {
  const { keyId, secret } = razorpayCredentials();
  const response = await fetch(`https://api.razorpay.com/v1/${path}`, {
    method,
    headers: {
      Authorization: `Basic ${btoa(`${keyId}:${secret}`)}`,
      "Content-Type": "application/json",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) {
    throw new HttpError(502, "Payment provider is temporarily unavailable");
  }
  return await response.json() as T;
}

export async function createRazorpayOrder(
  amountPaise: number,
  receipt: string,
  notes: Record<string, string>,
): Promise<RazorpayOrder> {
  const order = await razorpayFetch<RazorpayOrder>("orders", "POST", {
    amount: amountPaise,
    currency: "INR",
    receipt,
    notes,
  });
  if (
    !/^order_[A-Za-z0-9]+$/.test(order.id) || order.amount !== amountPaise ||
    order.currency !== "INR"
  ) {
    throw new HttpError(502, "Payment provider returned an invalid order");
  }
  return order;
}

export async function fetchRazorpayPayment(
  paymentId: string,
): Promise<RazorpayPayment> {
  if (!/^pay_[A-Za-z0-9]+$/.test(paymentId)) {
    throw new HttpError(400, "Invalid payment ID");
  }
  return await razorpayFetch<RazorpayPayment>(
    `payments/${encodeURIComponent(paymentId)}`,
    "GET",
  );
}

export async function verifyCheckoutSignature(
  storedOrderId: string,
  paymentId: string,
  suppliedSignature: string,
): Promise<boolean> {
  if (!/^[0-9a-f]{64}$/i.test(suppliedSignature)) return false;
  const { secret } = razorpayCredentials();
  const expected = await hmacHex(secret, `${storedOrderId}|${paymentId}`);
  return secureEqual(expected, suppliedSignature.toLowerCase());
}

export async function verifyWebhookSignature(
  rawBody: string,
  suppliedSignature: string,
): Promise<boolean> {
  const secret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
  if (!secret) throw new HttpError(503, "Webhook is not configured");
  if (!/^[0-9a-f]{64}$/i.test(suppliedSignature)) return false;
  const expected = await hmacHex(secret, rawBody);
  return secureEqual(expected, suppliedSignature.toLowerCase());
}

export function assertPaymentMatches(
  payment: RazorpayPayment,
  orderId: string,
  amountPaise: number,
): void {
  if (
    payment.order_id !== orderId || payment.amount !== amountPaise ||
    payment.currency !== "INR"
  ) {
    throw new HttpError(409, "Payment details do not match the order");
  }
}
