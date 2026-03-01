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
        <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex w-full flex-col justify-between gap-14">
            <HeroBooking />

            {/* Metrics strip (Section 1 only) */}
            <div className="mx-auto w-full max-w-[320px] md:max-w-none">
              <div className="grid gap-10 sm:gap-12 md:grid-cols-4">
                <div className="hidden md:block" />

                <div className="text-left">
                  <div className="text-4xl font-bold tracking-tight text-black sm:text-5xl">15.000+</div>
                  <div className="mt-2 text-xs font-medium uppercase tracking-wider text-black/50">
                    RITTEN
                  </div>
                </div>

                <div className="text-left">
                  <div className="text-4xl font-bold tracking-tight text-black sm:text-5xl">8+</div>
                  <div className="mt-2 text-xs font-medium uppercase tracking-wider text-black/50">
                    JAAR ACTIEF
                  </div>
                </div>

                <div className="text-left">
                  <div className="text-4xl font-bold tracking-tight text-black sm:text-5xl">4,96★</div>
                  <div className="mt-2 text-xs font-medium uppercase tracking-wider text-black/50">
                    BEOORDELING
                  </div>
                </div>
              </div>
            </div>
          </div>
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
