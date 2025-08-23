
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Section } from '@/components/shared/Section';
import type { RegisteredMember, Payment } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useMembers } from '@/context/MemberContext';
import { facilities, BASE_MAINTENANCE_FEE } from '@/lib/data';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, ClipboardCheck } from 'lucide-react';
import { format, parseISO, getMonth, getYear } from 'date-fns';

const paymentSchema = z.object({
  amount: z.coerce.number().min(1, 'Amount must be greater than 0.'),
  date: z.date({ required_error: 'Date is required.' }),
  description: z.string().min(1, 'Description is required.'),
  status: z.enum(['Paid', 'Due'], { required_error: 'Status is required.' }),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function MemberPaymentsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { members, getPaymentsByMember, addPayment, updatePayment, loading } = useMembers();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('Monthly Maintenance Fee');
  const [paymentToUpdate, setPaymentToUpdate] = useState<Payment | null>(null);
  const [selectedPaymentDate, setSelectedPaymentDate] = useState<Date | undefined>(new Date());
  const [descriptionFilter, setDescriptionFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const memberId = params.memberId as string;
  const member = members.find((m) => m.id === memberId);
  const memberPayments = getPaymentsByMember(memberId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredPayments = useMemo(() => {
    return memberPayments.filter(payment => {
      const descriptionMatch = descriptionFilter === 'all' || payment.description === descriptionFilter;
      const statusMatch = statusFilter === 'all' || payment.status === statusFilter;
      
      if (monthFilter === 'all') {
        return descriptionMatch && statusMatch;
      }
      
      const paymentDate = parseISO(payment.date);
      const [filterMonth, filterYear] = monthFilter.split('-').map(Number);
      const monthMatch = getMonth(paymentDate) + 1 === filterMonth && getYear(paymentDate) === filterYear;

      return descriptionMatch && statusMatch && monthMatch;
    });
  }, [memberPayments, descriptionFilter, monthFilter, statusFilter]);

  const monthOptions = useMemo(() => {
    const months = new Set<string>();
    memberPayments.forEach(p => {
        const date = parseISO(p.date);
        months.add(`${getMonth(date) + 1}-${getYear(date)}`);
    });
    return Array.from(months).map(m => {
        const [month, year] = m.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return { value: m, label: format(date, 'MMMM yyyy') };
    });
  }, [memberPayments]);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      date: new Date(),
      description: 'Monthly Maintenance Fee',
      status: 'Paid',
    },
  });

  const calculateTotalFee = (member: RegisteredMember | null | undefined) => {
    if (!member) return 0;
    const subscribedServices = member.services || [];
    const servicesFee =
      subscribedServices?.reduce((total, serviceName) => {
        const service = facilities.find((f) => f.name === serviceName);
        return total + (service?.fee || 0);
      }, 0) ?? 0;
    return BASE_MAINTENANCE_FEE + servicesFee;
  };

  useEffect(() => {
    if (member) {
      form.setValue('amount', calculateTotalFee(member));
    }
  }, [member, form]);

  useEffect(() => {
    if (selectedDescription !== 'Other') {
      form.setValue('description', selectedDescription);
    } else {
      form.setValue('description', '');
    }
  }, [selectedDescription, form]);
  
  if (loading) {
    return <Section title="Loading..."><p>Loading member data...</p></Section>
  }
  
  if (!member) {
     return <Section title="Member Not Found"><p>Could not find the specified member.</p></Section>
  }
  
  const handleUpdateStatus = async () => {
    if (!paymentToUpdate || !selectedPaymentDate) return;
    try {
      await updatePayment({ ...paymentToUpdate, status: 'Paid', paymentDate: format(selectedPaymentDate, 'yyyy-MM-dd')});
      toast({
        title: 'Payment Updated',
        description: 'Payment status changed to Paid.',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update payment status.',
      })
    } finally {
      setPaymentToUpdate(null);
    }
  };

  const onSubmit = async (data: PaymentFormValues) => {
    setIsSubmitting(true);
    try {
      await addPayment({
        memberId: member.id,
        amount: data.amount,
        description: data.description,
        status: data.status,
        date: format(data.date, 'yyyy-MM-dd'),
        paymentDate: data.status === 'Paid' ? format(new Date(), 'yyyy-MM-dd') : undefined,
      });

      toast({
        title: 'Payment Added',
        description: `Payment of ${data.amount} has been logged for ${member.name}.`,
      });
      
      form.reset({
        amount: calculateTotalFee(member),
        date: new Date(),
        description: 'Monthly Maintenance Fee',
        status: 'Paid',
      });
      setSelectedDescription('Monthly Maintenance Fee');

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to Add Payment',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const descriptionOptions = [
    'Monthly Maintenance Fee',
    ...facilities.map(f => f.name),
    'Other',
  ];

  return (
    <Section title={`Payments for ${member.name}`}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Payment</CardTitle>
              <CardDescription>Log a new payment or due for this member.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                     <Select onValueChange={setSelectedDescription} value={selectedDescription}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a description" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {descriptionOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                  
                  {selectedDescription === 'Other' && (
                     <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter custom payment details" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Payment Status</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Paid" />
                              </FormControl>
                              <FormLabel className="font-normal">Paid</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Due" />
                              </FormControl>
                              <FormLabel className="font-normal">Due</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Add Payment'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
           <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                  <Select value={descriptionFilter} onValueChange={setDescriptionFilter}>
                      <SelectTrigger>
                          <SelectValue placeholder="Filter by description" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Descriptions</SelectItem>
                          {descriptionOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  <Select value={monthFilter} onValueChange={setMonthFilter}>
                      <SelectTrigger>
                          <SelectValue placeholder="Filter by month" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Months</SelectItem>
                          {monthOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                   <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                          <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Due">Due</SelectItem>
                      </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => { setDescriptionFilter('all'); setMonthFilter('all'); setStatusFilter('all'); }}>
                      Clear Filters
                  </Button>
              </div>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{format(parseISO(payment.date), 'PPP')}</TableCell>
                          <TableCell>{payment.description}</TableCell>
                          <TableCell>
                            <Badge variant={payment.status === 'Paid' ? 'default' : 'destructive'}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>
                            {payment.status === 'Due' && (
                              <Dialog onOpenChange={(open) => !open && setPaymentToUpdate(null)}>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="icon" onClick={() => setPaymentToUpdate(payment)}>
                                    <ClipboardCheck className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Mark as Paid</DialogTitle>
                                  </DialogHeader>
                                  <div className="flex flex-col items-center gap-4">
                                     <p>Select the date this payment was made.</p>
                                     <Calendar
                                        mode="single"
                                        selected={selectedPaymentDate}
                                        onSelect={setSelectedPaymentDate}
                                        className="rounded-md border"
                                      />
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button type="button" variant="secondary">Cancel</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                      <Button onClick={handleUpdateStatus} disabled={!selectedPaymentDate}>
                                        Mark as Paid
                                      </Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No payments found for the selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
