/**
 * Normalize Supabase URL/key from env (common mistakes: spaces, trailing slashes,
 * or pasting only the project ref instead of https://<ref>.supabase.co).
 */
function normalizeSupabaseUrl(raw: string): string {
  const s = raw.trim().replace(/\/+$/, "");
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  // Only the project ref was pasted (e.g. from dashboard) — expand to full host
  if (/^[a-z0-9]{15,40}$/i.test(s) && !s.includes(".")) {
    return `https://${s}.supabase.co`;
  }
  return s;
}

export function getPublicSupabaseEnv(): {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  issues: string[];
} {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const issues: string[] = [];

  if (!rawUrl) issues.push("NEXT_PUBLIC_SUPABASE_URL is missing or empty");
  if (!rawKey) issues.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or empty");

  const url = rawUrl ? normalizeSupabaseUrl(rawUrl) : "";
  const anonKey = rawKey ?? "";

  const looksLikePlaceholderHost =
    !url || url.includes("placeholder.supabase.co");

  if (looksLikePlaceholderHost && issues.length === 0) {
    issues.push(
      "Supabase URL is missing or still the build placeholder — put your project URL in .env.local and restart the dev server"
    );
  }

  if (url && !/^https?:\/\//i.test(url)) {
    issues.push(
      "NEXT_PUBLIC_SUPABASE_URL must be https://YOUR_PROJECT.supabase.co (or paste only the project ref; we expand it)"
    );
  }

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && !looksLikePlaceholderHost),
    issues,
  };
}
