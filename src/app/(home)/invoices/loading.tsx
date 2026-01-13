// app/invoices/loading.tsx
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/src/components/ui/table';
import { PlusCircle } from 'lucide-react';

export default function InvoicesLoading() {
  return (
    <div className="@container/main px-4 lg:px-6">
      <div className="flex items-center justify-between mb-8">
          <div>
          <h1 className="text-3xl font-bold tracking-tight text-chart-1 dark:text-gray-100">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Here you can view and manage all your invoices.
          </p>
        </div>
         <Button className="cursor-pointer" >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Invoice
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-5 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-32" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-28" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {[...Array(7)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
