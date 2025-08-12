import { Hero } from '@/components/shared/Hero';
import { EventsSection } from '@/components/home/EventsSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';
import { TeamSection } from '@/components/home/TeamSection';
import { WelcomeSection } from '@/components/home/WelcomeSection';

export default function Home() {
  return (
    <>
      <Hero
        imageUrl="https://placehold.co/1920x1080.png"
        imageHint="resort pool"
        title=""
        subtitle=""
        height="h-[calc(100vh-5rem)]"
      />
      <WelcomeSection />
      <EventsSection />
      <ServicesSection />
      <FacilitiesSection />
      <TeamSection />
    </>
  );
}
