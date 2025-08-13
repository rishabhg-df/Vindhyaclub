import { Section } from '@/components/shared/Section';
import { FacilityCard } from '@/components/shared/FacilityCard';
import { facilities } from '@/lib/data';

export function FacilitiesSection({ className }: { className?: string }) {
  return (
    <Section title="Our Facilities" id="facilities" className={className}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {facilities.map((facility, index) => (
          <FacilityCard
            key={index}
            facility={facility}
          />
        ))}
      </div>
    </Section>
  );
}
