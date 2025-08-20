
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Section } from '@/components/shared/Section';
import type { Location } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/context/LocationContext';
import { Loader2 } from 'lucide-react';

const locationSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  mapsUrl: z.string().url('Please enter a valid Google Maps URL.'),
});

type LocationFormValues = z.infer<typeof locationSchema>;

export default function EditLocationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { location, updateLocation, loading } = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      latitude: 0,
      longitude: 0,
      mapsUrl: '',
    },
  });

  useEffect(() => {
    if (location) {
      form.reset({
        latitude: location.latitude,
        longitude: location.longitude,
        mapsUrl: location.mapsUrl,
      });
    }
  }, [location, form]);

  const onSubmit = async (data: LocationFormValues) => {
    setIsSubmitting(true);
    try {
      await updateLocation({
        name: 'Vindhya Club',
        latitude: data.latitude,
        longitude: data.longitude,
        mapsUrl: data.mapsUrl,
      });

      toast({
        title: 'Location Updated',
        description: 'The club location has been successfully saved.',
      });
      router.push('/admin');
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

  if (loading) {
    return (
      <Section title="Manage Location">
        <div className="flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      </Section>
    );
  }

  return (
    <Section title="Manage Location">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Club Location Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="e.g., 24.579478" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="e.g., 80.837728" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mapsUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Maps URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://maps.app.goo.gl/..." {...field} />
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
                  ) : (
                    'Save Location'
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
