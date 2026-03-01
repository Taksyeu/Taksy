import Link from 'next/link';
import * as React from 'react';

import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'secondary';

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkProps = CommonProps & {
  href: string;
  onClick?: never;
};

export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', className, children } = props;

  const base =
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ' +
    'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed';

  const styles =
    variant === 'primary'
      ? 'bg-black text-white hover:bg-black/90'
      : 'bg-white text-black border border-black/20 hover:border-black/50';

  const cls = cn(base, styles, className);

  const href = (props as Partial<LinkProps>).href;
  if (typeof href === 'string') {
    return (
      <Link className={cls} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
