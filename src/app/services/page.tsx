import { Hero } from '@/components/shared/Hero';
import { ServicesSection } from '@/components/home/ServicesSection';

export default function ServicesPage() {
  return (
    <>
      <Hero
        imageUrl="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1920&auto=format=fit=crop"
        imageHint="personal trainer"
        title=""
        subtitle="From training to teamwork — our services are here to help every member thrive."
        height="h-[70vh]"
      />
      <ServicesSection />
    </>
  );
}
