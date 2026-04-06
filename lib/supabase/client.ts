import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIn0.placeholder";

export function createClient() {
  const { url: u, anonKey: k } = getPublicSupabaseEnv();
  const url = u || PLACEHOLDER_URL;
  const key = k || PLACEHOLDER_KEY;
  return createBrowserClient(url, key);
}
