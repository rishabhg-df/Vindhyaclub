
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Section } from '@/components/shared/Section';
import type { RegisteredMember } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useMembers } from '@/context/MemberContext';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';

export default function ManageMembersPage() {
  const { members, deleteRegisteredMember, loading } = useMembers();
  const [memberToDelete, setMemberToDelete] = useState<RegisteredMember | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = () => {
    if (!memberToDelete) return;

    deleteRegisteredMember(memberToDelete.id);
    toast({
      title: 'Member Deleted',
      description: `${memberToDelete.name} has been removed.`,
    });
    setMemberToDelete(null);
  };

  return (
    <Section title="Registered Members">
      <div className="mb-6 flex justify-end">
        <Button asChild>
          <Link href="/admin/members/edit/new">
            <PlusCircle />
            Add New Member
          </Link>
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date of Joining</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-10 w-10" />
                      <Skeleton className="h-10 w-10" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                   <TableCell>
                    <Image
                      src={member.photoUrl || 'https://placehold.co/40x40.png'}
                      alt={member.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>
                    {format(parseISO(member.dateOfJoining), 'PPP')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          router.push(`/admin/members/edit/${member.id}`)
                        }
                      >
                        <Edit />
                      </Button>
                      <AlertDialog
                        open={!!memberToDelete && memberToDelete.id === member.id}
                        onOpenChange={(isOpen) => !isOpen && setMemberToDelete(null)}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setMemberToDelete(member)}
                          >
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the member{' '}
                              <span className="font-bold">{member.name}</span>.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setMemberToDelete(null)}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
}
