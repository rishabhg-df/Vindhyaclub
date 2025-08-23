
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
import { Section } from '@/components/shared/Section';
import type { RegisteredMember } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useMembers } from '@/context/MemberContext';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const memberSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(1, 'Phone number is required.'),
  address: z.string().min(1, 'Address is required.'),
  dob: z.date({ required_error: 'Date of birth is required.' }),
  dateOfJoining: z.date({ required_error: 'Date of joining is required.' }),
});

type MemberFormValues = z.infer<typeof memberSchema>;

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { members, addRegisteredMember, updateRegisteredMember } = useMembers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDobCalendarOpen, setIsDobCalendarOpen] = useState(false);
  const [isDojCalendarOpen, setIsDojCalendarOpen] = useState(false);

  const memberId = params.id as string;
  const isNew = memberId === 'new';
  const member = isNew ? null : members.find((m) => m.id === memberId);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: member
      ? { ...member, dob: new Date(member.dob), dateOfJoining: new Date(member.dateOfJoining) }
      : {
          name: '',
          email: '',
          phone: '',
          address: '',
          dob: undefined,
          dateOfJoining: undefined,
        },
  });
  
  useEffect(() => {
    if (!isNew && !member && members.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Member not found',
        description: 'The requested member could not be found.',
      });
      router.push('/admin/members');
    }
  }, [isNew, member, router, toast, members]);

  const onSubmit = async (data: MemberFormValues) => {
    setIsSubmitting(true);
    try {
      const memberData: Omit<RegisteredMember, 'id' | 'createdAt'> = {
        ...data,
        dob: format(data.dob, 'yyyy-MM-dd'),
        dateOfJoining: format(data.dateOfJoining, 'yyyy-MM-dd'),
      };

      if (isNew) {
        await addRegisteredMember(memberData);
      } else if (member) {
        await updateRegisteredMember({ ...member, ...memberData });
      }

      toast({
        title: `Member ${isNew ? 'Added' : 'Updated'}`,
        description: `${data.name} has been successfully saved.`,
      });

      router.push('/admin/members');
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
    <Section title={isNew ? 'Add New Member' : 'Edit Member'}>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Member Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., +1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover open={isDobCalendarOpen} onOpenChange={setIsDobCalendarOpen}>
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
                            onSelect={(date) => {
                              field.onChange(date);
                              setIsDobCalendarOpen(false);
                            }}
                             captionLayout="dropdown-buttons" fromYear={1930} toYear={new Date().getFullYear()}
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
                  name="dateOfJoining"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Joining</FormLabel>
                      <Popover open={isDojCalendarOpen} onOpenChange={setIsDojCalendarOpen}>
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
                            onSelect={(date) => {
                              field.onChange(date);
                              setIsDojCalendarOpen(false);
                            }}
                            captionLayout="dropdown-buttons" fromYear={1930} toYear={new Date().getFullYear()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
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
                    'Add Member'
                  ) : (
                    'Update Member'
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
