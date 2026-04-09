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
      <div className="mx-auto flex max-w-5xl flex-nowrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <SkullLogo
            size={28}
            onClick={openSkiGame}
            style={{ filter: "drop-shadow(0 0 6px rgba(57,255,20,0.35))" }}
          />
          <Link
            href="/"
            className="whitespace-nowrap font-display text-[13px] tracking-wide text-dead-neon"
            style={{ textShadow: "0 0 12px rgba(57,255,20,0.35)" }}
          >
            DEAD AIR
          </Link>
        </div>
        <nav className="flex flex-nowrap items-center gap-2">
          {NAV.map((item) => {
            const active = isNavActive(pathname, hash, item);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded px-3 py-2 font-display text-[11px] tracking-wide transition sm:px-4 ${
                  active
                    ? "bg-[rgba(57,255,20,0.1)] text-dead-neon"
                    : "text-white hover:text-dead-neon/80"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <AuthNav />
        </nav>
      </div>
    </header>
  );
}
