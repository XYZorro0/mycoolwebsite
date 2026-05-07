"use client";

export default function About() {
  return (
    <div className="p-5 text-sm leading-relaxed text-white/90">
      <h2 className="font-mono text-[12px] uppercase tracking-widest text-[#7fd3ff]/80">
        about me
      </h2>
      <h1 className="mt-1 text-xl font-semibold">Hi, I&apos;m Your Name 👋</h1>
      <p className="mt-3 text-white/80">
        I build small, fast, well-crafted software. I like terminals, type systems, and
        the smell of fresh CRT phosphor in the morning.
      </p>
      <p className="mt-3 text-white/80">
        This site is hosted on a Mac Mini in my apartment. It is intentionally tiny —
        idle CPU near zero, no canvas particles, no infinite re-renders. Aesthetics
        without the bill.
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
        <li className="rounded border border-white/10 bg-white/5 p-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#7fd3ff]/80">
            location
          </span>
          <div>Internet, mostly</div>
        </li>
        <li className="rounded border border-white/10 bg-white/5 p-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#7fd3ff]/80">
            currently
          </span>
          <div>Building things, learning Rust</div>
        </li>
      </ul>
    </div>
  );
}
