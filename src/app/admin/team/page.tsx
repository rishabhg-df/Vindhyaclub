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
import type { TeamMember } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useTeam } from '@/context/TeamContext';

export default function ManageTeamPage() {
  const { team, deleteMember } = useTeam();
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = () => {
    if (!memberToDelete) return;

    deleteMember(memberToDelete.id);
    toast({
      title: 'Member Deleted',
      description: `${memberToDelete.name} has been removed from the team.`,
    });
    setMemberToDelete(null);
  };

  return (
    <Section title="Manage Team">
      <div className="mb-6 flex justify-end">
        <Button asChild>
          <Link href="/admin/team/edit/new">
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
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        router.push(
                          `/admin/team/edit/${member.id}`
                        )
                      }
                    >
                      <Edit />
                    </Button>
                    <AlertDialog open={!!memberToDelete && memberToDelete.id === member.id} onOpenChange={(isOpen) => !isOpen && setMemberToDelete(null)}>
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
                            This will permanently delete{' '}
                            <span className="font-bold">{member.name}</span>{' '}
                            from the team. This action cannot be undone.
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
            ))}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
}
