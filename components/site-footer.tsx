"use client";

import { SkullLogo } from "@/components/brand/skull-logo";
import { useSkiGame } from "@/components/ski-game-provider";
import { SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  const { openSkiGame } = useSkiGame();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] mt-auto border-t border-[rgba(57,255,20,0.1)] text-center">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <button
          type="button"
          onClick={openSkiGame}
          className="mx-auto block cursor-pointer border-none bg-transparent p-0"
          aria-label="Open hidden game"
        >
          <SkullLogo size={24} />
        </button>
        <p className="font-display mt-3 text-[8px] tracking-wide text-[#666]">
          {SITE_NAME.toUpperCase()} © {year}
        </p>
        <p className="font-body mt-3 text-[13px] italic text-[#c0c0c0]">DAT&apos;s all, folks.</p>
        <p className="font-body mt-1.5 text-[11px] italic text-[#808080]">
          Broadcasting nothing, to no one, beautifully.
        </p>
        <div className="mx-auto mt-8 max-w-xl border-t border-[rgba(57,255,20,0.08)] pt-5">
          <p className="font-body text-[9px] leading-relaxed text-[#555]">
            DISCLAIMER: Dead Air Technologies is a parody and humor site. All commentary, obituaries, and roasts are
            satirical. We are not affiliated with any companies or products mentioned. No actual tech products were harmed
            — they were already dead.
          </p>
        </div>
      </div>
    </footer>
  );
}
