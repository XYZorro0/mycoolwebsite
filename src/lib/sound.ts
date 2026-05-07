"use client";

// Tiny synthesized UI sounds via WebAudio — zero asset weight.
// Only creates an AudioContext on first user gesture, and suspends when idle.

let ctx: AudioContext | null = null;
let enabled = false;
let lastPlay = 0;

export function setAudioEnabled(v: boolean) {
  enabled = v;
  if (!v && ctx) {
    void ctx.suspend();
  }
}

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(freq: number, duration: number, type: OscillatorType = "square", gain = 0.04) {
  if (!enabled) return;
  // throttle to avoid overlap floods
  const now = performance.now();
  if (now - lastPlay < 25) return;
  lastPlay = now;

  const ac = ensureCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g);
  g.connect(ac.destination);
  const t = ac.currentTime;
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.start(t);
  osc.stop(t + duration);
}

export const sfx = {
  hover: () => blip(880, 0.04, "triangle", 0.02),
  click: () => blip(520, 0.06, "square", 0.03),
  open: () => {
    blip(440, 0.07, "sine", 0.04);
    setTimeout(() => blip(660, 0.07, "sine", 0.04), 60);
  },
  close: () => blip(220, 0.08, "sawtooth", 0.03),
  startup: () => {
    // short three-note flourish
    blip(330, 0.12, "sine", 0.05);
    setTimeout(() => blip(440, 0.12, "sine", 0.05), 130);
    setTimeout(() => blip(660, 0.18, "sine", 0.05), 280);
  },
};
