import { Hero } from '@/components/shared/Hero';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';

export default function FacilitiesPage() {
  return (
    <>
      <Hero
        imageUrl="https://placehold.co/1920x1080.png"
        imageHint="sports complex aerial"
        title="Our Facilities"
        subtitle="State-of-the-art facilities to support your athletic journey."
        height="h-[70vh]"
      />
      <FacilitiesSection />
    </>
  );
}
