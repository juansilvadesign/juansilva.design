import { handleContactRequest, type Env } from "./api/send";

// The contact endpoint is the ONLY thing this Worker serves. It runs on its own
// host (form.juanpablosilva.com.br) while all 14 static pages stay on Apache, so
// every request that reaches here is a form post or noise.
//
// Pages used to supply this routing for free: a file at functions/api/send.ts
// exporting `onRequestPost` was reachable at exactly POST /api/send and nothing
// else. A standalone Worker receives the whole hostname instead, so the path and
// method gates below are the replacement for that convention — not new handler
// logic, just the part Pages was doing implicitly.
const ENDPOINT_PATH = "/api/send";

const NO_STORE = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname !== ENDPOINT_PATH) {
      return new Response("Not found\n", { status: 404, headers: NO_STORE });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed\n", {
        status: 405,
        headers: { ...NO_STORE, Allow: "POST" },
      });
    }

    return handleContactRequest(request, env);
  },
} satisfies ExportedHandler<Env>;
