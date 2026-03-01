import { sponsorTiers } from '@/lib/constants/sponsors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function SponsorTiers() {
  return (
    <div>
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-black">Sponsor structure</h2>
        <p className="mt-3 text-base text-black/70">
          Phase 1: display-only tiers. Stripe subscription setup is prepared conceptually, not implemented.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {sponsorTiers.map((tier) => (
          <Card
            key={tier.id}
            className="flex flex-col transition-colors duration-200 hover:border-black/20"
          >
            <div className="flex-1">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-base font-semibold text-black">{tier.name}</h3>
                  <p className="mt-1 text-sm text-black/60">{tier.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-black">{tier.priceLabel}</div>
                </div>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-black/70">
                {tier.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-black" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <Button
                variant={tier.id === 'custom' ? 'secondary' : 'primary'}
                className="w-full"
                href="#cta"
              >
                {tier.ctaLabel}
              </Button>
              <p className="mt-2 text-center text-xs text-black/50">Mock CTA — payments not enabled.</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
