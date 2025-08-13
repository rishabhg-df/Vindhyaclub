import { Hero } from '@/components/shared/Hero';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';

export default function FacilitiesPage() {
  return (
    <>
      <Hero
        imageUrl="https://images.unsplash.com/photo-1596423403483-a7e4a119514e?q=80&w=1920&auto=format&fit=crop"
        imageHint="sports complex"
        title=""
        subtitle=""
        height="h-[70vh]"
      />
      <FacilitiesSection />
    </>
  );
}
