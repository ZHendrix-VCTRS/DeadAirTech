"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getFingerprintForClient } from "@/lib/fingerprint";
import type { CastVoteResult } from "@/lib/types/database";

type Props = {
  projectId: string;
  fingerprint: string;
  userId: string | null;
  hotPct: number;
  voteCount: number;
};

export function VoteButtons({
  projectId,
  fingerprint: initialFp,
  userId,
  hotPct: initialHotPct,
  voteCount: initialVoteCount,
}: Props) {
  const [hotPct, setHotPct] = useState(initialHotPct);
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const vote = useCallback(
    async (value: "hot" | "not") => {
      setPending(true);
      setMsg(null);
      const fp = getFingerprintForClient() || initialFp;
      const supabase = createClient();
      const { data, error } = await supabase.rpc("cast_vote", {
        p_project_id: projectId,
        p_fingerprint: fp,
        p_vote: value,
        p_user_id: userId,
      });

      setPending(false);

      if (error) {
        setMsg(error.message);
        return;
      }

      const result = data as CastVoteResult | null;
      if (!result?.success) {
        setMsg(result?.message ?? "Could not record vote.");
        return;
      }

      if (typeof result.hot_percentage === "number") {
        setHotPct(result.hot_percentage);
      }
      if (typeof result.vote_count === "number") {
        setVoteCount(result.vote_count);
      }
      setMsg(null);
    },
    [initialFp, projectId, userId]
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => vote("hot")}
          className="rounded border border-dead-neon bg-[rgba(57,255,20,0.1)] px-3 py-1.5 font-display text-[10px] text-dead-neon transition hover:bg-[rgba(57,255,20,0.18)] disabled:opacity-50"
        >
          🔥 HOT
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => vote("not")}
          className="rounded border border-dead-red bg-[rgba(255,0,64,0.08)] px-3 py-1.5 font-display text-[10px] text-dead-red transition hover:bg-[rgba(255,0,64,0.14)] disabled:opacity-50"
        >
          🧊 NOT
        </button>
        <span className="font-body text-[13px] text-[#808080]">
          {hotPct.toFixed(0)}% hot · {voteCount} votes
        </span>
      </div>
      {msg && <p className="max-w-xs font-body text-[13px] text-dead-red">{msg}</p>}
    </div>
  );
}
