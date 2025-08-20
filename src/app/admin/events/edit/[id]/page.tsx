
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
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { compressImage } from '@/lib/imageCompressor';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  date: z.date({ required_error: 'Date is required.' }),
  entryTime: z.string().min(1, 'Entry time is required.'),
  description: z.string().min(1, 'Description is required.'),
  imageHint: z.string().optional(),
  image: z.any().refine(files => {
    // For new events, image is required
    if (typeof window === 'undefined') return true; // Skip validation on server
    const params = new URLSearchParams(window.location.search);
    const isNew = window.location.pathname.includes('/edit/new');
    return !isNew || (files instanceof FileList && files.length > 0);
  }, 'An image is required for a new event.'),
});


type EventFormValues = z.infer<typeof eventSchema>;

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data.url;
}


export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { events, addEvent, updateEvent } = useEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const eventId = params.id as string;
  const isNew = eventId === 'new';
  const event = isNew ? null : events.find((e) => e.id === eventId);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? { ...event, date: new Date(event.date), entryTime: event.entryTime ?? '' }
      : {
          title: '',
          date: undefined,
          description: '',
          entryTime: '',
          imageHint: 'club event',
        },
  });

  useEffect(() => {
    if (event?.imageUrl) {
      setImagePreview(event.imageUrl);
    }
  }, [event]);
  
  useEffect(() => {
    if (!isNew && !event && events.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Event not found',
        description: 'The requested event could not be found.',
      });
      router.push('/admin/events');
    }
  }, [isNew, event, router, toast, events]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: FileList | null) => void) => {
    const file = e.target.files?.[0];
    fieldChange(e.target.files);
    if (file) {
      try {
        const compressedFile = await compressImage(file);
        setImageFile(compressedFile);
        setImagePreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error('Image processing error:', error);
        toast({
          variant: 'destructive',
          title: 'Image Error',
          description:
            'There was a problem processing your image. Please try another one.',
        });
        setImageFile(null);
        setImagePreview(event?.imageUrl ?? null);
      }
    }
  };

  const onSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true);
    try {
      let imageUrl = event?.imageUrl;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const eventData: Omit<Event, 'id'> = {
        title: data.title,
        description: data.description,
        date: format(data.date, 'yyyy-MM-dd'),
        entryTime: data.entryTime,
        imageUrl: imageUrl || 'https://placehold.co/800x600.png',
        imageHint: data.imageHint || 'club event',
      };

      if (isNew) {
        await addEvent(eventData);
      } else if (event) {
        await updateEvent({ ...event, ...eventData });
      }

      toast({
        title: `Event ${isNew ? 'Added' : 'Updated'}`,
        description: `${data.title} has been successfully saved.`,
      });

      router.push('/admin/events');
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
                      <Input
                        placeholder="e.g., 10:30pm"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormDescription>
                      The last time for entry.
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, field.onChange)}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload an image for the event (max 50KB). A photo is required for new events.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                    'Add Event'
                  ) : (
                    'Update Event'
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

    