import {
  handleJsonPost,
  HttpError,
  readJson,
  stringField,
} from "../_shared/core.ts";
import {
  eq,
  ownedRequest,
  type PaymentAttempt,
  paymentByOrder,
  updateRows,
} from "../_shared/db.ts";
import {
  assertPaymentMatches,
  fetchRazorpayPayment,
  verifyCheckoutSignature,
} from "../_shared/razorpay.ts";
import { confirmCapturedPayment } from "../_shared/payments.ts";

Deno.serve((req) =>
  handleJsonPost(req, async () => {
    const body = await readJson(req, 4_096);
    const request = await ownedRequest(body.referenceNumber, body.requestToken);
    const orderId = stringField(body.razorpay_order_id, "Order ID", 8, 100);
    const paymentId = stringField(
      body.razorpay_payment_id,
      "Payment ID",
      6,
      100,
    );
    const signature = stringField(body.razorpay_signature, "Signature", 64, 64);
    if (
      !/^order_[A-Za-z0-9]+$/.test(orderId) ||
      !/^pay_[A-Za-z0-9]+$/.test(paymentId)
    ) {
      throw new HttpError(400, "Invalid payment response");
    }

    const attempt = await paymentByOrder(orderId);
    if (!attempt || attempt.request_id !== request.id) {
      throw new HttpError(404, "Payment order not found");
    }
    // Razorpay's signature must be built using our stored order ID.
    if (
      !await verifyCheckoutSignature(
        attempt.razorpay_order_id!,
        paymentId,
        signature,
      )
    ) {
      throw new HttpError(400, "Invalid payment signature");
    }
    const providerPayment = await fetchRazorpayPayment(paymentId);
    assertPaymentMatches(
      providerPayment,
      attempt.razorpay_order_id!,
      attempt.amount_paise,
    );
    if (
      providerPayment.status !== "authorized" &&
      providerPayment.status !== "captured"
    ) {
      throw new HttpError(409, "Payment is not authorized");
    }
    if (attempt.status === "paid") {
      if (attempt.razorpay_payment_id !== paymentId) {
        throw new HttpError(409, "Order was paid by a different payment");
      }
      return {
        verified: true,
        status: "paid",
        referenceNumber: request.reference_number,
      };
    }

    if (providerPayment.status === "captured") {
      await confirmCapturedPayment(
        attempt.razorpay_order_id!,
        paymentId,
        providerPayment,
      );
      return {
        verified: true,
        status: "paid",
        referenceNumber: request.reference_number,
      };
    }

    const rows = await updateRows<PaymentAttempt>(
      "payment_attempts",
      `${eq("id", attempt.id)}&status=neq.paid`,
      {
        razorpay_payment_id: paymentId,
        status: "processing",
        payment_error: null,
        updated_at: new Date().toISOString(),
      },
    );
    if (rows.length === 0) {
      const current = await paymentByOrder(orderId);
      if (
        current?.status === "paid" && current.razorpay_payment_id === paymentId
      ) {
        return {
          verified: true,
          status: "paid",
          referenceNumber: request.reference_number,
        };
      }
      throw new HttpError(409, "Payment status changed while verifying");
    }
    return {
      verified: true,
      status: "processing",
      referenceNumber: request.reference_number,
    };
  })
);
