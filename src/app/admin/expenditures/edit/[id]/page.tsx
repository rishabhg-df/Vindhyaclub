
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Section } from '@/components/shared/Section';
import type { Expenditure } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useExpenditures } from '@/context/ExpenditureContext';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const expenditureSchema = z.object({
  date: z.date({ required_error: 'Date is required.' }),
  category: z.enum(['Maintenance', 'Salaries', 'Utilities', 'Events', 'Other'], {
    required_error: 'Category is required.',
  }),
  amount: z.coerce.number().min(0, 'Amount must be a positive number.'),
  description: z.string().min(1, 'Description is required.'),
});

type ExpenditureFormValues = z.infer<typeof expenditureSchema>;

export default function EditExpenditurePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { expenditures, addExpenditure, updateExpenditure } = useExpenditures();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const expenditureId = params.id as string;
  const isNew = expenditureId === 'new';
  const expenditure = isNew ? null : expenditures.find((e) => e.id === expenditureId);

  const form = useForm<ExpenditureFormValues>({
    resolver: zodResolver(expenditureSchema),
    defaultValues: expenditure
      ? { ...expenditure, date: new Date(expenditure.date) }
      : {
          date: new Date(),
          category: undefined,
          amount: 0,
          description: '',
        },
  });
  
  useEffect(() => {
    if (!isNew && !expenditure && expenditures.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Expenditure not found',
        description: 'The requested expenditure could not be found.',
      });
      router.push('/admin/expenditures');
    }
  }, [isNew, expenditure, router, toast, expenditures]);

  const onSubmit = async (data: ExpenditureFormValues) => {
    setIsSubmitting(true);
    try {
      const expenditureData = {
        ...data,
        date: format(data.date, 'yyyy-MM-dd'),
      };

      if (isNew) {
        await addExpenditure(expenditureData);
      } else if (expenditure) {
        await updateExpenditure({ ...expenditure, ...expenditureData });
      }

      toast({
        title: `Expenditure ${isNew ? 'Added' : 'Updated'}`,
        description: `The expenditure record has been successfully saved.`,
      });

      router.push('/admin/expenditures');
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Operation Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section title={isNew ? 'Add New Expenditure' : 'Edit Expenditure'}>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Expenditure Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Expenditure</FormLabel>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
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
                          onSelect={(date) => {
                            field.onChange(date);
                            setIsCalendarOpen(false);
                          }}
                          disabled={(date) => date > new Date()}
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Salaries">Salaries</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (INR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short description of the expenditure."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isNew ? (
                    'Add Expenditure'
                  ) : (
                    'Update Expenditure'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Section>
  );
}
