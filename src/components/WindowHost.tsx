"use client";

import { useDesktop } from "@/lib/store";
import { APPS } from "@/lib/apps";
import { Suspense, lazy, useMemo } from "react";
import Window from "./Window";
import type { AppId } from "@/lib/store";

function useAppLoaders() {
  return useMemo(() => {
    const map: Partial<Record<AppId, ReturnType<typeof lazy>>> = {};
    (Object.keys(APPS) as AppId[]).forEach((k) => {
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
                <div className="flex h-full items-center justify-center text-sm text-[#3a4d6c]">
                  Loading…
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
