import { localizedPath, t, type Locale } from "../i18n";
import type { ContactAction } from "../types/contact";

interface ContactProfile {
  name: {
    display: string;
    given: string;
    family: string;
  };
  title: string;
  tagline: string;
  phone: {
    e164: `+${number}`;
    display: string;
  };
  email: `${string}@${string}`;
  website: `https://${string}`;
  avatar: `/${string}`;
  vcardPath: `/${string}.vcf`;
  cardPath: `/${string}/`;
  socials: {
    linkedIn: `https://${string}`;
    x: `https://${string}`;
    instagram: `https://${string}`;
    threads: `https://${string}`;
    figma: `https://${string}`;
    dribbble: `https://${string}`;
    github: `https://${string}`;
  };
}

export const contact = {
  name: {
    display: "Juan Silva",
    given: "Juan",
    family: "Silva",
  },
  title: "Design Engineer",
  tagline: "Next.js · Python · Scalable Growth Automation",
  phone: {
    e164: "+5521966442965",
    display: "+55 21 96644-2965",
  },
  email: "jaypy.uxdesign@gmail.com",
  website: "https://juanpablosilva.com.br",
  avatar: "/assets/images/hero.webp",
  vcardPath: "/juan-silva.vcf",
  cardPath: "/card/",
  socials: {
    linkedIn: "https://linkedin.com/in/juansilvadesign",
    x: "https://x.com/juansilvadesign",
    instagram: "https://instagram.com/juansilvadesign",
    threads: "https://www.threads.net/@juansilvadesign",
    figma: "https://www.figma.com/@juansilvadesign",
    dribbble: "https://dribbble.com/juansilvadesign",
    github: "https://github.com/juansilvadesign",
  },
} as const satisfies ContactProfile;

// The contact form posts to a standalone Worker on its own subdomain: this site
// is static on Apache and cannot execute a handler at all (milestone G).
//
// Cross-origin is fine here precisely because the form carries zero JavaScript —
// a native form post is not subject to CORS, and the Worker 303s the visitor back
// to the page host. Two things still gate it, and both fail SILENTLY:
//   • public/.htaccess + public/_headers → CSP `form-action` must name this host.
//   • the Turnstile widget must authorize the PAGE hostnames (apex and www),
//     which functions/api/send.ts re-checks in ALLOWED_PAGE_HOSTNAMES.
export const contactFormEndpoint = "https://form.juanpablosilva.com.br/api/send";

export function getContactActions(lang: Locale): ContactAction[] {
  const copy = t(lang).card.actions;
  const localizedWebsite = new URL(localizedPath("/", lang), contact.website).href;
  const whatsappNumber = contact.phone.e164.slice(1);

  return [
    {
      label: copy.save.label,
      subtitle: copy.save.subtitle,
      href: contact.vcardPath,
      icon: "contact",
      arrow: "↓",
      primary: true,
      download: true,
    },
    {
      label: copy.phone.label,
      subtitle: contact.phone.display,
      href: `tel:${contact.phone.e164}`,
      icon: "phone",
      arrow: "↗",
    },
    {
      label: copy.whatsapp.label,
      subtitle: copy.whatsapp.subtitle,
      href: `https://wa.me/${whatsappNumber}`,
      icon: "whatsapp",
      arrow: "↗",
      external: true,
    },
    {
      label: copy.linkedIn.label,
      subtitle: "@juansilvadesign",
      href: contact.socials.linkedIn,
      icon: "linkedin",
      arrow: "↗",
      external: true,
    },
    {
      label: copy.website.label,
      subtitle: new URL(contact.website).hostname,
      href: localizedWebsite,
      icon: "website",
      arrow: "↗",
    },
    {
      label: copy.email.label,
      subtitle: contact.email,
      href: `mailto:${contact.email}`,
      icon: "email",
      arrow: "↗",
    },
    {
      label: copy.github.label,
      subtitle: "@juansilvadesign",
      href: contact.socials.github,
      icon: "github",
      arrow: "↗",
      external: true,
    },
  ];
}
