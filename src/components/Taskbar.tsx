"use client";

import { useEffect, useRef, useState } from "react";
import { useDesktop } from "@/lib/store";
import { APPS, START_MENU } from "@/lib/apps";
import { sfx } from "@/lib/sound";
import Clock from "./Clock";
import {
  AboutIcon,
  ComputerIcon,
  ContactIcon,
  DoomIcon,
  GamesIcon,
  MinecraftIcon,
  ProjectsIcon,
  RecycleBinIcon,
  ResumeIcon,
  TerminalIcon,
} from "./icons/VistaIcons";
import type { AppId } from "@/lib/store";

const ICONS: Record<AppId, React.ComponentType<{ size?: number }>> = {
  computer: ComputerIcon,
  resume: ResumeIcon,
  projects: ProjectsIcon,
  about: AboutIcon,
  games: GamesIcon,
  contact: ContactIcon,
  terminal: TerminalIcon,
  recyclebin: RecycleBinIcon,
  doom: DoomIcon,
  minecraft: MinecraftIcon,
};

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
  const menuRef = useRef<HTMLDivElement>(null);

  // Close start menu on outside click / escape
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <footer className="vista-taskbar absolute bottom-0 left-0 right-0 z-[10000] flex h-12 items-center gap-1 px-1.5">
      {/* Start orb */}
      <div className="relative" ref={menuRef}>
        <button
          className="vista-orb relative grid h-9 w-9 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fd3ff]"
          onClick={() => {
            if (audioEnabled) sfx.click();
            setMenuOpen((v) => !v);
          }}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Start menu"
        >
          {/* Vista flag glyph (4-pane) */}
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M2 4 q4 -2 8 0 v6 q-4 -2 -8 0 z" fill="#fff" opacity="0.95" />
            <path d="M10 4 q4 -2 6 0 v6 q-2 -2 -6 0 z" fill="#fff" opacity="0.95" />
            <path d="M2 11 q4 -2 8 0 v3 q-4 -2 -8 0 z" fill="#fff" opacity="0.95" />
            <path d="M10 11 q4 -2 6 0 v3 q-2 -2 -6 0 z" fill="#fff" opacity="0.95" />
          </svg>
        </button>

        {menuOpen && <StartMenu open={open} setMenuOpen={setMenuOpen} audio={audioEnabled} setAudio={setAudio} />}
      </div>

      <div className="mx-1 h-7 w-px bg-white/20" />

      {/* Open windows */}
      <ul className="flex flex-1 items-center gap-1 overflow-x-auto" aria-label="Open windows">
        {order.map((id) => {
          const w = windows[id];
          if (!w) return null;
          const active = focusId === id && !w.minimized;
          const Glyph = ICONS[w.appId];
          return (
            <li key={id}>
              <button
                onClick={() => {
                  if (active) minimize(id);
                  else focus(id);
                }}
                title={w.title}
                className={
                  "flex max-w-[180px] items-center gap-1.5 rounded-[3px] border px-2 py-1 text-[12px] font-medium text-white transition " +
                  (active
                    ? "border-white/45 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
                    : "border-white/15 bg-white/5 hover:bg-white/10")
                }
              >
                <Glyph size={16} />
                <span className="truncate">{w.title}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <Clock />
    </footer>
  );
}

function StartMenu({
  open,
  setMenuOpen,
  audio,
  setAudio,
}: {
  open: ReturnType<typeof useDesktop.getState>["open"];
  setMenuOpen: (v: boolean) => void;
  audio: boolean;
  setAudio: (v: boolean) => void;
}) {
  return (
    <div
      role="menu"
      className="vista-glass absolute bottom-12 left-0 z-[10001] flex w-[320px] flex-col rounded-md p-0 vista-fade-in"
    >
      <div
        className="flex items-center gap-3 rounded-t-md px-3 py-2"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(180,220,255,0.25))",
          borderBottom: "1px solid rgba(255,255,255,0.55)",
        }}
      >
        <div className="vista-orb h-9 w-9 rounded-full" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#0a1f3a]">User</span>
          <span className="text-[11px] text-[#3a4d6c]">Welcome</span>
        </div>
      </div>

      <ul className="flex flex-col py-1">
        {START_MENU.map((id) => {
          const Glyph = ICONS[id];
          return (
            <li key={id}>
              <button
                role="menuitem"
                className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left text-sm text-[#0a1f3a] hover:bg-white/40"
                onClick={() => {
                  setMenuOpen(false);
                  open(APPS[id]);
                }}
              >
                <Glyph size={20} />
                <span>{APPS[id].iconLabel}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between border-t border-white/40 bg-white/30 px-3 py-2">
        <span className="text-[11px] text-[#0a1f3a]">Sound</span>
        <button
          className="rounded border border-white/55 bg-white/60 px-2 py-0.5 text-[11px] text-[#0a1f3a] hover:bg-white/80"
          onClick={() => setAudio(!audio)}
          aria-pressed={audio}
        >
          {audio ? "On" : "Off"}
        </button>
      </div>
    </div>
  );
}
