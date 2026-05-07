"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// A deliberately tiny voxel sandbox: 2D grid of "blocks" rendered as DOM
// divs in an isometric projection. No canvas, no WebGL, no game loop —
// it only re-renders on user input, so idle CPU is zero.

type BlockType = "grass" | "dirt" | "stone" | "wood" | "leaf" | "water" | "empty";

const COLORS: Record<BlockType, string> = {
  grass: "#7ec84a",
  dirt: "#8b5a2b",
  stone: "#9aa0a6",
  wood: "#a9751a",
  leaf: "#3f8a2a",
  water: "#3a85d6",
  empty: "transparent",
};

const SIZE = 12; // 12x12 grid

function seedWorld(): BlockType[][] {
  const w: BlockType[][] = [];
  for (let y = 0; y < SIZE; y++) {
    const row: BlockType[] = [];
    for (let x = 0; x < SIZE; x++) {
      // simple deterministic terrain
      const v = Math.sin(x * 0.7) + Math.cos(y * 0.6) + (x ^ y) * 0.05;
      let t: BlockType = "grass";
      if (v < -0.6) t = "water";
      else if (v < -0.2) t = "dirt";
      else if (v > 1.2) t = "stone";
      if ((x === 3 && y === 4) || (x === 8 && y === 7)) t = "wood";
      if ((x === 3 && y === 3) || (x === 8 && y === 6)) t = "leaf";
      row.push(t);
    }
    w.push(row);
  }
  return w;
}

const PALETTE: BlockType[] = ["grass", "dirt", "stone", "wood", "leaf", "water", "empty"];

export default function Minecraft() {
  const [world, setWorld] = useState<BlockType[][]>(() => seedWorld());
  const [brush, setBrush] = useState<BlockType>("grass");
  const draggingRef = useRef(false);

  useEffect(() => {
    const up = () => (draggingRef.current = false);
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, []);

  const paint = (x: number, y: number) => {
    setWorld((prev) => {
      if (prev[y][x] === brush) return prev;
      const next = prev.map((row) => row.slice());
      next[y][x] = brush;
      return next;
    });
  };

  const tile = 28; // px

  const grid = useMemo(() => {
    const cells: { x: number; y: number; t: BlockType }[] = [];
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) cells.push({ x, y, t: world[y][x] });
    }
    return cells;
  }, [world]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-3 py-2">
        <h2 className="font-mono text-[12px] uppercase tracking-widest text-white/70">
          voxel.exe
        </h2>
        <div className="ml-auto flex items-center gap-1">
          <span className="mr-1 font-mono text-[11px] text-white/60">brush</span>
          {PALETTE.map((b) => (
            <button
              key={b}
              onClick={() => setBrush(b)}
              aria-pressed={brush === b}
              title={b}
              className={
                "h-5 w-5 rounded border " +
                (brush === b ? "border-white/80" : "border-white/20")
              }
              style={{ background: b === "empty" ? "transparent" : COLORS[b] }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-auto p-4">
        <div
          className="relative"
          style={{
            width: SIZE * tile,
            height: SIZE * tile,
            // isometric-ish tilt without canvas
            transform: "rotateX(50deg) rotateZ(-45deg)",
            transformStyle: "preserve-3d",
            boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
          }}
        >
          {grid.map(({ x, y, t }) => (
            <div
              key={`${x}-${y}`}
              className="absolute"
              style={{
                left: x * tile,
                top: y * tile,
                width: tile,
                height: tile,
                background: COLORS[t],
                outline: "1px solid rgba(0,0,0,0.25)",
                cursor: "crosshair",
              }}
              onPointerDown={(e) => {
                draggingRef.current = true;
                (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
                paint(x, y);
              }}
              onPointerEnter={() => {
                if (draggingRef.current) paint(x, y);
              }}
            />
          ))}
        </div>
      </div>

      <p className="border-t border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/60">
        Click to place blocks. No game loop, no canvas — pure DOM.
      </p>
    </div>
  );
}
