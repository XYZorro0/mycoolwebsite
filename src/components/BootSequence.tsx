"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useDesktop } from "@/lib/store";
import { sfx } from "@/lib/sound";
import { PROFILE } from "@/lib/profile";

type Line = { t: number; text: string; tone?: "ok" | "warn" | "muted" };

const buildLines = (): Line[] => [
  { t: 0, text: "AwardBIOS v6.00PG · Phoenix Tech, Inc." },
  { t: 80, text: "Copyright (C) 1984-2007, retro-os contributors", tone: "muted" },
  { t: 280, text: "Main Processor : Apple M-Series @ 3.2 GHz" },
  { t: 380, text: "Memory Testing : 16384M OK" },
  { t: 520, text: "Detecting IDE drives ......... [ OK ]", tone: "ok" },
  { t: 660, text: "Detecting USB devices ........ [ OK ]", tone: "ok" },
  { t: 780, text: "Initializing PnP devices ..... [ OK ]", tone: "ok" },
  { t: 900, text: "Loading kernel modules:" },
  { t: 970, text: "  · vfs       loaded" },
  { t: 1040, text: "  · net       loaded" },
  { t: 1110, text: "  · gfx       loaded" },
  { t: 1180, text: "  · audio     loaded" },
  { t: 1320, text: "Bringing up loopback ......... [ OK ]", tone: "ok" },
  { t: 1440, text: "Bringing up eth0 (DHCP) ...... [ OK ]", tone: "ok" },
  { t: 1540, text: `Resolving ${PROFILE.hostname} .... 10.0.0.42` },
  { t: 1660, text: "Mounting /home/user .......... [ OK ]", tone: "ok" },
  { t: 1820, text: "Starting Window Manager ...... [ OK ]", tone: "ok" },
  { t: 1980, text: "" },
  { t: 2040, text: "$ whoami" },
  { t: 2200, text: `  ${PROFILE.name} — ${PROFILE.role}` },
  { t: 2360, text: "$ uptime" },
  { t: 2520, text: "  ready in 0.04s — welcome." },
  { t: 2700, text: "" },
  { t: 2760, text: "Launching desktop environment…", tone: "ok" },
];

const TOTAL_MS = 4900;
const VISTA_FLASH_MS = 700;

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const reducedMotion = useDesktop((s) => s.reducedMotion);
  const audioEnabled = useDesktop((s) => s.audioEnabled);

  const lines = useMemo(() => buildLines(), []);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<"terminal" | "vista" | "done">("terminal");

  const audioRef = useRef(audioEnabled);
  audioRef.current = audioEnabled;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Skip on any keypress / pointer
  useEffect(() => {
    const skip = () => onDoneRef.current();
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setShown(lines.length);
      const id = window.setTimeout(() => onDoneRef.current(), 400);
      return () => window.clearTimeout(id);
    }
    const ts: number[] = [];
    lines.forEach((line, i) => {
      ts.push(window.setTimeout(() => setShown(i + 1), line.t));
    });
    ts.push(
      window.setTimeout(() => {
        setPhase("vista");
        if (audioRef.current) sfx.startup();
      }, TOTAL_MS - VISTA_FLASH_MS)
    );
    ts.push(
      window.setTimeout(() => {
        setPhase("done");
        onDoneRef.current();
      }, TOTAL_MS)
    );
    return () => ts.forEach((t) => window.clearTimeout(t));
  }, [reducedMotion]);

  if (phase === "done") return null;

  if (phase === "vista") {
    return (
      <div
        className="vista-wallpaper relative h-full w-full"
        aria-label="Loading Windows"
      >
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-3 vista-fade-in">
            <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
              <defs>
                <radialGradient id="orb-flash" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="55%" stopColor="#7fd3ff" />
                  <stop offset="100%" stopColor="#0a3a78" />
                </radialGradient>
              </defs>
              <circle cx="42" cy="42" r="38" fill="url(#orb-flash)" />
              <g transform="translate(20,22)">
                <path d="M0 0 q14 -6 22 0 v18 q-14 -6 -22 0 z" fill="#fff" opacity="0.95" />
                <path d="M22 0 q14 -6 22 0 v18 q-14 -6 -22 0 z" fill="#fff" opacity="0.95" />
                <path d="M0 22 q14 -6 22 0 v12 q-14 -6 -22 0 z" fill="#fff" opacity="0.95" />
                <path d="M22 22 q14 -6 22 0 v12 q-14 -6 -22 0 z" fill="#fff" opacity="0.95" />
              </g>
            </svg>
            <div
              className="text-sm tracking-widest text-white/90"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.75)", letterSpacing: "0.3em" }}
            >
              WELCOME
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crt relative h-full w-full bg-[#05070a] text-[#a8e7ff]">
      <pre
        className="m-0 max-h-full overflow-hidden p-6 font-mono text-[13px] leading-[1.45] tracking-tight md:p-10 md:text-sm"
        aria-live="polite"
      >
        {lines.slice(0, shown).map((l, i) => (
          <div
            key={i}
            className={
              l.tone === "ok"
                ? "text-[#7be57b]"
                : l.tone === "warn"
                  ? "text-[#ffd75a]"
                  : l.tone === "muted"
                    ? "text-[#a8e7ff]/55"
                    : "text-[#cdeeff]"
            }
          >
            {l.text || " "}
          </div>
        ))}
        <div className="mt-1 flex items-center">
          <span className="text-[#7be57b]">$</span>
          <span className="caret-blink ml-2 inline-block h-[1em] w-[0.55em] bg-[#cdeeff]">
            &nbsp;
          </span>
        </div>
      </pre>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center px-6 text-[11px] text-[#7fd3ff]/70">
        <span className="font-mono">press any key to skip</span>
      </div>
    </div>
  );
}
