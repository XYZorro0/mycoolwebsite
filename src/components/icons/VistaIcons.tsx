/**
 * Vista-inspired SVG icons.
 *
 * Authored by hand to evoke the era: heavy gradients, thick highlights,
 * inset shadows, soft drop shadows, slightly tilted "shelf" perspective.
 * Original artwork — no Microsoft assets are used.
 *
 * Each component renders into a fixed 64x64 viewBox and inherits the parent
 * size. Use them at 48–72px for the desktop grid.
 */

import { memo } from "react";

type Props = { size?: number; className?: string };

const Wrap = ({
  size = 56,
  className,
  children,
}: Props & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.45))" }}
  >
    {children}
  </svg>
);

/* ── Computer ─────────────────────────────────────────────────────────────── */
export const ComputerIcon = memo(function ComputerIcon(p: Props) {
  return (
    <Wrap {...p}>
      <defs>
        <linearGradient id="cmp-bezel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e6efff" />
          <stop offset="50%" stopColor="#a9bdda" />
          <stop offset="100%" stopColor="#6c80a3" />
        </linearGradient>
        <linearGradient id="cmp-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ed1ff" />
          <stop offset="55%" stopColor="#3a7fc9" />
          <stop offset="100%" stopColor="#16345f" />
        </linearGradient>
        <linearGradient id="cmp-stand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dde5f3" />
          <stop offset="100%" stopColor="#7c8fa9" />
        </linearGradient>
      </defs>
      {/* monitor bezel */}
      <rect x="6" y="8" width="52" height="36" rx="4" fill="url(#cmp-bezel)" stroke="#3b4d6c" />
      {/* screen */}
      <rect x="10" y="12" width="44" height="26" rx="2" fill="url(#cmp-screen)" />
      {/* aurora reflection on screen */}
      <path d="M10 22 q22 -12 44 -2 v-8 H10 z" fill="rgba(255,255,255,0.18)" />
      {/* stand */}
      <path d="M26 44 h12 l3 8 H23 z" fill="url(#cmp-stand)" stroke="#3b4d6c" />
      <ellipse cx="32" cy="56" rx="14" ry="2" fill="rgba(0,0,0,0.18)" />
    </Wrap>
  );
});

/* ── Folder (Documents / Projects) ───────────────────────────────────────── */
const Folder = memo(function Folder({
  hue,
  ...p
}: Props & { hue?: "manila" | "blue" }) {
  const isBlue = hue === "blue";
  return (
    <Wrap {...p}>
      <defs>
        <linearGradient id={`fld-${hue}-front`} x1="0" y1="0" x2="0" y2="1">
          {isBlue ? (
            <>
              <stop offset="0%" stopColor="#cfe7ff" />
              <stop offset="55%" stopColor="#5ea0d8" />
              <stop offset="100%" stopColor="#1f4f86" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#ffe9a8" />
              <stop offset="55%" stopColor="#f0b855" />
              <stop offset="100%" stopColor="#a26a14" />
            </>
          )}
        </linearGradient>
        <linearGradient id={`fld-${hue}-back`} x1="0" y1="0" x2="0" y2="1">
          {isBlue ? (
            <>
              <stop offset="0%" stopColor="#a6cdef" />
              <stop offset="100%" stopColor="#3b6da3" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#f3cf78" />
              <stop offset="100%" stopColor="#a87819" />
            </>
          )}
        </linearGradient>
      </defs>
      {/* tab */}
      <path
        d="M6 18 l4 -4 h14 l4 4 h30 v6 H6 z"
        fill={`url(#fld-${hue}-back)`}
        stroke="#5a3e0b"
      />
      {/* front pocket with subtle perspective */}
      <path
        d="M6 22 h52 l-4 30 H10 z"
        fill={`url(#fld-${hue}-front)`}
        stroke={isBlue ? "#143b66" : "#5a3e0b"}
      />
      {/* gloss */}
      <path d="M9 23 q23 6 46 0 l-2 6 q-22 -5 -42 0 z" fill="rgba(255,255,255,0.35)" />
    </Wrap>
  );
});

export const DocumentsIcon = memo((p: Props) => <Folder hue="manila" {...p} />);
DocumentsIcon.displayName = "DocumentsIcon";

export const ProjectsIcon = memo((p: Props) => <Folder hue="blue" {...p} />);
ProjectsIcon.displayName = "ProjectsIcon";

/* ── Resume (paper with curl) ────────────────────────────────────────────── */
export const ResumeIcon = memo(function ResumeIcon(p: Props) {
  return (
    <Wrap {...p}>
      <defs>
        <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dde7f3" />
        </linearGradient>
      </defs>
      <path d="M12 6 h28 l12 12 v40 H12 z" fill="url(#paper)" stroke="#3b5070" />
      <path d="M40 6 v12 h12" fill="rgba(150,180,220,0.35)" stroke="#3b5070" />
      {/* lines of text */}
      <g stroke="#5a749a" strokeWidth="1.2" strokeLinecap="round">
        <line x1="18" y1="26" x2="46" y2="26" />
        <line x1="18" y1="32" x2="48" y2="32" />
        <line x1="18" y1="38" x2="42" y2="38" />
        <line x1="18" y1="44" x2="48" y2="44" />
        <line x1="18" y1="50" x2="38" y2="50" />
      </g>
      {/* tiny portrait box */}
      <rect x="40" y="42" width="10" height="10" rx="1" fill="#7fbfff" stroke="#3b6ea2" />
    </Wrap>
  );
});

/* ── Games (joypad) ──────────────────────────────────────────────────────── */
export const GamesIcon = memo(function GamesIcon(p: Props) {
  return (
    <Wrap {...p}>
      <defs>
        <linearGradient id="pad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b6a87" />
          <stop offset="50%" stopColor="#2c3a55" />
          <stop offset="100%" stopColor="#0e1729" />
        </linearGradient>
      </defs>
      <path
        d="M10 26 q4 -10 14 -10 h16 q10 0 14 10 q3 10 -2 18 q-3 4 -8 2 l-6 -4 h-12 l-6 4 q-5 2 -8 -2 q-5 -8 -2 -18 z"
        fill="url(#pad)"
        stroke="#0a1224"
      />
      {/* d-pad */}
      <rect x="16" y="30" width="10" height="3" fill="#cfe7ff" />
      <rect x="20" y="26" width="3" height="11" fill="#cfe7ff" />
      {/* buttons */}
      <circle cx="44" cy="29" r="2.6" fill="#ff6b6b" />
      <circle cx="50" cy="33" r="2.6" fill="#ffd75a" />
      <circle cx="44" cy="37" r="2.6" fill="#7be57b" />
      <circle cx="38" cy="33" r="2.6" fill="#7fbfff" />
      <path d="M14 22 q18 -8 36 0" stroke="rgba(255,255,255,0.35)" fill="none" />
    </Wrap>
  );
});

/* ── Contact (mail envelope) ─────────────────────────────────────────────── */
export const ContactIcon = memo(function ContactIcon(p: Props) {
  return (
    <Wrap {...p}>
      <defs>
        <linearGradient id="env" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cdd9eb" />
        </linearGradient>
      </defs>
      <rect x="6" y="14" width="52" height="36" rx="3" fill="url(#env)" stroke="#3b5070" />
      <path d="M6 18 l26 18 l26 -18" fill="none" stroke="#3b5070" strokeWidth="1.5" />
      <path d="M6 50 l22 -16 l4 3 l4 -3 l22 16 z" fill="rgba(0,0,0,0.05)" />
      <circle cx="48" cy="40" r="6" fill="#7fd3ff" stroke="#1f4f86" />
      <text
        x="48"
        y="43"
        textAnchor="middle"
        fontFamily="Segoe UI, sans-serif"
        fontSize="7"
        fontWeight="700"
        fill="#0e2848"
      >
        @
      </text>
    </Wrap>
  );
});

/* ── Recycle Bin (transparent bin with arrows) ───────────────────────────── */
export const RecycleBinIcon = memo(function RecycleBinIcon(p: Props) {
  return (
    <Wrap {...p}>
      <defs>
        <linearGradient id="bin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(180,220,255,0.85)" />
          <stop offset="100%" stopColor="rgba(70,130,200,0.55)" />
        </linearGradient>
      </defs>
      {/* lid */}
      <ellipse cx="32" cy="14" rx="22" ry="4" fill="#cfe0f5" stroke="#3b5070" />
      {/* body */}
      <path
        d="M12 14 l4 42 q1 4 5 4 h22 q4 0 5 -4 l4 -42 z"
        fill="url(#bin)"
        stroke="#1f4f86"
      />
      {/* recycling arrows */}
      <g stroke="#1f4f86" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M22 28 q4 -6 10 -6 l4 3 l-1 -7 l-7 1 l3 4 q-7 0 -11 7" />
        <path d="M42 38 q-4 6 -10 6 l-4 -3 l1 7 l7 -1 l-3 -4 q7 0 11 -7" />
      </g>
    </Wrap>
  );
});

/* ── Terminal (black window with caret) ──────────────────────────────────── */
export const TerminalIcon = memo(function TerminalIcon(p: Props) {
  return (
    <Wrap {...p}>
      <defs>
        <linearGradient id="term-frame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfd8e6" />
          <stop offset="100%" stopColor="#7588a8" />
        </linearGradient>
      </defs>
      <rect x="6" y="10" width="52" height="44" rx="3" fill="url(#term-frame)" stroke="#1f2a44" />
      <rect x="8" y="18" width="48" height="34" rx="1" fill="#0a0f1c" />
      <text
        x="14"
        y="34"
        fontFamily="ui-monospace, Menlo, Consolas, monospace"
        fontSize="9"
        fill="#7be57b"
      >
        &gt;_
      </text>
      <text
        x="14"
        y="46"
        fontFamily="ui-monospace, Menlo, Consolas, monospace"
        fontSize="6"
        fill="#7be57b"
        opacity="0.6"
      >
        run
      </text>
      <circle cx="11" cy="14" r="1.4" fill="#ff6b6b" />
      <circle cx="15" cy="14" r="1.4" fill="#ffd75a" />
      <circle cx="19" cy="14" r="1.4" fill="#7be57b" />
    </Wrap>
  );
});

/* ── Doom (skull / red shield) ───────────────────────────────────────────── */
export const DoomIcon = memo(function DoomIcon(p: Props) {
  return (
    <Wrap {...p}>
      <defs>
        <radialGradient id="doom-bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ff8a4a" />
          <stop offset="60%" stopColor="#a31616" />
          <stop offset="100%" stopColor="#3a0606" />
        </radialGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="4" fill="url(#doom-bg)" stroke="#1a0303" />
      {/* skull */}
      <path
        d="M32 16 c-10 0 -16 7 -16 16 c0 6 3 9 6 11 v6 h6 v-4 h2 v4 h4 v-4 h2 v4 h6 v-6 c3 -2 6 -5 6 -11 c0 -9 -6 -16 -16 -16 z"
        fill="#f5e9d6"
        stroke="#1a0303"
        strokeWidth="1.5"
      />
      <ellipse cx="26" cy="32" rx="3" ry="4" fill="#1a0303" />
      <ellipse cx="38" cy="32" rx="3" ry="4" fill="#1a0303" />
      <path d="M30 40 q2 2 4 0" stroke="#1a0303" strokeWidth="1.5" fill="none" />
    </Wrap>
  );
});

/* ── Minecraft (grass-block isometric cube) ──────────────────────────────── */
export const MinecraftIcon = memo(function MinecraftIcon(p: Props) {
  return (
    <Wrap {...p}>
      <defs>
        <pattern id="grass-top" patternUnits="userSpaceOnUse" width="6" height="6">
          <rect width="6" height="6" fill="#5fa83b" />
          <rect width="3" height="3" fill="#74c44a" />
          <rect x="3" y="3" width="3" height="3" fill="#4f8d2f" />
        </pattern>
        <pattern id="grass-side" patternUnits="userSpaceOnUse" width="6" height="6">
          <rect width="6" height="2" fill="#5fa83b" />
          <rect y="2" width="6" height="4" fill="#8b5a2b" />
          <rect x="2" y="3" width="2" height="2" fill="#6a4220" />
        </pattern>
      </defs>
      {/* top face */}
      <path d="M32 8 L56 20 L32 32 L8 20 z" fill="url(#grass-top)" stroke="#1a2e10" />
      {/* left face */}
      <path d="M8 20 L32 32 L32 56 L8 44 z" fill="url(#grass-side)" stroke="#3b2208" />
      {/* right face — slightly darker for depth */}
      <path d="M56 20 L32 32 L32 56 L56 44 z" fill="url(#grass-side)" stroke="#3b2208" opacity="0.85" />
      {/* edge highlight */}
      <path d="M8 20 L32 32 L56 20" stroke="rgba(255,255,255,0.25)" fill="none" />
    </Wrap>
  );
});

/* ── About (user profile circle) ─────────────────────────────────────────── */
export const AboutIcon = memo(function AboutIcon(p: Props) {
  return (
    <Wrap {...p}>
      <defs>
        <radialGradient id="profile-bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#cfe7ff" />
          <stop offset="100%" stopColor="#3b6ea2" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="26" fill="url(#profile-bg)" stroke="#1f4f86" />
      <circle cx="32" cy="26" r="9" fill="#fff7e8" stroke="#1f4f86" strokeWidth="1.5" />
      <path d="M14 54 c4 -10 12 -14 18 -14 s14 4 18 14" fill="#fff7e8" stroke="#1f4f86" strokeWidth="1.5" />
    </Wrap>
  );
});

/* ── GitHub ──────────────────────────────────────────────────────────────── */
export const GitHubIcon = memo(function GitHubIcon(p: Props) {
  return (
    <Wrap {...p}>
      <defs>
        <linearGradient id="gh-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4658" />
          <stop offset="100%" stopColor="#161b22" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="10" fill="url(#gh-bg)" stroke="#0a0d12" />
      <path
        d="M32 16 c-9 0 -16 7 -16 16 c0 7 4 13 11 15 c.8 .15 1 -.4 1 -.8 v-3 c-4 1 -5 -2 -5 -2 c-1 -2 -2 -2 -2 -2 c-1 -1 0 -1 0 -1 c1 0 2 1 2 1 c1 2 3 1 4 1 c0 -1 0 -2 1 -2 c-3 0 -7 -1 -7 -7 c0 -2 1 -3 2 -4 c0 -1 -1 -2 0 -4 c0 0 1 0 4 1 c1 0 3 -.5 4 -.5 s3 .5 4 .5 c3 -1 4 -1 4 -1 c1 2 0 3 0 4 c1 1 2 2 2 4 c0 6 -4 7 -7 7 c1 1 1 2 1 3 v4 c0 .4 .2 1 1 .8 c7 -2 11 -8 11 -15 c0 -9 -7 -16 -16 -16 z"
        fill="#ffffff"
      />
    </Wrap>
  );
});

/* ── LinkedIn ────────────────────────────────────────────────────────────── */
export const LinkedInIcon = memo(function LinkedInIcon(p: Props) {
  return (
    <Wrap {...p}>
      <rect x="6" y="6" width="52" height="52" rx="6" fill="#0a66c2" />
      <rect x="14" y="22" width="8" height="28" fill="#fff" />
      <circle cx="18" cy="16" r="4" fill="#fff" />
      <path
        d="M28 22 h7 v4 c2 -3 5 -5 9 -5 c6 0 8 4 8 10 v19 h-8 v-17 c0 -3 -1 -5 -4 -5 s-4 2 -4 5 v17 h-8 z"
        fill="#fff"
      />
    </Wrap>
  );
});
