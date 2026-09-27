import { HttpError, json } from "../_shared/core.ts";
import { paymentByOrder } from "../_shared/db.ts";
import { confirmCapturedPayment } from "../_shared/payments.ts";
import { verifyWebhookSignature } from "../_shared/razorpay.ts";

type PaymentEntity = {
  id?: string;
  order_id?: string;
  amount?: number;
  currency?: string;
  status?: string;
  error_description?: string;
  error_reason?: string;
};

Deno.serve(async (req) => {
  if (req.method === "GET") {
    return json(req, { ok: true, service: "razorpay-webhook-v2" });
  }
  if (req.method !== "POST") {
    return json(req, { error: "Method not allowed" }, 405);
  }
  try {
    const declaredSize = Number(req.headers.get("content-length") || "0");
    if (declaredSize > 262_144) {
      throw new HttpError(413, "Webhook is too large");
    }
    const raw = await req.text();
    if (new TextEncoder().encode(raw).length > 262_144) {
      throw new HttpError(413, "Webhook is too large");
    }
    const signature = req.headers.get("x-razorpay-signature") || "";
    if (!await verifyWebhookSignature(raw, signature)) {
      throw new HttpError(401, "Invalid webhook signature");
    }
    let event: Record<string, unknown>;
    try {
      event = JSON.parse(raw);
    } catch {
      throw new HttpError(400, "Invalid webhook JSON");
    }
    if (
      event.event !== "payment.captured" && event.event !== "payment.failed"
    ) return json(req, { ignored: true });
    const payload = event.payload as
      | { payment?: { entity?: PaymentEntity } }
      | undefined;
    const payment = payload?.payment?.entity;
    if (!payment?.order_id || !payment.id) {
      throw new HttpError(400, "Webhook payment details are missing");
    }
    const attempt = await paymentByOrder(payment.order_id);
    if (!attempt) return json(req, { ignored: true }); // Legacy checkout uses its own webhook.
    if (payment.amount !== attempt.amount_paise || payment.currency !== "INR") {
      throw new HttpError(409, "Webhook amount does not match the order");
    }

    if (event.event === "payment.captured") {
      if (payment.status !== "captured") {
        throw new HttpError(409, "Payment is not captured");
      }
      await confirmCapturedPayment(payment.order_id, payment.id);
      return json(req, { received: true, status: "paid" });
    }

    if (payment.status !== "failed") {
      throw new HttpError(409, "Payment failure state is invalid");
    }
    // Razorpay can have several payment attempts for one order. Failure of
    // one payment is not evidence that the whole order failed; another may
    // already be captured. Never downgrade the order from this event.
    return json(req, { received: true, status: attempt.status });
  } catch (error) {
    if (error instanceof HttpError) {
      return json(req, { error: error.message }, error.status);
    }
    console.error("Webhook error", error);
    return json(req, { error: "Webhook processing failed" }, 503);
  }
});
