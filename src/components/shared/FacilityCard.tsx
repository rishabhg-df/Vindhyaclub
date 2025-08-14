import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Facility } from '@/lib/types';

type FacilityCardProps = {
  facility: Facility;
};

export function FacilityCard({ facility }: FacilityCardProps) {
  return (
    <Card className="h-full overflow-hidden text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
      <CardHeader className="p-0">
        <Image
          src={facility.image}
          alt={facility.name}
          data-ai-hint={facility.imageHint}
          width={600}
          height={400}
          className="h-56 w-full object-cover"
        />
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="font-headline text-2xl font-bold text-primary">
          {facility.name}
        </CardTitle>
        <CardDescription className="mt-2 text-muted-foreground">
          {facility.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
