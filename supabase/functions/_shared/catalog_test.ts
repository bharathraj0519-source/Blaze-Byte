import { getPlan, PLAN_CATALOG, splitAdvance } from "./catalog.ts";
import {
  randomReference,
  randomToken,
  requireReference,
  requireToken,
  secureEqual,
  sha256Hex,
} from "./core.ts";

Deno.test("every fixed plan splits into exact advance and balance paise", () => {
  const expected: Record<string, number> = {
    "web-basic": 500_000,
    "web-growth": 1_200_000,
    "web-pro": 2_500_000,
    "web-scale": 5_000_000,
    "marketing-basic": 1_000_000,
    "marketing-growth": 2_000_000,
    "marketing-pro": 3_500_000,
    "marketing-scale": 6_000_000,
    "ai-basic": 2_500_000,
    "ai-growth": 5_000_000,
    "ai-pro": 9_000_000,
    "ai-scale": 15_000_000,
  };
  for (const [id, amount] of Object.entries(expected)) {
    const plan = getPlan(id);
    if (
      !plan || plan.checkoutMode !== "advance" ||
      plan.fullAmountPaise !== amount
    ) throw new Error(`Incorrect server price: ${id}`);
    const split = splitAdvance(amount);
    if (
      split.advanceAmountPaise + split.balanceAmountPaise !== amount ||
      split.advanceAmountPaise !== amount / 2
    ) {
      throw new Error(`Incorrect 50% split: ${id}`);
    }
  }
  if (Object.keys(PLAN_CATALOG).length !== Object.keys(expected).length + 1) {
    throw new Error("Unexpected plan count");
  }
});

Deno.test("app stays quote-only above the 50k starting point", () => {
  const app = getPlan("app-custom");
  if (
    !app || app.checkoutMode !== "quote" || app.fullAmountPaise !== null ||
    app.startingPricePaise !== 5_000_000
  ) {
    throw new Error("App must not enter fixed checkout");
  }
  if (getPlan("tampered-plan") !== null) {
    throw new Error("Unknown package was accepted");
  }
});

Deno.test("ownership token and reference formats are strict", async () => {
  const token = randomToken();
  const reference = randomReference();
  if (
    requireToken(token) !== token || requireReference(reference) !== reference
  ) throw new Error("Generated identifier rejected");
  if (!secureEqual(await sha256Hex(token), await sha256Hex(token))) {
    throw new Error("Token digest comparison failed");
  }
  if (secureEqual(await sha256Hex(token), await sha256Hex(randomToken()))) {
    throw new Error("Different tokens matched");
  }
  try {
    requireReference("BB-1234567");
    throw new Error("Legacy/guessable reference accepted");
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Legacy/guessable reference accepted"
    ) throw error;
  }
});
