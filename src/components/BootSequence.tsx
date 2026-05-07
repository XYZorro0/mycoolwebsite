"use client";

import { useEffect, useRef, useState } from "react";
import { useDesktop } from "@/lib/store";
import { sfx } from "@/lib/sound";

const LINES = [
  { t: 0, text: "BIOS v4.20.06 — POST OK" },
  { t: 280, text: "CPU: Apple M-Series @ 3.2GHz · 8 cores" },
  { t: 520, text: "MEM: 16384 MB · ECC ok" },
  { t: 760, text: "Detecting devices........ [ OK ]" },
  { t: 1060, text: "Mounting /dev/portfolio ... [ OK ]" },
  { t: 1340, text: "Loading kernel modules:" },
  { t: 1480, text: "  · vfs       loaded" },
  { t: 1620, text: "  · net       loaded" },
  { t: 1760, text: "  · gfx       loaded" },
  { t: 1900, text: "  · sfx       loaded" },
  { t: 2120, text: "Starting RetroOS userland..." },
  { t: 2520, text: "$ whoami" },
  { t: 2860, text: "  developer · designer · tinkerer" },
  { t: 3260, text: "$ uptime" },
  { t: 3580, text: "  ready in 0.04s — welcome." },
];

const TOTAL_MS = 4500; // total duration before transition (keeps under 5–7s)

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const reducedMotion = useDesktop((s) => s.reducedMotion);
  const audioEnabled = useDesktop((s) => s.audioEnabled);
  const setAudio = useDesktop((s) => s.setAudioEnabled);

  const [shown, setShown] = useState<number>(0);

  // Hold latest audioEnabled in a ref so toggling mid-boot doesn't restart timers.
  const audioRef = useRef(audioEnabled);
  audioRef.current = audioEnabled;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Skip with any key/click
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
      setShown(LINES.length);
      const id = window.setTimeout(() => onDoneRef.current(), 600);
      return () => window.clearTimeout(id);
    }

    const timeouts: number[] = [];
    LINES.forEach((line, i) => {
      timeouts.push(
        window.setTimeout(() => {
          setShown(i + 1);
        }, line.t)
      );
    });
    timeouts.push(
      window.setTimeout(() => {
        if (audioRef.current) sfx.startup();
        onDoneRef.current();
      }, TOTAL_MS)
    );
    return () => timeouts.forEach((t) => window.clearTimeout(t));
  }, [reducedMotion]);

  return (
    <div className="crt relative h-full w-full bg-[#05070a] text-[#a8e7ff]">
      <pre
        className="m-0 max-h-full overflow-hidden p-6 font-mono text-[13px] leading-[1.45] tracking-tight md:p-10 md:text-sm"
        aria-live="polite"
      >
        {LINES.slice(0, shown).map((l, i) => (
          <div key={i} className="opacity-90">
            {l.text}
          </div>
        ))}
        <div className="mt-2">
          <span className="text-crt-glow">$</span>{" "}
          <span className="inline-block w-2 animate-caret-blink bg-crt-ink align-baseline">
            &nbsp;
          </span>
        </div>
      </pre>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-between px-6 text-[11px] text-[#7fd3ff]/70">
        <span className="font-mono">RetroOS · press any key to skip</span>
        <button
          className="pointer-events-auto rounded border border-[#7fd3ff]/40 px-2 py-0.5 font-mono hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            setAudio(!audioEnabled);
          }}
          aria-pressed={audioEnabled}
        >
          sound: {audioEnabled ? "on" : "off"}
        </button>
      </div>
    </div>
  );
}
