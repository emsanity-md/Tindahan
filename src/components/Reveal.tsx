"use client";

import type { ReactNode } from "react";
import AnimatedContent from "./AnimatedContent";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

/**
 * GSAP drives its tweens with rAF, not CSS animations — so the global
 * prefers-reduced-motion rule in globals.css does not stop it. This wrapper
 * detects the preference and renders children plainly when it's set.
 */
export function Reveal({
  children,
  className,
  distance = 24,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  delay?: number;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatedContent
      distance={distance}
      delay={delay}
      duration={0.6}
      ease="power2.out"
      className={className}
    >
      {children}
    </AnimatedContent>
  );
}
