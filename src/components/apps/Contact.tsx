"use client";

import { useState } from "react";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "you@example.com";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="p-5 text-sm text-white/90">
      <h2 className="font-mono text-[12px] uppercase tracking-widest text-[#7fd3ff]/80">
        contact
      </h2>
      <p className="mt-3 text-white/80">
        Want to work together, say hi, or trade boot screen screenshots? Reach out:
      </p>

      <div className="mt-4 flex items-center gap-2 rounded border border-white/15 bg-white/5 px-3 py-2 font-mono text-[13px]">
        <span className="select-all">{email}</span>
        <button
          className="ml-auto rounded border border-white/15 px-2 py-0.5 text-[11px] hover:bg-white/10"
          onClick={copy}
          aria-live="polite"
        >
          {copied ? "copied!" : "copy"}
        </button>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
        <li>
          <a
            className="block rounded border border-white/10 bg-white/5 p-2 hover:bg-white/10"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub ↗
          </a>
        </li>
        <li>
          <a
            className="block rounded border border-white/10 bg-white/5 p-2 hover:bg-white/10"
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            LinkedIn ↗
          </a>
        </li>
        <li>
          <a
            className="block rounded border border-white/10 bg-white/5 p-2 hover:bg-white/10"
            href="https://x.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            X / Twitter ↗
          </a>
        </li>
        <li>
          <a
            className="block rounded border border-white/10 bg-white/5 p-2 hover:bg-white/10"
            href="https://bsky.app/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Bluesky ↗
          </a>
        </li>
      </ul>
    </div>
  );
}
