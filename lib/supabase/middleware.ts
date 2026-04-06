import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const FP_COOKIE = "deadair_voter_fp";
const FP_MAX_AGE = 60 * 60 * 24 * 400; // ~400 days

function randomFp(): string {
  return crypto.randomUUID();
}

const FP_OPTIONS = {
  httpOnly: false,
  sameSite: "lax" as const,
  path: "/",
  maxAge: FP_MAX_AGE,
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const newFingerprint = !request.cookies.get(FP_COOKIE)?.value ? randomFp() : null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    if (newFingerprint) {
      supabaseResponse.cookies.set(FP_COOKIE, newFingerprint, FP_OPTIONS);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  await supabase.auth.getUser();

  if (newFingerprint) {
    supabaseResponse.cookies.set(FP_COOKIE, newFingerprint, FP_OPTIONS);
  }

  return supabaseResponse;
}
