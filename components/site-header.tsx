"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SkullLogo } from "@/components/brand/skull-logo";
import { useSkiGame } from "@/components/ski-game-provider";
import { AuthNav } from "@/components/auth-nav";

const NAV: { href: string; label: string; hash?: string }[] = [
  { href: "/", label: "HOME" },
  { href: "/#hot-or-not", label: "HOT OR NOT", hash: "hot-or-not" },
  { href: "/leaderboard", label: "LEADERBOARD" },
  { href: "/eulogy", label: "EULOGY" },
  { href: "/submit", label: "BURY" },
  { href: "/#the-static", label: "SUBSCRIBE", hash: "the-static" },
];

function isNavActive(
  pathname: string,
  hash: string,
  item: { href: string; hash?: string }
): boolean {
  if (item.href.startsWith("/#")) {
    return pathname === "/" && (item.hash ? hash === item.hash : false);
  }
  if (item.href === "/") {
    return pathname === "/" && !hash;
  }
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function SiteHeader() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const { openSkiGame } = useSkiGame();

  useEffect(() => {
    const read = () => setHash(typeof window !== "undefined" ? window.location.hash.slice(1) : "");
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-[100] border-b border-dead-line bg-[rgba(10,10,10,0.92)] backdrop-blur-[10px]">
      <div className="mx-auto flex max-w-5xl flex-nowrap items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <SkullLogo
            size={28}
            onClick={openSkiGame}
            style={{ filter: "drop-shadow(0 0 6px rgba(57,255,20,0.35))" }}
          />
          <Link
            href="/"
            className="whitespace-nowrap font-display text-[12px] tracking-wide text-dead-neon sm:text-[13px]"
            style={{ textShadow: "0 0 12px rgba(57,255,20,0.35)" }}
          >
            DEAD AIR
          </Link>
        </div>
        <nav className="flex min-w-0 flex-1 flex-nowrap items-center justify-end gap-0.5 sm:gap-1">
          {NAV.map((item) => {
            const active = isNavActive(pathname, hash, item);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`whitespace-nowrap rounded px-1.5 py-1.5 font-display text-[10px] tracking-wide transition sm:px-2 sm:text-[11px] ${
                  active
                    ? "bg-[rgba(57,255,20,0.1)] text-dead-neon"
                    : "text-white hover:text-dead-neon/80"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="shrink-0 pl-0.5">
            <AuthNav />
          </div>
        </nav>
      </div>
    </header>
  );
}
