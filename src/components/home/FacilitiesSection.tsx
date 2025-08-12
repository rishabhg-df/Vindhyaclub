import { Section } from '@/components/shared/Section';
import { FacilityCard } from '@/components/shared/FacilityCard';
import { facilities } from '@/lib/data';

export function FacilitiesSection() {
  return (
    <Section title="Our Facilities" id="facilities">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {facilities.map((facility, index) => (
          <FacilityCard key={index} facility={facility} />
        ))}
      </div>
    </Section>
  );
}
