"use client";

import { useEffect, useState } from "react";

type Eulogy = {
  cause_of_death: string;
  survived_by: string;
  flowers_or_forget_me_nots: string;
  pallbearers_note: string;
  sponsor: string;
};

const LOADING_PHRASES = [
  "DIGGING THE GRAVE...",
  "WRITING THE OBITUARY...",
  "CONSULTING THE TOMBSTONE...",
  "SUMMONING THE CORPSE...",
  "MOURNING PROFESSIONALLY...",
  "POLISHING THE CASKET...",
  "NOTIFYING NEXT OF KIN...",
  "SCHEDULING THE FUNERAL...",
  "GRIEVING IN MONOSPACE...",
  "BLAMING THE VC...",
  "FILING THE DEATH CERTIFICATE...",
  "LOWERING INTO THE GROUND...",
];

export default function EulogyPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [eulogy, setEulogy] = useState<Eulogy | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "err">("idle");
  const [error, setError] = useState<string | null>(null);
  const [loadingPhrase, setLoadingPhrase] = useState(LOADING_PHRASES[0]);

  useEffect(() => {
    if (status !== "loading") return;
    const iv = setInterval(() => {
      setLoadingPhrase(LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)]);
    }, 600);
    return () => clearInterval(iv);
  }, [status]);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    setEulogy(null);

    try {
      const res = await fetch("/api/eulogy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });
      const data = (await res.json()) as { error?: string } & Partial<Eulogy>;
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setEulogy(data as Eulogy);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something died that shouldn't have.");
      setStatus("err");
    }
  }

  function reset() {
    setEulogy(null);
    setStatus("idle");
    setName("");
    setDescription("");
    setError(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col space-y-8 py-10">
      <div className="space-y-3 text-center">
        <p className="font-display text-[11px] tracking-[0.25em] text-dead-red animate-pulse">
          ● AI-POWERED
        </p>
        <h1
          className="font-display text-dead-neon"
          style={{
            fontSize: "clamp(20px, 4vw, 48px)",
            textShadow: "0 0 30px rgba(57,255,20,0.4)",
          }}
        >
          EULOGY GENERATOR
        </h1>
        <p className="mx-auto max-w-lg font-body text-[16px] leading-relaxed text-white">
          Every dead product deserves a proper sendoff. Type a name. We&apos;ll handle the grief.
        </p>
      </div>

      {!eulogy && (
        <form onSubmit={generate} className="space-y-4">
          <div className="space-y-2">
            <label className="font-display text-[10px] tracking-widest text-dead-neon/70">
              PRODUCT / STARTUP / FEATURE / SIDE PROJECT
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Google Glass, Juicero, my Rust side project..."
              className="terminal-input w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="font-display text-[10px] tracking-widest text-dead-neon/70">
              ANYTHING ELSE WE SHOULD KNOW? (OPTIONAL)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. raised $400M, only had 3 users, my ex built it..."
              className="terminal-input w-full"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="terminal-btn-primary w-full py-4 disabled:opacity-50"
          >
            {status === "loading" ? `${loadingPhrase} 🪦` : "WRITE THE EULOGY →"}
          </button>
        </form>
      )}

      {error && <p className="text-center font-body text-[14px] text-dead-red">{error}</p>}

      {eulogy && (
        <div className="terminal-border animate-fadeUp space-y-6 rounded-lg border-dead-neon/40 p-8">
          <div className="space-y-2 text-center">
            <div className="text-5xl">🪦</div>
            <h2
              className="font-display text-dead-neon"
              style={{ fontSize: "clamp(16px, 3vw, 32px)" }}
            >
              {name.toUpperCase()}
            </h2>
            <p className="font-display text-[10px] tracking-widest text-white/40">IN MEMORIAM</p>
          </div>

          <div className="space-y-5 border-t border-dead-neon/20 pt-6">
            <div className="space-y-1">
              <p className="font-display text-[10px] tracking-widest text-dead-red">CAUSE OF DEATH</p>
              <p className="font-body text-[16px] leading-relaxed text-white">{eulogy.cause_of_death}</p>
            </div>

            <div className="space-y-1">
              <p className="font-display text-[10px] tracking-widest text-dead-neon/70">SURVIVED BY</p>
              <p className="font-body text-[16px] leading-relaxed text-white">{eulogy.survived_by}</p>
            </div>

            <div className="space-y-1">
              <p className="font-display text-[10px] tracking-widest text-dead-neon/70">
                FLOWERS OR FORGET-ME-NOTS
              </p>
              <p className="font-body text-[16px] leading-relaxed text-white">
                {eulogy.flowers_or_forget_me_nots}
              </p>
            </div>

            <div className="space-y-1 border-t border-dead-neon/20 pt-5">
              <p className="font-display text-[10px] tracking-widest text-dead-neon/70">
                PALLBEARER&apos;S NOTE
              </p>
              <p className="font-body text-[16px] leading-relaxed text-white">{eulogy.pallbearers_note}</p>
            </div>
          </div>

          <div className="border-t border-dead-neon/10 pt-4">
            <p className="text-center font-body text-[12px] italic text-white/30">{eulogy.sponsor}</p>
          </div>

          <button type="button" onClick={reset} className="terminal-btn-ghost w-full">
            BURY ANOTHER ONE →
          </button>
        </div>
      )}
    </div>
  );
}
