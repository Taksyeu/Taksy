import * as React from 'react';

import { cn } from '@/lib/utils/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-md border border-black/15 bg-white px-3 text-sm text-black ' +
          'placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20',
        className,
      )}
      {...props}
    />
  );
}
