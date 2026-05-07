"use client";

import Image from "next/image";

type Project = {
  title: string;
  description: string;
  stack: string[];
  github?: string;
  demo?: string;
  screenshot?: string;
};

const PROJECTS: Project[] = [
  {
    title: "RetroOS Portfolio",
    description: "This site — a Vista-meets-CRT desktop, built for low idle CPU.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Zustand"],
    github: "https://github.com/example/retro-os",
    demo: "#",
  },
  {
    title: "Pixel Pipeline",
    description: "Image processing service with WASM filters and edge-cached output.",
    stack: ["Rust", "WASM", "Cloudflare Workers"],
    github: "https://github.com/example/pixel-pipeline",
  },
  {
    title: "Tape Deck",
    description: "A tiny audio looper with a focus on tactile UI and 60fps interactions.",
    stack: ["React", "WebAudio", "Canvas"],
    demo: "#",
  },
];

export default function Projects() {
  return (
    <div className="p-4">
      <h2 className="font-mono text-[12px] uppercase tracking-widest text-[#7fd3ff]/80">
        projects
      </h2>
      <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <li
            key={p.title}
            className="overflow-hidden rounded-md border border-white/10 bg-white/5"
          >
            {p.screenshot ? (
              <div className="relative aspect-video bg-black/40">
                <Image
                  src={p.screenshot}
                  alt={`${p.title} screenshot`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className="aspect-video w-full"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(127,211,255,0.15), rgba(60,100,180,0.25)), repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 6px, transparent 6px 12px)",
                }}
              />
            )}
            <div className="p-3">
              <h3 className="text-sm font-semibold">{p.title}</h3>
              <p className="mt-1 text-[12px] text-white/70">{p.description}</p>
              <ul className="mt-2 flex flex-wrap gap-1">
                {p.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/70"
                  >
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex gap-2 text-[12px]">
                {p.github && (
                  <a
                    className="rounded border border-white/15 px-2 py-0.5 hover:bg-white/10"
                    href={p.github}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    GitHub ↗
                  </a>
                )}
                {p.demo && (
                  <a
                    className="rounded border border-white/15 px-2 py-0.5 hover:bg-white/10"
                    href={p.demo}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Live ↗
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
