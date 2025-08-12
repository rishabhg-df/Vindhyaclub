import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Section } from '@/components/shared/Section';
import { EventCard } from '@/components/shared/EventCard';
import { events } from '@/lib/data';

export function EventsSection() {
  return (
    <Section title="Our Events" id="events">
      <div className="md:hidden">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {events.map((event, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <EventCard event={event} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="hidden grid-cols-1 gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </Section>
  );
}
