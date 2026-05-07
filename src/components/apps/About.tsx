"use client";

import { PROFILE, SKILLS } from "@/lib/profile";

export default function About() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-[#a8c4e8] bg-gradient-to-b from-[#eef5ff] to-[#cfe0f5] px-3 py-1 text-[12px] text-[#0a1f3a]">
        <span>👤 About</span>
      </div>
      <div className="flex-1 overflow-auto p-5 text-[13px] leading-relaxed text-[#0a1f3a]">
        <header className="flex items-center gap-3">
          <div
            className="grid h-16 w-16 place-items-center rounded-full border border-[#a8c4e8]"
            style={{
              background: "radial-gradient(circle at 35% 30%, #fff, #cfe7ff 30%, #4ea7ea 80%)",
            }}
            aria-hidden="true"
          >
            <span className="text-2xl font-bold text-white" style={{ textShadow: "0 1px 1px rgba(0,0,0,0.5)" }}>
              {PROFILE.name.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#0a3a78]">{PROFILE.name}</h1>
            <p className="text-[#3a4d6c]">{PROFILE.role}</p>
          </div>
        </header>

        <p className="mt-4">{PROFILE.bio}</p>

        <h2 className="mt-5 mb-2 border-b border-[#cfd8e6] pb-1 text-[12px] font-bold uppercase tracking-widest text-[#0a3a78]">
          Skills
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SKILLS.map((g) => (
            <div key={g.name} className="rounded border border-[#a8c4e8] bg-white p-2">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#0a3a78]">
                {g.name}
              </div>
              <ul className="mt-1 flex flex-wrap gap-1">
                {g.items.map((s) => (
                  <li
                    key={s}
                    className="rounded bg-[#eef5ff] px-1.5 py-0.5 font-mono text-[10px] text-[#0a3a78]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="mt-5 mb-2 border-b border-[#cfd8e6] pb-1 text-[12px] font-bold uppercase tracking-widest text-[#0a3a78]">
          Links
        </h2>
        <ul className="grid grid-cols-2 gap-1 text-[12px]">
          {PROFILE.github && (
            <li>
              <a className="text-[#0a3a78] underline" href={PROFILE.github} target="_blank" rel="noreferrer noopener">
                GitHub ↗
              </a>
            </li>
          )}
          {PROFILE.linkedin && (
            <li>
              <a className="text-[#0a3a78] underline" href={PROFILE.linkedin} target="_blank" rel="noreferrer noopener">
                LinkedIn ↗
              </a>
            </li>
          )}
          {PROFILE.twitter && (
            <li>
              <a className="text-[#0a3a78] underline" href={PROFILE.twitter} target="_blank" rel="noreferrer noopener">
                Twitter / X ↗
              </a>
            </li>
          )}
          {PROFILE.bluesky && (
            <li>
              <a className="text-[#0a3a78] underline" href={PROFILE.bluesky} target="_blank" rel="noreferrer noopener">
                Bluesky ↗
              </a>
            </li>
          )}
          {PROFILE.website && (
            <li>
              <a className="text-[#0a3a78] underline" href={PROFILE.website} target="_blank" rel="noreferrer noopener">
                Website ↗
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
