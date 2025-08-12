import { Section } from '@/components/shared/Section';
import { FacilityCard } from '@/components/shared/FacilityCard';
import { facilities } from '@/lib/data';

export function FacilitiesSection() {
  return (
    <Section title="Our Facilities" id="facilities">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {facilities.map((facility, index) => (
          <FacilityCard
            key={index}
            facility={facility}
            isEven={index % 2 === 0}
          />
        ))}
      </div>
    </Section>
  );
}
