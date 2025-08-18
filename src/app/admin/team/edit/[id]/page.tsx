
'use client';

import { useEffect } from 'react';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Section } from '@/components/shared/Section';
import { team as initialTeam } from '@/lib/data';
import type { TeamMember } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const memberSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  role: z.string().min(1, 'Role is required.'),
  bio: z.string().min(1, 'Bio is required.'),
  image: z.string().url('Must be a valid URL.'),
  imageHint: z.string().optional(),
});

type MemberFormValues = z.infer<typeof memberSchema>;

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const memberId = params.id;
  const isNew = memberId === 'new';

  const member = isNew
    ? null
    : initialTeam.find((m) => m.name === decodeURIComponent(memberId as string));

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: member || {
      name: '',
      role: '',
      bio: '',
      image: '',
      imageHint: 'professional portrait',
    },
  });

  useEffect(() => {
    if (!isNew && !member) {
      toast({
        variant: 'destructive',
        title: 'Member not found',
        description: 'The requested team member could not be found.',
      });
      router.push('/admin/team');
    }
  }, [isNew, member, router, toast]);

  const onSubmit = (data: MemberFormValues) => {
    // In a real app, you would make an API call to save the data.
    console.log('Form submitted', data);
    toast({
      title: `Member ${isNew ? 'Added' : 'Updated'}`,
      description: `${data.name} has been successfully saved.`,
    });
    router.push('/admin/team');
    // Note: The UI won't actually update because we are not persisting the changes.
  };

  return (
    <Section title={isNew ? 'Add New Team Member' : 'Edit Team Member'}>
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
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role / Designation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Club President" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Yourself</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short description about the member."
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
                    <FormLabel>Photo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.png" {...field} />
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
                >
                  Cancel
                </Button>
                <Button type="submit">{isNew ? 'Add Member' : 'Update Member'}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Section>
  );
}
