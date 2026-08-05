# Contact form operations

`/api/send` is a same-origin Cloudflare Pages Function. It verifies a Turnstile
token, applies the existing five-requests-per-IP / 15-minute policy through KV,
and hands the message to Gmail over SMTP/TLS on port 465. It never emits CORS
headers and never accepts a second API origin.

`public/_routes.json` restricts Function invocations to `/api/*`, so the 14 static
pages keep the unlimited static-request path instead of entering the Functions
runtime.

## Bindings

The Pages project needs one KV binding:

- `CONTACT_RATE_LIMIT` — fixed-window counters keyed by an HMAC of the visitor IP.

The build needs one public variable:

- `PUBLIC_TURNSTILE_SITEKEY` — the widget sitekey embedded in the static contact
  pages. If it is absent, the form fails closed, disables submit, and displays the
  working email fallback.

The Function needs four encrypted secrets in both preview and production:

- `TURNSTILE_SECRET_KEY` — the secret paired with the public sitekey. It must
  never use a `PUBLIC_` prefix.
- `RATE_LIMIT_SECRET` — at least 32 random characters, used only to HMAC IPs
  before they become KV keys.
- `GMAIL_USER` — the Gmail mailbox that sends and receives submissions.
- `GMAIL_PASS` — the mailbox's app password.

Never commit real values. `.env.example` and `.dev.vars.example` document names
only. Set production secrets through Cloudflare Pages secrets (stdin or dashboard),
not through `wrangler.jsonc`.

## Turnstile contract

The widget and Function are deliberately coupled by three checks:

1. Siteverify must return `success: true`.
2. Its action must be `turnstile-spin-v1`.
3. Its hostname must equal the hostname that received `/api/send`.

The production widget must authorize every hostname used to submit the form.
Confirm the exact hostname list before creating it; do not use an unrestricted
widget. Use Cloudflare's public test sitekey only for local builds, paired with a
test secret supplied locally. Production keys must never be mixed with test keys.

## Verification and retirement gate

Local success is necessary but not sufficient. Milestone G closes only after:

1. the Pages Function bundle and Workers-runtime tests pass;
2. a production form submission passes Turnstile;
3. the resulting message is visibly present in the target inbox (an HTTP 200 or
   SMTP acceptance log alone is not delivery evidence);
4. a sixth test request is rejected with `429` without sending mail;
5. `server/` and `render.yaml` are deleted only after that inbox proof;
6. the contact form is submitted once more after deletion.

Pages does not accept the native Workers Email or RateLimit bindings in its
current Wrangler schema. Gmail/TLS and KV keep this endpoint within Pages without
introducing another public host. KV counters are eventually consistent, so
Turnstile remains the primary bot barrier while KV enforces the human-scale quota.
