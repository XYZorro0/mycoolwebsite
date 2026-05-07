"use client";

import { useState } from "react";
import { useDesktop } from "@/lib/store";
import { APPS, APP_LIST } from "@/lib/apps";
import { sfx } from "@/lib/sound";
import Clock from "./Clock";

export default function Taskbar() {
  const order = useDesktop((s) => s.order);
  const windows = useDesktop((s) => s.windows);
  const focusId = useDesktop((s) => s.focusId);
  const focus = useDesktop((s) => s.focus);
  const minimize = useDesktop((s) => s.minimize);
  const open = useDesktop((s) => s.open);
  const audioEnabled = useDesktop((s) => s.audioEnabled);
  const setAudio = useDesktop((s) => s.setAudioEnabled);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <footer className="taskbar absolute bottom-0 left-0 right-0 z-[10000] flex h-12 items-center gap-1 px-2">
      {/* Start orb */}
      <div className="relative">
        <button
          className="btn-orb h-9 w-9 rounded-full ring-1 ring-white/30 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fd3ff]"
          onClick={() => {
            if (audioEnabled) sfx.click();
            setMenuOpen((v) => !v);
          }}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Start menu"
        />
        {menuOpen && (
          <div
            role="menu"
            className="glass absolute bottom-12 left-0 w-56 rounded-md p-2 shadow-window"
            onMouseLeave={() => setMenuOpen(false)}
          >
            <div className="px-2 pb-2 pt-1 font-mono text-[11px] uppercase tracking-widest text-white/60">
              Programs
            </div>
            <ul className="flex flex-col">
              {APP_LIST.map((app) => (
                <li key={app.id}>
                  <button
                    role="menuitem"
                    className="w-full rounded px-2 py-1.5 text-left text-sm text-white/90 hover:bg-white/10"
                    onClick={() => {
                      if (audioEnabled) sfx.open();
                      setMenuOpen(false);
                      open(app);
                    }}
                  >
                    {app.iconLabel}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-[12px]">
              <span className="px-2 text-white/70">Sound</span>
              <button
                className="rounded border border-white/20 px-2 py-0.5 text-white/90 hover:bg-white/10"
                onClick={() => setAudio(!audioEnabled)}
                aria-pressed={audioEnabled}
              >
                {audioEnabled ? "on" : "off"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mx-2 h-7 w-px bg-white/15" />

      <ul className="flex flex-1 items-center gap-1 overflow-x-auto" aria-label="Open windows">
        {order.map((id) => {
          const w = windows[id];
          if (!w) return null;
          const active = focusId === id && !w.minimized;
          return (
            <li key={id}>
              <button
                className={
                  "rounded border px-2 py-1 text-[12px] font-medium text-white/90 backdrop-blur-sm transition " +
                  (active
                    ? "border-white/40 bg-white/15"
                    : "border-white/10 bg-white/5 hover:bg-white/10")
                }
                onClick={() => {
                  if (active) minimize(id);
                  else focus(id);
                }}
                title={APPS[w.appId].title}
              >
                {w.title}
              </button>
            </li>
          );
        })}
      </ul>

      <Clock />
    </footer>
  );
}
