import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <p className="font-display text-[8px] tracking-[0.35em] text-dead-red">404</p>
      <h1 className="font-display text-sm text-dead-neon">NOTHING HERE BUT ECHOES</h1>
      <p className="font-body text-[13px] text-[#808080]">
        This project is private, flagged, or never existed. Schrödinger&apos;s startup.
      </p>
      <Link href="/" className="font-display inline-block text-[9px] text-dead-neon underline-offset-4 hover:underline">
        ← RETURN TO THE GRAVEYARD
      </Link>
    </div>
  );
}
