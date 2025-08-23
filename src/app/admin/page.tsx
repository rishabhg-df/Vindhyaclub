
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/shared/Section';
import { Users, Calendar, UserCheck, Briefcase, BarChart2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const dashboardLinks = [
    {
      href: '/admin/team',
      icon: Users,
      title: 'Manage Management Team',
      description: 'Add, edit, or remove members from the management team.',
      label: 'Go to Team Management',
    },
    {
      href: '/admin/events',
      icon: Calendar,
      title: 'Manage Events',
      description: 'Create, update, or delete club events and announcements.',
      label: 'Go to Event Management',
    },
    {
      href: '/admin/members',
      icon: UserCheck,
      title: 'Registered Members',
      description: 'View and manage all registered members of the club.',
      label: 'View Members',
    },
     {
      href: '/admin/expenditures',
      icon: Briefcase,
      title: 'Manage Expenditures',
      description: 'Log and track all club expenditures and operational costs.',
      label: 'Go to Expenditures',
    },
    {
      href: '/admin/reports',
      icon: BarChart2,
      title: 'Financial Reports',
      description: 'Generate and view detailed financial reports and statements.',
      label: 'View Reports',
    },
  ];

  return (
    <Section title="Admin Dashboard">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {dashboardLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <Card
              key={index}
              className="flex flex-col text-center transition-transform hover:scale-105"
            >
              <CardHeader>
                <Icon className="mx-auto mb-4 h-12 w-12 text-primary" />
                <CardTitle>{link.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between">
                <p className="mb-4 text-muted-foreground">{link.description}</p>
                <Button asChild>
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
