import { handleJsonPost, HttpError, readJson } from "../_shared/core.ts";
import { ownedRequest, paymentByStage } from "../_shared/db.ts";
import {
  confirmCapturedPayment,
  publicPaymentStatus,
} from "../_shared/payments.ts";

Deno.serve((req) =>
  handleJsonPost(req, async () => {
    const body = await readJson(req, 4_096);
    const request = await ownedRequest(body.referenceNumber, body.requestToken);
    const stage = body.paymentStage === "balance" ? "balance" : "advance";
    if (
      body.paymentStage !== undefined && body.paymentStage !== stage
    ) throw new HttpError(400, "Invalid payment stage");
    if (request.checkout_mode === "quote") {
      return {
        status: "not_required",
        paymentStage: stage,
        amountPaise: null,
        currency: "INR",
      };
    }
    let attempt = await paymentByStage(request.id, stage);
    if (
      attempt && attempt.status !== "paid" && attempt.razorpay_order_id &&
      attempt.razorpay_payment_id &&
      Date.now() - Date.parse(attempt.updated_at) >= 15_000
    ) {
      // Razorpay recommends fetching payment status if a user-facing flow is
      // waiting for a delayed webhook. Only a captured matching payment can win.
      try {
        attempt = await confirmCapturedPayment(
          attempt.razorpay_order_id,
          attempt.razorpay_payment_id,
        ) || attempt;
      } catch (error) {
        if (
          !(error instanceof HttpError &&
            (error.status === 409 || error.status === 502))
        ) throw error;
      }
    }
    return publicPaymentStatus(
      attempt,
      stage,
      stage === "advance"
        ? request.advance_amount_paise
        : request.balance_amount_paise,
    );
  })
);
