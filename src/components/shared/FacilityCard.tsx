import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Facility } from '@/lib/types';

type FacilityCardProps = {
  facility: Facility;
  isEven: boolean;
};

export function FacilityCard({ facility, isEven }: FacilityCardProps) {
  const imageContainerClass = isEven
    ? 'clip-triangle-bottom'
    : 'clip-triangle-top';
  const textOrderClass = isEven ? 'order-2' : 'order-1';
  const imageOrderClass = isEven ? 'order-1' : 'order-2';

  return (
    <div className="flex flex-col items-center text-center">
      <div className={cn('flex flex-col', textOrderClass)}>
        <h3 className="font-headline text-2xl font-bold text-primary">
          {facility.name}
        </h3>
        <p className="mt-2 max-w-xs text-muted-foreground">
          {facility.description}
        </p>
      </div>

      <div
        className={cn(
          'relative mt-4 h-64 w-full max-w-sm',
          imageContainerClass,
          imageOrderClass
        )}
      >
        <Image
          src={facility.image}
          alt={facility.name}
          data-ai-hint={facility.imageHint}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
