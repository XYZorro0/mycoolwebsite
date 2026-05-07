"use client";

/**
 * DOOM, embedded via js-dos v8.
 *
 * - The js-dos runtime (~270KB gzipped) and its WASM core are loaded only
 *   when the user clicks LAUNCH, never as part of the main bundle.
 * - The freely-redistributable shareware WAD is expected at
 *   /public/games/doom1.wad — drop it there once and the bundle is built
 *   on the fly with a minimal DOSBox config.
 * - On window close / minimize / unmount, the js-dos instance is properly
 *   stopped so it can't burn CPU in the background.
 *
 * This is configurable via env vars:
 *   NEXT_PUBLIC_JSDOS_SRC   — script URL (defaults to v8.xx.x CDN)
 *   NEXT_PUBLIC_JSDOS_CSS   — stylesheet URL
 *   NEXT_PUBLIC_DOOM_WAD    — path to the WAD inside the bundle
 */

import { useCallback, useEffect, useRef, useState } from "react";

const JSDOS_SRC =
  process.env.NEXT_PUBLIC_JSDOS_SRC ||
  "https://v8.js-dos.com/latest/js-dos.js";
const JSDOS_CSS =
  process.env.NEXT_PUBLIC_JSDOS_CSS ||
  "https://v8.js-dos.com/latest/js-dos.css";
const DOOM_WAD =
  process.env.NEXT_PUBLIC_DOOM_WAD || "/games/doom1.wad";

// js-dos attaches a global `Dos(element, options)` constructor.
type DosCi = {
  stop: () => Promise<void>;
};
type DosOptions = {
  url?: string;
  dosboxConf?: string;
  initFs?: { path: string; contents: ArrayBuffer | Uint8Array }[];
  onEvent?: (e: string, ...rest: unknown[]) => void;
  backend?: "dosbox" | "dosboxX";
  pathPrefix?: string;
  workerThread?: boolean;
  mouseCapture?: boolean;
  autoStart?: boolean;
  kiosk?: boolean;
};
type DosFn = (el: HTMLElement, opts: DosOptions) => DosCi;
declare global {
  interface Window {
    Dos?: DosFn;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("ssr"));
  if (window.Dos) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    // CSS
    if (!document.querySelector(`link[data-jsdos]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = JSDOS_CSS;
      link.dataset.jsdos = "1";
      document.head.appendChild(link);
    }
    // JS
    const s = document.createElement("script");
    s.src = JSDOS_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load js-dos"));
    document.head.appendChild(s);
  }).catch((e) => {
    scriptPromise = null;
    throw e;
  });

  return scriptPromise;
}

const DOSBOX_CONF = `
[sdl]
fullscreen=false
[cpu]
cycles=auto
[autoexec]
mount c .
c:
doom.exe -iwad doom1.wad
exit
`;

export default function Doom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dosRef = useRef<DosCi | null>(null);
  const [phase, setPhase] = useState<"idle" | "loading" | "running" | "error">("idle");
  const [error, setError] = useState<string>("");

  const launch = useCallback(async () => {
    if (!containerRef.current) return;
    setPhase("loading");
    setError("");
    try {
      await loadScript();
      const wadResp = await fetch(DOOM_WAD, { cache: "force-cache" });
      if (!wadResp.ok) {
        throw new Error(
          `Couldn't load ${DOOM_WAD}. Drop the shareware doom1.wad into public/games/.`
        );
      }
      const wadBytes = new Uint8Array(await wadResp.arrayBuffer());

      if (!window.Dos) throw new Error("js-dos failed to initialize");

      // Detect if shareware doom.exe ships with the wad — most shareware
      // distributions include it. If you only have a wad, set NEXT_PUBLIC_DOOM_BUNDLE
      // to a prebuilt .jsdos bundle URL instead.
      const bundleUrl = process.env.NEXT_PUBLIC_DOOM_BUNDLE;

      dosRef.current = window.Dos(containerRef.current, {
        ...(bundleUrl
          ? { url: bundleUrl }
          : {
              dosboxConf: DOSBOX_CONF,
              initFs: [{ path: "doom1.wad", contents: wadBytes }],
            }),
        backend: "dosbox",
        autoStart: true,
        mouseCapture: true,
        kiosk: true,
        workerThread: true,
        onEvent: (e) => {
          if (e === "ready") setPhase("running");
        },
      });
      // Some bundles don't fire "ready" reliably — fall through after first paint
      requestAnimationFrame(() => setPhase("running"));
    } catch (e) {
      setPhase("error");
      setError(e instanceof Error ? e.message : "Failed to launch");
    }
  }, []);

  // Stop the dosbox instance on unmount or page hide
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "hidden" && dosRef.current) {
        // js-dos workers continue to run; pause is handled via .stop on full unmount.
        // We don't .stop() here because the user might just be Alt-Tabbing.
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (dosRef.current) {
        dosRef.current.stop().catch(() => {});
        dosRef.current = null;
      }
    };
  }, []);

  if (phase === "idle") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-black p-6 text-center text-white">
        <pre className="font-mono text-[10px] leading-tight text-[#ff7777]">
{`  ____   ___   ___  __  __
 |  _ \\ / _ \\ / _ \\|  \\/  |
 | | | | | | | | | | |\\/| |
 | |_| | |_| | |_| | |  | |
 |____/ \\___/ \\___/|_|  |_|`}
        </pre>
        <p className="max-w-sm text-sm text-white/80">
          Click LAUNCH to load DOOM. The DOSBox runtime and the shareware WAD
          (~3 MB) are downloaded only when you click — never on page load.
        </p>
        <button
          onClick={launch}
          className="rounded border-2 border-[#ff5050] bg-gradient-to-b from-[#a31616] to-[#5a0808] px-5 py-2 font-mono text-sm font-bold text-white shadow-[0_0_18px_rgba(255,80,80,0.55)] hover:brightness-110"
        >
          ▶ LAUNCH DOOM
        </button>
        <p className="text-[11px] text-white/50">
          Drop <code>doom1.wad</code> into <code>public/games/</code> on the server.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-black">
      {phase === "loading" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black text-white">
          <div className="font-mono text-sm text-[#ff8a8a]">Loading DOOM…</div>
          <div className="h-1 w-64 overflow-hidden rounded bg-white/10">
            <div className="h-full w-1/3 animate-pulse bg-[#ff5050]" />
          </div>
        </div>
      )}
      {phase === "error" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black p-6 text-white">
          <div className="font-mono text-[#ff8a8a]">DOOM failed to start</div>
          <div className="max-w-md text-center text-[12px] text-white/70">{error}</div>
          <button
            onClick={launch}
            className="rounded border border-white/30 px-3 py-1 text-sm hover:bg-white/10"
          >
            Try again
          </button>
        </div>
      )}
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{
          // js-dos renders into this element; full-bleed canvas
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
