
'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Section } from '@/components/shared/Section';
import { useMembers } from '@/context/MemberContext';
import { useExpenditures } from '@/context/ExpenditureContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportsPage() {
  const { members, payments, loading: membersLoading } = useMembers();
  const { expenditures, loading: expendituresLoading } = useExpenditures();

  const loading = membersLoading || expendituresLoading;

  const {
    totalRevenue,
    totalExpenditure,
    netProfitLoss,
    expenditureByCategory,
    revenueByMember,
  } = useMemo(() => {
    const totalRevenue = payments.reduce((acc, payment) => {
      return payment.status === 'Paid' ? acc + payment.amount : acc;
    }, 0);

    const totalExpenditure = expenditures.reduce((acc, exp) => acc + exp.amount, 0);

    const netProfitLoss = totalRevenue - totalExpenditure;

    const expenditureByCategory = expenditures.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const revenueByMemberData = members.map(member => {
        const memberPayments = payments.filter(p => p.memberId === member.id && p.status === 'Paid');
        const totalMemberRevenue = memberPayments.reduce((sum, p) => sum + p.amount, 0);
        return {
            name: member.name,
            revenue: totalMemberRevenue,
        };
    });

    const revenueByMember = revenueByMemberData
      .filter(m => m.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue);

    return {
      totalRevenue,
      totalExpenditure,
      netProfitLoss,
      expenditureByCategory: Object.entries(expenditureByCategory).map(([name, amount]) => ({ name, amount })),
      revenueByMember,
    };
  }, [members, payments, expenditures]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const chartConfig = {
    amount: { label: 'Amount (INR)', color: 'hsl(var(--primary))' },
    revenue: { label: 'Revenue (INR)', color: 'hsl(var(--chart-2))' },
  };

  if (loading) {
    return (
      <Section title="Financial Reports">
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
             <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
              <CardContent><Skeleton className="h-10 w-48" /></CardContent>
            </Card>
          ))}
        </div>
         <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-80 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-80 w-full" /></CardContent></Card>
        </div>
      </Section>
    );
  }

  return (
    <Section title="Financial Reports">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue (Paid)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Expenditures</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(totalExpenditure)}</p>
          </CardContent>
        </Card>
        <Card className={netProfitLoss >= 0 ? 'bg-green-900/20' : 'bg-red-900/20'}>
          <CardHeader>
            <CardTitle>Net Profit / Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(netProfitLoss)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expenditure Breakdown by Category</CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart data={expenditureByCategory} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="amount" tickFormatter={formatCurrency} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
                <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Member (Paid)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart data={revenueByMember} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="revenue" tickFormatter={formatCurrency} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
