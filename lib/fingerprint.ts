const STORAGE_KEY = "deadair_voter_fp";
const COOKIE_NAME = "deadair_voter_fp";

function randomId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

/**
 * Fingerprint for anonymous vote limits — aligned with middleware cookie + legacy localStorage.
 */
export function getFingerprintForClient(): string {
  if (typeof window === "undefined") return "";
  const fromCookie = readCookie(COOKIE_NAME);
  if (fromCookie) return fromCookie;
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const next = randomId();
    window.localStorage.setItem(STORAGE_KEY, next);
    return next;
  } catch {
    return randomId();
  }
}
