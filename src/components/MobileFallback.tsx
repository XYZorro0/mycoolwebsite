"use client";

import { useState, lazy, Suspense } from "react";
import { APPS, START_MENU } from "@/lib/apps";
import type { AppId } from "@/lib/store";
import { PROFILE } from "@/lib/profile";

const lazyApps = Object.fromEntries(
  (Object.keys(APPS) as AppId[]).map((id) => [id, lazy(APPS[id].load)])
) as Record<AppId, ReturnType<typeof lazy>>;

export default function MobileFallback() {
  const [active, setActive] = useState<AppId | null>(null);

  if (active) {
    const App = lazyApps[active];
    return (
      <main className="min-h-screen bg-[#06101e] text-[#dcefff]">
        <header className="sticky top-0 z-10 flex h-12 items-center gap-3 border-b border-white/10 bg-[#0a172c]/95 px-3 backdrop-blur">
          <button
            onClick={() => setActive(null)}
            className="rounded border border-white/15 px-2 py-1 text-sm hover:bg-white/10"
            aria-label="Back to home"
          >
            ← Back
          </button>
          <h1 className="font-mono text-sm">{APPS[active].title}</h1>
        </header>
        <Suspense
          fallback={<div className="p-6 text-center text-sm text-white/60">loading…</div>}
        >
          <div className="bg-white text-[#0a1f3a]">
            <App />
          </div>
        </Suspense>
      </main>
    );
  }

  return (
    <main className="vista-wallpaper min-h-screen text-[#dcefff]">
      <header className="px-5 pb-4 pt-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-[#7fd3ff]/90">
          retro-os · mobile
        </p>
        <h1
          className="mt-1 text-2xl font-semibold"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
        >
          {PROFILE.name}
        </h1>
        <p
          className="mt-1 text-sm text-white/85"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.55)" }}
        >
          {PROFILE.role}
        </p>
        <p
          className="mt-3 text-sm text-white/75"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.55)" }}
        >
          The full desktop experience is reserved for larger screens. Tap below to browse.
        </p>
      </header>
      <ul className="grid grid-cols-2 gap-3 p-4">
        {START_MENU.filter((id) => id !== "doom" && id !== "minecraft").map((id) => (
          <li key={id}>
            <button
              onClick={() => setActive(id)}
              className="flex h-24 w-full flex-col items-start justify-end rounded-lg border border-white/30 bg-white/10 p-3 text-left backdrop-blur transition hover:bg-white/20"
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#7fd3ff]/95">
                {id}
              </span>
              <span
                className="text-base font-medium text-white"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
              >
                {APPS[id].iconLabel}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="px-5 pb-6 pt-2 text-[11px] text-white/60" style={{ textShadow: "0 1px 1px rgba(0,0,0,0.5)" }}>
        DOOM & Voxelcraft are desktop-only.
      </p>
    </main>
  );
}
