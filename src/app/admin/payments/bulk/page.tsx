
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
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
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Section } from '@/components/shared/Section';
import { useToast } from '@/hooks/use-toast';
import { useMembers } from '@/context/MemberContext';
import { facilities, BASE_MAINTENANCE_FEE } from '@/lib/data';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, ClipboardCheck } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { Payment } from '@/lib/types';

const bulkPaymentSchema = z.object({
  memberIds: z.array(z.string()).min(1, 'Please select at least one member.'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0.'),
  date: z.date({ required_error: 'Date is required.' }),
  description: z.string().min(1, 'Description is required.'),
  comment: z.string().optional(),
  status: z.enum(['Paid', 'Due'], { required_error: 'Status is required.' }),
});

type BulkPaymentFormValues = z.infer<typeof bulkPaymentSchema>;

export default function BulkPaymentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { members, payments, addBulkPayments, updatePayment, loading } = useMembers();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('Monthly Maintenance Fee');
  const [statusFilter, setStatusFilter] = useState('all');
  const [nameFilter, setNameFilter] = useState('');
  const [paymentToUpdate, setPaymentToUpdate] = useState<Payment | null>(null);
  const [selectedPaymentDate, setSelectedPaymentDate] = useState<Date | undefined>(new Date());
  
  const form = useForm<BulkPaymentFormValues>({
    resolver: zodResolver(bulkPaymentSchema),
    defaultValues: {
      memberIds: [],
      amount: BASE_MAINTENANCE_FEE,
      date: new Date(),
      description: 'Monthly Maintenance Fee',
      comment: '',
      status: 'Due',
    },
  });
  
  const memberMap = useMemo(() => {
    return new Map(members.map(m => [m.id, m.name]));
  }, [members]);

  const regularMembers = useMemo(() => {
    return members.filter(m => m.role !== 'admin');
  }, [members]);

  const filteredRecentPayments = useMemo(() => {
    return [...payments]
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter(payment => {
        const memberName = memberMap.get(payment.memberId)?.toLowerCase() || '';
        const nameMatch = nameFilter ? memberName.includes(nameFilter.toLowerCase()) : true;
        const statusMatch = statusFilter === 'all' || payment.status === statusFilter;
        return nameMatch && statusMatch;
      });
  }, [payments, memberMap, nameFilter, statusFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handleSelectAll = (checked: boolean) => {
    const allRegularMemberIds = regularMembers.map(m => m.id);
    form.setValue('memberIds', checked ? allRegularMemberIds : []);
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

  const onSubmit = async (data: BulkPaymentFormValues) => {
    setIsSubmitting(true);
    try {
      await addBulkPayments({
        memberIds: data.memberIds,
        paymentDetails: {
          amount: data.amount,
          description: data.description,
          comment: data.comment,
          status: data.status,
          date: format(data.date, 'yyyy-MM-dd'),
          paymentDate: data.status === 'Paid' ? format(new Date(), 'yyyy-MM-dd') : undefined,
        }
      });

      toast({
        title: 'Bulk Payments Added',
        description: `Payment record added for ${data.memberIds.length} members.`,
      });
      form.reset({
        memberIds: [],
        amount: BASE_MAINTENANCE_FEE,
        date: new Date(),
        description: 'Monthly Maintenance Fee',
        comment: '',
        status: 'Due',
      });
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to Add Bulk Payments',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const descriptionOptions = [
    'Monthly Maintenance Fee',
    ...facilities.map(f => f.name),
    'Other',
  ];

  return (
    <Section title="Bulk Payment Entry">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Enter the details for the bulk payment entry.</CardDescription>
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
                     <Select onValueChange={(value) => {
                         setSelectedDescription(value);
                         form.setValue('description', value === 'Other' ? '' : value);
                     }} value={selectedDescription}>
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
                        <FormLabel>Due Date</FormLabel>
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
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comment (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Add a comment for all selected members..." {...field} />
                          </FormControl>
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
                   <FormField
                    control={form.control}
                    name="memberIds"
                    render={() => <FormMessage />}
                    />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Add Bulk Payments'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Members</CardTitle>
              <CardDescription>Select the members to apply this payment to.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead padding="checkbox">
                        <Checkbox
                           onCheckedChange={(checked) => handleSelectAll(checked === true)}
                           aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                       [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                        </TableRow>
                       ))
                    ) : (
                      <Controller
                        control={form.control}
                        name="memberIds"
                        render={({ field }) => (
                          <>
                            {regularMembers.map((member) => (
                              <TableRow key={member.id}
                                selected={field.value?.includes(member.id)}
                                onClick={() => {
                                   const newSelection = field.value?.includes(member.id)
                                      ? field.value.filter((id) => id !== member.id)
                                      : [...(field.value ?? []), member.id];
                                    field.onChange(newSelection);
                                }}
                              >
                                <TableCell>
                                  <Checkbox
                                    checked={field.value?.includes(member.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value ?? []), member.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (id) => id !== member.id
                                            )
                                          );
                                    }}
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{member.name}</TableCell>
                                <TableCell>{member.email}</TableCell>
                              </TableRow>
                            ))}
                          </>
                        )}
                       />
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

       <div className="mx-auto mt-8 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>A view of all recently logged payments for all members.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row">
              <Input
                placeholder="Filter by name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="max-w-sm"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Due">Due</SelectItem>
                </SelectContent>
              </Select>
               <Button variant="outline" onClick={() => { setNameFilter(''); setStatusFilter('all'); }}>
                  Clear Filters
              </Button>
            </div>
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                     [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell><Skeleton className="ml-auto h-6 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-10 w-10" /></TableCell>
                        </TableRow>
                       ))
                  ) : filteredRecentPayments.length > 0 ? (
                    filteredRecentPayments.slice(0, 10).map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{memberMap.get(payment.memberId) || 'N/A'}</TableCell>
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
                      <TableCell colSpan={6} className="text-center">
                        No payments found for the selected filters.
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
