import { Section } from '@/components/shared/Section';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { services } from '@/lib/data';

export function ServicesSection() {
  return (
    <Section title="Our Services" id="services" className="bg-card">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} />
        ))}
      </div>
    </Section>
  );
}
