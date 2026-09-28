import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/Reveal";

export function Cta() {
  return (
    <Section tone="paper" className="border-t">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl">Put the notebook away.</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Add your products, record your first sale, and let Tindahan keep
            the numbers.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/pos">
              Try the demo
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
