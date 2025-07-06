'use client';

import { cn } from '@/lib/utils';

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function H1({ children, className }: HeadingProps) {
  const id = generateId(children as string);
  return (
    <h1 id={id} className={cn('scroll-mt-20', className)}>
      {children}
    </h1>
  );
}

export function H2({ children, className }: HeadingProps) {
  const id = generateId(children as string);
  return (
    <h2 id={id} className={cn('scroll-mt-20', className)}>
      {children}
    </h2>
  );
}

export function H3({ children, className }: HeadingProps) {
  const id = generateId(children as string);
  return (
    <h3 id={id} className={cn('scroll-mt-20', className)}>
      {children}
    </h3>
  );
}

export function H4({ children, className }: HeadingProps) {
  const id = generateId(children as string);
  return (
    <h4 id={id} className={cn('scroll-mt-20', className)}>
      {children}
    </h4>
  );
}

export function H5({ children, className }: HeadingProps) {
  const id = generateId(children as string);
  return (
    <h5 id={id} className={cn('scroll-mt-20', className)}>
      {children}
    </h5>
  );
}

export function H6({ children, className }: HeadingProps) {
  const id = generateId(children as string);
  return (
    <h6 id={id} className={cn('scroll-mt-20', className)}>
      {children}
    </h6>
  );
}
