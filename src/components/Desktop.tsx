"use client";

import { useMemo } from "react";
import { useDesktop } from "@/lib/store";
import { APP_LIST } from "@/lib/apps";
import { sfx } from "@/lib/sound";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import WindowHost from "./WindowHost";

export default function Desktop() {
  const open = useDesktop((s) => s.open);
  const audioEnabled = useDesktop((s) => s.audioEnabled);

  const wallpaperStyle = useMemo(
    () => ({
      backgroundImage:
        "radial-gradient(1200px 700px at 30% 20%, rgba(80,140,220,0.55), transparent 60%)," +
        "radial-gradient(900px 500px at 80% 80%, rgba(40,80,160,0.55), transparent 65%)," +
        "linear-gradient(180deg, #0b1830 0%, #061224 60%, #03070f 100%)",
    }),
    []
  );

  return (
    <div
      className="crt relative h-full w-full select-none"
      style={wallpaperStyle}
      aria-label="Desktop"
    >
      {/* desktop icons grid */}
      <ul
        className="absolute left-3 top-3 grid auto-rows-min grid-cols-1 gap-2"
        role="list"
        aria-label="Desktop icons"
      >
        {APP_LIST.map((app) => (
          <DesktopIcon
            key={app.id}
            label={app.iconLabel}
            appId={app.id}
            onActivate={() => {
              if (audioEnabled) sfx.open();
              open(app);
            }}
          />
        ))}
      </ul>

      <WindowHost />
      <Taskbar />
    </div>
  );
}
