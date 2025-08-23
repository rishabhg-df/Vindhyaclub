
'use client';

import { useAdmin } from '@/context/AdminContext';
import { useMembers } from '@/context/MemberContext';
import { Section } from '@/components/shared/Section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function MemberDashboardPage() {
  const { profile } = useAdmin();
  const { getPaymentsByMember, loading } = useMembers();

  if (!profile || loading) {
    return (
      <Section title="Member Dashboard">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-6">
                 <Skeleton className="h-24 w-24 rounded-full" />
                <div>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="mt-2 h-5 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader><Skeleton className="h-8 w-40" /></CardHeader>
            <CardContent><Skeleton className="h-48 w-full" /></CardContent>
          </Card>
        </div>
      </Section>
    );
  }
  
  const payments = getPaymentsByMember(profile.id).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Section title="Member Dashboard">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8">
        <Card>
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

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your record of all payments and dues.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {format(parseISO(payment.date), 'PPP')}
                      </TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === 'Paid' ? 'default' : 'destructive'}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No payment history found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
