
'use client';

import { useState } from 'react';
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
import type { Expenditure } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useExpenditures } from '@/context/ExpenditureContext';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';

export default function ManageExpendituresPage() {
  const { expenditures, deleteExpenditure, loading } = useExpenditures();
  const [expenditureToDelete, setExpenditureToDelete] = useState<Expenditure | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = () => {
    if (!expenditureToDelete) return;

    deleteExpenditure(expenditureToDelete.id);
    toast({
      title: 'Expenditure Deleted',
      description: `The expenditure has been removed.`,
    });
    setExpenditureToDelete(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Section title="Manage Expenditures">
      <div className="mb-6 flex justify-end">
        <Button asChild>
          <Link href="/admin/expenditures/edit/new">
            <PlusCircle />
            Add New Expenditure
          </Link>
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-64" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 ml-auto" /></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-10 w-10" />
                      <Skeleton className="h-10 w-10" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              expenditures.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell>{format(parseISO(exp.date), 'PPP')}</TableCell>
                  <TableCell>{exp.category}</TableCell>
                  <TableCell className="font-medium">{exp.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(exp.amount)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          router.push(`/admin/expenditures/edit/${exp.id}`)
                        }
                      >
                        <Edit />
                      </Button>
                      <AlertDialog
                        open={!!expenditureToDelete && expenditureToDelete.id === exp.id}
                        onOpenChange={(isOpen) => !isOpen && setExpenditureToDelete(null)}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setExpenditureToDelete(exp)}
                          >
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this expenditure record. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setExpenditureToDelete(null)}>
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
