
'use client';

import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Section } from '@/components/shared/Section';
import { useToast } from '@/hooks/use-toast';
import { useMembers } from '@/context/MemberContext';
import { facilities, BASE_MAINTENANCE_FEE } from '@/lib/data';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const bulkPaymentSchema = z.object({
  memberIds: z.array(z.string()).min(1, 'Please select at least one member.'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0.'),
  date: z.date({ required_error: 'Date is required.' }),
  description: z.string().min(1, 'Description is required.'),
  status: z.enum(['Paid', 'Due'], { required_error: 'Status is required.' }),
});

type BulkPaymentFormValues = z.infer<typeof bulkPaymentSchema>;

export default function BulkPaymentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { members, addBulkPayments, loading } = useMembers();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('Monthly Maintenance Fee');
  
  const form = useForm<BulkPaymentFormValues>({
    resolver: zodResolver(bulkPaymentSchema),
    defaultValues: {
      memberIds: [],
      amount: BASE_MAINTENANCE_FEE,
      date: new Date(),
      description: 'Monthly Maintenance Fee',
      status: 'Due',
    },
  });

  const handleSelectAll = (checked: boolean) => {
    const allMemberIds = members.map(m => m.id);
    form.setValue('memberIds', checked ? allMemberIds : []);
  }

  const onSubmit = async (data: BulkPaymentFormValues) => {
    setIsSubmitting(true);
    try {
      await addBulkPayments({
        memberIds: data.memberIds,
        paymentDetails: {
          amount: data.amount,
          description: data.description,
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
                            {members.map((member) => (
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
    </Section>
  );
}
