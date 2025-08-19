
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
import type { Event } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useEvents } from '@/context/EventContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManageEventsPage() {
  const { events, deleteEvent, loading } = useEvents();
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = () => {
    if (!eventToDelete) return;

    deleteEvent(eventToDelete.id);
    toast({
      title: 'Event Deleted',
      description: `${eventToDelete.title} has been removed.`,
    });
    setEventToDelete(null);
  };

  return (
    <Section title="Manage Events">
      <div className="mb-6 flex justify-end">
        <Button asChild>
          <Link href="/admin/events/edit/new">
            <PlusCircle />
            Add New Event
          </Link>
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-16 rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-48" /></TableCell>
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
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={80}
                      height={45}
                      className="h-10 w-16 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    {new Date(event.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          router.push(`/admin/events/edit/${event.id}`)
                        }
                      >
                        <Edit />
                      </Button>
                      <AlertDialog
                        open={!!eventToDelete && eventToDelete.id === event.id}
                        onOpenChange={(isOpen) => !isOpen && setEventToDelete(null)}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setEventToDelete(event)}
                          >
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the event{' '}
                              <span className="font-bold">{event.title}</span>.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setEventToDelete(null)}
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
