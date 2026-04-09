import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6 px-4 text-center">
      <div className="text-6xl animate-pulse">🪦</div>

      <p className="font-display text-[11px] tracking-[0.25em] text-dead-red animate-pulse">
        ● ERROR 404
      </p>

      <h1
        className="font-display text-dead-neon"
        style={{
          fontSize: "clamp(28px, 6vw, 64px)",
          textShadow: "0 0 30px rgba(57,255,20,0.4)",
        }}
      >
        PAGE NOT FOUND
      </h1>

      <div className="terminal-border w-full max-w-md space-y-3 rounded-lg border-dead-neon/30 p-6">
        <p className="font-display text-[10px] tracking-widest text-dead-red">CAUSE OF DEATH</p>
        <p className="font-body text-[15px] leading-relaxed text-white">
          This page launched in stealth mode and never came out of it.
        </p>
        <p className="font-display pt-2 text-[10px] tracking-widest text-dead-neon/50">
          SURVIVED BY: the homepage
        </p>
      </div>

      <p className="font-body text-[13px] text-white/50">
        Whatever you were looking for didn&apos;t make it. Classic.
      </p>

      <Link href="/" className="terminal-btn-primary">
        BACK TO THE GRAVEYARD →
      </Link>
    </div>
  );
}
