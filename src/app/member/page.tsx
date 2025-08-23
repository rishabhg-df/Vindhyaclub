
'use client';

import { useAdmin } from '@/context/AdminContext';
import { Section } from '@/components/shared/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';

export default function MemberDashboardPage() {
  const { profile } = useAdmin();

  if (!profile) {
    return (
      <Section title="Member Dashboard">
        <p>Loading profile...</p>
      </Section>
    );
  }

  return (
    <Section title="Member Dashboard">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-6">
             <Image
              src={profile.photoUrl || 'https://placehold.co/128x128.png'}
              alt={profile.name}
              width={100}
              height={100}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-primary"
            />
            <div>
              <CardTitle className="text-3xl">{profile.name}</CardTitle>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-4 grid grid-cols-1 gap-4 text-lg md:grid-cols-2">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="font-semibold text-primary">Phone Number</p>
            <p>{profile.phone}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="font-semibold text-primary">Date of Joining</p>
            <p>{format(parseISO(profile.dateOfJoining), 'PPP')}</p>
          </div>
          <div className="col-span-1 rounded-lg bg-muted/50 p-4 md:col-span-2">
            <p className="font-semibold text-primary">Address</p>
            <p>{profile.address}</p>
          </div>
          {profile.dob && (
             <div className="rounded-lg bg-muted/50 p-4">
                <p className="font-semibold text-primary">Date of Birth</p>
                <p>{format(parseISO(profile.dob), 'PPP')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Section>
  );
}
