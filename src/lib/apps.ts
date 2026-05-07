"use client";

import type { ComponentType } from "react";
import type { AppId } from "./store";

export type AppMeta = {
  id: AppId;
  title: string;
  iconLabel: string;
  defaultSize: { w: number; h: number };
  load: () => Promise<{ default: ComponentType<Record<string, unknown>> }>;
};

// Each app is its own dynamic chunk — no JS or assets ship until launched.
export const APPS: Record<AppId, AppMeta> = {
  computer: {
    id: "computer",
    title: "My Computer",
    iconLabel: "Computer",
    defaultSize: { w: 720, h: 460 },
    load: () => import("@/components/apps/Computer"),
  },
  resume: {
    id: "resume",
    title: "Resume.pdf",
    iconLabel: "Resume",
    defaultSize: { w: 760, h: 600 },
    load: () => import("@/components/apps/Resume"),
  },
  projects: {
    id: "projects",
    title: "Projects",
    iconLabel: "Projects",
    defaultSize: { w: 880, h: 620 },
    load: () => import("@/components/apps/Projects"),
  },
  about: {
    id: "about",
    title: "About Me",
    iconLabel: "About Me",
    defaultSize: { w: 640, h: 540 },
    load: () => import("@/components/apps/About"),
  },
  games: {
    id: "games",
    title: "Games",
    iconLabel: "Games",
    defaultSize: { w: 560, h: 380 },
    load: () => import("@/components/apps/Games"),
  },
  contact: {
    id: "contact",
    title: "Contact",
    iconLabel: "Contact",
    defaultSize: { w: 540, h: 460 },
    load: () => import("@/components/apps/Contact"),
  },
  terminal: {
    id: "terminal",
    title: "Command Prompt",
    iconLabel: "Terminal",
    defaultSize: { w: 680, h: 440 },
    load: () => import("@/components/apps/Terminal"),
  },
  recyclebin: {
    id: "recyclebin",
    title: "Recycle Bin",
    iconLabel: "Recycle Bin",
    defaultSize: { w: 520, h: 360 },
    load: () => import("@/components/apps/RecycleBin"),
  },
  doom: {
    id: "doom",
    title: "DOOM",
    iconLabel: "Doom",
    defaultSize: { w: 800, h: 600 },
    load: () => import("@/components/apps/Doom"),
  },
  minecraft: {
    id: "minecraft",
    title: "Voxelcraft",
    iconLabel: "Minecraft",
    defaultSize: { w: 880, h: 620 },
    load: () => import("@/components/apps/Minecraft"),
  },
};

// The desktop icon grid (in display order).
export const DESKTOP_ICONS: AppId[] = [
  "computer",
  "resume",
  "projects",
  "about",
  "games",
  "contact",
  "terminal",
  "recyclebin",
];

// The Start menu (everything launchable).
export const START_MENU: AppId[] = [
  "computer",
  "resume",
  "projects",
  "about",
  "games",
  "contact",
  "terminal",
  "doom",
  "minecraft",
  "recyclebin",
];
