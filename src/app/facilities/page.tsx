import { Hero } from '@/components/shared/Hero';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';

export default function FacilitiesPage() {
  return (
    <>
      <Hero
        imageUrl="https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1920&auto=format=fit=crop"
        imageHint="sports complex"
        title=""
        subtitle="Discover top-notch facilities designed to elevate your game and inspire greatness!"
        height="h-[calc(100vh-5rem)]"
      />
      <FacilitiesSection />
    </>
  );
}
