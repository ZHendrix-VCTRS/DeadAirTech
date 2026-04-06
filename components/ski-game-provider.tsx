"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { SkiFreeOverlay } from "@/components/brand/ski-free-overlay";

type Ctx = { openSkiGame: () => void };

const SkiGameContext = createContext<Ctx | null>(null);

export function useSkiGame(): Ctx {
  const v = useContext(SkiGameContext);
  if (!v) {
    throw new Error("useSkiGame must be used within SkiGameProvider");
  }
  return v;
}

export function SkiGameProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openSkiGame = useCallback(() => setOpen(true), []);

  return (
    <SkiGameContext.Provider value={{ openSkiGame }}>
      {children}
      {open && <SkiFreeOverlay onClose={() => setOpen(false)} />}
    </SkiGameContext.Provider>
  );
}
