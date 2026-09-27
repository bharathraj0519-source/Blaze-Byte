const ALLOWED_ORIGINS = new Set([
  "https://blazebyte.store",
  "https://www.blazebyte.store",
  "https://sparkling-shadow-1bf4.bdraj8244.workers.dev",
]);

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get("origin");
  const allowed = origin &&
    (ALLOWED_ORIGINS.has(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin));
  return {
    ...(allowed
      ? { "Access-Control-Allow-Origin": origin!, Vary: "Origin" }
      : {}),
    "Access-Control-Allow-Headers": "apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  };
}

export function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(req),
  });
}

export async function handleJsonPost(
  req: Request,
  action: () => Promise<unknown>,
): Promise<Response> {
  const origin = req.headers.get("origin");
  if (
    origin && !ALLOWED_ORIGINS.has(origin) &&
    !/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
  ) {
    return json(req, { error: "Origin is not allowed" }, 403);
  }
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }
  if (req.method !== "POST") {
    return json(req, { error: "Method not allowed" }, 405);
  }
  try {
    requirePublishableKey(req);
    return json(req, await action());
  } catch (error) {
    if (error instanceof HttpError) {
      return json(req, { error: error.message }, error.status);
    }
    console.error("Checkout function error", error);
    return json(req, { error: "Service is temporarily unavailable" }, 503);
  }
}

export function requirePublishableKey(req: Request): void {
  const received = req.headers.get("apikey") || "";
  const raw = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "";
  let configured: string[] = [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      configured = Object.values(parsed).filter((value): value is string =>
        typeof value === "string"
      );
    }
  } catch { /* Older projects may still have only a legacy anon key. */ }
  const legacy = Deno.env.get("SUPABASE_ANON_KEY");
  if (legacy) configured.push(legacy);
  if (!received || !configured.some((key) => secureEqual(key, received))) {
    throw new HttpError(401, "Invalid API key");
  }
}

export async function readJson(
  req: Request,
  maxBytes = 16_384,
): Promise<Record<string, unknown>> {
  if (
    !(req.headers.get("content-type") || "").toLowerCase().includes(
      "application/json",
    )
  ) {
    throw new HttpError(415, "JSON content type required");
  }
  const declaredSize = Number(req.headers.get("content-length") || "0");
  if (declaredSize > maxBytes) throw new HttpError(413, "Request is too large");
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > maxBytes) {
    throw new HttpError(413, "Request is too large");
  }
  try {
    const body: unknown = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new Error("Invalid body");
    }
    return body as Record<string, unknown>;
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }
}

export function stringField(
  value: unknown,
  label: string,
  min: number,
  max: number,
): string {
  if (typeof value !== "string") {
    throw new HttpError(400, `${label} is required`);
  }
  const clean = value.trim();
  if (clean.length < min || clean.length > max) {
    throw new HttpError(400, `${label} must be ${min}-${max} characters`);
  }
  return clean;
}

export function optionalString(
  value: unknown,
  label: string,
  max: number,
): string | null {
  if (value === undefined || value === null || value === "") return null;
  return stringField(value, label, 1, max);
}

export function secureEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export async function sha256Hex(value: string): Promise<string> {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(bytes)].map((byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

export async function hmacHex(
  secret: string,
  message: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );
  return [...new Uint8Array(signature)].map((byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

export function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll(
    "/",
    "_",
  ).replaceAll("=", "");
}

export function randomReference(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `BB-${
    [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("")
      .toUpperCase()
  }`;
}

export function requireReference(value: unknown): string {
  if (typeof value !== "string" || !/^BB-[0-9A-F]{12}$/.test(value)) {
    throw new HttpError(400, "Invalid reference number");
  }
  return value;
}

export function requireToken(value: unknown): string {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(value)) {
    throw new HttpError(400, "Invalid request token");
  }
  return value;
}
