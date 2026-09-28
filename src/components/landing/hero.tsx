import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HeroHeading } from "@/components/HeroHeading";
import { AppWindow } from "./app-window";

const HEADLINE = "Run your store without the notebook.";

const PROOF = [
  "No install or account needed",
  "Stock updates on every sale",
  "Sample store resets on refresh",
];

/**
 * The standard centered business hero: eyebrow pill, headline, subhead, two
 * actions, a short reassurance row, then the product screenshot running the
 * full width of the container and fading into the next section.
 *
 * The copy is centered rather than split, so the screenshot — not a text
 * column — is the widest thing on the page. `pb-0` is deliberate: it lets the
 * window's bottom edge reach the section boundary and dissolve into the
 * Features section below instead of floating in a band of empty padding.
 */
export function Hero() {
  return (
    <Section className="pt-10 pb-0 md:pt-14 lg:pt-16">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-tint px-3.5 py-1.5 text-xs font-semibold text-brand-strong">
            <span aria-hidden className="size-1.5 rounded-full bg-brand" />
            Inventory and POS for small stores
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl">
            <HeroHeading text={HEADLINE} />
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Tindahan keeps your products, stock levels, and every transaction
            in one place — so you know what&apos;s left on the shelf, what&apos;s
            selling, and when to restock.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 gap-2 px-6 text-base">
              <Link href="/pos">
                Try the demo
                <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            {PROOF.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="size-4 shrink-0 text-brand-strong" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="relative mt-12 md:mt-16">
        <Container>
          <AppWindow />
        </Container>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background"
        />
      </div>
    </Section>
  );
}
