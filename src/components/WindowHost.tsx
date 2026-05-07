"use client";

import { useDesktop } from "@/lib/store";
import { APPS } from "@/lib/apps";
import { Suspense, lazy, useMemo } from "react";
import Window from "./Window";

// Build a map of lazy components on first render. The actual JS chunk
// is only fetched when the window mounts, not before.
function useAppLoaders() {
  return useMemo(() => {
    const map: Partial<Record<keyof typeof APPS, ReturnType<typeof lazy>>> = {};
    (Object.keys(APPS) as (keyof typeof APPS)[]).forEach((k) => {
      map[k] = lazy(APPS[k].load);
    });
    return map;
  }, []);
}

export default function WindowHost() {
  const order = useDesktop((s) => s.order);
  const windows = useDesktop((s) => s.windows);
  const loaders = useAppLoaders();

  return (
    <>
      {order.map((id) => {
        const w = windows[id];
        if (!w) return null;
        const App = loaders[w.appId];
        return (
          <Window key={id} id={id}>
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center text-sm text-white/60">
                  loading…
                </div>
              }
            >
              {App ? <App /> : null}
            </Suspense>
          </Window>
        );
      })}
    </>
  );
}
