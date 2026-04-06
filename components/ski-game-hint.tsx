"use client";

import { useSkiGame } from "@/components/ski-game-provider";

export function SkiGameHint() {
  const { openSkiGame } = useSkiGame();

  return (
    <button
      type="button"
      onClick={openSkiGame}
      aria-label="Open SkiFree game"
      className="fixed bottom-4 right-4 z-[99] cursor-pointer rounded border border-[rgba(57,255,20,0.15)] bg-[rgba(10,10,10,0.8)] px-3 py-2 font-display text-[7px] tracking-[0.06em] text-dead-neon animate-hintPulse"
      style={{ letterSpacing: "1px" }}
    >
      ⛷️ CLICK SKULL TO PLAY
    </button>
  );
}
