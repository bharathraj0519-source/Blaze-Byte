import { HttpError, stringField } from "./core.ts";

export async function verifyTurnstile(
  tokenInput: unknown,
  submissionId: string,
): Promise<void> {
  const mode = Deno.env.get("BLAZEBYTE_CHECKOUT_MODE");
  if (mode !== "test" && mode !== "live") {
    throw new HttpError(503, "Checkout mode is not configured");
  }
  const secret = Deno.env.get("BLAZEBYTE_TURNSTILE_SECRET") || "";
  const siteKey = Deno.env.get("BLAZEBYTE_TURNSTILE_SITE_KEY") || "";
  if (mode === "live" && (!secret || !siteKey)) {
    throw new HttpError(503, "Form protection is not configured");
  }
  if (!secret) return; // Local/test development without a widget.
  const token = stringField(tokenInput, "Verification token", 1, 2_048);
  let response: Response;
  try {
    response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          response: token,
          idempotency_key: submissionId,
        }),
        signal: AbortSignal.timeout(8_000),
      },
    );
  } catch {
    throw new HttpError(503, "Verification service is temporarily unavailable");
  }
  if (!response.ok) {
    throw new HttpError(503, "Verification service is temporarily unavailable");
  }
  const result = await response.json().catch(() => ({})) as {
    success?: boolean;
    hostname?: string;
  };
  if (result.success !== true) {
    throw new HttpError(400, "Please complete the security check again");
  }
  if (
    mode === "live" && result.hostname !== "blazebyte.store" &&
    result.hostname !== "www.blazebyte.store"
  ) {
    throw new HttpError(400, "Security check did not match this website");
  }
}
