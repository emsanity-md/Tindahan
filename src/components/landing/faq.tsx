import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/Reveal";

const FAQS = [
  {
    q: "Is this a real product?",
    a: "No, it is a demo. There is no server, no real store connected to it, and no data is collected about you. The products and sales you see are sample data built into the app.",
  },
  {
    q: "Does my data survive a refresh?",
    a: "No. Everything lives in your browser's memory for the length of the session, so refreshing restores the original sample catalog. You will get a prompt before reloading with items in the cart, and there is a Reset demo data button whenever you want to start over.",
  },
  {
    q: "Do I need a barcode scanner?",
    a: "No. You find products by typing part of the name, which is why search is built for partial words — typing sanmig will find San Miguel Pale Pilsen.",
  },
  {
    q: "What can I run it on?",
    a: "Any device with a browser — phone, tablet, or laptop. The demo needs an internet connection only to load the page.",
  },
  {
    q: "How much does it cost?",
    a: "Nothing yet. This demo is free, and Tindahan is not charging for anything at this stage.",
  },
];

export function Faq() {
  return (
    <Section id="faq">
      <Container>
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-16">
          <Reveal>
            <div>
              <h2 className="text-3xl sm:text-4xl">Questions</h2>
              <p className="mt-4 text-muted-foreground">
                Including the one that matters most about this build.
              </p>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-2" delay={0.08}>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className="text-left">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
