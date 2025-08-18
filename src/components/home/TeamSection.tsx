'use client';

import { Section } from '@/components/shared/Section';
import { TeamMemberCard } from '@/components/shared/TeamMemberCard';
import { useTeam } from '@/context/TeamContext';

export function TeamSection() {
  const { team } = useTeam();
  return (
    <Section title="Our Management Team" id="team">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </Section>
  );
}
