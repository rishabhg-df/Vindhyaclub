import { Hero } from '@/components/shared/Hero';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';

export default function FacilitiesPage() {
  return (
    <>
      <Hero
        imageUrl="https://placehold.co/1920x1080.png"
        imageHint="sports complex aerial"
        title=""
        subtitle=""
        height="h-[70vh]"
      />
      <FacilitiesSection />
    </>
  );
}
