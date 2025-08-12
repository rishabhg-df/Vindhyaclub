import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import type { Service } from '@/lib/types';

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;
  return (
    <Card className="h-full text-center transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/20">
      <CardHeader>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-8 w-8" />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="mb-2 font-headline text-xl">{service.title}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
