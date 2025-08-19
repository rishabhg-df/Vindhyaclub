
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
import type { TeamMember } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useTeam } from '@/context/TeamContext';
import { Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/firebase';

const memberSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  role: z.string().min(1, 'Role is required.'),
  bio: z.string().min(1, 'Bio is required.'),
  image: z.instanceof(File).optional(),
  imageHint: z.string().optional(),
});

type MemberFormValues = z.infer<typeof memberSchema>;

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { team, addMember, updateMember } = useTeam();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const memberId = params.id as string;
  const isNew = memberId === 'new';
  const member = isNew ? null : team.find((m) => m.id === memberId);
  
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: member ? { ...member, image: undefined } : {
      name: '',
      role: '',
      bio: '',
      image: undefined,
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
    if (member?.image) {
      setImagePreview(member.image);
    } else {
      setImagePreview(null);
    }
  }, [isNew, member, router, toast, form]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: MemberFormValues) => {
    setIsSubmitting(true);
    try {
      let imageUrl = member?.image || 'https://placehold.co/128x128.png';

      if (data.image) {
        imageUrl = await uploadImage(data.image, 'team');
      }

      const memberData: TeamMember = {
        id: isNew ? Date.now().toString() : memberId,
        name: data.name,
        role: data.role,
        bio: data.bio,
        image: imageUrl,
        imageHint: data.imageHint || 'professional portrait',
      };

      if (isNew) {
        addMember(memberData);
      } else {
        updateMember(memberData);
      }

      toast({
        title: `Member ${isNew ? 'Added' : 'Updated'}`,
        description: `${data.name} has been successfully saved.`,
      });
      router.push('/admin/team');
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
                    <FormLabel>Photo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          handleImageChange(e);
                          field.onChange(e.target.files?.[0] ?? undefined);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                     Upload a new photo. If no image is selected, the existing one will be kept, or a placeholder used for new members.
                    </FormDescription>
                    {imagePreview && (
                      <div className="mt-4">
                        <Image
                          src={imagePreview}
                          alt="Profile preview"
                          width={128}
                          height={128}
                          className="h-32 w-32 rounded-full object-cover"
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
