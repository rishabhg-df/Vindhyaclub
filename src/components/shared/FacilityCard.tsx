import Image from 'next/image';
import { Card } from '@/components/ui/card';
import type { Facility } from '@/lib/types';

type FacilityCardProps = {
  facility: Facility;
};

export function FacilityCard({ facility }: FacilityCardProps) {
  return (
    <Card className="group relative h-64 overflow-hidden rounded-lg">
      <Image
        src={facility.image}
        alt={facility.name}
        data-ai-hint={facility.imageHint}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative flex h-full items-center justify-center">
        <h3 className="font-headline text-2xl font-bold text-white">{facility.name}</h3>
      </div>
    </Card>
  );
}
