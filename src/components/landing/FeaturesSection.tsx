import * as React from 'react';

type Feature = {
  title: string;
  body: string;
  icon: React.ReactNode;
};

const features: Feature[] = [
  {
    title: 'Platform dat Verbindt',
    body: 'TAKSY richt zich op verbinden in plaats van maximaliseren. Het platform faciliteert ritten, maar laat ruimte voor samenwerking tussen chauffeurs, reizigers en lokale markten.',
    icon: <IconLink />,
  },
  {
    title: 'Lokale Rittoedeling',
    body: 'Het platform houdt rekening met regio en beschikbaarheid om lokale chauffeurs te beschermen. Zo blijft werk eerlijk verdeeld, ook bij ritten over stads- of regiogrenzen.',
    icon: <IconMapPin />,
  },
  {
    title: 'Abonnementsmodel',
    body: 'In tegenstelling tot gangbare commissiemodellen bij Uber en Bolt werkt TAKSY met een vast abonnementsmodel, zonder afdracht per rit en met voorspelbare kosten.',
    icon: <IconCreditCard />,
  },
  {
    title: 'Vrije Prijsinstelling',
    body: 'Chauffeurs behouden binnen duidelijke kaders invloed op hun tarieven. Dit biedt flexibiliteit zonder chaos en sluit beter aan op lokale vraag en omstandigheden.',
    icon: <IconSliders />,
  },
  {
    title: 'Inzicht in Inkomsten',
    body: 'Heldere dashboards tonen inkomsten en ritten zonder verborgen berekeningen. Chauffeurs zien direct waar ze aan toe zijn, zonder prestatiedruk of onduidelijkheid.',
    icon: <IconChart />,
  },
  {
    title: 'Gebouwd uit Ervaring',
    body: 'Elke functie is gevormd vanuit jarenlange ervaring op de weg. Geen theorie, maar een platform gebouwd rond wat in de dagelijkse praktijk werkt.',
    icon: <IconSpark />,
  },
];

export function FeaturesSection() {
  return (
    <section id="how-it-works" className="w-full bg-[#F3F3F3] py-[180px]">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Top intro block */}
        <div className="relative pt-6">
          <div
            className="pointer-events-none absolute left-0 top-0 -z-10 select-none text-[120px] font-bold leading-none text-black/[0.04] sm:text-[140px] md:text-[120px] lg:text-[140px]"
            aria-hidden="true"
          >
            02
          </div>

          <div className="mx-0 flex w-full max-w-[794px] flex-col items-start text-left lg:mx-auto lg:items-start lg:text-left">
            <div className="mb-4 text-xs uppercase tracking-widest text-black/50">
              PLATFORM MOGELIJKHEDEN
            </div>

            <h2 className="text-balance text-[36px] font-bold leading-[39.6px] tracking-tight text-black lg:text-[48px] lg:leading-[50.4px]">
              Wat TAKSY platform anders maakt
            </h2>

            <div className="max-w-[576px]">
              <p className="mt-3 text-pretty text-base leading-relaxed text-black/70">
                Een samenhangend platform gebouwd vanuit praktijkervaring — gericht op eerlijke ritverdeling, voorspelbare kosten en lokale balans. Geen losse modules, geen complexe integraties, maar één helder systeem.
              </p>
            </div>
          </div>
        </div>

        {/* Grid block (main white card) */}
        <div className="mt-[100px] bg-white">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 [&>*]:border-black/10 [&>*]:border-t [&>*:first-child]:border-t-0 md:[&>*]:border-0 md:[&>*]:border-black/10 md:[&>*:nth-child(n+3)]:border-t md:[&>*:nth-child(2n)]:border-l lg:[&>*]:border-0 lg:[&>*]:border-black/10 lg:[&>*:nth-child(n+4)]:border-t lg:[&>*:not(:nth-child(3n+1))]:border-l"
          >
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-8 text-left transition-colors duration-200 ease-out lg:hover:bg-black/[0.02]"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-black/70 transition-colors duration-200 ease-out lg:group-hover:bg-black/[0.06] lg:group-hover:text-black">
                  {feature.icon}
                </div>

                <div className="mt-1 text-[18px] font-semibold leading-[28px] text-black">{feature.title}</div>
                <p className="mt-2 text-base text-black/70">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function IconLink() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0 0-7.07 5 5 0 0 0-7.07 0L10 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.07 0L5.5 12.43a5 5 0 0 0 0 7.07 5 5 0 0 0 7.07 0L14 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconCreditCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
      <path d="M7 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconSliders() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 21V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 10V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 21V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 8V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 21V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 12V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 19V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 19H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M12 2l1.4 5.2L18.6 9 13.4 10.4 12 15.6 10.6 10.4 5.4 9l5.2-1.8L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M5 14l.8 3 3 .8-3 .8-.8 3-.8-3-3-.8 3-.8.8-3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
