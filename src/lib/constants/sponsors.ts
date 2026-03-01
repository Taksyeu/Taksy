export type SponsorTier = {
  id: 'individual' | 'business' | 'custom';
  name: string;
  priceLabel: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
};

export const sponsorTiers: SponsorTier[] = [
  {
    id: 'individual',
    name: 'Individual Supporter',
    priceLabel: '£9 / month',
    description: 'Support the mission and help us ship faster.',
    bullets: ['Early access updates', 'Supporter badge', 'Priority feedback channel'],
    ctaLabel: 'Become a supporter',
  },
  {
    id: 'business',
    name: 'Business Supporter',
    priceLabel: '£49 / month',
    description: 'For local businesses backing safer, smarter transport.',
    bullets: ['Logo in sponsor wall', 'Quarterly roadmap call', 'Priority partnership review'],
    ctaLabel: 'Support as a business',
  },
  {
    id: 'custom',
    name: 'Custom Partner',
    priceLabel: 'Let’s talk',
    description: 'Strategic partnerships and city-level deployments.',
    bullets: ['Custom SLA planning', 'Integration planning', 'Dedicated success contact'],
    ctaLabel: 'Contact partnership',
  },
];
