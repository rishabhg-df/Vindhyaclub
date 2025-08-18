'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/shared/Section';
import { useEvents } from '@/context/EventContext';
import { Card, CardContent } from '@/components/ui/card';

export function EventsSection({ className }: { className?: string }) {
  const { events } = useEvents();

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
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        {event.entryTime && ` (No Entry After ${event.entryTime})`}
                      </p>
                      <p className="mb-6">{event.description}</p>
                    </div>
                    <div className="relative min-h-[300px]">
                      <Image
                        src={event.image}
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
