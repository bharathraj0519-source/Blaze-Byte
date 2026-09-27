import { HttpError } from "./core.ts";
import { eq, type PaymentAttempt, paymentByOrder, updateRows } from "./db.ts";
import {
  assertPaymentMatches,
  fetchRazorpayPayment,
  type RazorpayPayment,
} from "./razorpay.ts";

export async function confirmCapturedPayment(
  orderId: string,
  paymentId: string,
  verifiedPayment?: RazorpayPayment,
): Promise<PaymentAttempt | null> {
  const attempt = await paymentByOrder(orderId);
  if (!attempt) return null;
  const providerPayment = verifiedPayment ||
    await fetchRazorpayPayment(paymentId);
  assertPaymentMatches(providerPayment, orderId, attempt.amount_paise);
  if (providerPayment.status !== "captured") {
    throw new HttpError(409, "Payment has not been captured");
  }
  if (attempt.status === "paid") {
    if (attempt.razorpay_payment_id !== paymentId) {
      throw new HttpError(409, "Order was paid by a different payment");
    }
    return attempt;
  }
  const rows = await updateRows<PaymentAttempt>(
    "payment_attempts",
    `${eq("id", attempt.id)}&status=neq.paid`,
    {
      razorpay_payment_id: paymentId,
      status: "paid",
      payment_error: null,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  );
  if (rows.length === 1) return rows[0];
  const current = await paymentByOrder(orderId);
  if (current?.status === "paid" && current.razorpay_payment_id === paymentId) {
    return current;
  }
  throw new HttpError(409, "Payment status changed while confirming");
}

export function publicPaymentStatus(
  attempt: PaymentAttempt | null,
  stage: "advance" | "balance",
  amountPaise: number | null,
) {
  return {
    status: attempt?.status || "not_started",
    paymentStage: stage,
    amountPaise,
    currency: "INR",
    paidAt: attempt?.paid_at || null,
    paymentError: attempt?.payment_error || null,
  };
}
