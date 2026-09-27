# BlazeByte three-service release checklist

This is a staged replacement for the current BlazeByte website. Do not publish
the new static site until the v2 checkout reports live readiness and a payment
test plan is agreed. The current production site and its legacy payment
functions remain available in the meantime.

## Already prepared

- Three responsive service paths: Websites, Digital Marketing, AI Solutions.
- Fixed Basic-to-Scale packages, monthly marketing terms, and quote-only apps.
- 50% advance / 50% balance presentation for fixed-price packages.
- Additive `service_requests` and `payment_attempts` tables with RLS enabled and
  no browser-role read access. The migration is applied in Supabase.
- Six separate v2 Edge Functions are deployed. No legacy payment function was
  replaced. See `supabase/README.md` for their contract.
- Both `index.html` and `web/site/index.html` contain the new frontend. The
  `web/site` directory can be published directly as static assets; a Flutter
  web build also includes this directory under `build/web/site`.

## Private setup in Supabase

Set Edge Function Secrets in the Supabase dashboard; never commit or paste
secrets into a source file or chat:

1. `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`: matching **live** API keys.
2. `BLAZEBYTE_TURNSTILE_SITE_KEY` and `BLAZEBYTE_TURNSTILE_SECRET`: the widget
   must allow `blazebyte.store` and, if used, `www.blazebyte.store`.
3. Create a **new** Razorpay Live webhook pointing to
   `https://ssbxolloyyvlbuefyhda.supabase.co/functions/v1/razorpay-webhook-v2`
   for `payment.captured` and `payment.failed`. Save that webhook's signing
   secret as `RAZORPAY_WEBHOOK_SECRET`. Leave the old webhook unchanged until
   after release.
4. Set `BLAZEBYTE_CHECKOUT_MODE` to `live` once the above values are saved.

The public `checkout-config-v2` endpoint must then return `checkoutMode: live`
and the public Turnstile site key when called with the Supabase publishable
`apikey`. A 503 response means checkout is still safely closed.

## Before the production switch

1. Confirm `blazebyte.store` still shows the current website and its existing
   payment flow is unaffected.
2. Review the new site on a desktop and a phone, including all three routes,
   each package, the app enquiry, the order terms, keyboard navigation, and
   optional sound off by default.
3. Confirm the request form blocks an invalid Turnstile response; confirm
   package IDs and prices cannot be overridden from the browser. Check the
   Razorpay order amount for at least the Basic and Scale plans in each
   service. Do not perform a real charge without explicit authorization.
4. Confirm the webhook URL is live and uses the matching signing secret.
   Simulate or observe captured, failed, cancelled, and delayed confirmation
   cases. A failed individual payment must not downgrade a captured order.
5. Verify FormSubmit notifications reach the studio mailbox. Supabase stores
   the request even if the email notification is delayed; use the reference
   number to find it.
6. Decide the Cloudflare build output deliberately. For the leanest standalone
   site, serve `web/site` as the asset directory with no Flutter build. If the
   existing Flutter build stays in place, its root page embeds `site/index.html`
   in an iframe; test routing, SEO, headers, and checkout on that exact output.

## After publishing

- Confirm Cloudflare reports a successful deployment and the correct commit.
- Open `https://blazebyte.store` in a private window and check the three routes.
- Check network requests, payment form, webhook delivery, and Supabase logs.
- Keep the previous Cloudflare deployment available for immediate rollback.
- Do not enable aggressive CSP source restrictions or HSTS until the full
  Razorpay and Turnstile browser flow has been tested on the live domain.
