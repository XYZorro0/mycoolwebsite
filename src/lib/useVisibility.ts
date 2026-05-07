"use client";

import { useEffect, useState } from "react";

// Reports document visibility and toggles a class on <html> so CSS can pause
// animations on hidden tabs (combined with `visibilitychange` on intervals).
export function useVisibility(): boolean {
  const [visible, setVisible] = useState(
    typeof document === "undefined" ? true : document.visibilityState === "visible"
  );

  useEffect(() => {
    const onChange = () => {
      const v = document.visibilityState === "visible";
      setVisible(v);
      document.documentElement.classList.toggle("is-hidden", !v);
    };
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return visible;
}
