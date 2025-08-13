import { Hero } from '@/components/shared/Hero';
import { EventsSection } from '@/components/home/EventsSection';

export default function EventsPage() {
  return (
    <>
      <Hero
        imageUrl="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1920&auto=format=fit=crop"
        imageHint="cheering crowd"
        title=""
        subtitle="Experience the thrill of the game – unforgettable events, lasting memories!"
        height="h-[70vh]"
      />
      <EventsSection />
    </>
  );
}
