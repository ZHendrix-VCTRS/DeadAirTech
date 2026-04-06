"use client";

import { useEffect, useState } from "react";

export function GlitchText({ children }: { children: React.ReactNode }) {
  const [g, setG] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setG(true);
      setTimeout(() => setG(false), 150);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  return (
    <span className="relative inline-block">
      {g && (
        <span
          className="absolute left-0.5 top-px opacity-80"
          style={{ color: "#ff0040", clipPath: "inset(10% 0 60% 0)" }}
        >
          {children}
        </span>
      )}
      {g && (
        <span
          className="absolute -left-0.5 -top-px opacity-80"
          style={{ color: "#00d4ff", clipPath: "inset(50% 0 10% 0)" }}
        >
          {children}
        </span>
      )}
      {children}
    </span>
  );
}
