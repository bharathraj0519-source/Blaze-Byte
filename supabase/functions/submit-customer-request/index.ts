import { getPlan, splitAdvance } from "../_shared/catalog.ts";
import {
  handleJsonPost,
  HttpError,
  optionalString,
  randomReference,
  randomToken,
  readJson,
  requireToken,
  secureEqual,
  sha256Hex,
  stringField,
} from "../_shared/core.ts";
import {
  DbError,
  insertRows,
  requestBySubmission,
  type ServiceRequest,
} from "../_shared/db.ts";
import { verifyTurnstile } from "../_shared/turnstile.ts";

function responseFor(row: ServiceRequest, requestToken: string) {
  const plan = getPlan(row.plan_id);
  return {
    referenceNumber: row.reference_number,
    requestToken,
    serviceCategory: row.service_category,
    planId: row.plan_id,
    planName: row.plan_name,
    checkoutMode: row.checkout_mode,
    billingPeriod: row.billing_period,
    fullAmountPaise: row.full_amount_paise,
    advanceAmountPaise: row.advance_amount_paise,
    balanceAmountPaise: row.balance_amount_paise,
    startingPricePaise: plan?.startingPricePaise || null,
    currency: row.currency,
  };
}

Deno.serve((req) =>
  handleJsonPost(req, async () => {
    const body = await readJson(req);
    const plan = getPlan(body.planId);
    if (!plan) throw new HttpError(400, "Choose a valid package");
    if (body.privacyConsent !== true) {
      throw new HttpError(400, "Privacy consent is required");
    }

    const firstName = stringField(body.firstName, "First name", 1, 80);
    const lastName = stringField(body.lastName, "Last name", 1, 80);
    const phone = stringField(body.phone, "Phone", 7, 24);
    const email = stringField(body.email, "Email", 5, 254).toLowerCase();
    if (!/^[+0-9 ()-]{7,24}$/.test(phone)) {
      throw new HttpError(400, "Enter a valid phone number");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new HttpError(400, "Enter a valid email address");
    }
    const company = optionalString(body.company, "Company", 120);
    const projectType = optionalString(body.projectType, "Project type", 120);
    const projectDetails = optionalString(
      body.projectDetails,
      "Project details",
      5_000,
    );
    const submissionId = body.submissionId === undefined
      ? crypto.randomUUID()
      : stringField(body.submissionId, "Submission ID", 36, 36);
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        .test(submissionId)
    ) {
      throw new HttpError(400, "Invalid submission ID");
    }
    const requestToken = body.requestToken === undefined
      ? randomToken()
      : requireToken(body.requestToken);
    const tokenHash = await sha256Hex(requestToken);

    const existing = await requestBySubmission(submissionId);
    if (existing) {
      if (
        !secureEqual(existing.request_token_hash, tokenHash) ||
        existing.plan_id !== plan.id || existing.email !== email
      ) {
        throw new HttpError(409, "Submission ID was already used");
      }
      return responseFor(existing, requestToken);
    }

    await verifyTurnstile(body.turnstileToken, submissionId);
    const amounts = plan.fullAmountPaise === null
      ? null
      : splitAdvance(plan.fullAmountPaise);
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const rows = await insertRows<ServiceRequest>("service_requests", {
          submission_id: submissionId,
          reference_number: randomReference(),
          request_token_hash: tokenHash,
          service_category: plan.category,
          plan_id: plan.id,
          plan_name: plan.name,
          checkout_mode: plan.checkoutMode,
          billing_period: plan.billingPeriod,
          full_amount_paise: plan.fullAmountPaise,
          advance_amount_paise: amounts?.advanceAmountPaise ?? null,
          balance_amount_paise: amounts?.balanceAmountPaise ?? null,
          currency: "INR",
          first_name: firstName,
          last_name: lastName,
          phone,
          email,
          company,
          project_type: projectType,
          project_details: projectDetails,
          privacy_consent_at: new Date().toISOString(),
        });
        if (rows.length !== 1) {
          throw new HttpError(503, "Could not save request");
        }
        return responseFor(rows[0], requestToken);
      } catch (error) {
        if (!(error instanceof DbError && error.code === "23505")) {
          throw error;
        }
        const duplicate = await requestBySubmission(submissionId);
        if (duplicate) {
          if (
            !secureEqual(duplicate.request_token_hash, tokenHash) ||
            duplicate.plan_id !== plan.id || duplicate.email !== email
          ) {
            throw new HttpError(409, "Submission ID was already used");
          }
          return responseFor(duplicate, requestToken);
        }
        // A random reference collision is extraordinarily unlikely; retry it.
      }
    }
    throw new HttpError(503, "Could not reserve a request reference");
  })
);
