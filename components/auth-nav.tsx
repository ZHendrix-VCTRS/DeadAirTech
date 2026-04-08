"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthNav() {
  const [email, setEmail] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setEmail(data.user?.email ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (email) {
    return (
      <form action="/auth/signout" method="post" className="inline-flex items-center gap-2">
        <span
          className="hidden max-w-[100px] truncate font-body text-[11px] text-dead-muted sm:inline sm:max-w-[140px]"
          title={email}
        >
          {email.split("@")[0]}
        </span>
        <button
          type="submit"
          className="rounded border border-dead-neon bg-dead-neon px-3 py-1.5 font-display text-[13px] tracking-wide text-dead-bg transition hover:bg-dead-neon/80"
        >
          OUT
        </button>
      </form>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded border border-dead-neon bg-dead-neon px-3 py-1.5 font-display text-[13px] tracking-wide text-dead-bg transition hover:bg-dead-neon/80"
    >
      LOG IN
    </Link>
  );
}
