"use client";

import { useEffect, useState } from "react";
import { PROFILE, RESUME, SKILLS } from "@/lib/profile";

export default function Resume() {
  const [hasPdf, setHasPdf] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(PROFILE.resumePath, { method: "HEAD" })
      .then((r) => !cancelled && setHasPdf(r.ok))
      .catch(() => !cancelled && setHasPdf(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex h-full flex-col bg-[#e9f0f9]">
      {/* Vista document toolbar */}
      <div className="flex items-center gap-2 border-b border-[#a8c4e8] bg-gradient-to-b from-[#eef5ff] to-[#cfe0f5] px-3 py-1 text-[12px] text-[#0a1f3a]">
        <span>📄 Resume</span>
        <a
          href={PROFILE.resumePath}
          download
          className="ml-auto rounded border border-[#7da5d8] bg-gradient-to-b from-white to-[#cee] px-2 py-0.5 text-[11px] hover:brightness-105"
        >
          ↓ Download PDF
        </a>
      </div>

      {/* Page */}
      <div className="flex-1 overflow-auto p-6">
        {hasPdf ? (
          <object
            data={PROFILE.resumePath}
            type="application/pdf"
            className="mx-auto h-full w-full max-w-[820px] rounded border border-[#a8c4e8] bg-white shadow-md"
          >
            <p className="p-4 text-sm text-[#3a4d6c]">
              Your browser can&apos;t embed the PDF. Use the download link.
            </p>
          </object>
        ) : (
          <article className="mx-auto max-w-[820px] rounded border border-[#a8c4e8] bg-white p-8 shadow-md">
            <header className="mb-4 border-b border-[#cfd8e6] pb-3">
              <h1 className="text-2xl font-bold text-[#0a3a78]">{PROFILE.name}</h1>
              <p className="text-[#3a4d6c]">{PROFILE.role}</p>
              <p className="mt-1 text-[12px] text-[#3a4d6c]">
                {PROFILE.email}
                {PROFILE.github && <> · {PROFILE.github}</>}
                {PROFILE.linkedin && <> · {PROFILE.linkedin}</>}
              </p>
            </header>

            <Section title="Summary">
              <p>{RESUME.summary}</p>
            </Section>

            {RESUME.experience.length > 0 && (
              <Section title="Experience">
                <ul className="space-y-2">
                  {RESUME.experience.map((e, i) => (
                    <li key={i} className="grid grid-cols-[1fr_auto] gap-2">
                      <div>
                        <div className="font-semibold">{e.role}</div>
                        <div className="text-[#3a4d6c]">{e.company}</div>
                        {e.detail && (
                          <div className="text-[12px] text-[#3a4d6c]">{e.detail}</div>
                        )}
                      </div>
                      <div className="text-right text-[12px] text-[#3a4d6c]">{e.period}</div>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <Section title="Skills">
              <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {SKILLS.map((g) => (
                  <li key={g.name}>
                    <span className="font-semibold">{g.name}: </span>
                    <span className="text-[#3a4d6c]">{g.items.join(", ")}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Education">
              <ul className="space-y-2">
                {RESUME.education.map((e, i) => (
                  <li key={i} className="grid grid-cols-[1fr_auto] gap-2">
                    <div>
                      <div className="font-semibold">{e.degree}</div>
                      <div className="text-[#3a4d6c]">{e.school}</div>
                      {e.detail && (
                        <div className="text-[12px] text-[#3a4d6c]">{e.detail}</div>
                      )}
                    </div>
                    <div className="text-right text-[12px] text-[#3a4d6c]">{e.period}</div>
                  </li>
                ))}
              </ul>
            </Section>

            {RESUME.certifications.length > 0 && (
              <Section title="Certifications">
                <ul className="space-y-2">
                  {RESUME.certifications.map((c, i) => (
                    <li key={i} className="grid grid-cols-[1fr_auto] gap-2">
                      <div>
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-[#3a4d6c]">{c.issuer}</div>
                        {c.detail && (
                          <div className="text-[12px] text-[#3a4d6c]">{c.detail}</div>
                        )}
                      </div>
                      <div className="text-right text-[12px] text-[#3a4d6c]">{c.period}</div>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <p className="mt-6 text-[11px] text-[#3a4d6c]">
              Drop a real <code>resume.pdf</code> into <code>/public</code> and this view will
              automatically embed it instead.
            </p>
          </article>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-4">
      <h2 className="mb-2 border-b border-[#cfd8e6] pb-1 text-[13px] font-bold uppercase tracking-widest text-[#0a3a78]">
        {title}
      </h2>
      <div className="text-[13px] leading-relaxed text-[#0a1f3a]">{children}</div>
    </section>
  );
}
