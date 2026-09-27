import {
  corsHeaders,
  HttpError,
  json,
  requirePublishableKey,
} from "../_shared/core.ts";
import { razorpayCredentials } from "../_shared/razorpay.ts";

Deno.serve((req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }
  if (req.method !== "GET") {
    return json(req, { error: "Method not allowed" }, 405);
  }
  try {
    requirePublishableKey(req);
    const checkoutMode = Deno.env.get("BLAZEBYTE_CHECKOUT_MODE");
    if (checkoutMode !== "test" && checkoutMode !== "live") {
      throw new HttpError(503, "Checkout is not configured");
    }
    // Also checks that the Razorpay key prefix matches the selected mode.
    razorpayCredentials();
    const turnstileSiteKey = Deno.env.get("BLAZEBYTE_TURNSTILE_SITE_KEY") ||
      null;
    if (
      checkoutMode === "live" &&
      (!turnstileSiteKey || !Deno.env.get("BLAZEBYTE_TURNSTILE_SECRET"))
    ) {
      throw new HttpError(503, "Form protection is not configured");
    }
    return json(req, { checkoutMode, turnstileSiteKey });
  } catch (error) {
    if (error instanceof HttpError) {
      return json(req, { error: error.message }, error.status);
    }
    console.error("Checkout config error", error);
    return json(req, { error: "Checkout is temporarily unavailable" }, 503);
  }
});
