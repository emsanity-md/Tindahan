import {
  Boxes,
  TrendingDown,
  Zap,
  ReceiptText,
  BellRing,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/Reveal";
import { RecentSalesPanel } from "./recent-sales-panel";

const FEATURES = [
  {
    icon: Boxes,
    title: "Product catalog",
    body: "Add a name, price, and category once. Use it every day after that.",
  },
  {
    icon: TrendingDown,
    title: "Live stock levels",
    body: "Stock goes down when you sell and up when you restock. The number on screen is the number you have.",
  },
  {
    icon: Zap,
    title: "Fast checkout",
    body: "Pick the items, confirm the total, take payment. No calculator, no guessing.",
  },
  {
    icon: BellRing,
    title: "Running low",
    body: "See what's about to run out before a customer has to ask.",
  },
];

export function Features() {
  return (
    <Section id="features">
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl">
              Everything a small store actually needs
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No enterprise overhead. Just the records you used to keep by
              hand, kept straight for you.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <Card className="h-full shadow-xs">
                <div className="p-6">
                  <span className="grid size-9 place-items-center rounded-md bg-brand-tint text-brand-strong">
                    <f.icon className="size-4.5" />
                  </span>
                  <h3 className="mt-4 text-lg">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
                </div>
              </Card>
            </Reveal>
          ))}

          {/* Transaction history spans the full width and carries the live
              feed — the motion here shows transactions arriving, which is
              the feature itself rather than decoration. */}
          <Reveal className="sm:col-span-2" delay={0.24}>
            <Card className="h-full shadow-xs">
              <div className="grid gap-6 p-6 md:grid-cols-2 md:items-center">
                <div>
                  <span className="grid size-9 place-items-center rounded-md bg-brand-tint text-brand-strong">
                    <ReceiptText className="size-4.5" />
                  </span>
                  <h3 className="mt-4 text-lg">Transaction history</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Every sale is written down the moment it happens: what was
                    bought, when, and for how much.
                  </p>
                </div>
                <RecentSalesPanel />
              </div>
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
