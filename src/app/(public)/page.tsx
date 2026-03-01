import { Section } from '@/components/layout/Section';
import { CTA } from '@/components/landing/CTA';
import { FareCalculator } from '@/components/landing/FareCalculator';
import { HeroBooking } from '@/components/landing/HeroBooking';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { SponsorTiers } from '@/components/landing/SponsorTiers';

export default function Page() {
  return (
    <div id="top">
      {/* Section 1 gets a custom layout wrapper (1200px max-width + near full-viewport height). */}
      <section className="w-full bg-white">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[1200px] items-center px-4 py-16 sm:px-6 lg:px-8">
          <HeroBooking />
        </div>
      </section>

      <Section id="how-it-works" tone="gray">
        <HowItWorks />
      </Section>

      <Section id="calculator" tone="white">
        <FareCalculator />
      </Section>

      <Section id="sponsors" tone="gray">
        <SponsorTiers />
      </Section>

      <Section id="cta" tone="white">
        <CTA />
      </Section>
    </div>
  );
}
