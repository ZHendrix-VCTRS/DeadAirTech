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
  const [menuOpen, setMenuOpen] = useState(false);
  const { openSkiGame } = useSkiGame();

  useEffect(() => {
    const read = () => setHash(typeof window !== "undefined" ? window.location.hash.slice(1) : "");
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-[100] border-b border-dead-line bg-[rgba(10,10,10,0.92)] backdrop-blur-[10px]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-2">
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

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = isNavActive(pathname, hash, item);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`whitespace-nowrap rounded px-2 py-1.5 font-display text-[10px] tracking-wide transition sm:text-[11px] ${
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

        {/* Mobile right side */}
        <div className="flex items-center gap-2 md:hidden">
          <AuthNav />
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-center justify-center gap-[5px] p-2"
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-[2px] w-5 bg-dead-neon transition-all ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span className={`block h-[2px] w-5 bg-dead-neon transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`block h-[2px] w-5 bg-dead-neon transition-all ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-dead-line bg-[rgba(10,10,10,0.97)] px-4 py-3 md:hidden">
          {NAV.map((item) => {
            const active = isNavActive(pathname, hash, item);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded px-3 py-2.5 font-display text-[11px] tracking-wide transition ${
                  active
                    ? "bg-[rgba(57,255,20,0.1)] text-dead-neon"
                    : "text-white hover:text-dead-neon/80"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
