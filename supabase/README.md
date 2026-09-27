# BlazeByte checkout v2 (local implementation)

The six Edge Functions and additive migration in this folder are **not deployed**. They create a new checkout flow alongside the existing `customer_requests` table and existing payment functions. Historical customer requests and paid payment rows are untouched.

## Package catalog

The server catalog is `functions/_shared/catalog.ts`. The displayed prices in the website must match these integer paise values. Marketing prices are **per month**; the 50% advance and 50% balance cover the first month only. Following months require a separate agreement/invoice. Custom app work starts above ₹50,000 and is quote-only, with no immediate Razorpay button.

| `planId` | Full price | Due now | Period |
| --- | ---: | ---: | --- |
| `web-basic` | ₹5,000 | ₹2,500 | Project |
| `web-growth` | ₹12,000 | ₹6,000 | Project |
| `web-pro` | ₹25,000 | ₹12,500 | Project |
| `web-scale` | ₹50,000 | ₹25,000 | Project |
| `marketing-basic` | ₹10,000 | ₹5,000 | First month |
| `marketing-growth` | ₹20,000 | ₹10,000 | First month |
| `marketing-pro` | ₹35,000 | ₹17,500 | First month |
| `marketing-scale` | ₹60,000 | ₹30,000 | First month |
| `ai-basic` | ₹25,000 | ₹12,500 | Project |
| `ai-growth` | ₹50,000 | ₹25,000 | Project |
| `ai-pro` | ₹90,000 | ₹45,000 | Project |
| `ai-scale` | ₹1,50,000 | ₹75,000 | Project |
| `app-custom` | Quote from above ₹50,000 | None | Custom |

## Browser contract

First, `GET /functions/v1/checkout-config-v2` to read `{ checkoutMode: "test" | "live", turnstileSiteKey: string | null }`. It contains no private secret. The static page can load and render the widget from this response. If it returns 503, disable order submission and show a friendly retry message.

All other calls are JSON `POST` requests with the public Supabase `apikey` header and `Content-Type: application/json`. The public key is a routing key, not proof of identity. Functions that access an existing request also require its high-entropy `requestToken`.

1. Generate one `submissionId = crypto.randomUUID()` and one 32-byte base64url `requestToken` for each new form submission. Reuse the **same values** if the network request is retried. A full page reload before a response may require a new form submission; do not put the token in a URL.
2. `POST /functions/v1/submit-customer-request`:

   ```json
   {
     "submissionId": "browser-generated UUID",
     "requestToken": "browser-generated 32-byte base64url token",
     "planId": "web-basic",
     "firstName": "Customer",
     "lastName": "Name",
     "phone": "+91 9000000000",
     "email": "customer@example.com",
     "company": "Optional",
     "projectType": "Optional",
     "projectDetails": "Optional",
     "privacyConsent": true,
     "turnstileToken": "Cloudflare widget response in live mode"
   }
   ```

   Response: `{ referenceNumber, requestToken, serviceCategory, planId, planName, checkoutMode, billingPeriod, fullAmountPaise, advanceAmountPaise, balanceAmountPaise, startingPricePaise, currency }`. Amounts are integer paise, or `null` for `app-custom`. The server echoes the token; store it only in browser memory/session needed for checkout. Never send it to FormSubmit, analytics, logs, or URLs.

3. For `checkoutMode: "advance"`, `POST /functions/v1/create-razorpay-order-v2` with `{ referenceNumber, requestToken, paymentStage: "advance" }`. Response: `{ status, keyId, orderId, amount, totalAmount, balanceAmount, currency, planId, planName, paymentStage, referenceNumber }`. Render `amount` from this response in Razorpay Checkout. `status: "paid"` means it was already paid and no new checkout should open. Repeated calls reuse the existing Razorpay order.
4. After the Razorpay Checkout handler, `POST /functions/v1/verify-razorpay-payment-v2` with `{ referenceNumber, requestToken, razorpay_order_id, razorpay_payment_id, razorpay_signature }`. The server verifies the signature **using its stored order ID** and fetches the payment from Razorpay to check its order, exact amount, INR currency, and status. Response status is `paid` if captured or `processing` if authorized but not captured.
5. `POST /functions/v1/get-payment-status-v2` with `{ referenceNumber, requestToken, paymentStage: "advance" }` for status polling. Show paid/success only after status is `paid`. If Razorpay's webhook is delayed, the status function can reconcile a captured payment by calling Razorpay's API.

Browser failure and cancel callbacks are only hints, not a confirmed order status. They are not allowed to write payment state. The `payment.failed` webhook also leaves the order state unchanged because another payment for the same Razorpay order may succeed. Support can reconcile a stuck payment using the Razorpay dashboard and the customer reference number.

`paymentStage: "balance"` is reserved for the balance after project or first-month work. It is blocked until staff set `service_requests.balance_eligible_at` and the advance is paid. There is no customer-facing balance flow yet.

## Private configuration and launch gates

Configure these as Supabase Edge Function Secrets, never in HTML or Git:

- `BLAZEBYTE_CHECKOUT_MODE`: `test` or `live`. A test mode value only accepts an `rzp_test_` key; live only accepts `rzp_live_`. Missing or mismatched configuration fails closed.
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`: matching Razorpay keys for that mode.
- `RAZORPAY_WEBHOOK_SECRET`: the secret configured for the new v2 webhook URL.
- `BLAZEBYTE_TURNSTILE_SITE_KEY`: the public widget sitekey; required as a live launch guard.
- `BLAZEBYTE_TURNSTILE_SECRET`: private Turnstile secret; required in live mode. The server calls Siteverify and checks the hostname is `blazebyte.store` or `www.blazebyte.store`.
- Supabase automatically provides `SUPABASE_URL` plus service-role or new secret keys. These are read only by Edge Functions.

Before switching the website: apply the additive migration; configure the above secrets; deploy the six v2 functions with `verify_jwt = false` as in `config.toml`; create a Razorpay webhook for `payment.captured` and `payment.failed` at `/functions/v1/razorpay-webhook-v2`; test each package amount, a captured payment, failure, cancellation, retry, and quote-only app; then publish the frontend pointing at v2 endpoints. The current functions and rows remain available during this transition.

The submit function does not send email. If the frontend keeps FormSubmit, send only contact details, selected plan ID, and reference number. Never send the request token or Razorpay IDs through FormSubmit.

For spam protection, embed Cloudflare Turnstile in the order form and pass its token. [Cloudflare's validation guide](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) requires Siteverify on the server; the new submit function does that in live mode.
