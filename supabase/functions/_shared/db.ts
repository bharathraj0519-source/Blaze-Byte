import {
  HttpError,
  requireReference,
  requireToken,
  secureEqual,
  sha256Hex,
} from "./core.ts";

export type ServiceRequest = {
  id: string;
  submission_id: string;
  reference_number: string;
  request_token_hash: string;
  service_category: "website" | "marketing" | "ai" | "app";
  plan_id: string;
  plan_name: string;
  checkout_mode: "advance" | "quote";
  billing_period: "one_time" | "month" | "custom";
  full_amount_paise: number | null;
  advance_amount_paise: number | null;
  balance_amount_paise: number | null;
  currency: "INR";
  email: string;
  balance_eligible_at: string | null;
};

export type PaymentAttempt = {
  id: string;
  request_id: string;
  payment_stage: "advance" | "balance";
  amount_paise: number;
  currency: "INR";
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  status:
    | "creating"
    | "pending"
    | "processing"
    | "paid"
    | "failed"
    | "cancelled";
  payment_error: string | null;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
};

export class DbError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

function adminKey(): { key: string; legacy: boolean } {
  const raw = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (raw) {
    try {
      const value: unknown = JSON.parse(raw);
      if (
        value && typeof value === "object" && "default" in value &&
        typeof value.default === "string"
      ) {
        return { key: value.default, legacy: false };
      }
    } catch { /* Fall back to the legacy service role key below. */ }
  }
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!key) throw new HttpError(503, "Database is not configured");
  return { key, legacy: true };
}

async function dbFetch<T>(
  table: "service_requests" | "payment_attempts",
  method: "GET" | "POST" | "PATCH",
  query: string,
  body?: unknown,
): Promise<T[]> {
  const root = Deno.env.get("SUPABASE_URL");
  if (!root) throw new HttpError(503, "Database is not configured");
  const { key, legacy } = adminKey();
  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
  if (legacy) headers.Authorization = `Bearer ${key}`;
  const response = await fetch(
    `${root}/rest/v1/${table}${query ? `?${query}` : ""}`,
    {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    },
  );
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const error = result as { code?: string; message?: string } | null;
    throw new DbError(
      response.status,
      error?.code || "unknown",
      error?.message || "Database request failed",
    );
  }
  if (!Array.isArray(result)) {
    throw new DbError(
      502,
      "unexpected_response",
      "Database returned an unexpected response",
    );
  }
  return result as T[];
}

export const eq = (field: string, value: string) =>
  `${field}=eq.${encodeURIComponent(value)}`;

export function selectRows<T>(
  table: "service_requests" | "payment_attempts",
  query: string,
): Promise<T[]> {
  return dbFetch<T>(table, "GET", `select=*&${query}`);
}

export function insertRows<T>(
  table: "service_requests" | "payment_attempts",
  body: unknown,
): Promise<T[]> {
  return dbFetch<T>(table, "POST", "select=*", body);
}

export function updateRows<T>(
  table: "service_requests" | "payment_attempts",
  query: string,
  body: unknown,
): Promise<T[]> {
  return dbFetch<T>(table, "PATCH", `select=*&${query}`, body);
}

export async function requestByReference(
  referenceNumber: string,
): Promise<ServiceRequest | null> {
  const rows = await selectRows<ServiceRequest>(
    "service_requests",
    eq("reference_number", referenceNumber),
  );
  return rows[0] || null;
}

export async function requestBySubmission(
  submissionId: string,
): Promise<ServiceRequest | null> {
  const rows = await selectRows<ServiceRequest>(
    "service_requests",
    eq("submission_id", submissionId),
  );
  return rows[0] || null;
}

export async function ownedRequest(
  referenceInput: unknown,
  tokenInput: unknown,
): Promise<ServiceRequest> {
  const referenceNumber = requireReference(referenceInput);
  const token = requireToken(tokenInput);
  const row = await requestByReference(referenceNumber);
  if (!row || !secureEqual(row.request_token_hash, await sha256Hex(token))) {
    throw new HttpError(404, "Request not found");
  }
  return row;
}

export async function paymentByStage(
  requestId: string,
  stage: "advance" | "balance",
): Promise<PaymentAttempt | null> {
  const rows = await selectRows<PaymentAttempt>(
    "payment_attempts",
    `${eq("request_id", requestId)}&${eq("payment_stage", stage)}`,
  );
  return rows[0] || null;
}

export async function paymentByOrder(
  orderId: string,
): Promise<PaymentAttempt | null> {
  const rows = await selectRows<PaymentAttempt>(
    "payment_attempts",
    eq("razorpay_order_id", orderId),
  );
  return rows[0] || null;
}
