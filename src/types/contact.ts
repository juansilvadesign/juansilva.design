export type ContactIconName =
  | "contact"
  | "phone"
  | "whatsapp"
  | "linkedin"
  | "linkedin-outlined"
  | "website"
  | "email"
  | "github";

export interface ContactAction {
  label: string;
  subtitle: string;
  href: string;
  icon: ContactIconName;
  arrow: "↓" | "↗";
  primary?: boolean;
  download?: boolean;
  external?: boolean;
}
