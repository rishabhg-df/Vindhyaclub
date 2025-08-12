import { Hero } from '@/components/shared/Hero';
import { EventsSection } from '@/components/home/EventsSection';

export default function EventsPage() {
  return (
    <>
      <Hero
        imageUrl="https://placehold.co/1920x1080.png"
        imageHint="cheering crowd"
        title=""
        subtitle=""
        height="h-[70vh]"
      />
      <EventsSection />
    </>
  );
}
