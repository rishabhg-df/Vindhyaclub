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
        imageHint="resort pool"
        title="Welcome to Vindhya Club"
        subtitle="Join our sports club today - where passion, skill, and community thrive!"
        height="h-[calc(100vh-5rem)]"
      />
      <EventsSection />
      <ServicesSection />
      <FacilitiesSection />
      <TeamSection />
    </>
  );
}
