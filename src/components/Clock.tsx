"use client";

import { useEffect, useState } from "react";

// Updates only every ~30s and pauses on hidden tabs to keep idle CPU near zero.
function format(d: Date) {
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = d.toLocaleDateString([], { month: "short", day: "numeric" });
  return { time, date };
}

export default function Clock() {
  const [now, setNow] = useState<{ time: string; date: string }>(() => format(new Date()));

  useEffect(() => {
    let id: number | null = null;
    const tick = () => setNow(format(new Date()));

    const start = () => {
      tick();
      // align to the next 30-second boundary, then tick every 30s
      const ms = 30000 - (Date.now() % 30000);
      id = window.setTimeout(function loop() {
        tick();
        id = window.setTimeout(loop, 30000);
      }, ms);
    };
    const stop = () => {
      if (id !== null) {
        window.clearTimeout(id);
        id = null;
      }
    };
    const onVis = () => (document.visibilityState === "visible" ? start() : stop());

    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      className="pointer-events-none flex select-none flex-col items-end px-3 font-mono text-[12px] leading-tight text-white/90"
      aria-live="off"
    >
      <span>{now.time}</span>
      <span className="text-white/60">{now.date}</span>
    </div>
  );
}
