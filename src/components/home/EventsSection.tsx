
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/shared/Section';
import { events } from '@/lib/data';

export function EventsSection({ className }: { className?: string }) {
  const latestEvent = events[0];

  return (
    <Section title="OUR EVENT" id="events" className={className}>
      <div className="overflow-hidden rounded-lg bg-white text-black shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center p-8">
            <h3 className="mb-2 font-headline text-2xl font-bold text-primary">
              {latestEvent.title} {new Date(latestEvent.date).getFullYear()}-{new Date(latestEvent.date).getMonth() + 1}-{new Date(latestEvent.date).getDate()}
            </h3>
            <p className="mb-4">
              {new Date(latestEvent.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              (No Entry After 00:00)
            </p>
            <p className="mb-6 ">
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
          <div className="min-h-[300px]">
            <Image
              src={latestEvent.image}
              alt={latestEvent.title}
              data-ai-hint={latestEvent.imageHint}
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
