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

// Each app is a separate dynamic chunk — assets only load when launched.
export const APPS: Record<AppId, AppMeta> = {
  resume: {
    id: "resume",
    title: "Resume.pdf",
    iconLabel: "Resume",
    defaultSize: { w: 720, h: 560 },
    load: () => import("@/components/apps/Resume"),
  },
  projects: {
    id: "projects",
    title: "Projects",
    iconLabel: "Projects",
    defaultSize: { w: 820, h: 580 },
    load: () => import("@/components/apps/Projects"),
  },
  about: {
    id: "about",
    title: "About Me",
    iconLabel: "About Me",
    defaultSize: { w: 560, h: 460 },
    load: () => import("@/components/apps/About"),
  },
  contact: {
    id: "contact",
    title: "Contact",
    iconLabel: "Contact",
    defaultSize: { w: 520, h: 420 },
    load: () => import("@/components/apps/Contact"),
  },
  doom: {
    id: "doom",
    title: "DOOM.exe",
    iconLabel: "Doom",
    defaultSize: { w: 760, h: 560 },
    load: () => import("@/components/apps/Doom"),
  },
  minecraft: {
    id: "minecraft",
    title: "Voxel.exe",
    iconLabel: "Minecraft",
    defaultSize: { w: 760, h: 560 },
    load: () => import("@/components/apps/Minecraft"),
  },
};

export const APP_LIST: AppMeta[] = [
  APPS.resume,
  APPS.projects,
  APPS.about,
  APPS.contact,
  APPS.doom,
  APPS.minecraft,
];
