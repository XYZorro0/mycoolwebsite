"use client";

import { PROFILE } from "@/lib/profile";

const DRIVES = [
  { id: "C", label: "Local Disk", total: 250, used: 187, system: true },
  { id: "D", label: "Projects", total: 500, used: 312 },
  { id: "E", label: "Media", total: 1000, used: 642 },
];

export default function Computer() {
  return (
    <div className="flex h-full flex-col">
      <Toolbar />
      <div className="flex-1 overflow-auto p-4">
        <h2 className="mb-1 text-[15px] font-semibold text-[#0a3a78]">Hard Disk Drives</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {DRIVES.map((d) => (
            <Drive key={d.id} {...d} />
          ))}
        </div>

        <h2 className="mt-5 mb-1 text-[15px] font-semibold text-[#0a3a78]">System</h2>
        <div className="rounded border border-[#a8c4e8] bg-white/70 p-3 text-[12px] text-[#0a1f3a]">
          <Row k="Computer name" v={PROFILE.hostname} />
          <Row k="OS" v="RetroOS 6.0 (Build 6000)" />
          <Row k="User" v={PROFILE.name} />
          <Row k="Uptime" v="lots" />
        </div>
      </div>
    </div>
  );
}

function Toolbar() {
  return (
    <div className="flex items-center gap-2 border-b border-[#a8c4e8] bg-gradient-to-b from-[#eef5ff] to-[#cfe0f5] px-3 py-1 text-[12px] text-[#0a1f3a]">
      <span>📁 Computer</span>
      <span className="ml-auto text-[#3a4d6c]">View · Tools · Help</span>
    </div>
  );
}

function Drive({
  id,
  label,
  total,
  used,
  system,
}: {
  id: string;
  label: string;
  total: number;
  used: number;
  system?: boolean;
}) {
  const free = total - used;
  const pct = used / total;
  return (
    <div className="rounded border border-[#a8c4e8] bg-white/70 p-3">
      <div className="flex items-center gap-2">
        <DriveIcon system={!!system} />
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-[#0a1f3a]">
            {label} ({id}:)
          </div>
          <div className="text-[11px] text-[#3a4d6c]">
            {free} GB free of {total} GB
          </div>
        </div>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded bg-[#e6eef7]">
        <div
          className={
            "h-full " + (pct > 0.9 ? "bg-red-500" : pct > 0.6 ? "bg-blue-500" : "bg-emerald-500")
          }
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}

function DriveIcon({ system }: { system: boolean }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
      <defs>
        <linearGradient id="drv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e6efff" />
          <stop offset="100%" stopColor="#7c8fa9" />
        </linearGradient>
      </defs>
      <rect x="4" y="8" width="28" height="22" rx="2" fill="url(#drv)" stroke="#3b4d6c" />
      <rect x="6" y="10" width="24" height="6" fill="#cfd8e6" stroke="#3b4d6c" />
      <circle cx="28" cy="22" r="1.6" fill="#7be57b" />
      {system && (
        <text x="6" y="27" fontFamily="Segoe UI" fontSize="6" fill="#0a1f3a" fontWeight="700">
          SYS
        </text>
      )}
    </svg>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-[#e6eef7] py-1 last:border-b-0">
      <span className="text-[#3a4d6c]">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
