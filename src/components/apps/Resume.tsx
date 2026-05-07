"use client";

const RESUME_PDF = "/resume.pdf";

export default function Resume() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-3 py-2">
        <h2 className="font-mono text-[12px] uppercase tracking-widest text-white/70">
          resume
        </h2>
        <a
          href={RESUME_PDF}
          download
          className="rounded border border-white/15 bg-white/5 px-3 py-1 text-[12px] text-white/90 hover:bg-white/10"
        >
          ↓ Download PDF
        </a>
      </div>

      <div className="grid flex-1 grid-rows-[auto_1fr] gap-0">
        <article className="max-w-none p-5 text-sm leading-relaxed">
          <h1 className="!mb-0 text-xl font-semibold">Your Name</h1>
          <p className="!mt-1 text-white/70">Software Engineer · Designer · Tinkerer</p>

          <h3 className="mt-4 font-mono text-[11px] uppercase tracking-widest text-[#7fd3ff]/80">
            Summary
          </h3>
          <p className="mt-1 text-white/85">
            Generalist engineer focused on performant, beautiful product surfaces.
            Comfortable across the stack with a love for the small details that
            make software feel alive.
          </p>

          <h3 className="mt-4 font-mono text-[11px] uppercase tracking-widest text-[#7fd3ff]/80">
            Experience
          </h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-white/85">
            <li>Company A — Senior Engineer (2023–present)</li>
            <li>Company B — Engineer (2020–2023)</li>
            <li>Freelance — Various clients (2018–2020)</li>
          </ul>

          <h3 className="mt-4 font-mono text-[11px] uppercase tracking-widest text-[#7fd3ff]/80">
            Skills
          </h3>
          <p className="mt-1 text-white/85">
            TypeScript · React · Next.js · Node · Rust · Python · Postgres · Cloudflare ·
            Design systems
          </p>
        </article>

        <p className="border-t border-white/10 bg-white/5 px-5 py-2 text-[11px] text-white/60">
          Tip: drop your real <code>resume.pdf</code> into <code>/public</code> to
          enable the embedded PDF viewer.
        </p>
      </div>
    </div>
  );
}
