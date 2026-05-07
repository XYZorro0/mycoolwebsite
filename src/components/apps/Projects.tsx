"use client";

import Image from "next/image";
import { PROJECTS } from "@/lib/profile";

export default function Projects() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-[#a8c4e8] bg-gradient-to-b from-[#eef5ff] to-[#cfe0f5] px-3 py-1 text-[12px] text-[#0a1f3a]">
        <span>📁 Projects</span>
        <span className="ml-auto text-[#3a4d6c]">{PROJECTS.length} items</span>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {PROJECTS.map((p) => (
            <li
              key={p.title}
              className="overflow-hidden rounded border border-[#a8c4e8] bg-white shadow-sm transition hover:shadow-md"
            >
              {p.screenshot ? (
                <div className="relative aspect-video bg-[#dde9f7]">
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
                      "linear-gradient(135deg, rgba(127,211,255,0.45), rgba(60,100,180,0.55)), repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 6px, transparent 6px 12px)",
                  }}
                />
              )}
              <div className="p-3">
                <h3 className="text-[14px] font-semibold text-[#0a3a78]">{p.title}</h3>
                <p className="mt-1 text-[12px] text-[#3a4d6c]">{p.description}</p>
                <ul className="mt-2 flex flex-wrap gap-1">
                  {p.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded border border-[#a8c4e8] bg-[#eef5ff] px-1.5 py-0.5 font-mono text-[10px] text-[#0a3a78]"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex gap-2 text-[12px]">
                  {p.github && (
                    <a
                      className="rounded border border-[#7da5d8] bg-gradient-to-b from-white to-[#cee] px-2 py-0.5 text-[#0a3a78] hover:brightness-105"
                      href={p.github}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      GitHub ↗
                    </a>
                  )}
                  {p.demo && (
                    <a
                      className="rounded border border-[#7da5d8] bg-gradient-to-b from-white to-[#cee] px-2 py-0.5 text-[#0a3a78] hover:brightness-105"
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
    </div>
  );
}
