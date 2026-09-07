/**
 * Analytics configuration.
 *
 * Reads credentials for Google Analytics, Google Tag Manager, and Microsoft Clarity
 * from environment variables (supporting both PUBLIC_* and unprefixed keys).
 */

const getEnv = (key: string): string | undefined => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const metaVal = (import.meta.env as Record<string, string | undefined>)[key];
    if (metaVal) return metaVal;
  }
  const proc = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process;
  if (proc?.env && proc.env[key]) {
    return proc.env[key];
  }
  return undefined;
};

const clean = (val?: string): string | undefined => {
  if (!val) return undefined;
  const trimmed = val.trim().replace(/^["']|["']$/g, "");
  return trimmed.length > 0 ? trimmed : undefined;
};

const cleanTagId = (val?: string): string | undefined => {
  const cleaned = clean(val);
  if (!cleaned || cleaned === "AW-" || cleaned === "AW") return undefined;
  return cleaned;
};

export interface AnalyticsConfig {
  googleAnalyticsId?: string;
  gtmId?: string;
  googleTagId?: string;
  clarityId?: string;
}

export const analyticsConfig: AnalyticsConfig = {
  googleAnalyticsId: clean(
    getEnv("PUBLIC_GOOGLE_ANALYTICS_ID") ?? getEnv("GOOGLE_ANALYTICS_ID")
  ),
  gtmId: clean(
    getEnv("PUBLIC_GTM_ID") ?? getEnv("GTM_ID")
  ),
  googleTagId: cleanTagId(
    getEnv("PUBLIC_GOOGLE_TAG_ID") ?? getEnv("GOOGLE_TAG_ID")
  ),
  clarityId: clean(
    getEnv("PUBLIC_CLARITY_ID") ?? getEnv("CLARITY_ID")
  ),
};
