import { Hero } from '@/components/shared/Hero';
import { EventsSection } from '@/components/home/EventsSection';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';
import { TeamSection } from '@/components/home/TeamSection';
import { WelcomeSection } from '@/components/home/WelcomeSection';

export default function Home() {
  return (
    <>
      <Hero
        imageUrl="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1920&auto=format=fit=crop"
        imageHint="tennis court sunset"
        title=""
        subtitle="Join our sports club today - where passion, skill, and community thrive!"
        height="h-[calc(100vh-5rem)]"
      />
      <WelcomeSection />
      <EventsSection />
      <FacilitiesSection />
      <TeamSection />
    </>
  );
}
