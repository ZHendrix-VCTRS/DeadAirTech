"use client";

import { useState } from "react";
import { GlitchText } from "@/components/brand/glitch-text";
import { SkullLogo } from "@/components/brand/skull-logo";
import { useSkiGame } from "@/components/ski-game-provider";
import { HERO_TAGLINE, SITE_NAME } from "@/lib/constants";

export function HomeHero() {
  const { openSkiGame } = useSkiGame();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("err");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("ok");
      setEmail("");
      setMessage("You're in the graveyard. First edition of The Static incoming.");
    } catch {
      setStatus("err");
      setMessage("Network error. Try again.");
    }
  }

  if (status === "ok") {
    return (
      <section
        id="the-static"
        className="mx-auto max-w-2xl scroll-mt-24 space-y-6 px-2 text-center animate-fadeUp"
      >
        <div className="flex justify-center">
          <SkullLogo
            size={64}
            onClick={openSkiGame}
            className="mx-auto"
            style={{ filter: "drop-shadow(0 0 12px rgba(57,255,20,0.35))" }}
          />
        </div>
        <h1
          className="font-display text-[clamp(14px,3.5vw,22px)] leading-snug text-dead-neon"
          style={{ textShadow: "0 0 30px rgba(57,255,20,0.4)" }}
        >
          <GlitchText>{SITE_NAME.toUpperCase()}</GlitchText>
        </h1>
        <p className="font-body text-sm leading-relaxed text-[#c0c0c0]">{HERO_TAGLINE}</p>
        <div className="terminal-border mx-auto max-w-lg rounded-lg border-dead-neon/40 bg-[rgba(57,255,20,0.05)] p-8">
          <div className="mb-3 text-4xl">💀✉️</div>
          <p className="font-display text-xs text-dead-neon">YOU&apos;RE IN THE GRAVEYARD.</p>
          <p className="font-body mt-2 text-[13px] text-[#c0c0c0]">{message}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="the-static"
      className="mx-auto max-w-2xl scroll-mt-24 space-y-6 px-2 text-center animate-fadeUp"
    >
      <div className="flex justify-center">
        <SkullLogo
          size={64}
          onClick={openSkiGame}
          style={{ filter: "drop-shadow(0 0 12px rgba(57,255,20,0.35))" }}
        />
      </div>

      <h1
        className="font-display text-[clamp(14px,3.5vw,22px)] leading-snug text-dead-neon"
        style={{ textShadow: "0 0 30px rgba(57,255,20,0.4)" }}
      >
        <GlitchText>{SITE_NAME.toUpperCase()}</GlitchText>
      </h1>

      <p className="font-body mx-auto max-w-2xl text-sm leading-relaxed text-[#c0c0c0]">{HERO_TAGLINE}</p>

      <form
        onSubmit={onSubmit}
        className="mx-auto flex max-w-[460px] flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:justify-center"
      >
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
          className="terminal-input min-h-[48px] min-w-[220px] flex-1 rounded px-4 py-3.5 font-body text-sm"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="terminal-btn-primary min-h-[48px] shrink-0 disabled:opacity-50"
        >
          {status === "loading" ? "…" : "SUBSCRIBE →"}
        </button>
      </form>

      {message && status === "err" && (
        <p className="font-body text-[11px] text-dead-red">{message}</p>
      )}

      <p className="font-body text-[11px] text-[#808080]">
        No spam. Unsubscribe anytime — unlike Google&apos;s products, we respect your choices.
      </p>
    </section>
  );
}
