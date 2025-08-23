
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/shared/Section';
import { Users, Calendar, UserCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <Section title="Admin Dashboard">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="flex flex-col text-center transition-transform hover:scale-105">
          <CardHeader>
            <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
            <CardTitle>Manage Management Team</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <p className="mb-4 text-muted-foreground">
              Add, edit, or remove members from the management team.
            </p>
            <Button asChild>
              <Link href="/admin/team">Go to Team Management</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col text-center transition-transform hover:scale-105">
          <CardHeader>
            <Calendar className="mx-auto mb-4 h-12 w-12 text-primary" />
            <CardTitle>Manage Events</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <p className="mb-4 text-muted-foreground">
              Create, update, or delete club events and announcements.
            </p>
            <Button asChild>
              <Link href="/admin/events">Go to Event Management</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col text-center transition-transform hover:scale-105">
          <CardHeader>
            <UserCheck className="mx-auto mb-4 h-12 w-12 text-primary" />
            <CardTitle>Registered Members</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <p className="mb-4 text-muted-foreground">
              View and manage all registered members of the club.
            </p>
            <Button asChild>
              <Link href="#">View Members</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
