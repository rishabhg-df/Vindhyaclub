import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { HistoryItem } from '@/lib/types';

type HistoryCardProps = {
  item: HistoryItem;
};

export function HistoryCard({ item }: HistoryCardProps) {
  return (
    <Card className="overflow-hidden rounded-lg bg-card text-card-foreground shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-primary/20">
      <CardHeader className="rounded-t-lg bg-primary p-3 text-center text-primary-foreground">
        <CardTitle className="font-headline text-xl">{item.year}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <Image
            src={item.image}
            alt={item.year}
            data-ai-hint={item.imageHint}
            width={400}
            height={200}
            className="h-40 w-full rounded-md object-cover"
          />
        </div>
        <p className="text-center text-muted-foreground">{item.description}</p>
      </CardContent>
    </Card>
  );
}
