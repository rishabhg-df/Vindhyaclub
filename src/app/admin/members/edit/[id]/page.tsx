
'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import Image from 'next/image';
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
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { compressImage } from '@/lib/imageCompressor';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { facilities, BASE_MAINTENANCE_FEE } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';

const memberSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().optional(),
  phone: z.string().min(1, 'Phone number is required.'),
  address: z.string().min(1, 'Address is required.'),
  dob: z.date().optional(),
  dateOfJoining: z.date({ required_error: 'Date of joining is required.' }),
  role: z.enum(['admin', 'member'], { required_error: 'Role is required.' }),
  imageHint: z.string().optional(),
  photo: z.any().optional(),
  services: z.array(z.string()).optional(),
  phoneVerified: z.boolean().optional(),
});


type MemberFormValues = z.infer<typeof memberSchema>;

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

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { members, addRegisteredMember, updateRegisteredMember } =
    useMembers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDobCalendarOpen, setIsDobCalendarOpen] = useState(false);
  const [isDojCalendarOpen, setIsDojCalendarOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const memberId = params.id as string;
  const isNew = memberId === 'new';
  const member = isNew ? null : members.find((m) => m.id === memberId);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: member
      ? {
          ...member,
          dob: member.dob ? parseISO(member.dob) : undefined,
          dateOfJoining: parseISO(member.dateOfJoining),
          services: member.services || [],
          phoneVerified: member.phoneVerified || false,
        }
      : {
          name: '',
          email: '',
          password: '',
          phone: '',
          address: '',
          dob: undefined,
          dateOfJoining: undefined,
          role: 'member',
          imageHint: 'member portrait',
          services: [],
          phoneVerified: false,
        },
  });

  useEffect(() => {
    if (member?.photoUrl) {
      setImagePreview(member.photoUrl);
    }
  }, [member]);
  
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

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: FileList | null) => void
  ) => {
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
        setImagePreview(member?.photoUrl ?? null);
      }
    }
  };
  
  const handleSendOtp = async () => {
    const phoneNumber = form.getValues('phone');
    if (!phoneNumber) {
      toast({ variant: 'destructive', title: 'Phone number is required.' });
      return;
    }

    setIsSendingOtp(true);
    
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    const authkey = '0a3baf54b7279130';
    const company = 'Vindhya Club';
    const sid = '9234';
    
    const url = `https://api.authkey.io/request?authkey=${authkey}&mobile=${phoneNumber}&country_code=91&sid=${sid}&company=${company}&otp=${newOtp}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        setOtpSent(true);
        toast({ title: 'OTP Sent', description: "An OTP has been sent to the member's phone." });
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to send OTP',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleConfirmOtp = () => {
    if (!otp) {
      toast({ variant: 'destructive', title: 'Please enter the OTP.' });
      return;
    }
    
    setIsVerifying(true);
    if (otp === generatedOtp) {
      form.setValue('phoneVerified', true);
      toast({ title: 'Success', description: 'Phone number verified successfully.' });
      setOtpSent(false);
      setGeneratedOtp(''); // Clear OTP after use
    } else {
      toast({ variant: 'destructive', title: 'Invalid OTP', description: 'The OTP you entered is incorrect.' });
      form.setValue('phoneVerified', false);
    }
    setIsVerifying(false);
  };

  const onSubmit = async (data: MemberFormValues) => {
    setIsSubmitting(true);
    try {
      if (isNew && !data.password) {
        form.setError('password', {
          message: 'Password is required for new members.',
        });
        setIsSubmitting(false);
        return;
      }

      let photoUrl = member?.photoUrl;
      if (imageFile) {
        photoUrl = await uploadImage(imageFile);
      }

      let finalRole = data.role;
      if (isNew) {
        const adminQuery = query(
          collection(db, 'members'),
          where('role', '==', 'admin')
        );
        const adminSnapshot = await getDocs(adminQuery);
        if (adminSnapshot.empty) {
          finalRole = 'admin';
          toast({
            title: 'First Admin Created',
            description: 'The first user has been assigned the admin role.',
          });
        }
      }

      const memberData: Omit<RegisteredMember, 'id' | 'createdAt' | 'uid'> = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        phoneVerified: data.phoneVerified,
        address: data.address,
        dateOfJoining: format(data.dateOfJoining, 'yyyy-MM-dd'),
        role: finalRole,
        photoUrl: photoUrl || 'https://placehold.co/128x128.png',
        imageHint: data.imageHint || 'member portrait',
        services: data.services,
      };

      if (data.dob) {
        (memberData as Partial<RegisteredMember>).dob = format(
          data.dob,
          'yyyy-MM-dd'
        );
      }

      if (isNew) {
        await addRegisteredMember(memberData, data.password!);
      } else if (member) {
        await updateRegisteredMember({
          ...member,
          ...memberData,
          role: data.role,
        });
      }

      toast({
        title: `Member ${isNew ? 'Added' : 'Updated'}`,
        description: `${data.name} has been successfully saved.`,
      });

      if (isNew) router.push('/admin/members');
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Section title={isNew ? 'Add New Member' : 'Edit Member'}>
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>Member Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
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
                      <Input
                        placeholder="e.g., john.doe@example.com"
                        {...field}
                        disabled={!isNew}
                      />
                    </FormControl>
                    {!isNew && (
                       <FormDescription>
                        Email address cannot be changed after creation.
                       </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={
                          isNew
                            ? 'Required for new member'
                            : 'Leave blank to keep unchanged'
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A password is required for new members to log in.
                    </FormDescription>
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
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder="e.g., 9876543210" {...field} />
                        </FormControl>
                        {!form.getValues('phoneVerified') && (
                            <Button type="button" onClick={handleSendOtp} disabled={otpSent || isSendingOtp}>
                                {isSendingOtp ? <Loader2 className="animate-spin" /> : (otpSent ? 'OTP Sent' : 'Send OTP')}
                            </Button>
                        )}
                      </div>
                       <div className='mt-2'>
                        {form.watch('phoneVerified') ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            <span>Verified</span>
                          </div>
                        ) : (
                           <div className="flex items-center text-yellow-600">
                            <ShieldAlert className="mr-2 h-5 w-5" />
                            <span>Not Verified</span>
                           </div>
                        )}
                       </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              {otpSent && !form.getValues('phoneVerified') && (
                <div className="space-y-2">
                  <FormLabel>Enter OTP</FormLabel>
                  <div className="flex items-center gap-2">
                      <Input 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit code"
                       />
                      <Button type="button" onClick={handleConfirmOtp} disabled={isVerifying}>
                        {isVerifying ? <Loader2 className="animate-spin"/> : 'Confirm OTP'}
                      </Button>
                  </div>
                </div>
              )}
              
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
                      <FormLabel>Date of Birth (Optional)</FormLabel>
                      <Popover
                        open={isDobCalendarOpen}
                        onOpenChange={setIsDobCalendarOpen}
                      >
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
                            captionLayout="dropdown-buttons"
                            fromYear={1930}
                            toYear={new Date().getFullYear()}
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
                      <Popover
                        open={isDojCalendarOpen}
                        onOpenChange={setIsDojCalendarOpen}
                      >
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
                            captionLayout="dropdown-buttons"
                            fromYear={1930}
                            toYear={new Date().getFullYear()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin / Manager</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, field.onChange)}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload a photo for the member (max 50KB).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {imagePreview && (
                <div className="mt-4">
                  <Image
                    src={imagePreview}
                    alt="Member preview"
                    width={128}
                    height={128}
                    className="h-32 w-32 rounded-full object-cover"
                  />
                </div>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Subscribed Services</CardTitle>
                  <CardDescription>
                    Select the facilities this member has subscribed to.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="services"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-4">
                          {facilities.map((item) => (
                            <FormField
                              key={item.name}
                              control={form.control}
                              name="services"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.name}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          item.name
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...(field.value ?? []),
                                                item.name,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== item.name
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.name} ({formatCurrency(item.fee)})
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>


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
