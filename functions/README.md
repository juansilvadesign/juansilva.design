# Contact form operations

The contact endpoint is a **standalone Cloudflare Worker**, deployed by
`wrangler deploy` from `wrangler.jsonc`:

| | |
|---|---|
| Worker | `juansilva-contact-form` |
| Endpoint | `https://form.juanpablosilva.com.br/api/send` |
| Entry point | `functions/worker.ts` |
| Handler | `functions/api/send.ts` |
| Transport | Gmail SMTP over TLS on 465 (`functions/_lib/smtp.ts`) |

It verifies a Turnstile token, applies a five-requests-per-IP / 15-minute policy
through KV, and hands the message to Gmail. It emits **no CORS headers** — and
needs none, see below.

> ⚠️ **This used to be a Pages Function and the difference is load-bearing.** The
> origin serving the site is Apache (manual cPanel upload), which cannot execute
> anything, so `onRequestPost` had no runtime at all. Two Pages artifacts survive
> in `public/` and are **inert**: `_routes.json` and `_headers`. On this host the
> real config is `public/.htaccess`.

## Why cross-origin is safe here — and what actually gates it

The form is served from `juanpablosilva.com.br` and posts to
`form.juanpablosilva.com.br`. That is fine because the form carries **zero
JavaScript**: a native `<form method="post">` is not subject to CORS. The browser
sends it cross-origin unconditionally and follows the `303 Location` home. CORS
governs JS *reading* a response, not the browser *sending* a form.

Two other mechanisms do gate it, and **both fail silently**:

1. 🔴 **CSP `form-action`.** Separate from CORS, and it polices exactly this. It
   must name the Worker in `public/.htaccess` *and* `public/_headers` (kept
   byte-identical). Under plain `'self'` the browser blocks the submission before
   any request leaves: no network entry, no error page, only a console violation.
2. 🔴 **The Turnstile hostname check.** See the contract below.

## Routing is now our job

Pages supplied it by file convention: `functions/api/send.ts` exporting
`onRequestPost` was reachable at exactly `POST /api/send`. A standalone Worker
receives the **whole hostname**, so `worker.ts` gates path and method itself and
404s/405s everything else.

## Bindings

One KV binding, declared in `wrangler.jsonc`:

- `CONTACT_RATE_LIMIT` — fixed-window counters keyed by an HMAC of the visitor IP.
  ⛔ Inspect it with `wrangler kv key list --namespace-id <id> --remote`. **Without
  `--remote` wrangler reads the local miniflare store** and reports an empty
  namespace while production is writing normally.

One public build-time variable, in the gitignored `.env`:

- `PUBLIC_TURNSTILE_SITEKEY` — embedded in the static contact pages at build time.
  If absent the form fails closed: submit is disabled and the email fallback shows.
  ⚠️ Because `.env` is gitignored, a rebuild on a fresh machine silently produces
  the disabled state. Check this first when a rebuild looks broken.

Four Worker secrets — `npx wrangler secret put <NAME>`, never in `wrangler.jsonc`:

- `TURNSTILE_SECRET_KEY` — paired with the public sitekey. Never a `PUBLIC_` prefix.
- `RATE_LIMIT_SECRET` — ≥32 random characters, used only to HMAC IPs into KV keys.
- `GMAIL_USER` — the Gmail mailbox that sends and receives submissions.
- `GMAIL_PASS` — that mailbox's **App Password**, not the account password.

## Turnstile contract

The widget and the Worker are deliberately coupled by three checks:

1. Siteverify returns `success: true`.
2. Its action is `turnstile-spin-v1`.
3. 🔑 Its hostname is in **`ALLOWED_PAGE_HOSTNAMES`** — the hostnames of the
   *pages that host the form*, currently `juanpablosilva.com.br` and
   `www.juanpablosilva.com.br` (verified 2026-08-12: `www` serves a byte-identical
   contact page rather than redirecting, so dropping it 403s every `www` visitor).

⛔ Check 3 must **never** be rewritten as "equals the hostname that received the
request". That was the original code and it 403s every submission cross-host: the
widget is solved on the page host, the request lands on the Worker. Nothing
derived from `request.url` names the page.

The production widget must authorize exactly that same set. A hostname allowed in
one place but not the other fails closed and silently. Use Cloudflare's public
test sitekey only for local builds, with a test secret supplied locally; never mix
test and production keys.

⚠️ **Milestone H (cutover to `juansilva.design`) must update four things in
lockstep** or the form dies at the moment the domain flips: `ALLOWED_PAGE_HOSTNAMES`
and `SITE_ORIGIN` in `send.ts`, `contactFormEndpoint` in `src/data/contact.ts`, the
CSP `form-action` in both header files, and the widget's authorized hostnames.

## Typechecking

`functions/` has its own `tsconfig.json` on purpose. The root config extends
`astro/tsconfigs/strict`, which loads the DOM lib, while `@cloudflare/workers-types`
redeclares `Request`/`Response`/`Headers`/`fetch` — a single program containing
both fails with duplicate-identifier errors. Two programs is what makes this
directory checkable at all.

```bash
npm run check:worker   # tsc -p functions
npm run check          # astro check && check:worker && astro build
```

⛔ A green **bundle** check is not a typecheck. Before 2026-08-12 this directory
was in no tsconfig and `@cloudflare/workers-types` was not installed, so
`PagesFunction`, `KVNamespace` and `cloudflare:sockets` were all unresolved and
nothing ever looked at the handler. Three cross-host defects sat here undetected.

## Verification and retirement gate

Local success is necessary but not sufficient. Milestone G closes only after:

1. `npm run check` passes, including `check:worker`;
2. a production form submission passes Turnstile;
3. the resulting message is **visibly present in the target inbox** — an HTTP 200,
   a `303`, or an SMTP acceptance log is not delivery evidence;
4. a sixth request is rejected `429` without sending mail (needs a fresh 15-minute
   window — buckets are fixed at `floor(now/900s)`, not sliding);
5. `server/` and `render.yaml` are deleted only after that inbox proof;
6. the form is submitted once more after deletion.

KV counters are eventually consistent, so Turnstile remains the primary bot
barrier while KV enforces the human-scale quota.
