import { connect } from "cloudflare:sockets";

const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 465;
const SMTP_TIMEOUT_MS = 10_000;
const SMTP_CLOSE_TIMEOUT_MS = 1_000;
const MAX_SMTP_RESPONSE_BYTES = 64 * 1024;
const encoder = new TextEncoder();

export interface ContactEmail {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  lang: "en" | "pt";
}

export interface GmailCredentials {
  user: string;
  password: string;
}

class SmtpError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SmtpError";
  }
}

class SmtpSession {
  private readonly reader: ReadableStreamDefaultReader<Uint8Array>;
  private readonly writer: WritableStreamDefaultWriter<Uint8Array>;
  private readonly decoder = new TextDecoder();
  private pending = "";

  constructor(private readonly socket: ReturnType<typeof connect>) {
    this.reader = socket.readable.getReader();
    this.writer = socket.writable.getWriter();
  }

  async expect(codes: readonly number[]): Promise<void> {
    const code = await this.readResponseCode();

    if (!codes.includes(code)) {
      throw new SmtpError(`SMTP returned an unexpected ${code} response`);
    }
  }

  async command(line: string, codes: readonly number[]): Promise<void> {
    if (line.includes("\r") || line.includes("\n")) {
      throw new SmtpError("SMTP command contains an invalid line break");
    }

    await withTimeout(this.writer.write(encoder.encode(`${line}\r\n`)), SMTP_TIMEOUT_MS);
    await this.expect(codes);
  }

  async data(payload: string): Promise<void> {
    const dotStuffed = payload.replace(/(^|\r\n)\./g, "$1..");
    await withTimeout(
      this.writer.write(encoder.encode(`${dotStuffed}\r\n.\r\n`)),
      SMTP_TIMEOUT_MS,
    );
    await this.expect([250]);
  }

  async close(): Promise<void> {
    try {
      await withTimeout(this.writer.write(encoder.encode("QUIT\r\n")), SMTP_CLOSE_TIMEOUT_MS);
    } catch {
      // DATA's 250 response is the delivery hand-off. QUIT is best-effort only.
    }

    try {
      this.reader.releaseLock();
    } catch {
      // A timed-out read is released when the socket closes.
    }

    try {
      this.writer.releaseLock();
    } catch {
      // A timed-out write is released when the socket closes.
    }

    try {
      await withTimeout(this.socket.close(), SMTP_CLOSE_TIMEOUT_MS);
    } catch {
      // The SMTP peer may close the socket immediately after QUIT.
    }
  }

  private async readResponseCode(): Promise<number> {
    while (this.pending.length <= MAX_SMTP_RESPONSE_BYTES) {
      const terminalLine = /(?:^|\r\n)(\d{3}) [^\r\n]*\r\n/.exec(this.pending);

      if (terminalLine) {
        const responseEnd = terminalLine.index + terminalLine[0].length;
        const code = Number(terminalLine[1]);
        this.pending = this.pending.slice(responseEnd);
        return code;
      }

      const chunk = await withTimeout(this.reader.read(), SMTP_TIMEOUT_MS);

      if (chunk.done) {
        throw new SmtpError("SMTP connection closed before a complete response");
      }

      this.pending += this.decoder.decode(chunk.value, { stream: true });
    }

    throw new SmtpError("SMTP response exceeded the safety limit");
  }
}

export async function sendContactEmail(
  contact: ContactEmail,
  credentials: GmailCredentials,
): Promise<string> {
  assertMailbox(credentials.user);
  assertCredential(credentials.password);

  const socket = connect(
    { hostname: SMTP_HOST, port: SMTP_PORT },
    { secureTransport: "on", allowHalfOpen: false },
  );
  const session = new SmtpSession(socket);

  try {
    await withTimeout(socket.opened, SMTP_TIMEOUT_MS);
    await session.expect([220]);
    await session.command("EHLO juanpablosilva.com.br", [250]);
    await session.command(
      `AUTH PLAIN ${toBase64(`\u0000${credentials.user}\u0000${credentials.password}`)}`,
      [235],
    );
    await session.command(`MAIL FROM:<${credentials.user}>`, [250]);
    await session.command(`RCPT TO:<${credentials.user}>`, [250, 251]);
    await session.command("DATA", [354]);

    const { messageId, payload } = buildMessage(contact, credentials.user);
    await session.data(payload);
    return messageId;
  } finally {
    await session.close();
  }
}

function buildMessage(contact: ContactEmail, mailbox: string) {
  const id = crypto.randomUUID();
  const messageId = `<${id}@juanpablosilva.com.br>`;
  const boundary = `juan-contact-${id}`;
  const fullName = `${contact.firstName} ${contact.lastName}`;
  const subject = `New contact form submission from ${fullName}`;
  const language = contact.lang === "pt" ? "Portuguese" : "English";
  const text = [
    "New portfolio contact submission",
    "",
    `Name: ${fullName}`,
    `Email: ${contact.email}`,
    `Language: ${language}`,
    "",
    "Message:",
    contact.message,
  ].join("\n");
  const html = [
    "<h2>New portfolio contact submission</h2>",
    `<p><strong>Name:</strong> ${escapeHtml(fullName)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>`,
    `<p><strong>Language:</strong> ${language}</p>`,
    "<p><strong>Message:</strong></p>",
    `<p>${escapeHtml(contact.message).replace(/\n/g, "<br>")}</p>`,
  ].join("\r\n");

  const payload = [
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: ${messageId}`,
    `From: Juan Silva Portfolio <${mailbox}>`,
    `To: <${mailbox}>`,
    `Reply-To: ${encodeHeader(fullName)} <${contact.email}>`,
    `Subject: ${encodeHeader(subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(toBase64(text)),
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(toBase64(html)),
    `--${boundary}--`,
  ].join("\r\n");

  return { messageId, payload };
}

function assertMailbox(value: string): void {
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value) || /[\r\n]/.test(value)) {
    throw new SmtpError("Gmail user is not a valid mailbox");
  }
}

function assertCredential(value: string): void {
  if (!value || /[\r\n\u0000]/.test(value)) {
    throw new SmtpError("Gmail credential is invalid");
  }
}

function encodeHeader(value: string): string {
  const chunks: string[] = [];
  let chunk = "";

  for (const character of value) {
    if (encoder.encode(chunk + character).byteLength > 42 && chunk) {
      chunks.push(chunk);
      chunk = character;
    } else {
      chunk += character;
    }
  }

  if (chunk) {
    chunks.push(chunk);
  }

  return chunks.map((part) => `=?UTF-8?B?${toBase64(part)}?=`).join("\r\n ");
}

function toBase64(value: string): string {
  const bytes = encoder.encode(value);
  let binary = "";

  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }

  return btoa(binary);
}

function wrapBase64(value: string): string {
  return value.match(/.{1,76}/g)?.join("\r\n") ?? "";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeout = setTimeout(() => reject(new SmtpError("SMTP operation timed out")), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
  }
}
