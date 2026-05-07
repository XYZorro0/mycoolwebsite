"use client";

import { useDesktop } from "@/lib/store";
import { APPS } from "@/lib/apps";
import { sfx } from "@/lib/sound";
import DesktopIcon from "../DesktopIcon";

export default function Games() {
  const open = useDesktop((s) => s.open);
  const audioEnabled = useDesktop((s) => s.audioEnabled);

  const launch = (id: "doom" | "minecraft") => {
    if (audioEnabled) sfx.open();
    open(APPS[id]);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-[#a8c4e8] bg-gradient-to-b from-[#eef5ff] to-[#cfe0f5] px-3 py-1 text-[12px] text-[#0a1f3a]">
        <span>🎮 Games</span>
        <span className="ml-auto text-[#3a4d6c]">2 items</span>
      </div>
      <div className="flex-1 p-4">
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          <DesktopIcon
            appId="doom"
            label="DOOM"
            onActivate={() => launch("doom")}
            variant="folder"
            size={56}
          />
          <DesktopIcon
            appId="minecraft"
            label="Voxelcraft"
            onActivate={() => launch("minecraft")}
            variant="folder"
            size={56}
          />
        </ul>
      </div>
    </div>
  );
}
