import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/shared/Section';
import { events } from '@/lib/data';

export function EventsSection() {
  const latestEvent = events[0];

  return (
    <Section title="Our Event" id="events">
      <div className="overflow-hidden rounded-lg bg-card text-card-foreground shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center p-8">
            <h3 className="mb-2 font-headline text-2xl font-bold text-primary">
              {latestEvent.title}
            </h3>
            <p className="mb-4 text-muted-foreground">
              {new Date(latestEvent.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              (No Entry After 00:00)
            </p>
            <p className="mb-6 text-muted-foreground">
              {latestEvent.description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="#">Circular &raquo;</Link>
              </Button>
              <Button asChild variant="destructive">
                <Link href="/signin">Please Login To Book Your Event Tickets</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-full">
            <Image
              src={latestEvent.image}
              alt={latestEvent.title}
              data-ai-hint="new year party"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
