"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

/**
 * Animated sale feed.
 *
 * This replaces the React Bits `AnimatedList`, which was a poor fit here: it
 * hard-codes a 500px width and a dark palette (#120F17), bakes in gradients,
 * and installs a window-level Tab handler that calls preventDefault() — which
 * breaks keyboard navigation across the whole app. The animation is worth
 * keeping, the component is not, so this is a small motion-based equivalent
 * that uses the app's own tokens.
 */
export function SaleFeed({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-2">{children}</ul>;
}

export function SaleFeedItem({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <li>{children}</li>;
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
    >
      {children}
    </motion.li>
  );
}
