"use client";

import { useState } from "react";

// We don't bundle a Doom port — the iframe is only mounted when the user
// explicitly launches it, so no assets load until then. Configure DOOM_URL
// to a self-hosted dosbox/js-dos build for full offline operation.
const DOOM_URL =
  process.env.NEXT_PUBLIC_DOOM_URL ||
  "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos";

export default function Doom() {
  const [launched, setLaunched] = useState(false);

  if (!launched) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <pre className="font-mono text-[11px] leading-tight text-[#ff7777]">
{`  ____   ___   ___  __  __
 |  _ \\ / _ \\ / _ \\|  \\/  |
 | | | | | | | | | | |\\/| |
 | |_| | |_| | |_| | |  | |
 |____/ \\___/ \\___/|_|  |_|`}
        </pre>
        <p className="max-w-sm text-sm text-white/80">
          Click below to load the embedded shareware build. No assets are
          downloaded until you do.
        </p>
        <button
          onClick={() => setLaunched(true)}
          className="rounded border border-[#ff5050]/60 bg-[#ff3030]/15 px-4 py-1.5 text-sm font-semibold text-[#ffb0b0] hover:bg-[#ff3030]/25"
        >
          ▶ LOAD DOOM
        </button>
        <p className="text-[11px] text-white/50">
          Tip: configure <code>NEXT_PUBLIC_DOOM_URL</code> to a self-hosted
          js-dos bundle.
        </p>
      </div>
    );
  }

  return (
    <iframe
      title="DOOM"
      src={DOOM_URL}
      className="h-full w-full border-0 bg-black"
      // Sandbox keeps the embed isolated; allow scripts/audio for the game.
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}
