import * as React from 'react';

import { cn } from '@/lib/utils/cn';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-xl border border-black/10 bg-white p-6 shadow-sm', className)}
      {...props}
    />
  );
}
