"use client";

import { create } from "zustand";
import type { ComponentType } from "react";

export type AppId =
  | "computer"
  | "resume"
  | "projects"
  | "about"
  | "games"
  | "contact"
  | "terminal"
  | "recyclebin"
  | "doom"
  | "minecraft";

export type WindowState = {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minimized: boolean;
  maximized: boolean;
  z: number;
  prev?: { x: number; y: number; w: number; h: number };
};

type AppMeta = {
  id: AppId;
  title: string;
  defaultSize: { w: number; h: number };
  load: () => Promise<{ default: ComponentType<Record<string, unknown>> }>;
};

type Store = {
  windows: Record<string, WindowState>;
  order: string[];
  focusId: string | null;
  zCounter: number;
  booted: boolean;
  reducedMotion: boolean;
  audioEnabled: boolean;
  selectedIcon: AppId | null;

  setBooted: (b: boolean) => void;
  setReducedMotion: (b: boolean) => void;
  setAudioEnabled: (b: boolean) => void;
  setSelectedIcon: (id: AppId | null) => void;

  open: (app: AppMeta) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMaximize: (id: string, viewport: { w: number; h: number }) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, w: number, h: number, x?: number, y?: number) => void;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

let openCount = 0;

export const useDesktop = create<Store>((set, get) => ({
  windows: {},
  order: [],
  focusId: null,
  zCounter: 10,
  booted: false,
  reducedMotion: false,
  audioEnabled: false,
  selectedIcon: null,

  setBooted: (b) => set({ booted: b }),
  setReducedMotion: (b) => set({ reducedMotion: b }),
  setAudioEnabled: (b) => set({ audioEnabled: b }),
  setSelectedIcon: (id) => set({ selectedIcon: id }),

  open: (app) => {
    const existing = Object.values(get().windows).find((w) => w.appId === app.id);
    if (existing) {
      get().focus(existing.id);
      if (existing.minimized) {
        set((s) => ({
          windows: { ...s.windows, [existing.id]: { ...existing, minimized: false } },
        }));
      }
      return;
    }
    const id = `${app.id}-${++openCount}`;
    const z = get().zCounter + 1;
    const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const w = Math.min(app.defaultSize.w, Math.floor(vw * 0.92));
    const h = Math.min(app.defaultSize.h, Math.floor(vh * 0.85));
    const offset = (openCount % 6) * 28;
    const x = clamp(Math.floor((vw - w) / 2) + offset, 12, vw - w - 12);
    const y = clamp(Math.floor((vh - h) / 2) - 24 + offset, 12, vh - h - 60);
    const win: WindowState = {
      id,
      appId: app.id,
      title: app.title,
      x,
      y,
      w,
      h,
      minimized: false,
      maximized: false,
      z,
    };
    set((s) => ({
      windows: { ...s.windows, [id]: win },
      order: [...s.order, id],
      focusId: id,
      zCounter: z,
    }));
  },

  close: (id) =>
    set((s) => {
      const { [id]: _gone, ...rest } = s.windows;
      void _gone;
      const order = s.order.filter((x) => x !== id);
      const top = order
        .map((wid) => rest[wid])
        .filter((w) => w && !w.minimized)
        .sort((a, b) => b!.z - a!.z)[0];
      return {
        windows: rest,
        order,
        focusId: top ? top.id : null,
      };
    }),

  focus: (id) =>
    set((s) => {
      const win = s.windows[id];
      if (!win) return s;
      const z = s.zCounter + 1;
      return {
        windows: { ...s.windows, [id]: { ...win, z, minimized: false } },
        focusId: id,
        zCounter: z,
      };
    }),

  minimize: (id) =>
    set((s) => {
      const win = s.windows[id];
      if (!win) return s;
      const minimized = !win.minimized;
      // re-focus the next visible top window when minimizing the current focus
      let focusId = s.focusId;
      if (minimized && s.focusId === id) {
        const next = s.order
          .filter((wid) => wid !== id)
          .map((wid) => s.windows[wid])
          .filter((w) => w && !w.minimized)
          .sort((a, b) => b!.z - a!.z)[0];
        focusId = next ? next.id : null;
      }
      return {
        windows: { ...s.windows, [id]: { ...win, minimized } },
        focusId,
      };
    }),

  toggleMaximize: (id, viewport) =>
    set((s) => {
      const win = s.windows[id];
      if (!win) return s;
      if (win.maximized && win.prev) {
        return {
          windows: {
            ...s.windows,
            [id]: { ...win, maximized: false, ...win.prev, prev: undefined },
          },
        };
      }
      const prev = { x: win.x, y: win.y, w: win.w, h: win.h };
      return {
        windows: {
          ...s.windows,
          [id]: {
            ...win,
            maximized: true,
            prev,
            x: 0,
            y: 0,
            w: viewport.w,
            h: viewport.h - 48,
          },
        },
      };
    }),

  move: (id, x, y) =>
    set((s) => {
      const win = s.windows[id];
      if (!win || win.maximized) return s;
      return { windows: { ...s.windows, [id]: { ...win, x, y } } };
    }),

  resize: (id, w, h, x, y) =>
    set((s) => {
      const win = s.windows[id];
      if (!win) return s;
      return {
        windows: {
          ...s.windows,
          [id]: { ...win, w, h, x: x ?? win.x, y: y ?? win.y },
        },
      };
    }),
}));
