"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getFingerprintForClient } from "@/lib/fingerprint";
import type { CastVoteResult, Project } from "@/lib/types/database";

const BATCH = 12;

export function HotOrNotSwiper() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<"left" | "right" | null>(null);
  const [showRes, setShowRes] = useState(false);
  const [lastHotPct, setLastHotPct] = useState<number | null>(null);
  const [sx, setSx] = useState<number | null>(null);
  const [dx, setDx] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [poolExhausted, setPoolExhausted] = useState(false);
  const votingRef = useRef(false);
  const supabase = useRef(createClient());
  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    supabase.current.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
    const {
      data: { subscription },
    } = supabase.current.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchBatch = useCallback(async () => {
    setLoadError(null);
    const fp = getFingerprintForClient();
    const { data, error } = await supabase.current.rpc("get_random_projects", {
      p_fingerprint: fp,
      p_limit: BATCH,
    });
    if (error) {
      setLoadError(error.message);
      return [] as Project[];
    }
    const rows = (data ?? []) as Project[];
    return rows.filter((p) => !seenIds.current.has(p.id));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setInitialLoading(true);
      setPoolExhausted(false);
      const rows = await fetchBatch();
      if (cancelled) return;
      rows.forEach((p) => seenIds.current.add(p.id));
      setProjects(rows);
      setIdx(0);
      if (rows.length === 0) setPoolExhausted(true);
      setInitialLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchBatch]);

  useEffect(() => {
    if (initialLoading) return;
    if (poolExhausted && projects.length === 0) return;
    if (idx < projects.length) return;
    if (fetchingMore || poolExhausted) return;

    let cancelled = false;
    (async () => {
      setFetchingMore(true);
      const rows = await fetchBatch();
      if (cancelled) return;
      if (rows.length === 0) {
        setPoolExhausted(true);
        setFetchingMore(false);
        return;
      }
      rows.forEach((p) => seenIds.current.add(p.id));
      setProjects((prev) => [...prev, ...rows]);
      setFetchingMore(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [idx, projects.length, initialLoading, fetchingMore, poolExhausted, fetchBatch]);

  function vote(side: "left" | "right") {
    if (votingRef.current || idx >= projects.length || dir) return;
    const item = projects[idx];
    if (!item) return;

    votingRef.current = true;
    setVoteError(null);
    setDir(side === "right" ? "right" : "left");

    window.setTimeout(async () => {
      const voteVal = side === "right" ? "hot" : "not";
      const fp = getFingerprintForClient();
      const { data, error } = await supabase.current.rpc("cast_vote", {
        p_project_id: item.id,
        p_fingerprint: fp,
        p_vote: voteVal,
        p_user_id: userId,
      });

      if (error) {
        setVoteError(error.message);
        setDir(null);
        votingRef.current = false;
        return;
      }

      const result = data as CastVoteResult | null;
      if (!result?.success) {
        setVoteError(result?.message ?? "Vote failed.");
        setDir(null);
        votingRef.current = false;
        return;
      }

      if (typeof result.hot_percentage === "number") {
        setLastHotPct(result.hot_percentage);
      }
      setShowRes(true);

      window.setTimeout(() => {
        setDir(null);
        setShowRes(false);
        setIdx((i) => i + 1);
        votingRef.current = false;
      }, 800);
    }, 300);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (dir) return;
    setSx(e.clientX);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (sx === null || dir) return;
    setDx(e.clientX - sx);
  }

  function onPointerUp(e: React.PointerEvent) {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (dir) return;
    if (Math.abs(dx) > 80) {
      vote(dx > 0 ? "right" : "left");
    }
    setSx(null);
    setDx(0);
  }

  if (initialLoading) {
    return (
      <p className="font-body text-center text-[15px] text-[#808080]">Loading the graveyard…</p>
    );
  }

  if (loadError && projects.length === 0) {
    return (
      <p className="font-body text-center text-[15px] text-dead-red">
        Could not load projects: {loadError}
      </p>
    );
  }

  if (idx >= projects.length && poolExhausted && !fetchingMore) {
    return (
      <div className="px-4 py-10 text-center">
        <div className="mb-4 text-5xl">⚰️</div>
        <h3 className="font-display mb-3 text-base text-dead-neon">ALL VOTES CAST</h3>
        <p className="font-body mb-6 text-[14px] text-[#d4d4d4]">The dead have been judged. For now.</p>
        <button
          type="button"
          onClick={async () => {
            setInitialLoading(true);
            setPoolExhausted(false);
            seenIds.current.clear();
            const rows = await fetchBatch();
            rows.forEach((p) => seenIds.current.add(p.id));
            setProjects(rows);
            setIdx(0);
            if (rows.length === 0) setPoolExhausted(true);
            setInitialLoading(false);
          }}
          className="terminal-btn-primary"
        >
          LOAD MORE CORPSES
        </button>
      </div>
    );
  }

  if (idx >= projects.length && fetchingMore) {
    return (
      <p className="font-body text-center text-[15px] text-[#808080]">Summoning the next corpse…</p>
    );
  }

  const item = projects[idx];
  if (!item) {
    return (
      <p className="font-body text-center text-[15px] text-[#808080]">Loading…</p>
    );
  }

  const emoji = item.ai_emoji ?? "💀";
  const tagline = item.ai_tagline ?? item.one_liner ?? "—";
  const cause = item.ai_cause_of_death ?? item.why_stopped ?? "Cause unknown. The void keeps secrets.";
  const meta = [item.tech_stack?.trim() || "DEAD TECH", new Date(item.created_at).getFullYear().toString()]
    .filter(Boolean)
    .join(" • ");

  const cardTransform =
    dir === "right"
      ? "translateX(120%) rotate(12deg)"
      : dir === "left"
        ? "translateX(-120%) rotate(-12deg)"
        : `translateX(${dx}px) rotate(${dx * 0.05}deg)`;

  const cardBorder =
    dir === "right"
      ? "border-2 border-dead-neon"
      : dir === "left"
        ? "border-2 border-dead-red"
        : "border-2 border-[rgba(57,255,20,0.3)]";

  const cardTransition = dir ? "all 0.3s ease-out" : dx ? "none" : "all 0.2s ease";

  const voting = !!dir || votingRef.current;

  return (
    <div className="mx-auto max-w-[420px] select-none">
      <div className="mb-4 text-center">
        <span className="font-display text-[10px] text-[#a0a0a0]">
          {idx + 1} / {projects.length}
        </span>
      </div>

      <div
        role="presentation"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`relative flex min-h-[340px] flex-col justify-between rounded-lg bg-gradient-to-b from-[#111] to-dead-bg px-7 py-8 ${cardBorder}`}
        style={{
          transform: cardTransform,
          opacity: dir ? 0 : 1,
          transition: cardTransition,
          touchAction: "none",
        }}
      >
        {dx > 40 && !dir && (
          <div
            className="absolute right-5 top-5 rounded border-2 border-dead-neon px-2.5 py-1 font-display text-sm text-dead-neon"
            style={{ transform: "rotate(12deg)" }}
          >
            HOT
          </div>
        )}
        {dx < -40 && !dir && (
          <div
            className="absolute left-5 top-5 rounded border-2 border-dead-red px-2.5 py-1 font-display text-sm text-dead-red"
            style={{ transform: "rotate(-12deg)" }}
          >
            NOT
          </div>
        )}

        <div>
          <div
            className="mb-4 text-center text-[56px] leading-none"
            style={{ filter: "drop-shadow(0 0 20px rgba(57,255,20,0.3))" }}
          >
            {emoji}
          </div>
          <span className="font-display text-[9px] uppercase tracking-[0.2em] text-dead-neon">{meta}</span>
          <h3 className="font-display mt-2 text-[20px] leading-snug text-[#e0e0e0]">
            <Link href={`/project/${item.id}`} className="hover:text-dead-neon hover:underline">
              {item.name}
            </Link>
          </h3>
          <p className="font-body mt-1 text-[14px] italic text-[#c0c0c0]">{tagline}</p>
        </div>

        <div>
          <div className="font-display mb-1.5 text-[9px] tracking-wide text-dead-red">CAUSE OF DEATH:</div>
          <p className="font-body text-[14px] leading-relaxed text-[#d4d4d4]">{cause}</p>
        </div>

        {showRes && lastHotPct !== null && (
          <div className="absolute bottom-3 right-4 font-body text-[11px] text-[#d4d4d4]">
            {Math.round(lastHotPct)}% hot
          </div>
        )}
      </div>

      {voteError && (
        <p className="mt-3 text-center font-body text-[13px] text-dead-red">{voteError}</p>
      )}

      <div className="mt-6 flex justify-center gap-6">
        <button
          type="button"
          aria-label="Not"
          onClick={() => vote("left")}
          disabled={voting}
          className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-dead-red bg-[rgba(255,0,64,0.1)] text-2xl disabled:opacity-50"
        >
          💀
        </button>
        <button
          type="button"
          aria-label="Hot"
          onClick={() => vote("right")}
          disabled={voting}
          className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-dead-neon bg-[rgba(57,255,20,0.1)] text-2xl disabled:opacity-50"
        >
          🔋
        </button>
      </div>

      <div className="mt-2.5 flex justify-center gap-10">
        <span className="font-display text-[9px] tracking-wide text-dead-red">LET IT ROT</span>
        <span className="font-display text-[9px] tracking-wide text-dead-neon">RESURRECT</span>
      </div>
    </div>
  );
}
