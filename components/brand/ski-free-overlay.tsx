"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SkullLogo } from "@/components/brand/skull-logo";

const SKIER_DOWN: [number, number][] = [
  [3, 0],
  [4, 0],
  [2, 1],
  [3, 1],
  [4, 1],
  [5, 1],
  [3, 2],
  [4, 2],
  [2, 3],
  [3, 3],
  [4, 3],
  [5, 3],
  [1, 4],
  [2, 4],
  [3, 4],
  [4, 4],
  [5, 4],
  [6, 4],
  [3, 5],
  [4, 5],
  [2, 6],
  [3, 6],
  [4, 6],
  [5, 6],
  [3, 7],
  [4, 7],
  [2, 8],
  [3, 8],
  [4, 8],
  [5, 8],
  [1, 9],
  [2, 9],
  [5, 9],
  [6, 9],
];
const SKIER_LEFT: [number, number][] = [
  [2, 0],
  [3, 0],
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [2, 2],
  [3, 2],
  [1, 3],
  [2, 3],
  [3, 3],
  [4, 3],
  [0, 4],
  [1, 4],
  [2, 4],
  [3, 4],
  [4, 4],
  [5, 4],
  [2, 5],
  [3, 5],
  [1, 6],
  [2, 6],
  [3, 6],
  [4, 6],
  [2, 7],
  [3, 7],
  [1, 8],
  [2, 8],
  [3, 8],
  [0, 9],
  [1, 9],
  [4, 9],
  [5, 9],
];
const SKIER_RIGHT: [number, number][] = [
  [4, 0],
  [5, 0],
  [3, 1],
  [4, 1],
  [5, 1],
  [6, 1],
  [4, 2],
  [5, 2],
  [3, 3],
  [4, 3],
  [5, 3],
  [6, 3],
  [2, 4],
  [3, 4],
  [4, 4],
  [5, 4],
  [6, 4],
  [7, 4],
  [4, 5],
  [5, 5],
  [3, 6],
  [4, 6],
  [5, 6],
  [6, 6],
  [4, 7],
  [5, 7],
  [4, 8],
  [5, 8],
  [6, 8],
  [2, 9],
  [3, 9],
  [6, 9],
  [7, 9],
];
const TREE_PX: [number, number][] = [
  [3, 0],
  [4, 0],
  [2, 1],
  [3, 1],
  [4, 1],
  [5, 1],
  [1, 2],
  [2, 2],
  [3, 2],
  [4, 2],
  [5, 2],
  [6, 2],
  [0, 3],
  [1, 3],
  [2, 3],
  [3, 3],
  [4, 3],
  [5, 3],
  [6, 3],
  [7, 3],
  [2, 4],
  [3, 4],
  [4, 4],
  [5, 4],
  [1, 5],
  [2, 5],
  [3, 5],
  [4, 5],
  [5, 5],
  [6, 5],
  [0, 6],
  [1, 6],
  [2, 6],
  [3, 6],
  [4, 6],
  [5, 6],
  [6, 6],
  [7, 6],
  [3, 7],
  [4, 7],
  [3, 8],
  [4, 8],
  [3, 9],
  [4, 9],
];
const TOMB_PX: [number, number][] = [
  [2, 0],
  [3, 0],
  [4, 0],
  [5, 0],
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [5, 1],
  [6, 1],
  [1, 2],
  [2, 2],
  [3, 2],
  [4, 2],
  [5, 2],
  [6, 2],
  [1, 3],
  [2, 3],
  [4, 3],
  [5, 3],
  [6, 3],
  [1, 4],
  [2, 4],
  [3, 4],
  [4, 4],
  [5, 4],
  [6, 4],
  [1, 5],
  [2, 5],
  [4, 5],
  [5, 5],
  [6, 5],
  [1, 6],
  [2, 6],
  [3, 6],
  [4, 6],
  [5, 6],
  [6, 6],
  [2, 7],
  [3, 7],
  [4, 7],
  [5, 7],
];
const ROCK_PX: [number, number][] = [
  [2, 0],
  [3, 0],
  [4, 0],
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [5, 1],
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
  [4, 2],
  [5, 2],
  [6, 2],
  [1, 3],
  [2, 3],
  [3, 3],
  [4, 3],
  [5, 3],
  [2, 4],
  [3, 4],
  [4, 4],
];

function buildYeti(): [number, number][] {
  const px: [number, number][] = [];
  const r = [
    "   ########   ",
    "  ##########  ",
    " ## ###### ## ",
    " ## ###### ## ",
    " ############ ",
    "  ##########  ",
    "  ##########  ",
    "  ##########  ",
    " ############ ",
    " ## ###### ## ",
    " ## ###### ## ",
    "  ##########  ",
    "   ########   ",
    "    ##  ##    ",
    "   ##    ##   ",
    "  ###    ###  ",
  ];
  for (let y = 0; y < r.length; y++)
    for (let x = 0; x < r[y].length; x++) if (r[y][x] === "#") px.push([x, y]);
  return px;
}
const YETI_PX = buildYeti();

function dp(
  ctx: CanvasRenderingContext2D,
  px: [number, number][],
  ox: number,
  oy: number,
  color: string,
  sc: number
) {
  ctx.fillStyle = color;
  px.forEach((p) => {
    ctx.fillRect(ox + p[0] * sc, oy + p[1] * sc, sc, sc);
  });
}

type Obs = { x: number; y: number; t: string; w: number; h: number };
type Skier = { x: number; y: number; d: number };
type GameState = {
  st: string;
  sk: Skier;
  obs: Obs[];
  yeti: { x: number; y: number } | null;
  sc: number;
  spd: number;
  fr: number;
  keys: Record<string, boolean>;
  hi: number;
  W: number;
  H: number;
};

const HI_KEY = "deadair-ski-hi";

type Props = { onClose: () => void };

export function SkiFreeOverlay({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gRef = useRef<GameState>({
    st: "ready",
    sk: { x: 0, y: 100, d: 0 },
    obs: [],
    yeti: null,
    sc: 0,
    spd: 2.5,
    fr: 0,
    keys: {},
    hi: 0,
    W: 800,
    H: 600,
  });
  const animRef = useRef<number | null>(null);
  const [gState, setGState] = useState<"ready" | "playing" | "dead">("ready");
  const [score, setScore] = useState(0);
  const [hi, setHi] = useState(0);
  const tRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const r = localStorage.getItem(HI_KEY);
      if (r) {
        const v = parseInt(r, 10);
        if (!Number.isNaN(v)) {
          gRef.current.hi = v;
          setHi(v);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    function resize() {
      const el = canvasRef.current;
      if (!el) return;
      el.width = window.innerWidth;
      el.height = window.innerHeight;
      gRef.current.W = el.width;
      gRef.current.H = el.height;
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const spawn = useCallback(() => {
    const g = gRef.current;
    const types = ["tree", "tree", "tree", "tomb", "tomb", "rock"];
    const t = types[Math.floor(Math.random() * types.length)];
    return {
      x: Math.random() * (g.W - 60) + 30,
      y: g.H + Math.random() * 100,
      t,
      w: t === "rock" ? 14 : 16,
      h: t === "rock" ? 10 : 20,
    } as Obs;
  }, []);

  const die = useCallback((g: GameState) => {
    g.st = "dead";
    setGState("dead");
    if (g.sc > g.hi) {
      g.hi = g.sc;
      setHi(g.sc);
      try {
        localStorage.setItem(HI_KEY, String(g.sc));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const start = useCallback(() => {
    const g = gRef.current;
    g.st = "playing";
    g.sk = { x: g.W / 2, y: 100, d: 0 };
    g.obs = [];
    g.yeti = null;
    g.sc = 0;
    g.spd = 2.5;
    g.fr = 0;
    for (let i = 0; i < 12; i++) {
      const o = spawn();
      o.y = 200 + Math.random() * g.H;
      g.obs.push(o);
    }
    setGState("playing");
    setScore(0);
  }, [spawn]);

  useEffect(() => {
    function loop() {
      const c = canvasRef.current;
      if (!c) {
        animRef.current = requestAnimationFrame(loop);
        return;
      }
      const ctx = c.getContext("2d");
      if (!ctx) {
        animRef.current = requestAnimationFrame(loop);
        return;
      }
      const g = gRef.current;
      const W = g.W;
      const H = g.H;
      if (g.st !== "playing") {
        animRef.current = requestAnimationFrame(loop);
        return;
      }
      g.fr++;
      g.sc += Math.floor(g.spd);
      g.spd = Math.min(8, 2.5 + g.sc / 800);
      setScore(g.sc);
      const ms = 4;
      if (g.keys["ArrowLeft"] || g.keys["a"]) {
        g.sk.x -= ms;
        g.sk.d = -1;
      } else if (g.keys["ArrowRight"] || g.keys["d"]) {
        g.sk.x += ms;
        g.sk.d = 1;
      } else {
        g.sk.d = 0;
      }
      g.sk.x = Math.max(10, Math.min(W - 26, g.sk.x));
      for (let i = 0; i < g.obs.length; i++) g.obs[i].y -= g.spd;
      g.obs = g.obs.filter((o) => o.y > -40);
      if (g.fr % Math.max(8, 25 - Math.floor(g.sc / 500)) === 0) g.obs.push(spawn());
      if (g.sc > 3000 && !g.yeti) g.yeti = { x: W / 2, y: H + 60 };
      if (g.yeti) {
        const dx = g.sk.x - g.yeti.x;
        const dy = g.sk.y - g.yeti.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          g.yeti.x += (dx / dist) * g.spd * 0.55;
          g.yeti.y += (dy / dist) * g.spd * 0.55;
        }
        if (Math.abs(g.sk.x - g.yeti.x) < 20 && Math.abs(g.sk.y - g.yeti.y) < 24) die(g);
      }
      for (let j = 0; j < g.obs.length; j++) {
        const ob = g.obs[j];
        if (g.sk.x + 8 > ob.x && g.sk.x < ob.x + ob.w && g.sk.y + 20 > ob.y && g.sk.y < ob.y + ob.h) {
          die(g);
          break;
        }
      }
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);
      g.obs.forEach((ob) => {
        if (ob.t === "tree") {
          dp(ctx, TREE_PX, ob.x, ob.y, "#1a8a1a", 2);
        } else if (ob.t === "tomb") {
          dp(ctx, TOMB_PX, ob.x, ob.y, "#707070", 2);
          ctx.fillStyle = "#39ff14";
          ctx.font = "6px 'Press Start 2P', monospace";
          ctx.fillText("RIP", ob.x + 4, ob.y + 12);
        } else {
          dp(ctx, ROCK_PX, ob.x, ob.y, "#505050", 2);
        }
      });
      const spr = g.sk.d < 0 ? SKIER_LEFT : g.sk.d > 0 ? SKIER_RIGHT : SKIER_DOWN;
      dp(ctx, spr, g.sk.x, g.sk.y, "#39ff14", 2);
      if (g.yeti) {
        const pulse = Math.sin(g.fr * 0.15) * 0.3 + 0.7;
        dp(ctx, YETI_PX, g.yeti.x - 14, g.yeti.y - 16, `rgba(234,67,53,${pulse})`, 3);
        ctx.fillStyle = `rgba(66,133,244,${pulse})`;
        ctx.font = "bold 18px sans-serif";
        ctx.fillText("G", g.yeti.x + 2, g.yeti.y + 10);
      }
      ctx.fillStyle = "rgba(10,10,10,0.8)";
      ctx.fillRect(0, 0, W, 36);
      ctx.fillStyle = "#39ff14";
      ctx.font = "12px 'Press Start 2P', monospace";
      ctx.fillText(`DIST: ${g.sc}m`, 16, 24);
      ctx.fillStyle = "#555";
      ctx.font = "10px 'Press Start 2P', monospace";
      ctx.fillText("ESC TO EXIT", W - 160, 24);
      if (g.sc > 2500 && !g.yeti) {
        ctx.fillStyle = "#ff0040";
        ctx.font = "12px 'Press Start 2P', monospace";
        ctx.fillText("SOMETHING IS COMING...", W / 2 - 140, 24);
      }
      if (g.yeti && g.fr % 30 < 15) {
        ctx.fillStyle = "#ff0040";
        ctx.font = "12px 'Press Start 2P', monospace";
        ctx.fillText("GOOGLE IS CHASING YOU", W / 2 - 140, 24);
      }
      animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [die, spawn]);

  useEffect(() => {
    function dn(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      gRef.current.keys[e.key] = true;
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
    }
    function up(e: KeyboardEvent) {
      gRef.current.keys[e.key] = false;
    }
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", dn);
      window.removeEventListener("keyup", up);
    };
  }, [onClose]);

  function ts(e: React.TouchEvent) {
    tRef.current = e.touches[0].clientX;
  }
  function tm(e: React.TouchEvent) {
    if (tRef.current == null) return;
    const d = e.touches[0].clientX - tRef.current;
    if (d < -5) {
      gRef.current.keys["ArrowLeft"] = true;
      gRef.current.keys["ArrowRight"] = false;
    } else if (d > 5) {
      gRef.current.keys["ArrowRight"] = true;
      gRef.current.keys["ArrowLeft"] = false;
    }
    tRef.current = e.touches[0].clientX;
  }
  function te() {
    tRef.current = null;
    gRef.current.keys["ArrowLeft"] = false;
    gRef.current.keys["ArrowRight"] = false;
  }

  const ov =
    "absolute inset-0 flex flex-col items-center justify-center";
  const btn =
    "cursor-pointer rounded border-none px-8 py-3.5 font-display text-[11px] tracking-wide";
  return (
    <div className="fixed inset-0 z-[10000] bg-[#0a0a0a]">
      <canvas
        ref={canvasRef}
        onTouchStart={ts}
        onTouchMove={tm}
        onTouchEnd={te}
        className="block h-full w-full touch-none"
        style={{ imageRendering: "pixelated" }}
      />
      {gState === "ready" && (
        <div className={`${ov} bg-[rgba(10,10,10,0.9)]`}>
          <SkullLogo size={64} />
          <h2
            className="font-display mx-4 mt-4 mb-2 text-center text-lg text-[#39ff14]"
            style={{ textShadow: "0 0 20px rgba(57,255,20,0.4)" }}
          >
            DEAD RUN
          </h2>
          <p className="font-body mx-4 mb-1 text-center text-sm text-[#c0c0c0]">
            Ski through the graveyard of dead tech.
          </p>
          <p className="font-body mx-4 mb-6 text-center text-[13px] text-[#d4d4d4]">
            Dodge the tombstones. Outrun Google.
          </p>
          <button type="button" onClick={start} className={`${btn} bg-[#39ff14] text-[#0a0a0a]`}>
            ▶ START
          </button>
          <p className="font-body mt-5 text-center text-[11px] text-[#808080]">
            ← → arrow keys or swipe to steer
          </p>
          <button
            type="button"
            onClick={onClose}
            className="font-display mt-4 cursor-pointer rounded border border-[#555] bg-transparent px-4 py-2 text-[8px] text-[#808080]"
          >
            ESC TO EXIT
          </button>
        </div>
      )}
      {gState === "dead" && (
        <div className={`${ov} bg-[rgba(10,10,10,0.9)]`}>
          <div className="mb-3 text-5xl">💀</div>
          <h3 className="font-display mb-3 text-base text-[#ff0040]">GAME OVER</h3>
          <p className="font-display mb-1 text-xs text-[#c0c0c0]">DISTANCE: {score}m</p>
          <p className="font-display mb-4 text-[9px] text-[#808080]">BEST: {hi}m</p>
          {gRef.current.yeti && score > 0 && (
            <p className="font-body mb-4 max-w-md px-4 text-center text-[13px] italic text-[#ff0040]">
              Google got you. It gets everyone eventually.
            </p>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={start} className={`${btn} bg-[#39ff14] text-[#0a0a0a]`}>
              TRY AGAIN
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`${btn} border border-[#39ff14] bg-transparent text-[#39ff14]`}
            >
              EXIT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
