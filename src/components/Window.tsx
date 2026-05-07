"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useDesktop } from "@/lib/store";
import { sfx } from "@/lib/sound";

type Props = {
  id: string;
  children: React.ReactNode;
};

const MIN_W = 360;
const MIN_H = 240;

type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

type DragState = {
  mode: "move" | ResizeEdge;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
  startPosX: number;
  startPosY: number;
  raf: number | null;
  nextX: number;
  nextY: number;
  nextW: number;
  nextH: number;
  pointerId: number;
};

function WindowInner({ id, children }: Props) {
  const win = useDesktop((s) => s.windows[id]);
  const focusId = useDesktop((s) => s.focusId);
  const focus = useDesktop((s) => s.focus);
  const close = useDesktop((s) => s.close);
  const minimize = useDesktop((s) => s.minimize);
  const toggleMaximize = useDesktop((s) => s.toggleMaximize);
  const move = useDesktop((s) => s.move);
  const resize = useDesktop((s) => s.resize);
  const audioEnabled = useDesktop((s) => s.audioEnabled);
  const reducedMotion = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const startDrag = useCallback(
    (e: React.PointerEvent, mode: DragState["mode"]) => {
      if (!win || (mode === "move" && win.maximized)) return;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      focus(id);
      dragRef.current = {
        mode,
        startX: e.clientX,
        startY: e.clientY,
        startW: win.w,
        startH: win.h,
        startPosX: win.x,
        startPosY: win.y,
        raf: null,
        nextX: win.x,
        nextY: win.y,
        nextW: win.w,
        nextH: win.h,
        pointerId: e.pointerId,
      };
    },
    [win, id, focus]
  );

  const commit = useCallback(() => {
    const d = dragRef.current;
    if (!d) return;
    d.raf = null;
    if (d.mode === "move") {
      move(id, d.nextX, d.nextY);
    } else {
      resize(id, d.nextW, d.nextH, d.nextX, d.nextY);
    }
  }, [id, move, resize]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      const vw = window.innerWidth;
      const vh = window.innerHeight - 48;

      if (d.mode === "move") {
        d.nextX = Math.max(-40, Math.min(vw - 80, d.startPosX + dx));
        d.nextY = Math.max(0, Math.min(vh - 30, d.startPosY + dy));
      } else {
        let nx = d.startPosX;
        let ny = d.startPosY;
        let nw = d.startW;
        let nh = d.startH;
        if (d.mode.includes("e")) nw = Math.max(MIN_W, d.startW + dx);
        if (d.mode.includes("s")) nh = Math.max(MIN_H, d.startH + dy);
        if (d.mode.includes("w")) {
          const proposedW = Math.max(MIN_W, d.startW - dx);
          nx = d.startPosX + (d.startW - proposedW);
          nw = proposedW;
        }
        if (d.mode.includes("n")) {
          const proposedH = Math.max(MIN_H, d.startH - dy);
          ny = d.startPosY + (d.startH - proposedH);
          nh = proposedH;
        }
        // clamp to viewport
        nw = Math.min(nw, vw - nx);
        nh = Math.min(nh, vh - ny);
        d.nextX = nx;
        d.nextY = ny;
        d.nextW = nw;
        d.nextH = nh;
      }
      if (d.raf == null) d.raf = requestAnimationFrame(commit);
    },
    [commit]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    if (d.raf != null) {
      cancelAnimationFrame(d.raf);
      d.raf = null;
    }
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(d.pointerId);
    } catch {
      /* noop */
    }
    dragRef.current = null;
  }, []);

  // Focus the window root on focus change for keyboard nav
  useEffect(() => {
    if (focusId === id) {
      rootRef.current?.focus({ preventScroll: true });
    }
  }, [focusId, id]);

  // ESC closes the window when focused
  useEffect(() => {
    if (focusId !== id) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (e.target as HTMLElement)?.tagName !== "INPUT") {
        // don't trap textareas; only close when there's no editable focus
        const ae = document.activeElement as HTMLElement | null;
        if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable))
          return;
        close(id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusId, id, close]);

  if (!win || win.minimized) return null;

  const isFocused = focusId === id;
  const onClose = () => {
    if (audioEnabled) sfx.close();
    close(id);
  };
  const onMin = () => {
    if (audioEnabled) sfx.click();
    minimize(id);
  };
  const onMax = () => {
    if (audioEnabled) sfx.click();
    toggleMaximize(id, { w: window.innerWidth, h: window.innerHeight });
  };

  return (
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-label={win.title}
      tabIndex={-1}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 6 }}
      transition={{ duration: reducedMotion ? 0 : 0.16, ease: "easeOut" }}
      className={
        "vista-glass absolute flex flex-col overflow-hidden rounded-lg outline-none " +
        (isFocused ? "vista-window-focus" : "opacity-95")
      }
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
        willChange: "transform",
        contain: "layout paint",
      }}
      onPointerDown={() => focus(id)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Title bar */}
      <div
        className={
          "vista-titlebar flex h-10 shrink-0 cursor-grab select-none items-center gap-2 px-3 active:cursor-grabbing " +
          (isFocused ? "" : "inactive")
        }
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
          startDrag(e, "move");
        }}
        onDoubleClick={onMax}
      >
        <span
          className="truncate font-medium tracking-tight"
          style={{
            color: isFocused ? "#0a1f3a" : "#3a4d6c",
            textShadow: "0 1px 0 rgba(255,255,255,0.55)",
            fontSize: 13,
          }}
        >
          {win.title}
        </span>

        <div className="ml-auto flex items-center gap-1" data-no-drag>
          <TitleButton onClick={onMin} label="Minimize" tone="neutral">
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <rect x="1.5" y="7" width="7" height="1.5" fill="currentColor" />
            </svg>
          </TitleButton>
          <TitleButton onClick={onMax} label={win.maximized ? "Restore" : "Maximize"} tone="neutral">
            {win.maximized ? (
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <rect x="2" y="3.5" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <rect x="3.5" y="2" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            )}
          </TitleButton>
          <TitleButton onClick={onClose} label="Close" tone="danger">
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path
                d="M1.5 1.5 L8.5 8.5 M8.5 1.5 L1.5 8.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </TitleButton>
        </div>
      </div>

      {/* Content surface (white, like a real Vista window body) */}
      <div className="vista-content scrollbar-thin relative flex-1 overflow-auto">
        {children}
      </div>

      {/* Resize handles (8-way) */}
      {!win.maximized && (
        <>
          <ResizeHandle pos="n" startDrag={startDrag} />
          <ResizeHandle pos="s" startDrag={startDrag} />
          <ResizeHandle pos="e" startDrag={startDrag} />
          <ResizeHandle pos="w" startDrag={startDrag} />
          <ResizeHandle pos="ne" startDrag={startDrag} />
          <ResizeHandle pos="nw" startDrag={startDrag} />
          <ResizeHandle pos="se" startDrag={startDrag} />
          <ResizeHandle pos="sw" startDrag={startDrag} />
        </>
      )}
    </motion.div>
  );
}

function TitleButton({
  onClick,
  label,
  tone,
  children,
}: {
  onClick: () => void;
  label: string;
  tone: "neutral" | "danger";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={
        "grid h-6 w-7 place-items-center rounded-[3px] border border-white/40 transition " +
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] " +
        (tone === "danger"
          ? "bg-gradient-to-b from-[#fbb] to-[#d23] text-white hover:from-[#fcc] hover:to-[#e44]"
          : "bg-gradient-to-b from-white/85 to-[#bcd] text-[#0a1f3a] hover:from-white hover:to-[#cee]")
      }
      style={{ backdropFilter: "blur(2px)" }}
    >
      {children}
    </button>
  );
}

function ResizeHandle({
  pos,
  startDrag,
}: {
  pos: ResizeEdge;
  startDrag: (e: React.PointerEvent, mode: DragState["mode"]) => void;
}) {
  const cursor = {
    n: "ns-resize",
    s: "ns-resize",
    e: "ew-resize",
    w: "ew-resize",
    ne: "nesw-resize",
    sw: "nesw-resize",
    nw: "nwse-resize",
    se: "nwse-resize",
  }[pos];
  const styles: React.CSSProperties = (() => {
    const edge = 6;
    const corner = 12;
    const base: React.CSSProperties = { position: "absolute", cursor };
    switch (pos) {
      case "n":
        return { ...base, top: 0, left: corner, right: corner, height: edge };
      case "s":
        return { ...base, bottom: 0, left: corner, right: corner, height: edge };
      case "e":
        return { ...base, right: 0, top: corner, bottom: corner, width: edge };
      case "w":
        return { ...base, left: 0, top: corner, bottom: corner, width: edge };
      case "ne":
        return { ...base, top: 0, right: 0, width: corner, height: corner };
      case "nw":
        return { ...base, top: 0, left: 0, width: corner, height: corner };
      case "se":
        return { ...base, bottom: 0, right: 0, width: corner, height: corner };
      case "sw":
        return { ...base, bottom: 0, left: 0, width: corner, height: corner };
    }
  })();
  return (
    <div
      style={styles}
      onPointerDown={(e) => {
        e.stopPropagation();
        startDrag(e, pos);
      }}
      aria-hidden="true"
    />
  );
}

export default memo(WindowInner);
