"use client";

import BlurTextRaw from "./BlurText";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

/**
 * BlurText animates via framer-motion inline styles, which the global reduced
 * motion rule can't override either. Render the plain headline when the user
 * has asked for less motion.
 */
export function HeroHeading({ text }: { text: string }) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <>{text}</>;
  }

  return (
    <BlurTextRaw
      text={text}
      delay={70}
      animateBy="words"
      direction="top"
      /*
       * BlurText lays the words out as flex items, and flex item placement
       * ignores `text-align` entirely — a centred `text-center` on the h1 has
       * no effect on them, so the container has to centre itself. Without
       * this the headline packs hard left.
       */
      className="justify-center"
    />
  );
}
