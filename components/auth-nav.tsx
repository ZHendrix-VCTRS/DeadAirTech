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
      <form action="/auth/signout" method="post" className="inline">
        <span
          className="hidden max-w-[100px] truncate font-body text-[10px] text-dead-muted sm:inline sm:max-w-[140px] sm:text-xs"
          title={email}
        >
          {email.split("@")[0]}
        </span>
        <button
          type="submit"
          className="ml-1 rounded px-2 py-1.5 font-display text-[8px] text-[#909090] transition hover:text-dead-red sm:text-[9px]"
        >
          OUT
        </button>
      </form>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded px-2 py-1.5 font-display text-[8px] text-[#909090] transition hover:text-dead-neon sm:text-[9px]"
    >
      LOG IN
    </Link>
  );
}
