import { Hero } from '@/components/shared/Hero';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';

export default function FacilitiesPage() {
  return (
    <>
      <Hero
        imageUrl="https://images.unsplash.com/photo-1540496905036-5937c10647cc?q=80&w=1920&auto=format=fit=crop"
        imageHint="modern gym"
        title=""
        subtitle="Discover top-notch facilities designed to elevate your game and inspire greatness!"
        height="h-[calc(100vh-5rem)]"
      />
      <FacilitiesSection />
    </>
  );
}
