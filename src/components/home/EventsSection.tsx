
'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Section } from '@/components/shared/Section';
import { useEvents } from '@/context/EventContext';
import { Card } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { format, parseISO } from 'date-fns';

export function EventsSection({ className }: { className?: string }) {
  const { events, loading } = useEvents();

  if (loading) {
    return (
      <Section title="Our Events" id="events" className={className}>
        <div className="flex justify-center">
          <Skeleton className="h-[400px] w-full max-w-4xl" />
        </div>
      </Section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <Section title="Our Events" id="events" className={className}>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="mx-auto w-full max-w-4xl"
      >
        <CarouselContent>
          {events.map((event, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="overflow-hidden bg-card text-card-foreground shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="flex flex-col justify-center p-8">
                      <h3 className="mb-2 font-headline text-2xl font-bold text-primary">
                        {event.title}
                      </h3>
                      <p className="mb-4 text-muted-foreground">
                        {format(parseISO(event.date), 'PPP')}
                        {event.entryTime &&
                          ` (No Entry After ${event.entryTime})`}
                      </p>
                      <p className="mb-6">{event.description}</p>
                    </div>
                    <div className="relative min-h-[300px]">
                      <Image
                        src={event.imageUrl || 'https://placehold.co/800x600.png'}
                        alt={event.title}
                        data-ai-hint={event.imageHint}
                        fill
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Section>
  );
}
