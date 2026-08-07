import type { APIRoute } from "astro";
import { contact } from "../data/contact";

export const prerender = true;

const encoder = new TextEncoder();

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n?|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldLine(line: string): string {
  const segments: string[] = [];
  let segment = "";

  for (const character of line) {
    if (encoder.encode(segment + character).byteLength > 75) {
      segments.push(segment);
      segment = ` ${character}`;
    } else {
      segment += character;
    }
  }

  segments.push(segment);
  return segments.join("\r\n");
}

export function serializeContactVCard(): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(contact.name.family)};${escapeVCard(contact.name.given)};;;`,
    `FN:${escapeVCard(contact.name.display)}`,
    `TITLE:${escapeVCard(contact.title)}`,
    `TEL;TYPE=CELL,VOICE:${contact.phone.e164}`,
    `EMAIL;TYPE=INTERNET,PREF:${escapeVCard(contact.email)}`,
    `URL;TYPE=WORK:${escapeVCard(contact.website)}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${escapeVCard(contact.socials.linkedIn)}`,
    `X-SOCIALPROFILE;TYPE=github:${escapeVCard(contact.socials.github)}`,
    "END:VCARD",
  ];

  return `${lines.map(foldLine).join("\r\n")}\r\n`;
}

export const GET: APIRoute = () =>
  new Response(serializeContactVCard(), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Disposition": 'attachment; filename="juan-silva.vcf"',
      "Content-Type": "text/vcard; charset=utf-8",
    },
  });
