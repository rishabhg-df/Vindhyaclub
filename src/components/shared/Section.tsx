import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type SectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Section({ title, children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('py-12 md:py-20', className)}>
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="mb-10 text-center font-headline text-3xl font-bold md:text-4xl">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
