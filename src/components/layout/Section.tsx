import * as React from 'react';

import { cn } from '@/lib/utils/cn';

type Tone = 'white' | 'gray';

type Props = {
  id?: string;
  tone: Tone;
  children: React.ReactNode;
  className?: string;
};

export function Section({ id, tone, children, className }: Props) {
  return (
    <section
      id={id}
      className={cn(
        'w-full border-t border-black/5',
        tone === 'gray' ? 'bg-[#F3F3F3]' : 'bg-white',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
