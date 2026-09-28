import { LandingNav } from "@/components/landing/landing-nav";
import { DemoNotice } from "@/components/landing/demo-notice";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Faq } from "@/components/landing/faq";
import { Cta } from "@/components/landing/cta";
import { LandingFooter } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <DemoNotice />
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Faq />
        <Cta />
      </main>
      <LandingFooter />
    </div>
  );
}
