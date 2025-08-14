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
    <Card className="group h-full overflow-hidden text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
      <CardHeader className="p-0">
        <Image
          src={facility.image}
          alt={facility.name}
          data-ai-hint={facility.imageHint}
          width={600}
          height={400}
          className="object-cover"
        />
      </CardHeader>
      <CardContent className="p-6 transition-colors duration-300 group-hover:bg-destructive">
        <CardTitle className="font-headline text-2xl font-bold text-primary group-hover:text-destructive-foreground">
          {facility.name}
        </CardTitle>
        <CardDescription className="mt-2 text-muted-foreground group-hover:text-destructive-foreground/80">
          {facility.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
