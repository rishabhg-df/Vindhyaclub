import { Section } from '@/components/shared/Section';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { services } from '@/lib/data';

export function ServicesSection({ className }: { className?: string }) {
  return (
    <Section title="Our Services" id="services" className={className}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} />
        ))}
      </div>
    </Section>
  );
}
