
'use client';

import { Section } from '@/components/shared/Section';
import { TeamMemberCard } from '@/components/shared/TeamMemberCard';
import { useTeam } from '@/context/TeamContext';
import { Skeleton } from '../ui/skeleton';

export function TeamSection() {
  const { team, loading } = useTeam();

  if (loading) {
     return (
      <Section title="Our Management Team" id="team">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      </Section>
    );
  }

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
