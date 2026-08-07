import { contact } from "./contact";

export const socialLinks = {
  ...contact.socials,
  // Both addresses stay on the working mailbox until ROADMAP milestone H.
  mail: `mailto:${contact.email}`,
  mailCta: `mailto:${contact.email}`,
} as const;

export const siteVersions = [
  { label: "2026", url: "https://juanpablosilva.com.br", active: true },
  { label: "2025", url: "https://dev.juanpablosilva.com.br", active: false },
] as const;
