import * as React from 'react';

import { FareCalculator } from '@/components/landing/FareCalculator';

type Metric = {
  value: string;
  label: string;
};

const metrics: Metric[] = [
  { value: '8+', label: 'JAAR ACTIEF BIJ UBER & BOLT' },
  { value: '15.000+', label: 'RITTEN GEREDEN' },
  { value: '4.96★', label: 'GEMIDDELDE BEOORDELING' },
  { value: '7.000+', label: 'VIJFSTERRENRITTEN' },
];

export function TrackRecordSection() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="mx-auto flex w-full max-w-[794px] flex-col items-start text-left">
          <div className="mb-4 text-xs uppercase tracking-widest text-black/50">TRACK RECORD</div>

          <h2 className="text-balance text-[36px] font-bold leading-[39.6px] tracking-tight text-black lg:text-[48px] lg:leading-[50.4px]">
            Gebouwd op Praktijkervaring
          </h2>

          <div className="max-w-[576px]">
            <p className="mt-3 text-pretty text-base leading-relaxed text-black/70">
              TAKSY is geboren uit praktijkervaring — niet uit theorie. De basis van het platform ligt in jarenlange
              ervaring als chauffeur, opgebouwd onder de naam AfariCab en dagelijks gewerkt binnen bestaande
              taxiplatforms zoals Uber en Bolt.
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, idx) => (
            <div
              key={metric.label}
              className={
                'py-8 md:px-6 lg:px-8' +
                (idx < 3 ? ' lg:border-r lg:border-black/10' : '') +
                (idx >= 2 ? ' md:border-t md:border-black/10 lg:border-t-0' : '')
              }
            >
              <div className="text-[48px] font-bold leading-[48px] text-black">{metric.value}</div>
              <div className="mt-3 text-xs font-medium uppercase tracking-wider text-black/50">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Image + text */}
        <div className="mt-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div className="w-full">
            <FareCalculator />
          </div>

          <div className="w-full max-w-[584px]">
            <h3 className="text-balance text-[28px] font-bold leading-[33.6px] tracking-tight text-black">
              Van Chauffeur naar Platform
            </h3>

            <p className="mt-4 text-pretty text-base leading-relaxed text-black/70">
              In 2018 ben ik AfariCab gestart als zzp’er en actief geworden als chauffeur binnen Uber en later ook
              Bolt. Na duizenden ritten werd duidelijk wat goed werkt binnen bestaande taxiplatforms, maar ook
              waar chauffeurs vastlopen door beperkte ruimte voor stabiliteit, keuze en voorspelbaarheid. Die
              praktijkervaring liet zien dat de techniek vaak klopt, maar het model niet altijd meebeweegt met de
              realiteit van chauffeurs en reizigers. Vanuit dat inzicht ontstond TAKSY. Geen breuk met wat bestaat,
              maar een doorontwikkeling die voortbouwt op bewezen systemen, met andere uitgangspunten. Minder
              druk per rit, meer overzicht en een platform waarin chauffeurs en reizigers centraal staan. TAKSY wordt
              gebouwd door iemand die het werk kent, omdat hij het zelf jarenlang heeft gedaan.
            </p>

            <div className="mt-6 h-px w-full bg-black/10" />

            <div className="mt-6 text-xs font-medium uppercase tracking-wider text-black/50">GEWERKT IN DE STEDEN</div>
            <div className="mt-2 text-sm leading-relaxed text-black/70">
              Amsterdam · Rotterdam · Tilburg · Eindhoven · Den Haag · Utrecht · Hoofddorp
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
