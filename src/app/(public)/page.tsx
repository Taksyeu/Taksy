import { Section } from '@/components/layout/Section';
import { CTA } from '@/components/landing/CTA';
import { FareCalculator } from '@/components/landing/FareCalculator';
import { HeroBooking } from '@/components/landing/HeroBooking';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { SponsorTiers } from '@/components/landing/SponsorTiers';

export default function Page() {
  return (
    <div>
      <Section tone="white" className="border-t-0">
        <HeroBooking />
      </Section>

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
