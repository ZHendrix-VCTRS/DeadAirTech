"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function magicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Check your email for the login link.");
  }

  async function passwordAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  const inputClass =
    "terminal-input mt-1 w-full rounded px-3 py-2 font-body text-sm text-dead-text outline-none";

  return (
    <div className="mx-auto max-w-md space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="font-display text-sm text-dead-neon sm:text-base">LOG IN</h1>
        <p className="font-body text-[13px] text-[#808080]">
          Vote more than five times per project. Judge strangers. Feel alive.
        </p>
      </header>

      <div className="flex justify-center gap-2 font-display text-[8px]">
        <button
          type="button"
          onClick={() => setMode("magic")}
          className={`rounded px-3 py-1 ${mode === "magic" ? "bg-[rgba(57,255,20,0.1)] text-dead-neon" : "text-[#666]"}`}
        >
          MAGIC LINK
        </button>
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`rounded px-3 py-1 ${mode === "password" ? "bg-[rgba(57,255,20,0.1)] text-dead-neon" : "text-[#666]"}`}
        >
          EMAIL + PASSWORD
        </button>
      </div>

      <form onSubmit={mode === "magic" ? magicLink : passwordAuth} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-display text-[8px] text-[#a0a0a0]">
            EMAIL
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            autoComplete="email"
          />
        </div>
        {mode === "password" && (
          <div>
            <label htmlFor="password" className="block font-display text-[8px] text-[#a0a0a0]">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              autoComplete="current-password"
            />
          </div>
        )}
        {message && <p className="font-body text-sm text-dead-neon">{message}</p>}
        <button type="submit" disabled={loading} className="terminal-btn-primary w-full disabled:opacity-50">
          {loading ? "…" : mode === "magic" ? "SEND MAGIC LINK" : "SIGN IN"}
        </button>
      </form>

      <p className="text-center font-body text-[11px] text-[#555]">
        Configure Supabase auth templates for production.{" "}
        <Link href="/" className="text-dead-neon underline-offset-2 hover:underline">
          HOME
        </Link>
      </p>
    </div>
  );
}
