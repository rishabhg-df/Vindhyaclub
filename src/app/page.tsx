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
        imageUrl="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1920&auto=format=fit=crop"
        imageHint="resort pool"
        title=""
        subtitle="Join our sports club today - where passion, skill, and community thrive!"
        height="h-[calc(100vh-5rem)]"
      />
      <WelcomeSection />
      <EventsSection className="bg-card" />
      <ServicesSection />
      <FacilitiesSection className="bg-card" />
      <TeamSection />
    </>
  );
}
