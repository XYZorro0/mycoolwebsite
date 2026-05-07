"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { useDesktop } from "@/lib/store";
import { sfx } from "@/lib/sound";

type Props = {
  id: string;
  children: React.ReactNode;
};

const MIN_W = 320;
const MIN_H = 220;

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

  const rootRef = useRef<HTMLElement>(null);

  // rAF-batched drag/resize: store latest pointer, commit once per frame
  const dragRef = useRef<{
    mode: "move" | "resize";
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
  } | null>(null);

  const onPointerDownTitle = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!win || win.maximized) return;
      if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      focus(id);
      dragRef.current = {
        mode: "move",
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

  const onPointerDownResize = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!win || win.maximized) return;
      e.stopPropagation();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      focus(id);
      dragRef.current = {
        mode: "resize",
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
    if (d.mode === "move") move(id, d.nextX, d.nextY);
    else resize(id, d.nextW, d.nextH);
  }, [id, move, resize]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
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
        d.nextW = Math.max(MIN_W, Math.min(vw - d.startPosX, d.startW + dx));
        d.nextH = Math.max(MIN_H, Math.min(vh - d.startPosY, d.startH + dy));
      }
      if (d.raf == null) d.raf = requestAnimationFrame(commit);
    },
    [commit]
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLElement>) => {
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

  // Focus newly opened window for keyboard users
  useEffect(() => {
    if (focusId === id) {
      rootRef.current?.focus({ preventScroll: true });
    }
  }, [focusId, id]);

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
    <section
      ref={rootRef}
      role="dialog"
      aria-label={win.title}
      aria-modal="false"
      tabIndex={-1}
      className={
        "glass absolute flex flex-col overflow-hidden rounded-lg shadow-window outline-none " +
        (isFocused ? "ring-1 ring-[#7fd3ff]/40" : "opacity-95")
      }
      style={{
        transform: `translate3d(${win.x}px, ${win.y}px, 0)`,
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
      <div
        className="titlebar flex h-9 shrink-0 cursor-grab items-center gap-2 px-2 active:cursor-grabbing"
        onPointerDown={onPointerDownTitle}
        onDoubleClick={onMax}
      >
        <span className="ml-1 truncate font-mono text-[12px] tracking-tight text-white/95">
          {win.title}
        </span>
        <div className="ml-auto flex items-center gap-1" data-no-drag>
          <button
            aria-label="Minimize window"
            className="grid h-6 w-6 place-items-center rounded text-[12px] hover:bg-white/15"
            onClick={onMin}
          >
            —
          </button>
          <button
            aria-label="Maximize window"
            className="grid h-6 w-6 place-items-center rounded text-[12px] hover:bg-white/15"
            onClick={onMax}
          >
            {win.maximized ? "▭" : "▢"}
          </button>
          <button
            aria-label="Close window"
            className="grid h-6 w-6 place-items-center rounded text-[12px] hover:bg-red-500/70"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="scrollbar-thin relative flex-1 overflow-auto bg-[rgba(8,16,30,0.45)] text-[#dcefff]">
        {children}
      </div>

      {!win.maximized && (
        <div
          className="absolute bottom-0 right-0 h-3 w-3 cursor-se-resize"
          onPointerDown={onPointerDownResize}
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.45) 50%)",
          }}
        />
      )}
    </section>
  );
}

export default memo(WindowInner);
