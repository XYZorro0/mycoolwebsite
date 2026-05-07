"use client";

import { useState, lazy, Suspense } from "react";
import { APPS, APP_LIST } from "@/lib/apps";
import type { AppId } from "@/lib/store";

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
          fallback={
            <div className="p-6 text-center text-sm text-white/60">loading…</div>
          }
        >
          <div className="px-3 py-4">
            <App />
          </div>
        </Suspense>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b1830] via-[#06101e] to-[#03070f] text-[#dcefff]">
      <header className="px-5 pb-4 pt-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-[#7fd3ff]/80">
          retro-os · mobile
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Portfolio</h1>
        <p className="mt-2 text-sm text-white/70">
          The full desktop experience is reserved for larger screens. Tap below to browse.
        </p>
      </header>
      <ul className="grid grid-cols-2 gap-3 p-4">
        {APP_LIST.map((app) => (
          <li key={app.id}>
            <button
              onClick={() => setActive(app.id)}
              className="flex h-24 w-full flex-col items-start justify-end rounded-lg border border-white/15 bg-white/5 p-3 text-left transition hover:bg-white/10"
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#7fd3ff]/80">
                {app.id}
              </span>
              <span className="text-base font-medium">{app.iconLabel}</span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
