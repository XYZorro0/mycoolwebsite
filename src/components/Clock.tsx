"use client";

import { useEffect, useState } from "react";

function format(d: Date) {
  return {
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    date: d.toLocaleDateString([], { month: "short", day: "numeric" }),
  };
}

export default function Clock() {
  const [now, setNow] = useState(() => format(new Date()));

  useEffect(() => {
    let id: number | null = null;
    const tick = () => setNow(format(new Date()));
    const start = () => {
      tick();
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
      className="pointer-events-none flex select-none flex-col items-end px-3 leading-tight text-white/95"
      style={{ textShadow: "0 1px 1px rgba(0,0,0,0.55)", fontSize: 12 }}
      aria-live="off"
    >
      <span className="font-semibold">{now.time}</span>
      <span className="text-white/70">{now.date}</span>
    </div>
  );
}
