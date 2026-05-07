"use client";

import { useEffect, useState } from "react";
import { useDesktop, type AppId } from "@/lib/store";
import { useVisibility } from "@/lib/useVisibility";
import { setAudioEnabled } from "@/lib/sound";
import { APPS } from "@/lib/apps";
import BootSequence from "./BootSequence";
import Desktop from "./Desktop";
import MobileFallback from "./MobileFallback";

export default function Shell() {
  const booted = useDesktop((s) => s.booted);
  const setBooted = useDesktop((s) => s.setBooted);
  const setReducedMotion = useDesktop((s) => s.setReducedMotion);
  const open = useDesktop((s) => s.open);
  const audioEnabled = useDesktop((s) => s.audioEnabled);
  const [isMobile, setIsMobile] = useState(false);

  useVisibility();

  useEffect(() => {
    setAudioEnabled(audioEnabled);
  }, [audioEnabled]);

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const onMotion = () => setReducedMotion(mqMotion.matches);
    const onMobile = () => setIsMobile(mqMobile.matches);
    onMotion();
    onMobile();
    mqMotion.addEventListener("change", onMotion);
    mqMobile.addEventListener("change", onMobile);
    return () => {
      mqMotion.removeEventListener("change", onMotion);
      mqMobile.removeEventListener("change", onMobile);
    };
  }, [setReducedMotion]);

  // Terminal `open <app>` command bridge
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail as AppId;
      if (APPS[id]) open(APPS[id]);
    };
    window.addEventListener("retro:open", onOpen);
    return () => window.removeEventListener("retro:open", onOpen);
  }, [open]);

  if (isMobile) return <MobileFallback />;

  return (
    <main id="desktop-main" className="relative h-screen w-screen overflow-hidden">
      {!booted ? <BootSequence onDone={() => setBooted(true)} /> : <Desktop />}
    </main>
  );
}
