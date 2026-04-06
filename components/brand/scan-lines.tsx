/**
 * CRT scan lines — exact pattern from original-dead-air-component.jsx (ScanLines).
 * CSS only, no canvas; pointer-events none.
 */
export function ScanLines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9998] h-full w-full"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
      }}
    />
  );
}
