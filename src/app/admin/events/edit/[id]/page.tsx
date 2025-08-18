
'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Section } from '@/components/shared/Section';
import type { Event } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEvents } from '@/context/EventContext';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  date: z.date({ required_error: 'Date is required.' }),
  entryTime: z.string().optional(),
  description: z.string().min(1, 'Description is required.'),
  image: z.string().min(1, 'Image is required.'),
  imageHint: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { events, addEvent, updateEvent } = useEvents();

  const eventId = params.id as string;
  const isNew = eventId === 'new';
  const event = isNew ? null : events.find((e) => e.id === eventId);
  const [imagePreview, setImagePreview] = useState<string | null>(
    event?.image || null
  );

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? { ...event, date: new Date(event.date) }
      : {
          title: '',
          entryTime: '',
          description: '',
          image: '',
          imageHint: 'club event',
        },
  });

  useEffect(() => {
    if (!isNew && !event) {
      toast({
        variant: 'destructive',
        title: 'Event not found',
        description: 'The requested event could not be found.',
      });
      router.push('/admin/events');
    }
    if (event) {
      form.reset({ ...event, date: new Date(event.date) });
      setImagePreview(event.image);
    }
  }, [isNew, event, router, toast, form]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        form.setValue('image', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: EventFormValues) => {
    const eventData = { ...data, date: data.date.toISOString() };
    if (isNew) {
      addEvent({
        id: new Date().getTime().toString(),
        ...eventData,
      });
    } else {
      updateEvent({ ...event!, ...eventData });
    }

    toast({
      title: `Event ${isNew ? 'Added' : 'Updated'}`,
      description: `${data.title} has been successfully saved.`,
    });
    router.push('/admin/events');
  };

  return (
    <Section title={isNew ? 'Add New Event' : 'Edit Event'}>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Summer Festival" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
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
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date('1900-01-01')}
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
                name="entryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10:30pm" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional. The last time for entry.
                    </FormDescription>
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
                        placeholder="A short description of the event."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Photo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload a landscape image (e.g., 800x600 pixels).
                    </FormDescription>
                    {imagePreview && (
                      <div className="mt-4">
                        <Image
                          src={imagePreview}
                          alt="Event preview"
                          width={200}
                          height={150}
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isNew ? 'Add Event' : 'Update Event'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Section>
  );
}
