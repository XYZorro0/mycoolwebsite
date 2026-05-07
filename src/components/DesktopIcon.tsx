"use client";

import { memo, useCallback } from "react";
import { useDesktop } from "@/lib/store";
import { sfx } from "@/lib/sound";
import type { AppId } from "@/lib/store";

type Props = {
  label: string;
  appId: AppId;
  onActivate: () => void;
};

function Glyph({ appId }: { appId: AppId }) {
  // Inline SVG icons — zero network cost, themable.
  const common = "h-8 w-8 drop-shadow";
  switch (appId) {
    case "resume":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <rect x="4" y="2" width="14" height="20" rx="2" fill="#e7f3ff" />
          <path d="M14 2v5h5" fill="none" stroke="#3b6cb0" />
          <path d="M7 9h7M7 12h10M7 15h10M7 18h6" stroke="#3b6cb0" />
        </svg>
      );
    case "projects":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path d="M3 7h7l2 2h9v10H3z" fill="#f3c761" stroke="#7a5b14" />
          <path d="M3 7v-2h6l2 2" fill="#ffd97a" stroke="#7a5b14" />
        </svg>
      );
    case "about":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <circle cx="12" cy="9" r="3.5" fill="#cfe7ff" stroke="#3b6cb0" />
          <path d="M5 20c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5" fill="#cfe7ff" stroke="#3b6cb0" />
        </svg>
      );
    case "contact":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <rect x="3" y="6" width="18" height="12" rx="1.5" fill="#e7f3ff" stroke="#3b6cb0" />
          <path d="M3 7l9 7 9-7" fill="none" stroke="#3b6cb0" />
        </svg>
      );
    case "doom":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <rect x="2" y="4" width="20" height="14" rx="1.5" fill="#1a0a0a" stroke="#7a1414" />
          <text
            x="12"
            y="14"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="6"
            fill="#ff4747"
            fontWeight="900"
          >
            DOOM
          </text>
        </svg>
      );
    case "minecraft":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <rect x="3" y="6" width="18" height="14" fill="#7ec84a" stroke="#3a6a1f" />
          <rect x="3" y="6" width="18" height="4" fill="#3a6a1f" />
          <rect x="6" y="12" width="3" height="3" fill="#5e9d36" />
          <rect x="11" y="14" width="3" height="3" fill="#5e9d36" />
          <rect x="15" y="11" width="3" height="3" fill="#5e9d36" />
        </svg>
      );
  }
}

function DesktopIconComponent({ label, appId, onActivate }: Props) {
  const audioEnabled = useDesktop((s) => s.audioEnabled);
  const onHover = useCallback(() => {
    if (audioEnabled) sfx.hover();
  }, [audioEnabled]);

  return (
    <li>
      <button
        className="icon-tile group flex w-24 flex-col items-center gap-1 rounded-md px-2 py-2 text-center text-[12px] font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-[#7fd3ff]"
        onDoubleClick={onActivate}
        onClick={(e) => {
          // Accessibility: single-click activation when keyboard-focused via Enter
          if (e.detail === 0) onActivate();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onActivate();
          }
        }}
        onMouseEnter={onHover}
        aria-label={`Open ${label}`}
      >
        <Glyph appId={appId} />
        <span className="leading-tight drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]">{label}</span>
      </button>
    </li>
  );
}

export default memo(DesktopIconComponent);
