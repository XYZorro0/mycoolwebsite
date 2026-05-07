"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/profile";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard unavailable */
    }
  };

  const links: { label: string; href: string }[] = [
    PROFILE.github && { label: "GitHub", href: PROFILE.github },
    PROFILE.linkedin && { label: "LinkedIn", href: PROFILE.linkedin },
    PROFILE.twitter && { label: "Twitter / X", href: PROFILE.twitter },
    PROFILE.bluesky && { label: "Bluesky", href: PROFILE.bluesky },
    PROFILE.website && { label: "Website", href: PROFILE.website },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-[#a8c4e8] bg-gradient-to-b from-[#eef5ff] to-[#cfe0f5] px-3 py-1 text-[12px] text-[#0a1f3a]">
        <span>✉ Contact</span>
      </div>

      <div className="flex-1 overflow-auto p-5 text-[13px] text-[#0a1f3a]">
        <p className="mb-3">
          The fastest way to reach me is email. I read everything, and I usually reply within a
          day or two.
        </p>

        <div className="flex items-center gap-2 rounded border border-[#a8c4e8] bg-white px-3 py-2 font-mono text-[13px] text-[#0a3a78]">
          <span className="select-all">{PROFILE.email}</span>
          <button
            className="ml-auto rounded border border-[#7da5d8] bg-gradient-to-b from-white to-[#cee] px-2 py-0.5 text-[11px] hover:brightness-105"
            onClick={copy}
            aria-live="polite"
          >
            {copied ? "copied!" : "copy"}
          </button>
          <a
            className="rounded border border-[#7da5d8] bg-gradient-to-b from-white to-[#cee] px-2 py-0.5 text-[11px] hover:brightness-105"
            href={`mailto:${PROFILE.email}`}
          >
            mail
          </a>
        </div>

        <h2 className="mt-5 mb-2 border-b border-[#cfd8e6] pb-1 text-[12px] font-bold uppercase tracking-widest text-[#0a3a78]">
          Elsewhere
        </h2>
        <ul className="grid grid-cols-2 gap-2">
          {links.map((l) => (
            <li key={l.label}>
              <a
                className="block rounded border border-[#a8c4e8] bg-white px-3 py-2 text-[#0a3a78] hover:bg-[#eef5ff]"
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
