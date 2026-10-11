// Visitor choice for audience measurement (Google Analytics), kept 6 months
// as recommended by the CNIL. The GA loader lives in index.html.

const STORAGE_KEY = "hn-analytics-consent";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182;
const GA_ID = "G-YTTP4T98J0";
export const OPEN_CONSENT_EVENT = "hn:open-consent";

export type ConsentChoice = "granted" | "denied";

declare global {
  interface Window {
    hnLoadAnalytics?: () => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export const readConsent = (): ConsentChoice | null => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (stored && (stored.value === "granted" || stored.value === "denied") && Date.now() - stored.date < MAX_AGE_MS) {
      return stored.value;
    }
  } catch {
    // storage unavailable or corrupted: ask again
  }
  return null;
};

export const saveConsent = (value: ConsentChoice) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, date: Date.now() }));
  } catch {
    // storage unavailable: the banner is simply shown again on the next visit
  }
  if (value === "granted") {
    window[`ga-disable-${GA_ID}`] = false;
    window.hnLoadAnalytics?.();
  } else {
    // Stops collection immediately if GA was already loaded on this page.
    window[`ga-disable-${GA_ID}`] = true;
  }
};

/** Re-opens the cookie banner (footer "Gestion des cookies" link). */
export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
