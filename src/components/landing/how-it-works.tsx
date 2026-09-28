import { ListPlus, ScanBarcode, LineChart } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/Reveal";

const STEPS = [
  {
    icon: ListPlus,
    title: "List your products",
    body: "Add what you sell with a price and category. You are set up after one sitting.",
  },
  {
    icon: ScanBarcode,
    title: "Ring up each sale",
    body: "Pick the items, confirm the total, take payment. Stock updates itself.",
  },
  {
    icon: LineChart,
    title: "Read your numbers",
    body: "See what sold today, what is left, and what you need to restock.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" tone="paper">
      <Container>
        <Reveal>
          <h2 className="max-w-2xl text-3xl sm:text-4xl">
            Three steps, then it runs itself
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <li className="border-t pt-5">
                <div className="flex items-center gap-3">
                  <span className="nums grid size-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <s.icon className="size-4.5 text-brand-strong" />
                </div>
                <h3 className="mt-4 text-lg">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
