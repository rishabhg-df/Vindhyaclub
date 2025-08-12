import { Hero } from '@/components/shared/Hero';
import { EventsSection } from '@/components/home/EventsSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';
import { TeamSection } from '@/components/home/TeamSection';

export default function Home() {
  return (
    <>
      <Hero
        imageUrl="https://placehold.co/1920x1080.png"
        imageHint="sports club action"
        title="Welcome to Vindhya Club"
        height="h-[calc(100vh-5rem)]"
      />
      <EventsSection />
      <ServicesSection />
      <FacilitiesSection />
      <TeamSection />
    </>
  );
}
