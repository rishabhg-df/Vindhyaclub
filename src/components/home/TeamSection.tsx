import { Section } from '@/components/shared/Section';
import { TeamMemberCard } from '@/components/shared/TeamMemberCard';
import { team } from '@/lib/data';

export function TeamSection() {
  return (
    <Section title="Our Management Team" id="team">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member, index) => (
          <TeamMemberCard key={index} member={member} />
        ))}
      </div>
    </Section>
  );
}
