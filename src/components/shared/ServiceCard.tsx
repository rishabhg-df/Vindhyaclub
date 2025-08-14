import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Service } from '@/lib/types';

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden bg-card text-card-foreground shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="min-h-[200px]">
          <Image
            src={service.image}
            alt={service.title}
            data-ai-hint={service.imageHint}
            width={600}
            height={400}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center p-6">
          <h3 className="mb-2 font-headline text-2xl font-bold">
            {service.title}
          </h3>
          <p className="text-muted-foreground">{service.description}</p>
        </div>
      </div>
    </Card>
  );
}
