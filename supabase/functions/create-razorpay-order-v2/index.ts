import { handleJsonPost, HttpError, readJson } from "../_shared/core.ts";
import {
  DbError,
  eq,
  insertRows,
  ownedRequest,
  type PaymentAttempt,
  paymentByStage,
  type ServiceRequest,
  updateRows,
} from "../_shared/db.ts";
import {
  createRazorpayOrder,
  razorpayCredentials,
} from "../_shared/razorpay.ts";

function stageAmount(
  request: ServiceRequest,
  stage: "advance" | "balance",
): number {
  const amount = stage === "advance"
    ? request.advance_amount_paise
    : request.balance_amount_paise;
  if (
    request.checkout_mode !== "advance" || !amount ||
    !Number.isSafeInteger(amount)
  ) {
    throw new HttpError(
      400,
      "This request does not have a fixed checkout amount",
    );
  }
  return amount;
}

function checkoutResponse(request: ServiceRequest, payment: PaymentAttempt) {
  if (!payment.razorpay_order_id) {
    throw new HttpError(
      409,
      "Payment order is still being created. Retry in a moment.",
    );
  }
  return {
    status: payment.status,
    keyId: razorpayCredentials().keyId,
    orderId: payment.razorpay_order_id,
    amount: payment.amount_paise,
    totalAmount: request.full_amount_paise,
    balanceAmount: request.balance_amount_paise,
    currency: "INR",
    planId: request.plan_id,
    planName: request.plan_name,
    paymentStage: payment.payment_stage,
    referenceNumber: request.reference_number,
  };
}

Deno.serve((req) =>
  handleJsonPost(req, async () => {
    const body = await readJson(req, 4_096);
    const request = await ownedRequest(body.referenceNumber, body.requestToken);
    const stage = body.paymentStage;
    if (stage !== "advance" && stage !== "balance") {
      throw new HttpError(400, "Invalid payment stage");
    }
    const amount = stageAmount(request, stage);

    if (stage === "balance") {
      if (!request.balance_eligible_at) {
        throw new HttpError(403, "Final balance is not due yet");
      }
      const advance = await paymentByStage(request.id, "advance");
      if (advance?.status !== "paid") {
        throw new HttpError(403, "Advance payment must be complete first");
      }
    }

    let payment = await paymentByStage(request.id, stage);
    let reserved = false;
    if (!payment) {
      try {
        const rows = await insertRows<PaymentAttempt>("payment_attempts", {
          request_id: request.id,
          payment_stage: stage,
          amount_paise: amount,
          currency: "INR",
          status: "creating",
        });
        payment = rows[0];
        reserved = true;
      } catch (error) {
        if (!(error instanceof DbError && error.code === "23505")) {
          throw error;
        }
        payment = await paymentByStage(request.id, stage);
      }
    }
    if (!payment) {
      throw new HttpError(503, "Could not reserve a payment order");
    }
    if (
      payment.amount_paise !== amount || payment.currency !== "INR"
    ) throw new HttpError(409, "Payment amount does not match the request");
    if (payment.status === "paid") {
      return {
        status: "paid",
        referenceNumber: request.reference_number,
        paymentStage: stage,
        amount,
      };
    }

    if (payment.razorpay_order_id) {
      if (payment.status === "failed" || payment.status === "cancelled") {
        const rows = await updateRows<PaymentAttempt>(
          "payment_attempts",
          `${eq("id", payment.id)}&${eq("status", payment.status)}`,
          {
            status: "pending",
            payment_error: null,
            updated_at: new Date().toISOString(),
          },
        );
        payment = rows[0] || await paymentByStage(request.id, stage);
        if (!payment) {
          throw new HttpError(503, "Could not resume the payment order");
        }
        if (payment.status === "paid") {
          return {
            status: "paid",
            referenceNumber: request.reference_number,
            paymentStage: stage,
            amount,
          };
        }
      }
      return checkoutResponse(request, payment);
    }

    if (payment.status === "failed" || payment.status === "cancelled") {
      const rows = await updateRows<PaymentAttempt>(
        "payment_attempts",
        `${eq("id", payment.id)}&${eq("status", payment.status)}`,
        {
          status: "creating",
          payment_error: null,
          updated_at: new Date().toISOString(),
        },
      );
      if (rows.length !== 1) {
        throw new HttpError(
          409,
          "Payment order is being prepared. Retry in a moment.",
        );
      }
      payment = rows[0];
      reserved = true;
    } else if (
      payment.status === "creating" &&
      Date.now() - Date.parse(payment.created_at) > 120_000
    ) {
      // An old creation may have reached Razorpay before the function stopped.
      // Manual reconciliation is safer than creating a second payable order.
      throw new HttpError(
        409,
        "Payment order needs review. Contact BlazeByte with your reference number.",
      );
    } else if (payment.status !== "creating") {
      throw new HttpError(
        409,
        "Payment order is not ready. Retry in a moment.",
      );
    }
    if (!reserved) {
      throw new HttpError(
        409,
        "Payment order is being prepared. Retry in a moment.",
      );
    }

    try {
      const providerOrder = await createRazorpayOrder(
        amount,
        `${request.reference_number}-${stage}`,
        {
          reference_number: request.reference_number,
          plan_id: request.plan_id,
          payment_stage: stage,
          billing_period: request.billing_period,
        },
      );
      const rows = await updateRows<PaymentAttempt>(
        "payment_attempts",
        `${eq("id", payment.id)}&status=eq.creating`,
        {
          razorpay_order_id: providerOrder.id,
          status: "pending",
          updated_at: new Date().toISOString(),
        },
      );
      if (rows.length !== 1) {
        throw new HttpError(
          503,
          "Order was created but could not be saved",
        );
      }
      return checkoutResponse(request, rows[0]);
    } catch (error) {
      if (
        !(error instanceof HttpError &&
          error.message === "Order was created but could not be saved")
      ) {
        await updateRows<PaymentAttempt>(
          "payment_attempts",
          `${eq("id", payment.id)}&status=eq.creating`,
          {
            status: "failed",
            payment_error: "Could not create a Razorpay order",
            updated_at: new Date().toISOString(),
          },
        ).catch(() => {});
      }
      throw error;
    }
  })
);
