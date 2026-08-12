import { sendContactEmail, type ContactEmail } from "../_lib/smtp";

const TURNSTILE_ACTION = "turnstile-spin-v1";
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// This endpoint runs on its own host (form.juanpablosilva.com.br) while the form
// is served from the Apache site. So the request hostname is NEVER the page
// hostname, and anything derived from `request.url` is wrong here — it names the
// Worker, not the site. The page hostnames are therefore explicit.
//
// Both entries are load-bearing: `www` was verified 2026-08-12 to serve a
// byte-identical contact page rather than redirecting to the apex, so dropping
// it 403s every `www` visitor at the Turnstile gate.
//
// ⛔ The production Turnstile widget must authorize exactly this set. A hostname
//    that is allowed here but not on the widget fails closed and silently.
// ⚠️ Milestone H (cutover to juansilva.design) must add the new hostnames here
//    AND on the widget, or the form dies at the moment the domain flips.
const SITE_ORIGIN = "https://juanpablosilva.com.br";
const ALLOWED_PAGE_HOSTNAMES = new Set([
  "juanpablosilva.com.br",
  "www.juanpablosilva.com.br",
]);
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 15 * 60;
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const textDecoder = new TextDecoder();

// Bindings this handler needs. `CONTACT_RATE_LIMIT` is the KV namespace; the
// rest are Worker secrets set with `wrangler secret put` — never plain vars, and
// never anything prefixed `PUBLIC_`, which Astro would inline into the built HTML.
export interface Env {
  CONTACT_RATE_LIMIT: KVNamespace;
  TURNSTILE_SECRET_KEY: string;
  RATE_LIMIT_SECRET: string;
  GMAIL_USER: string;
  GMAIL_PASS: string;
}

type Locale = "en" | "pt";
type FeedbackCode =
  | "sent"
  | "form-error"
  | "turnstile-error"
  | "rate-limited"
  | "send-error";
type SecretName = "TURNSTILE_SECRET_KEY" | "RATE_LIMIT_SECRET" | "GMAIL_USER" | "GMAIL_PASS";

interface ContactDependencies {
  now: () => number;
  fetch: typeof fetch;
  sendEmail: typeof sendContactEmail;
}

interface TurnstileResult {
  success: boolean;
  action?: string;
  hostname?: string;
  errorCodes: string[];
}

class ContactRequestError extends Error {
  constructor(
    readonly status: number,
    readonly feedback: FeedbackCode,
    message: string,
  ) {
    super(message);
    this.name = "ContactRequestError";
  }
}

const dependencies: ContactDependencies = {
  now: Date.now,
  fetch: (input, init) => fetch(input, init),
  sendEmail: sendContactEmail,
};

export async function handleContactRequest(
  request: Request,
  env: Env,
  deps: ContactDependencies = dependencies,
): Promise<Response> {
  const requestId = request.headers.get("cf-ray") ?? crypto.randomUUID();
  let locale = localeFromRequest(request);

  try {
    assertRequestSize(request);

    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const rateLimitSecret = requiredSecret(env, "RATE_LIMIT_SECRET");
    const rateLimit = await consumeRateLimit(
      env.CONTACT_RATE_LIMIT,
      ip,
      rateLimitSecret,
      deps.now(),
    );

    if (!rateLimit.allowed) {
      log("contact_rate_limited", requestId, { retryAfter: rateLimit.retryAfter });
      return respond(request, locale, 429, "rate-limited", {
        "Retry-After": String(rateLimit.retryAfter),
      });
    }

    const body = await readUrlEncodedBody(request);
    locale = body.get("lang") === "pt" ? "pt" : "en";
    const contact = parseContact(body, locale);
    const token = singleValue(body, "cf-turnstile-response");

    if (!token || token.length > 2048) {
      throw new ContactRequestError(403, "turnstile-error", "Turnstile token is missing or invalid");
    }

    const turnstileSecret = requiredSecret(env, "TURNSTILE_SECRET_KEY");
    const verification = await verifyTurnstile(
      deps.fetch,
      token,
      turnstileSecret,
      ip === "unknown" ? undefined : ip,
    );
    const solvedHostname = verification.hostname?.toLowerCase();
    const hostnameAllowed = Boolean(solvedHostname && ALLOWED_PAGE_HOSTNAMES.has(solvedHostname));

    if (!verification.success || verification.action !== TURNSTILE_ACTION || !hostnameAllowed) {
      log("contact_turnstile_rejected", requestId, {
        actionMatch: verification.action === TURNSTILE_ACTION,
        hostnameMatch: hostnameAllowed,
        solvedHostname,
        errorCodes: verification.errorCodes,
      });
      throw new ContactRequestError(403, "turnstile-error", "Turnstile verification failed");
    }

    const gmailUser = requiredSecret(env, "GMAIL_USER");
    const gmailPassword = requiredSecret(env, "GMAIL_PASS");
    const messageId = await deps.sendEmail(contact, {
      user: gmailUser,
      password: gmailPassword,
    });

    log("contact_email_accepted", requestId, { messageId });
    return respond(request, locale, 200, "sent");
  } catch (error) {
    if (error instanceof ContactRequestError) {
      log("contact_request_rejected", requestId, {
        status: error.status,
        reason: error.message,
      });
      return respond(request, locale, error.status, error.feedback);
    }

    logError("contact_send_failed", requestId, error);
    return respond(request, locale, 502, "send-error");
  }
}

function assertRequestSize(request: Request): void {
  const header = request.headers.get("Content-Length");

  if (!header) {
    return;
  }

  const length = Number(header);

  if (!Number.isSafeInteger(length) || length < 0 || length > MAX_BODY_BYTES) {
    throw new ContactRequestError(413, "form-error", "Request body is too large");
  }
}

async function readUrlEncodedBody(request: Request): Promise<URLSearchParams> {
  const contentType = request.headers.get("Content-Type")?.toLowerCase() ?? "";

  if (!contentType.startsWith("application/x-www-form-urlencoded")) {
    throw new ContactRequestError(415, "form-error", "Unsupported contact form content type");
  }

  if (!request.body) {
    throw new ContactRequestError(400, "form-error", "Contact form body is missing");
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const chunk = await reader.read();

      if (chunk.done) {
        break;
      }

      total += chunk.value.byteLength;

      if (total > MAX_BODY_BYTES) {
        await reader.cancel("Contact form body exceeded the safety limit");
        throw new ContactRequestError(413, "form-error", "Request body is too large");
      }

      chunks.push(chunk.value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(total);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new URLSearchParams(textDecoder.decode(bytes));
}

function parseContact(body: URLSearchParams, lang: Locale): ContactEmail {
  const firstName = cleanSingleValue(body, "fname");
  const lastName = cleanSingleValue(body, "lname");
  const email = cleanSingleValue(body, "email").toLowerCase();
  const message = cleanSingleValue(body, "message").replace(/\r\n?/g, "\n");
  const terms = singleValue(body, "terms");

  if (
    firstName.length < 2 ||
    firstName.length > 80 ||
    lastName.length < 2 ||
    lastName.length > 80 ||
    email.length > 254 ||
    !emailPattern.test(email) ||
    message.length < 10 ||
    message.length > 4_000 ||
    terms !== "on" ||
    /[\u0000-\u001f\u007f]/.test(firstName + lastName + email) ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(message)
  ) {
    throw new ContactRequestError(400, "form-error", "Contact form validation failed");
  }

  return { firstName, lastName, email, message, lang };
}

function cleanSingleValue(body: URLSearchParams, name: string): string {
  return singleValue(body, name)?.trim() ?? "";
}

function singleValue(body: URLSearchParams, name: string): string | undefined {
  const values = body.getAll(name);
  return values.length === 1 ? values[0] : undefined;
}

async function verifyTurnstile(
  fetcher: typeof fetch,
  token: string,
  secret: string,
  remoteIp?: string,
): Promise<TurnstileResult> {
  const idempotencyKey = crypto.randomUUID();
  const body = new URLSearchParams({
    secret,
    response: token,
    idempotency_key: idempotencyKey,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetcher(SITEVERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        signal: AbortSignal.timeout(5_000),
      });

      if (!response.ok) {
        if (attempt === 0 && response.status >= 500) {
          continue;
        }

        throw new ContactRequestError(502, "send-error", "Turnstile service returned an error");
      }

      return parseTurnstileResult(await response.json());
    } catch (error) {
      if (error instanceof ContactRequestError) {
        throw error;
      }

      if (attempt === 1) {
        throw new ContactRequestError(502, "send-error", "Turnstile service is unavailable");
      }
    }
  }

  throw new ContactRequestError(502, "send-error", "Turnstile service is unavailable");
}

function parseTurnstileResult(value: unknown): TurnstileResult {
  if (!isRecord(value) || typeof value.success !== "boolean") {
    throw new ContactRequestError(502, "send-error", "Turnstile returned an invalid response");
  }

  const rawErrors = value["error-codes"];
  const errorCodes = Array.isArray(rawErrors)
    ? rawErrors.filter((entry): entry is string => typeof entry === "string")
    : [];

  return {
    success: value.success,
    action: typeof value.action === "string" ? value.action : undefined,
    hostname: typeof value.hostname === "string" ? value.hostname : undefined,
    errorCodes,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function consumeRateLimit(
  namespace: KVNamespace,
  ip: string,
  secret: string,
  now: number,
): Promise<{ allowed: boolean; retryAfter: number }> {
  const windowMs = RATE_LIMIT_WINDOW_SECONDS * 1_000;
  const window = Math.floor(now / windowMs);
  const bucket = `contact:${await hmacIdentifier(ip, secret)}:${window}`;
  const stored = await namespace.get(bucket);
  const count = stored && /^\d+$/.test(stored) ? Number(stored) : 0;
  const retryAfter = Math.max(1, Math.ceil(((window + 1) * windowMs - now) / 1_000));

  if (count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter };
  }

  await namespace.put(bucket, String(count + 1), {
    expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
  });

  return { allowed: true, retryAfter };
}

function localeFromRequest(request: Request): Locale {
  return allowedRefererUrl(request)?.pathname.startsWith("/pt/") ? "pt" : "en";
}

function allowedRefererUrl(request: Request): URL | undefined {
  const referer = request.headers.get("Referer");

  if (!referer) {
    return undefined;
  }

  try {
    const url = new URL(referer);
    return ALLOWED_PAGE_HOSTNAMES.has(url.hostname.toLowerCase()) ? url : undefined;
  } catch {
    return undefined;
  }
}

async function hmacIdentifier(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)),
  );
  let binary = "";

  for (const byte of signature) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function requiredSecret(env: object, name: SecretName): string {
  const value: unknown = Reflect.get(env, name);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Required secret binding ${name} is missing`);
  }

  if (name === "RATE_LIMIT_SECRET" && value.trim().length < 32) {
    throw new Error("Required secret binding RATE_LIMIT_SECRET is too short");
  }

  return value.trim();
}

function respond(
  request: Request,
  locale: Locale,
  status: number,
  feedback: FeedbackCode,
  headers: HeadersInit = {},
): Response {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Cache-Control", "no-store");
  responseHeaders.set("X-Content-Type-Options", "nosniff");

  if (request.headers.get("Accept")?.includes("application/json")) {
    return Response.json(
      { success: status >= 200 && status < 300, code: feedback },
      { status, headers: responseHeaders },
    );
  }

  // Resolve against the PAGE origin, never `request.url` — that is this Worker's
  // own host, and redirecting there sends the visitor to a contact page that does
  // not exist on it. Bounce the submitter back to the host they came from so a
  // `www` visitor stays on `www`.
  const origin = allowedRefererUrl(request)?.origin ?? SITE_ORIGIN;
  const target = new URL(locale === "pt" ? "/pt/contact/" : "/contact/", origin);
  target.hash = feedback;
  responseHeaders.set("Location", target.toString());
  return new Response(null, { status: 303, headers: responseHeaders });
}

function log(event: string, requestId: string, details: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ event, requestId, ...details }));
}

function logError(event: string, requestId: string, error: unknown): void {
  console.error(
    JSON.stringify({
      event,
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    }),
  );
}
