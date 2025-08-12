import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { TeamMember } from '@/lib/types';

type TeamMemberCardProps = {
  member: TeamMember;
};

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card className="text-center">
      <CardContent className="p-6">
        <Image
          src={member.image}
          alt={member.name}
          data-ai-hint={member.imageHint}
          width={128}
          height={128}
          className="mx-auto mb-4 h-32 w-32 rounded-full object-cover ring-4 ring-primary"
        />
        <h3 className="font-headline text-xl font-bold">{member.name}</h3>
        <p className="mb-2 text-primary">{member.role}</p>
        <p className="text-muted-foreground">{member.bio}</p>
      </CardContent>
    </Card>
  );
}
