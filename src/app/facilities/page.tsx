import { Hero } from '@/components/shared/Hero';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';

export default function FacilitiesPage() {
  return (
    <>
      <Hero
        imageUrl="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1920&auto=format=fit=crop"
        imageHint="sports facilities"
        title=""
        subtitle=""
        height="h-[70vh]"
      />
      <FacilitiesSection className="bg-card" />
    </>
  );
}
