export type ServiceCategory = "website" | "marketing" | "ai" | "app";
export type BillingPeriod = "one_time" | "month" | "custom";
export type CheckoutMode = "advance" | "quote";

export type Plan = {
  id: string;
  category: ServiceCategory;
  name: string;
  billingPeriod: BillingPeriod;
  checkoutMode: CheckoutMode;
  fullAmountPaise: number | null;
  startingPricePaise?: number;
};

// The browser may display these amounts, but only this server catalog can
// determine the amount used for a Razorpay order.
export const PLAN_CATALOG: Readonly<Record<string, Readonly<Plan>>> = Object
  .freeze({
    "web-basic": {
      id: "web-basic",
      category: "website",
      name: "Website Basic",
      billingPeriod: "one_time",
      checkoutMode: "advance",
      fullAmountPaise: 500_000,
    },
    "web-growth": {
      id: "web-growth",
      category: "website",
      name: "Website Growth",
      billingPeriod: "one_time",
      checkoutMode: "advance",
      fullAmountPaise: 1_200_000,
    },
    "web-pro": {
      id: "web-pro",
      category: "website",
      name: "Website Pro",
      billingPeriod: "one_time",
      checkoutMode: "advance",
      fullAmountPaise: 2_500_000,
    },
    "web-scale": {
      id: "web-scale",
      category: "website",
      name: "Website Scale",
      billingPeriod: "one_time",
      checkoutMode: "advance",
      fullAmountPaise: 5_000_000,
    },
    "marketing-basic": {
      id: "marketing-basic",
      category: "marketing",
      name: "Marketing Basic",
      billingPeriod: "month",
      checkoutMode: "advance",
      fullAmountPaise: 1_000_000,
    },
    "marketing-growth": {
      id: "marketing-growth",
      category: "marketing",
      name: "Marketing Growth",
      billingPeriod: "month",
      checkoutMode: "advance",
      fullAmountPaise: 2_000_000,
    },
    "marketing-pro": {
      id: "marketing-pro",
      category: "marketing",
      name: "Marketing Pro",
      billingPeriod: "month",
      checkoutMode: "advance",
      fullAmountPaise: 3_500_000,
    },
    "marketing-scale": {
      id: "marketing-scale",
      category: "marketing",
      name: "Marketing Scale",
      billingPeriod: "month",
      checkoutMode: "advance",
      fullAmountPaise: 6_000_000,
    },
    "ai-basic": {
      id: "ai-basic",
      category: "ai",
      name: "AI Basic",
      billingPeriod: "one_time",
      checkoutMode: "advance",
      fullAmountPaise: 2_500_000,
    },
    "ai-growth": {
      id: "ai-growth",
      category: "ai",
      name: "AI Growth",
      billingPeriod: "one_time",
      checkoutMode: "advance",
      fullAmountPaise: 5_000_000,
    },
    "ai-pro": {
      id: "ai-pro",
      category: "ai",
      name: "AI Pro",
      billingPeriod: "one_time",
      checkoutMode: "advance",
      fullAmountPaise: 9_000_000,
    },
    "ai-scale": {
      id: "ai-scale",
      category: "ai",
      name: "AI Scale",
      billingPeriod: "one_time",
      checkoutMode: "advance",
      fullAmountPaise: 15_000_000,
    },
    "app-custom": {
      id: "app-custom",
      category: "app",
      name: "Custom App",
      billingPeriod: "custom",
      checkoutMode: "quote",
      fullAmountPaise: null,
      startingPricePaise: 5_000_000,
    },
  });

export function getPlan(planId: unknown): Readonly<Plan> | null {
  return typeof planId === "string" && Object.hasOwn(PLAN_CATALOG, planId)
    ? PLAN_CATALOG[planId]
    : null;
}

export function splitAdvance(
  fullAmountPaise: number,
): { advanceAmountPaise: number; balanceAmountPaise: number } {
  const advanceAmountPaise = Math.ceil(fullAmountPaise / 2);
  return {
    advanceAmountPaise,
    balanceAmountPaise: fullAmountPaise - advanceAmountPaise,
  };
}
