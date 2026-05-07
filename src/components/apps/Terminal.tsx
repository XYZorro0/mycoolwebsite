"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/profile";

type Entry = { kind: "input" | "output"; text: string };

const HELP = `Available commands:
  help              - this message
  whoami            - print user info
  ls                - list desktop apps
  open <app>        - open an app (resume, projects, doom, minecraft, ...)
  date              - print current date
  echo <text>       - echo arguments
  clear             - clear the screen
  uptime            - show how long the desktop has been up
  cowsay <text>     - moo`;

const APP_ALIASES = [
  "computer",
  "resume",
  "projects",
  "about",
  "games",
  "contact",
  "terminal",
  "doom",
  "minecraft",
];

export default function Terminal() {
  const [entries, setEntries] = useState<Entry[]>([
    {
      kind: "output",
      text:
        `RetroOS 6.0 (Build 6000) — Terminal\n` +
        `Type 'help' for commands.\n`,
    },
  ]);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    setEntries((e) => [...e, { kind: "input", text: cmd }]);
    if (!cmd) return;

    const [head, ...rest] = cmd.split(/\s+/);
    let out = "";

    switch (head) {
      case "help":
        out = HELP;
        break;
      case "whoami":
        out = `${PROFILE.name}\n${PROFILE.role}\n${PROFILE.email}`;
        break;
      case "ls":
        out = APP_ALIASES.join("  ");
        break;
      case "date":
        out = new Date().toString();
        break;
      case "uptime": {
        const s = Math.floor((Date.now() - startedAt.current) / 1000);
        out = `up ${s}s`;
        break;
      }
      case "echo":
        out = rest.join(" ");
        break;
      case "clear":
        setEntries([]);
        return;
      case "cowsay": {
        const msg = rest.join(" ") || "moo";
        const bar = "-".repeat(msg.length + 2);
        out =
          ` ${bar}\n< ${msg} >\n ${bar}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`;
        break;
      }
      case "open": {
        const target = (rest[0] || "").toLowerCase();
        if (!APP_ALIASES.includes(target)) {
          out = `unknown app: ${target}\nknown: ${APP_ALIASES.join(", ")}`;
          break;
        }
        // dispatch via custom event so the desktop can pick it up
        window.dispatchEvent(new CustomEvent("retro:open", { detail: target }));
        out = `opening ${target}…`;
        break;
      }
      default:
        out = `command not found: ${head}`;
    }

    setEntries((e) => [...e, { kind: "output", text: out }]);
  };

  return (
    <div
      className="flex h-full flex-col bg-black font-mono text-[12.5px] text-[#cdeeff]"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="scrollbar-thin flex-1 overflow-auto p-3 leading-snug">
        {entries.map((e, i) =>
          e.kind === "input" ? (
            <div key={i}>
              <span className="text-[#7be57b]">{PROFILE.hostname}</span>
              <span className="text-[#a8e7ff]">:</span>
              <span className="text-[#7fd3ff]">~</span>
              <span className="text-[#cdeeff]">$ </span>
              {e.text}
            </div>
          ) : (
            <pre key={i} className="m-0 whitespace-pre-wrap text-[#cdeeff]">
              {e.text}
            </pre>
          )
        )}
        <div className="flex items-center">
          <span className="text-[#7be57b]">{PROFILE.hostname}</span>
          <span className="text-[#a8e7ff]">:</span>
          <span className="text-[#7fd3ff]">~</span>
          <span className="text-[#cdeeff]">$&nbsp;</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                run(value);
                setValue("");
              }
            }}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            className="flex-1 border-0 bg-transparent text-[#cdeeff] outline-none"
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  );
}
