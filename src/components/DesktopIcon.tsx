"use client";

import { memo, useCallback } from "react";
import { useDesktop, type AppId } from "@/lib/store";
import { sfx } from "@/lib/sound";
import {
  ComputerIcon,
  ResumeIcon,
  ProjectsIcon,
  AboutIcon,
  GamesIcon,
  ContactIcon,
  TerminalIcon,
  RecycleBinIcon,
  DoomIcon,
  MinecraftIcon,
} from "./icons/VistaIcons";

const ICON_MAP: Record<AppId, React.ComponentType<{ size?: number }>> = {
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

type Props = {
  appId: AppId;
  label: string;
  onActivate: () => void;
  size?: number;
  /** When true, render as a "list" item (used inside folder windows). */
  variant?: "desktop" | "folder";
};

function IconInner({ appId, label, onActivate, size = 56, variant = "desktop" }: Props) {
  const audioEnabled = useDesktop((s) => s.audioEnabled);
  const selected = useDesktop((s) => s.selectedIcon === appId);
  const setSelected = useDesktop((s) => s.setSelectedIcon);

  const Glyph = ICON_MAP[appId];

  const onHover = useCallback(() => {
    if (audioEnabled) sfx.hover();
  }, [audioEnabled]);

  const onClick = useCallback(() => {
    setSelected(appId);
  }, [appId, setSelected]);

  const onDouble = useCallback(() => {
    onActivate();
  }, [onActivate]);

  return (
    <li>
      <button
        data-desktop-icon
        className={
          "vista-icon-hover group flex w-[88px] flex-col items-center gap-1 rounded-md px-2 py-2 text-center outline-none focus-visible:ring-2 focus-visible:ring-[#7fd3ff] " +
          (selected ? "vista-icon-selected" : "")
        }
        onClick={onClick}
        onDoubleClick={onDouble}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onActivate();
          }
        }}
        onMouseEnter={onHover}
        aria-label={`Open ${label}`}
        title={`Double-click to open ${label}`}
      >
        <Glyph size={size} />
        <span
          className={
            "leading-tight " +
            (variant === "desktop"
              ? "text-[12px] font-medium text-white"
              : "text-[12px] text-[#0a1f3a]")
          }
          style={
            variant === "desktop"
              ? { textShadow: "0 1px 2px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.55)" }
              : undefined
          }
        >
          {label}
        </span>
      </button>
    </li>
  );
}

export default memo(IconInner);
