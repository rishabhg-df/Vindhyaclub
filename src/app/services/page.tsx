import { Hero } from '@/components/shared/Hero';
import { ServicesSection } from '@/components/home/ServicesSection';

export default function ServicesPage() {
  return (
    <>
      <Hero
        imageUrl="https://placehold.co/1920x1080.png"
        imageHint="personal trainer"
        title=""
        subtitle=""
        height="h-[70vh]"
      />
      <ServicesSection />
    </>
  );
}
