"use client";

import { useEffect } from "react";
import { useDesktop } from "@/lib/store";
import { APPS, DESKTOP_ICONS } from "@/lib/apps";
import { sfx } from "@/lib/sound";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import WindowHost from "./WindowHost";

export default function Desktop() {
  const open = useDesktop((s) => s.open);
  const audioEnabled = useDesktop((s) => s.audioEnabled);
  const setSelected = useDesktop((s) => s.setSelectedIcon);

  // Click on empty desktop deselects icons.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-desktop-icon]") && !t.closest("[data-window]")) {
        setSelected(null);
      }
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [setSelected]);

  return (
    <div
      id="desktop"
      className="vista-wallpaper relative h-full w-full select-none overflow-hidden"
      aria-label="Vista desktop"
    >
      <ul
        className="absolute left-3 top-3 grid auto-rows-min grid-cols-1 gap-2"
        role="list"
        aria-label="Desktop icons"
      >
        {DESKTOP_ICONS.map((appId) => (
          <DesktopIcon
            key={appId}
            appId={appId}
            label={APPS[appId].iconLabel}
            onActivate={() => {
              if (audioEnabled) sfx.open();
              open(APPS[appId]);
            }}
          />
        ))}
      </ul>

      <WindowHost />
      <Taskbar />
    </div>
  );
}
