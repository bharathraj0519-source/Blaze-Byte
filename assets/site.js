"use strict";

const SUPABASE_URL = "https://ssbxolloyyvlbuefyhda.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_hutGjIj8D5_sqewq7eGhcw_tuTkSX5G";
const STUDIO_EMAIL = "blazebytestudio7@gmail.com";

const catalog = {
  websites: {
    overline: "01 / WEBSITES / THE BUILD PATH",
    title: "Built to make a first impression last.",
    lead: "Fast, purposeful websites that turn your idea into a place people can trust, use, and contact you from.",
    from: "Projects from ₹5,000",
    facts: [["STARTING PRICE", "₹5,000 one-time"], ["DELIVERY MODEL", "Scoped project"], ["FIRST PAYMENT", "50% advance"]],
    outcomes: [
      ["01", "Made for every screen", "Responsive layouts that look composed and remain useful across phones, tablets, and desktops."],
      ["02", "Clear routes to action", "Navigation, enquiries, and calls to action built around what visitors should do next."],
      ["03", "Ready to grow", "A sound foundation for search, analytics, content updates, and future additions."]
    ],
    intro: "Start small or build a more complete digital home. The listed price is for the stated package scope; any extra features are agreed separately.",
    footnote: "Domain, hosting, paid plugins, content writing, and third-party charges are separate unless included in your written proposal.",
    art: '<div class="art-web"><div class="art-web-top"><i></i><i></i><i></i><span></span></div><div class="art-web-body"><h3>Better<br>begins here.</h3><p>A digital front door that feels like your business.</p><b></b><div class="art-web-tiles"><span></span><span></span></div></div></div>',
    packages: [
      { id: "web-basic", name: "Basic", price: 5000, deck: "A sharp first page for a new business.", features: ["One responsive landing page", "Contact and WhatsApp links", "Basic search titles and descriptions", "One review round", "7 days of launch fixes"] },
      { id: "web-growth", name: "Growth", price: 12000, deck: "More room to explain and convert.", features: ["Up to 5 responsive pages", "Enquiry form and map", "On-page SEO foundations", "Analytics connection", "Two review rounds", "30 days of launch fixes"], featured: true },
      { id: "web-pro", name: "Pro", price: 25000, deck: "A fuller brand and content experience.", features: ["Up to 10 custom-designed pages", "Blog or simple CMS setup", "Lead capture and analytics", "Performance and accessibility review", "Three review rounds", "60 days of launch support"] },
      { id: "web-scale", name: "Scale", price: 50000, deck: "A substantial site with a tailored flow.", features: ["Up to 15 custom-designed pages", "One advanced lead or booking workflow", "CMS and analytics setup", "SEO and performance review", "Team handover", "Priority 90-day launch support"] }
    ]
  },
  marketing: {
    overline: "02 / DIGITAL MARKETING / THE REACH PATH",
    title: "Be seen by the right people, consistently.",
    lead: "A practical monthly marketing engine: plan, publish, optimise, and report on the channels that fit your business.",
    from: "Monthly plans from ₹10,000",
    facts: [["STARTING PRICE", "₹10,000 / month"], ["DELIVERY MODEL", "Monthly service"], ["FIRST PAYMENT", "50% of month one"]],
    outcomes: [
      ["01", "A clear content rhythm", "An agreed calendar and static creatives keep your brand active without last-minute scrambling."],
      ["02", "Focused channel work", "We choose the channels and campaigns that suit your audience rather than spreading effort thin."],
      ["03", "Visible progress", "Plain-language monthly reporting shows what shipped, what changed, and what to improve next."]
    ],
    intro: "Monthly packages cover agreed channel management and static creative work. No plan includes video production, reels, or shorts.",
    footnote: "Monthly price; not an automatic subscription. 50% of month one is paid in advance, the other 50% after its agreed work. Later months are billed separately. Ad spend, tools, video, reels, and shorts are excluded.",
    art: '<div class="art-marketing"><span class="art-metric one">REACH +42%</span><span class="art-metric two">NEW LEADS ↗</span><div class="art-marketing-core">↑<small>THE SIGNAL</small></div><span class="art-metric three">CAMPAIGN ACTIVE</span></div>',
    packages: [
      { id: "marketing-basic", name: "Basic", price: 10000, deck: "Build a reliable presence on one channel.", features: ["One social or search channel", "Monthly content calendar", "8 static posts or graphics", "Google Business Profile upkeep", "Monthly performance report"] },
      { id: "marketing-growth", name: "Growth", price: 20000, deck: "Show up in more places, with a plan.", features: ["Up to 2 channels", "12 static posts or graphics", "One ad campaign managed", "Basic SEO or profile recommendations", "Monthly performance review"], featured: true },
      { id: "marketing-pro", name: "Pro", price: 35000, deck: "Connect content, campaigns, and leads.", features: ["Up to 2 channels", "16 static posts or graphics", "Up to 2 ad campaigns managed", "Landing-page recommendations", "Biweekly optimisation review", "Monthly lead and reach report"] },
      { id: "marketing-scale", name: "Scale", price: 60000, deck: "A coordinated multi-channel growth operation.", features: ["Up to 3 channels", "24 static posts or graphics", "Multi-campaign management", "Weekly optimisation review", "Monthly strategy and reporting call", "Priority campaign support"] }
    ]
  },
  ai: {
    overline: "03 / AI SOLUTIONS / THE FLOW PATH",
    title: "Give your team its time back.",
    lead: "Useful AI automations for repetitive work, customer requests, and information flow—with human oversight where it matters.",
    from: "Projects from ₹25,000",
    facts: [["STARTING PRICE", "₹25,000 one-time"], ["DELIVERY MODEL", "Scoped automation"], ["FIRST PAYMENT", "50% advance"]],
    outcomes: [
      ["01", "Workflows that connect", "Move information between the tools your team already uses, with clear triggers and handoffs."],
      ["02", "Human control stays in", "Approvals, guardrails, and exception handling reduce avoidable surprises."],
      ["03", "A handover you can own", "Documented processes, testing, and training make the automation useful after launch."]
    ],
    intro: "Each package is scoped around a specific workflow and agreed integrations. We confirm feasibility, data access, and ongoing third-party fees first.",
    footnote: "AI model usage, API charges, paid automation platforms, messaging fees, and ongoing maintenance are separate unless included in your proposal.",
    art: '<div class="art-ai"><div class="art-ai-node"><small>01 / INPUT</small><strong>New request</strong></div><span class="art-ai-flow"></span><div class="art-ai-node"><small>02 / ROUTE</small><strong>Smart triage</strong></div><div class="art-ai-middle">✦</div><div class="art-ai-node last"><small>03 / OUTPUT</small><strong>Team ready</strong></div></div>',
    packages: [
      { id: "ai-basic", name: "Basic", price: 25000, deck: "Automate one useful job, end to end.", features: ["One defined workflow", "Up to 2 tool connections", "Human approval step if needed", "Testing and setup notes", "30 days of launch fixes"] },
      { id: "ai-growth", name: "Growth", price: 50000, deck: "Connect work across more of your stack.", features: ["Up to 2 defined workflows", "Up to 3 integrations", "Error alerts and monitoring setup", "Team walkthrough and documentation", "60 days of launch support"], featured: true },
      { id: "ai-pro", name: "Pro", price: 90000, deck: "A connected assistant for a larger process.", features: ["Up to 4 defined workflows", "Knowledge assistant or smart routing", "Approval and exception handling", "Usage and quality review", "Team training", "90 days of launch support"] },
      { id: "ai-scale", name: "Scale", price: 150000, deck: "A tailored system for multiple teams.", features: ["Multi-team workflow design", "Custom API integration", "Audit trail and role handoffs", "Testing and rollout plan", "Team training and documentation", "Priority 90-day support"] }
    ]
  }
};

const quotePackage = { id: "app-custom", name: "Custom app", price: null, category: "websites", mode: "quote" };
const byId = (id) => document.getElementById(id);
const money = (rupees) => "₹" + Number(rupees).toLocaleString("en-IN");
const allPackages = Object.values(catalog).flatMap((service) => service.packages);
const findPackage = (id) => allPackages.find((plan) => plan.id === id) || (id === quotePackage.id ? quotePackage : null);
const packageCategory = (id) => Object.keys(catalog).find((category) => catalog[category].packages.some((plan) => plan.id === id)) || "websites";
let currentWorld = "home";
let selectedPlan = null;
let requestContext = null;
let submitting = false;
let paymentBusy = false;
let soundOn = false;
let audioContext = null;
let checkoutConfig = null;
let turnstileToken = "";
let turnstileWidgetId = null;
let turnstileLoader = null;

function setText(id, value) { byId(id).textContent = value; }
function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}
function appendText(parent, tag, className, content) {
  const node = element(tag, className, content);
  parent.append(node);
  return node;
}

function renderService(category) {
  const service = catalog[category];
  setText("serviceOverline", service.overline);
  setText("serviceTitle", service.title);
  setText("serviceLead", service.lead);
  setText("serviceFrom", service.from);
  byId("serviceArt").innerHTML = service.art;
  byId("serviceFacts").replaceChildren(...service.facts.map(([label, value]) => {
    const wrapper = element("div");
    appendText(wrapper, "small", "", label);
    appendText(wrapper, "strong", "", value);
    return wrapper;
  }));
  setText("outcomesCount", "0" + service.outcomes.length + " / WHAT YOU GET");
  byId("outcomesGrid").replaceChildren(...service.outcomes.map(([symbol, title, copy]) => {
    const card = element("article", "outcome");
    appendText(card, "span", "outcome-symbol", symbol);
    const text = element("div");
    appendText(text, "h3", "", title);
    appendText(text, "p", "", copy);
    card.append(text);
    return card;
  }));
  setText("packagesIntro", service.intro);
  setText("packagesFootnote", service.footnote);
  byId("packagesGrid").replaceChildren(...service.packages.map((plan, index) => {
    const card = element("article", "package" + (plan.featured ? " is-featured" : ""));
    appendText(card, "span", "package-label", plan.featured ? "MOST POPULAR" : "0" + (index + 1) + " / " + category.toUpperCase());
    appendText(card, "h3", "", plan.name);
    const price = appendText(card, "p", "package-price", money(plan.price));
    if (category === "marketing") appendText(price, "small", "", " / month");
    appendText(card, "p", "package-deck", plan.deck);
    const list = element("ul");
    for (const feature of plan.features) appendText(list, "li", "", feature);
    card.append(list);
    const button = appendText(card, "button", "", "Start with " + plan.name + " ↗");
    button.type = "button";
    button.dataset.plan = plan.id;
    button.setAttribute("aria-label", "Start " + category + " " + plan.name + " package");
    return card;
  }));
  const extra = byId("serviceExtra");
  extra.hidden = category !== "websites";
  if (category === "websites") {
    extra.innerHTML = '<div><p class="micro-label">Beyond websites</p><h2>Have an app in mind?</h2><p>Custom web and mobile applications are quoted individually above ₹50,000. Tell us your users, core features, and timeline; we will scope it before requesting any payment.</p></div>';
    const button = appendText(extra, "button", "", "Discuss an app ↗");
    button.type = "button";
    button.dataset.plan = quotePackage.id;
  }
}

function renderRoute() {
  const hash = location.hash.slice(1).toLowerCase();
  if (hash === "packages" || hash === "serviceGates".toLowerCase()) return;
  const next = Object.hasOwn(catalog, hash) ? hash : "home";
  const changed = next !== currentWorld;
  currentWorld = next;
  document.body.dataset.world = next;
  byId("homeView").hidden = next !== "home";
  byId("serviceView").hidden = next === "home";
  document.querySelectorAll("[data-nav], [data-service-link]").forEach((link) => {
    if (link.dataset.nav === next || link.dataset.serviceLink === next) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (next !== "home") renderService(next);
  document.title = next === "home" ? "BlazeByte Studio — three ways forward" : (next === "ai" ? "AI Solutions" : next === "marketing" ? "Digital Marketing" : "Websites") + " — BlazeByte Studio";
  if (changed) {
    window.scrollTo({ top: 0, behavior: "instant" });
    byId(next === "home" ? "homeTitle" : "serviceTitle").focus({ preventScroll: true });
    playRouteTone(next);
  }
}

function playRouteTone(world) {
  if (!soundOn) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const notes = world === "websites" ? [392, 523.25] : world === "marketing" ? [329.63, 493.88] : world === "ai" ? [440, 659.25] : [392, 587.33];
    notes.forEach((frequency, index) => {
      const start = audioContext.currentTime + index * .075;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(.055, start + .025);
      gain.gain.exponentialRampToValueAtTime(.0001, start + .17);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + .18);
    });
  } catch (_) { /* Sound is optional; navigation never depends on it. */ }
}

function secureToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}
function apiErrorMessage(data, fallback) {
  const message = String(data?.error || data?.message || "");
  if (/rate|too many/i.test(message)) return "Too many attempts right now. Please wait a moment and try again.";
  if (/already paid/i.test(message)) return "This request has already been paid. Keep your reference number and contact us if you need help.";
  if (/unavailable|timeout|network/i.test(message)) return "The service is temporarily unavailable. Please retry in a moment.";
  return fallback;
}
async function functionRequest(name, payload, timeoutMs = 18000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(SUPABASE_URL + "/functions/v1/" + name, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_PUBLISHABLE_KEY },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store"
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(apiErrorMessage(data, "We could not complete that step. Please try again or email us."));
    return data;
  } catch (error) {
    if (error.name === "AbortError") throw new Error("The request timed out. Please retry; your saved request will not be duplicated.");
    if (error instanceof TypeError) throw new Error("We cannot connect right now. Check your internet connection and try again.");
    throw error;
  } finally { clearTimeout(timeout); }
}

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (turnstileLoader) return turnstileLoader;
  turnstileLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => window.turnstile ? resolve() : reject(new Error("Security check did not load."));
    script.onerror = () => reject(new Error("Security check could not load. Please check your connection."));
    document.head.append(script);
  }).catch((error) => { turnstileLoader = null; throw error; });
  return turnstileLoader;
}

async function prepareCheckout() {
  checkoutConfig = null;
  turnstileToken = "";
  byId("requestSubmit").disabled = true;
  setText("formMessage", "Checking secure checkout availability…");
  byId("challengeWrap").hidden = true;
  try {
    const response = await fetch(SUPABASE_URL + "/functions/v1/checkout-config-v2", { method: "GET", cache: "no-store", headers: { apikey: SUPABASE_PUBLISHABLE_KEY } });
    const config = await response.json().catch(() => ({}));
    if (!response.ok || !["test", "live"].includes(config.checkoutMode)) throw new Error("Secure checkout is being configured. Please email us to start your project.");
    if ((location.hostname === "blazebyte.store" || location.hostname === "www.blazebyte.store") && config.checkoutMode !== "live") {
      throw new Error("Live checkout is not enabled yet. Please email us to start your project.");
    }
    if (config.checkoutMode === "live") {
      if (!config.turnstileSiteKey) throw new Error("The security check is not configured yet. Please email us to start your project.");
      byId("challengeWrap").hidden = false;
      await loadTurnstile();
      if (turnstileWidgetId !== null) window.turnstile.remove(turnstileWidgetId);
      turnstileWidgetId = window.turnstile.render("#turnstileWidget", {
        sitekey: config.turnstileSiteKey,
        theme: "dark",
        size: "flexible",
        callback: (token) => { turnstileToken = token; setText("formMessage", ""); },
        "expired-callback": () => { turnstileToken = ""; setText("formMessage", "Security check expired. Please complete it again."); },
        "error-callback": () => { turnstileToken = ""; setText("formMessage", "Security check could not complete. Please retry or email us."); }
      });
    }
    checkoutConfig = config;
    byId("requestSubmit").disabled = false;
    setText("formMessage", "");
  } catch (error) {
    byId("requestSubmit").disabled = true;
    setText("formMessage", error instanceof TypeError ? "Secure checkout cannot connect right now. Please email us to start your project." : (error.message || "Checkout is unavailable. Please email us."));
  }
}

function openOrder(planId) {
  const plan = findPackage(planId);
  if (!plan) return;
  selectedPlan = plan;
  requestContext = { submissionId: crypto.randomUUID(), requestToken: secureToken(), planId };
  const category = packageCategory(planId);
  const isQuote = plan.mode === "quote";
  byId("requestForm").reset();
  byId("selectedPlanId").value = planId;
  byId("orderFormView").hidden = false;
  byId("orderResult").hidden = true;
  setText("orderPlan", isQuote ? "Custom app" : plan.name);
  setText("orderCategory", isQuote ? "Web or mobile app / custom quote" : category === "ai" ? "AI solutions" : category === "marketing" ? "Digital marketing" : "Websites");
  setText("orderFull", isQuote ? "Above ₹50,000" : money(plan.price));
  setText("orderPeriod", category === "marketing" ? "per month · first month shown" : isQuote ? "scope and price to be agreed" : "one-time project price");
  byId("amountSplit").hidden = isQuote;
  byId("quoteNote").hidden = !isQuote;
  if (!isQuote) {
    setText("orderAdvance", money(plan.price / 2));
    setText("orderBalance", money(plan.price / 2));
  }
  byId("requestSubmit").textContent = isQuote ? "Send app enquiry ↗" : "Save request and continue ↗";
  setText("formMessage", "");
  byId("orderDialog").showModal();
  prepareCheckout();
}

function validateServerRequest(data) {
  if (!selectedPlan || !data || !/^BB-[A-Za-z0-9-]+$/.test(String(data.referenceNumber || ""))) throw new Error("The saved request could not be confirmed. Please contact us before paying.");
  if (String(data.planId) !== selectedPlan.id || data.currency !== "INR") throw new Error("Package details did not match. No payment was started; please contact us.");
  if (selectedPlan.mode === "quote") {
    if (data.checkoutMode !== "quote") throw new Error("This custom app needs a quote before payment. Please contact us.");
  } else {
    const full = selectedPlan.price * 100;
    if (data.checkoutMode !== "advance" || data.fullAmountPaise !== full || data.advanceAmountPaise !== full / 2 || data.balanceAmountPaise !== full / 2) {
      throw new Error("The payment amount does not match the displayed package. No payment was started; please contact us.");
    }
  }
}

function notifyStudio(details) {
  const payload = {
    referenceNumber: details.referenceNumber,
    planId: details.planId,
    firstName: details.firstName,
    lastName: details.lastName,
    email: details.email,
    phone: details.phone,
    _subject: "BlazeByte request — " + details.referenceNumber,
    _template: "table"
  };
  fetch("https://formsubmit.co/ajax/" + STUDIO_EMAIL, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
}

async function submitRequest(event) {
  event.preventDefault();
  if (submitting || !selectedPlan || !requestContext || !checkoutConfig) return;
  if (checkoutConfig.checkoutMode === "live" && !turnstileToken) {
    setText("formMessage", "Please complete the security check first.");
    return;
  }
  const form = byId("requestForm");
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  if (String(formData.get("website") || "").trim()) return;
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const projectDetails = String(formData.get("projectDetails") || "").trim();
  if (!firstName || !lastName || phone.length < 7 || !projectDetails || !formData.get("privacyConsent")) {
    setText("formMessage", "Please complete the required fields and accept the privacy terms.");
    return;
  }
  submitting = true;
  byId("requestSubmit").disabled = true;
  setText("requestSubmit", "Saving securely…");
  setText("formMessage", "");
  try {
    const data = await functionRequest("submit-customer-request", {
      submissionId: requestContext.submissionId,
      requestToken: requestContext.requestToken,
      turnstileToken: checkoutConfig.checkoutMode === "live" ? turnstileToken : undefined,
      planId: requestContext.planId,
      firstName, lastName, phone, email, company, projectDetails,
      privacyConsent: true
    });
    validateServerRequest(data);
    requestContext.referenceNumber = data.referenceNumber;
    requestContext.serverPlan = data;
    requestContext.customer = { firstName, lastName, phone, email };
    setText("resultRef", data.referenceNumber);
    setText("resultPlan", data.planName);
    setText("resultAmount", selectedPlan.mode === "quote" ? "Quote required" : money(data.advanceAmountPaise / 100));
    setText("resultTitle", selectedPlan.mode === "quote" ? "App enquiry received" : "Request saved");
    setText("resultText", selectedPlan.mode === "quote" ? "We will review your app scope and contact you with a custom quote. No payment is due now." : "Your request is saved. The first payment is 50% of the displayed package price; the balance follows the agreed work.");
    byId("payButton").hidden = selectedPlan.mode === "quote";
    setText("paymentMessage", "");
    byId("orderFormView").hidden = true;
    byId("orderResult").hidden = false;
    notifyStudio({ referenceNumber: data.referenceNumber, planId: data.planId, firstName, lastName, email, phone });
  } catch (error) {
    setText("formMessage", error.message || "Could not save your request. Please retry.");
    if (checkoutConfig?.checkoutMode === "live" && turnstileWidgetId !== null) {
      turnstileToken = "";
      window.turnstile.reset(turnstileWidgetId);
    }
  } finally {
    submitting = false;
    byId("requestSubmit").disabled = false;
    setText("requestSubmit", selectedPlan?.mode === "quote" ? "Send app enquiry ↗" : "Save request and continue ↗");
  }
}

let razorpayLoader = null;
function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  if (razorpayLoader) return razorpayLoader;
  razorpayLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => window.Razorpay ? resolve() : reject(new Error("Payment checkout did not load."));
    script.onerror = () => reject(new Error("Payment checkout could not load. Please check your connection."));
    document.head.append(script);
  }).catch((error) => { razorpayLoader = null; throw error; });
  return razorpayLoader;
}

async function pollPaymentStatus() {
  const payload = { referenceNumber: requestContext.referenceNumber, requestToken: requestContext.requestToken };
  for (let attempt = 0; attempt < 10; attempt++) {
    if (attempt) await new Promise((resolve) => setTimeout(resolve, 2500));
    try {
      const result = await functionRequest("get-payment-status-v2", payload, 12000);
      if (result.status === "paid") return "paid";
      if (result.status === "failed" || result.status === "cancelled") return result.status;
    } catch (_) { /* A transient status read should not trigger a second charge. */ }
  }
  return "processing";
}

function paymentComplete() {
  setText("resultTitle", "Advance payment confirmed");
  setText("resultText", "Your 50% advance has been captured and verified. We will contact you about the agreed project steps. Keep the reference number below.");
  setText("paymentMessage", "Payment confirmed. The remaining 50% is due after the agreed work is completed.");
  byId("payButton").hidden = true;
}

async function startPayment() {
  if (paymentBusy || !requestContext?.referenceNumber || selectedPlan?.mode === "quote") return;
  paymentBusy = true;
  const button = byId("payButton");
  button.disabled = true;
  setText("paymentMessage", "Preparing secure checkout…");
  let opened = false;
  let paymentHandled = false;
  try {
    const order = await functionRequest("create-razorpay-order-v2", {
      referenceNumber: requestContext.referenceNumber,
      requestToken: requestContext.requestToken,
      paymentStage: "advance"
    });
    if (order.status === "paid") {
      paymentComplete();
      paymentBusy = false;
      button.disabled = false;
      return;
    }
    if (order.status === "processing") {
      const status = await pollPaymentStatus();
      if (status === "paid") paymentComplete();
      else if (status === "failed" || status === "cancelled") setText("paymentMessage", "The previous payment was not completed. You may try checkout again.");
      else {
        button.hidden = true;
        setText("paymentMessage", "A payment is being confirmed. Please do not pay again. Contact us with reference " + requestContext.referenceNumber + " if it remains pending.");
      }
      paymentBusy = false;
      button.disabled = false;
      return;
    }
    const expected = selectedPlan.price * 50;
    if (order.amount !== expected || order.currency !== "INR" || !/^order_[A-Za-z0-9]+$/.test(String(order.orderId || "")) || !/^rzp_(live|test)_[A-Za-z0-9]+$/.test(String(order.keyId || ""))) {
      throw new Error("Payment details did not match this package. No checkout was opened; please contact us.");
    }
    if ((location.hostname === "blazebyte.store" || location.hostname === "www.blazebyte.store") && !String(order.keyId).startsWith("rzp_live_")) {
      throw new Error("Live payments are not enabled yet. Your request is saved; please contact us with your reference number.");
    }
    await loadRazorpay();
    setText("paymentMessage", "Complete the 50% advance in the secure Razorpay window.");
    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: "BlazeByte Studio",
      description: (requestContext.serverPlan?.planName || selectedPlan.name) + " — 50% advance",
      prefill: { name: requestContext.customer.firstName + " " + requestContext.customer.lastName, email: requestContext.customer.email, contact: requestContext.customer.phone },
      notes: { reference_number: requestContext.referenceNumber, payment_stage: "advance" },
      theme: { color: "#6861dd" },
      retry: { enabled: false },
      modal: {
        confirm_close: true,
        ondismiss: () => {
          if (!opened || paymentHandled) return;
          paymentBusy = false;
          button.disabled = false;
          setText("paymentMessage", "Checkout closed. If you completed payment, wait for confirmation or contact us with your reference number before trying again.");
        }
      },
      handler: async (payment) => {
        paymentHandled = true;
        setText("paymentMessage", "Checking that Razorpay captured the payment…");
        button.disabled = true;
        try {
          const verified = await functionRequest("verify-razorpay-payment-v2", {
            referenceNumber: requestContext.referenceNumber,
            requestToken: requestContext.requestToken,
            razorpay_order_id: payment.razorpay_order_id,
            razorpay_payment_id: payment.razorpay_payment_id,
            razorpay_signature: payment.razorpay_signature
          });
          if (!verified.verified) throw new Error("Payment could not be verified yet.");
          if (verified.status === "paid") { paymentComplete(); return; }
          const status = await pollPaymentStatus();
          if (status === "paid") paymentComplete();
          else {
            button.hidden = true;
            setText("paymentMessage", "Payment is still being confirmed. Please do not pay again. Contact us with reference " + requestContext.referenceNumber + " if this takes longer than a few minutes.");
          }
        } catch (_) {
          const status = await pollPaymentStatus();
          if (status === "paid") paymentComplete();
          else {
            button.hidden = true;
            setText("paymentMessage", "We cannot confirm this payment yet. Please do not pay again. Contact us with reference " + requestContext.referenceNumber + ".");
          }
        } finally { paymentBusy = false; button.disabled = false; }
      }
    });
    opened = true;
    checkout.open();
  } catch (error) {
    setText("paymentMessage", error.message || "Checkout is unavailable. Your request is saved; please contact us.");
    paymentBusy = false;
    button.disabled = false;
  }
}

function openLegal(which) {
  const isPrivacy = which === "privacy";
  setText("legalTitle", isPrivacy ? "Privacy Policy" : "Terms of Service");
  byId("privacyContent").hidden = !isPrivacy;
  byId("termsContent").hidden = isPrivacy;
  byId("legalDialog").showModal();
}

document.addEventListener("click", (event) => {
  const planButton = event.target.closest("[data-plan]");
  if (planButton) { openOrder(planButton.dataset.plan); return; }
  const legalButton = event.target.closest("[data-legal]");
  if (legalButton) { openLegal(legalButton.dataset.legal); return; }
  const closeButton = event.target.closest("[data-close-dialog]");
  if (closeButton) { byId(closeButton.dataset.closeDialog).close(); return; }
  const scrollLink = event.target.closest('a[href="#packages"], a[href="#serviceGates"]');
  if (scrollLink) {
    event.preventDefault();
    const target = byId(scrollLink.getAttribute("href").slice(1));
    if (target && !target.closest("[hidden]")) target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
});
byId("soundToggle").addEventListener("click", () => {
  soundOn = !soundOn;
  byId("soundToggle").setAttribute("aria-pressed", String(soundOn));
  byId("soundToggle").title = soundOn ? "Turn off interface sounds" : "Turn on interface sounds";
  setText("soundLabel", soundOn ? "Sound on" : "Sound off");
  if (soundOn) playRouteTone(currentWorld);
});
byId("requestForm").addEventListener("submit", submitRequest);
byId("payButton").addEventListener("click", startPayment);
for (const dialog of [byId("orderDialog"), byId("legalDialog")]) {
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
}
window.addEventListener("hashchange", renderRoute);
setText("year", String(new Date().getFullYear()));
renderRoute();
